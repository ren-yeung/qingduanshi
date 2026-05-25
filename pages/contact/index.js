const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['联系我们', '反馈与支持', '意见反馈', '联系客服', '关于', '关于轻断食', '检查更新', '法律信息', '用户协议', '隐私政策', '小小轻断食', '健康生活每一天'],

  data: {
    statusBarHeight: 0,
    version: '',
    currentYear: new Date().getFullYear(),
  },

  onLoad() {
    this.i18nRefresh();
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
    wx.showToast({ title: this.$t('功能开发中'), icon: 'none' });
  },

  // 联系客服回调
  onContactService(e) {
    // 用户从客服消息卡片返回时触发，可获取返回路径
    console.log('客服会话回调', e.detail);
  },

  // 关于轻断食
  onAbout() {
    wx.showModal({
      title: this.$t('关于轻断食'),
      content: this.$t('关于轻断食\n描述') + this.data.version,
      showCancel: false,
      confirmText: this.$t('知道了'),
    });
  },

  // 检查更新
  onCheckUpdate() {
    wx.showToast({ title: this.$t('已是最新的'), icon: 'none' });
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
