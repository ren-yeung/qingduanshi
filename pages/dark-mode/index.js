const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['深色模式', '外观主题', '跟随系统', '自动匹配设备的亮暗模式', '浅色模式', '始终使用明亮界面', '暗色背景护眼', '预览模式提示', '效果预览', '浅色', '预览区域', '深色'],

  data: {
    statusBarHeight: 0,
    darkMode: 'follow', // follow / light / dark
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
