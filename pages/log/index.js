const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

const MEAL_TYPES = [
  { key: 'breakfast', name: '早餐', time: '07:00-09:00' },
  { key: 'lunch', name: '午餐', time: '11:30-13:30' },
  { key: 'dinner', name: '晚餐', time: '17:30-19:30' },
  { key: 'snack', name: '加餐', time: '任意' },
];

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: [
    '日志', '今日营养', 'kcal 剩余', '热量(kcal)', '蛋白质', '碳水', '脂肪',
    '点击 + 添加食物', '今日身体数据', '编辑', '记录',
    '体重(kg)', 'BMI', '体脂(%)', '腰围(cm)', '今日还未记录身体数据',
    '早餐', '午餐', '晚餐', '加餐', '任意', '提示', '确定要删除这个食物吗？',
  ],
  data: {
    statusBarHeight: 0,
    currentDate: '',
    todayDate: '',
    meals: MEAL_TYPES,
    dietRecord: null,
    bodyRecord: null,
    weightRecord: null,
    goal: storage.getGoal(),
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.setToday();
    this.translateMealNames();
  },

  onShow() {
    this.i18nRefresh();
    this.translateMealNames();
    // 每次显示页面时重新读取目标（可能已在设置页更新）
    this.setData({ goal: storage.getGoal() });
    this.loadDayData();
  },

  translateMealNames() {
    const t = this.$t.bind(this);
    this.setData({ meals: [
      { key: 'breakfast', name: t('早餐'), time: '07:00-09:00' },
      { key: 'lunch', name: t('午餐'), time: '11:30-13:30' },
      { key: 'dinner', name: t('晚餐'), time: '17:30-19:30' },
      { key: 'snack', name: t('加餐'), time: t('任意') },
    ]});
  },

  setToday() {
    const d = new Date();
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.setData({ currentDate: str, todayDate: str });
  },

  loadDayData() {
    const date = this.data.currentDate;

    const dietRecords = storage.get(storage.KEYS.DIET_RECORDS, []);
    let dietRecord = dietRecords.find((r) => r.date === date);
    if (!dietRecord) {
      dietRecord = { date, meals: {}, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    }
    MEAL_TYPES.forEach((m) => {
      if (!dietRecord.meals[m.key]) {
        dietRecord.meals[m.key] = { foods: [], totalCalories: 0 };
      }
    });

    const bodyRecords = storage.get(storage.KEYS.BODY_DATA, []);
    const bodyRecord = bodyRecords.find((r) => r.date === date) || null;

    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const weightRecord = weightRecords.find((r) => r.date === date) || null;

    const fix1 = (v) => Number((v || 0).toFixed(1));
    this.setData({
      dietRecord: {
        ...dietRecord,
        totalCalories: Math.round(dietRecord.totalCalories || 0),
        totalProtein: fix1(dietRecord.totalProtein),
        totalCarbs: fix1(dietRecord.totalCarbs),
        totalFat: fix1(dietRecord.totalFat),
      },
      bodyRecord,
      weightRecord,
    });
  },

  onChangeDate(e) {
    this.setData({ currentDate: e.detail.value }, () => {
      this.loadDayData();
    });
  },

  onAddFood(e) {
    const { meal } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/add-food/index?meal=${meal}&date=${this.data.currentDate}`,
    });
  },

  onDeleteFood(e) {
    const { meal, index } = e.currentTarget.dataset;
    const date = this.data.currentDate;

    wx.showModal({
      title: this.$t('提示'),
      content: this.$t('确定要删除这个食物吗？'),
      success: (res) => {
        if (res.confirm) {
          const records = storage.get(storage.KEYS.DIET_RECORDS, []);
          const record = records.find((r) => r.date === date);
          if (record && record.meals[meal] && record.meals[meal].foods[index]) {
            const food = record.meals[meal].foods[index];
            // 更新总营养值
            record.totalCalories = Math.max(0, (record.totalCalories || 0) - food.calories);
            record.totalProtein = Math.round(((record.totalProtein || 0) - food.protein) * 10) / 10;
            record.totalCarbs = Math.round(((record.totalCarbs || 0) - food.carbs) * 10) / 10;
            record.totalFat = Math.round(((record.totalFat || 0) - food.fat) * 10) / 10;
            record.meals[meal].totalCalories = Math.max(0, (record.meals[meal].totalCalories || 0) - food.calories);
            // 删除食物
            record.meals[meal].foods.splice(index, 1);
            storage.set(storage.KEYS.DIET_RECORDS, records);
            // 重新加载数据
            this.loadDayData();
          }
        }
      },
    });
  },

  onAddBodyData() {
    wx.navigateTo({
      url: `/pages/add-body/index?date=${this.data.currentDate}`,
    });
  },

  computeProgress(value, goal) {
    if (!goal || !value) return 0;
    return Math.min(100, Math.round((value / goal) * 100));
  },
});
