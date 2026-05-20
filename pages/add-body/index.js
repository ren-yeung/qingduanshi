const storage = require('~/utils/storage');

Page({
  data: {
    statusBarHeight: 0,
    date: '',
    weight: '',
    bodyFat: '',
    waist: '',
    hip: '',
    steps: '',
    mood: 5,
    note: '',
  },

  onLoad(options) {
    const info = wx.getSystemInfoSync();
    const date = options.date;
    this.setData({ statusBarHeight: info.statusBarHeight, date });

    // mode=new 时（概览页进入）不回显数据，直接重置
    if (options.mode === 'new') {
      return;
    }

    // 其他情况（编辑已有记录）回显数据
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const bodyRecords = storage.get(storage.KEYS.BODY_DATA, []);
    const w = weightRecords.find((r) => r.date === date);
    const b = bodyRecords.find((r) => r.date === date);

    if (w || b) {
      this.setData({
        weight: w ? w.weight : '',
        bodyFat: b ? b.bodyFat : '',
        waist: b ? b.waist : '',
        hip: b ? b.hip : '',
        steps: b ? b.steps : '',
        mood: b ? b.mood : 5,
        note: b ? b.note : '',
      });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  onMoodChange(e) {
    this.setData({ mood: Number(e.detail.value) });
  },

  computeBMI(weight) {
    const settings = storage.get(storage.KEYS.SETTINGS, {});
    const heightM = (settings.height || 170) / 100;
    if (!heightM || !weight) return null;
    return (weight / (heightM * heightM)).toFixed(1);
  },

  onSave() {
    const { date, weight, bodyFat, waist, hip, steps, mood, note } = this.data;

    if (!weight) {
      wx.showToast({ title: '请输入体重', icon: 'none' });
      return;
    }

    const weightNum = parseFloat(weight);
    const bmi = this.computeBMI(weightNum);

    // 保存体重记录到本地
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const wIndex = weightRecords.findIndex((r) => r.date === date);
    const wRecord = { date, weight: weightNum, bmi };
    if (wIndex >= 0) {
      weightRecords[wIndex] = wRecord;
    } else {
      weightRecords.push(wRecord);
    }
    storage.set(storage.KEYS.WEIGHT_RECORDS, weightRecords.sort((a, b) => a.date.localeCompare(b.date)));

    // 保存身体数据记录到本地
    const bodyRecords = storage.get(storage.KEYS.BODY_DATA, []);
    const bIndex = bodyRecords.findIndex((r) => r.date === date);
    const bRecord = {
      date,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      waist: waist ? parseFloat(waist) : null,
      hip: hip ? parseFloat(hip) : null,
      steps: steps ? parseInt(steps) : null,
      mood,
      note,
      bmi,
    };
    if (bIndex >= 0) {
      bodyRecords[bIndex] = bRecord;
    } else {
      bodyRecords.push(bRecord);
    }
    storage.set(storage.KEYS.BODY_DATA, bodyRecords.sort((a, b) => a.date.localeCompare(b.date)));

    // 保存到云端
    this.saveToCloud({ date, weight: weightNum, bmi, bodyFat, waist, hip, steps, mood, note });

    wx.navigateBack();
  },

  // 保存到云端数据库
  async saveToCloud(data) {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo || !userInfo.openid) return;

      const settings = storage.get(storage.KEYS.SETTINGS, {});
      const height = settings.height || 0;

      await wx.cloud.callFunction({
        name: 'bodyData',
        data: {
          action: 'save',
          openid: userInfo.openid,
          data: {
            date: data.date,
            height,
            weight: data.weight,
            bmi: data.bmi,
            bodyFat: data.bodyFat,
            waist: data.waist,
            hip: data.hip,
            steps: data.steps,
            mood: data.mood,
            note: data.note,
          },
        },
      });
    } catch (err) {
      console.error('保存体重到云端失败:', err);
    }
  },
});
