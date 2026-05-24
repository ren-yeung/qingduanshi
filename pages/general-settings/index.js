const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
    language: '简体中文',
    unitSystem: '公制 (kg/cm)',
    defaultPlan: '16:8 间歇性断食',
    weekStartDay: '周一',
    autoSync: true,
    wifiOnly: false,
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
        language: settings.language || '简体中文',
        unitSystem: settings.unitSystem || '公制 (kg/cm)',
        defaultPlan: settings.defaultPlan || '16:8 间歇性断食',
        weekStartDay: settings.weekStartDay || '周一',
        autoSync: settings.autoSync !== false,
        wifiOnly: settings.wifiOnly === true,
      });
    } catch (e) {
      console.error('加载通用设置失败:', e);
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
  },

  onRowClick(e) {
    const { type } = e.currentTarget.dataset;
    if (type === 'language') {
      wx.showToast({ title: '暂仅支持简体中文', icon: 'none' });
    } else if (type === 'unitSystem') {
      wx.showToast({ title: '暂仅支持公制', icon: 'none' });
    } else if (type === 'defaultPlan') {
      wx.showToast({ title: '请在首页选择方案', icon: 'none' });
    } else if (type === 'weekStartDay') {
      wx.showToast({ title: '暂仅支持周一', icon: 'none' });
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
