const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['全部记录', '身体数据', '编辑', '记录', '体重(kg)', 'BMI', '体脂率', '腰围', '臀围', '步', '步数', '当天暂无记录', '当天心情', '备注'],
  data: {
    statusBarHeight: 0,
    currentDate: '',
    todayDate: '',
    // 当天的身体数据记录
    bodyRecord: null,
    weightRecord: null,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.setToday();
  },

  onShow() {
    this.i18nRefresh();
    this.loadDayData();
  },

  setToday() {
    const d = new Date();
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.setData({ currentDate: str, todayDate: str }, () => {
      this.loadDayData();
    });
  },

  loadDayData() {
    const date = this.data.currentDate;

    // 读取身体维度数据
    const bodyRecords = storage.get(storage.KEYS.BODY_DATA, []);
    let bodyRecord = bodyRecords.find((r) => r.date === date) || null;

    // 格式化步数为千位分隔显示
    if (bodyRecord && bodyRecord.steps) {
      bodyRecord = {
        ...bodyRecord,
        steps: String(bodyRecord.steps).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      };
    }

    // 读取体重记录
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const weightRecord = weightRecords.find((r) => r.date === date) || null;

    this.setData({ bodyRecord, weightRecord });
  },

  // 切换日期
  onChangeDate(e) {
    this.setData({ currentDate: e.detail.value }, () => {
      this.loadDayData();
    });
  },

  // 编辑/记录当天数据
  onEditBody() {
    wx.navigateTo({
      url: `/pages/add-body/index?date=${this.data.currentDate}&mode=edit`,
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },
});
