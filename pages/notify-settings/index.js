const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['通知设置', '请确保微信已开启本小程序的通知权限，否则无法收到提醒。', '断食提醒', '开始断食提醒', '结束断食提醒', '中途阶段提醒', '打卡与互动', '每日打卡提醒', '社区互动通知', '活动与公告推送'],

  data: {
    statusBarHeight: 0,
    notifyStart: true,
    notifyEnd: true,
    notifyMidway: false,
    checkInTime: '21:00',
    communityNotify: true,
    announceNotify: true,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadSettings();
  },

  loadSettings() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      this.setData({
        notifyStart: settings.notifyStart !== false,
        notifyEnd: settings.notifyEnd !== false,
        notifyMidway: settings.notifyMidway === true,
        checkInTime: settings.checkInTime || '21:00',
        communityNotify: settings.communityNotify !== false,
        announceNotify: settings.announceNotify !== false,
      });
    } catch (e) {
      console.error('加载通知设置失败:', e);
    }
  },

  saveSetting(key, value) {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      settings[key] = value;
      wx.setStorageSync('customizeSettings', settings);
    } catch (e) {
      console.error('保存设置失败:', e);
    }
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = !this.data[key];
    this.setData({ [key]: value });
    this.saveSetting(key, value);

    if (value && (key === 'notifyStart' || key === 'notifyEnd' || key === 'announceNotify')) {
      // 引导用户开启微信订阅消息
      wx.requestSubscribeMessage({
        tmplIds: [],
      });
    }
  },

  onCheckInTimeClick() {
    const that = this;
    wx.showActionSheet({
      itemList: ['20:00', '21:00', '22:00'],
      success(res) {
        const times = ['20:00', '21:00', '22:00'];
        const time = times[res.tapIndex];
        that.setData({ checkInTime: time });
        that.saveSetting('checkInTime', time);
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
