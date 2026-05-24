const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
    darkMode: 'follow', // follow / light / dark
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadSettings();
  },

  loadSettings() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      this.setData({ darkMode: settings.darkMode || 'follow' });
    } catch (e) {
      console.error('加载深色模式设置失败:', e);
    }
  },

  onRadioChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ darkMode: value });

    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      settings.darkMode = value;
      wx.setStorageSync('customizeSettings', settings);

      // 触发主题刷新
      if (typeof app.loadTheme === 'function') {
        app.loadTheme();
      }
    } catch (err) {
      console.error('保存深色模式设置失败:', err);
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
