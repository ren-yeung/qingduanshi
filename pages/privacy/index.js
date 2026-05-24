const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['隐私政策', '引言', '收集和使用', 'Cookie', '共享转让', '保护', '权利', '未成年人', '更新', '联系我们'],

  data: {
    statusBarHeight: 0,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
