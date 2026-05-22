import { login as cloudLogin } from './cloudfunc';
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],
  data: {
    phoneNumber: '',
    sendCodeCount: 60,
    verifyCode: '',
  },

  timer: null,

  onLoad(options) {
    const { phoneNumber } = options;
    if (phoneNumber) {
      this.setData({ phoneNumber });
    }
    this.countDown();
  },

  onVerifycodeChange(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },

  countDown() {
    this.setData({ sendCodeCount: 60 });
    this.timer = setInterval(() => {
      if (this.data.sendCodeCount <= 0) {
        this.setData({ isSend: false, sendCodeCount: 0 });
        clearInterval(this.timer);
      } else {
        this.setData({ sendCodeCount: this.data.sendCodeCount - 1 });
      }
    }, 1000);
  },

  sendCode() {
    if (this.data.sendCodeCount === 0) {
      this.countDown();
    }
  },

  async login() {
    try {
      const res = await cloudLogin();
      if (res.success) {
        await wx.setStorageSync('userInfo', res.data.userInfo);
        await wx.setStorageSync('openid', res.data.openid);
        wx.switchTab({
          url: `/pages/my/index`,
        });
      }
    } catch (err) {
      console.error('登录失败', err);
    }
  },
});
