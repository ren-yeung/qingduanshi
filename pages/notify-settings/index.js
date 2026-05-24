const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

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
