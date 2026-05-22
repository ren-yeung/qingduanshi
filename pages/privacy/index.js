const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
