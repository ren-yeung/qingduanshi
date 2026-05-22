const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
    version: '',
    currentYear: new Date().getFullYear(),
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    // 获取应用版本号
    const accountInfo = wx.getAccountInfoSync();
    const version = accountInfo.miniProgram ? accountInfo.miniProgram.version : '2.0.0';

    this.setData({
      statusBarHeight: info.statusBarHeight,
      version: version || '2.0.0',
    });
  },

  onBack() {
    wx.navigateBack();
  },

  // 意见反馈
  onFeedback() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 联系客服回调
  onContactService(e) {
    // 用户从客服消息卡片返回时触发，可获取返回路径
    console.log('客服会话回调', e.detail);
  },

  // 关于轻断食
  onAbout() {
    wx.showModal({
      title: '关于轻断食',
      content: '轻断食是一款科学健康的断食追踪助手，帮助您轻松管理饮食计划，养成健康的生活习惯。\n\n版本：v' + this.data.version,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  // 检查更新
  onCheckUpdate() {
    wx.showToast({ title: '已是最新的', icon: 'none' });
  },

  // 用户协议
  onUserAgreement() {
    wx.navigateTo({ url: '/pages/agreement/index' });
  },

  // 隐私政策
  onPrivacyPolicy() {
    wx.navigateTo({ url: '/pages/privacy/index' });
  },
});
