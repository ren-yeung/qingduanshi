const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['打卡分享', '打卡成功', '天', '连续打卡', '分享给好友', '返回首页'],
  data: {
    statusBarHeight: 0,
    streak: 0,
    quotes: [
      '坚持就是胜利！',
      '今天的你，比昨天更强大。',
      '自律给你自由。',
      '每一滴汗水都不会白流。',
      '你的坚持，终将美好。',
      '不积跬步，无以至千里。',
    ],
    quote: '',
  },

  onLoad(options) {
    this.i18nRefresh();
    const streak = Number(options.streak) || 1;
    const quote = this.data.quotes[Math.floor(Math.random() * this.data.quotes.length)];
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      streak,
      quote,
      statusBarHeight: systemInfo.statusBarHeight || 0
    });
  },

  onShare() {
    // 分享功能，小程序自动触发 onShareAppMessage
  },

  onSaveImage() {
    wx.showToast({ title: '保存功能开发中', icon: 'none' });
  },

  onBack() {
    wx.switchTab({ url: '/pages/overview/index' });
  },

  onShareAppMessage() {
    return {
      title: `我已连续断食打卡 ${this.data.streak} 天，一起来挑战！`,
      path: '/pages/overview/index',
    };
  },
});
