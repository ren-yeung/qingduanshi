const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: [
    '深色模式',      // t0  导航栏标题
    '外观主题',      // t1  分区标题
    '跟随系统',      // t2  选项1标题
    '跟随系统描述',  // t3  选项1描述
    '浅色模式',      // t4  选项2标题
    '浅色模式描述',  // t5  选项2描述
    '深色主题',      // t6  选项3标题
    '深色模式描述',  // t7  选项3描述
    '模式说明',      // t8  提示框文字
    '效果预览',      // t9  预览分区标题
    '浅色',          // t10 预览标签
    '预览区域',      // t11 预览文字
    '深色',          // t12 预览标签
  ],

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

      // loadTheme 会自动叠加深色配色并广播 theme-changed
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
