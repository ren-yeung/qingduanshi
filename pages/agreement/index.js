const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['用户协议', '总则', '账号', '服务', '行为规范', '知识产权', '免责', '协议变更', '联系我们'],

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
