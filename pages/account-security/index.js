const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');
const storage = require('~/utils/storage');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['账号安全', '账号信息', '头像', '昵称', '安全设置', '修改密码', '绑定手机号', '登录设备管理', '上次登录：', '退出当前账号', '确定要退出当前账号吗？退出后需要重新登录。'],

  data: {
    statusBarHeight: 0,
    nickname: '',
    avatarUrl: '',
    maskedOpenid: '',
    phone: '',
    lastLoginTime: '',
    lastLoginDevice: '',
    lastLoginLocation: '',
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadUserInfo();
  },

  loadUserInfo() {
    try {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};

      let openid = '';
      if (userInfo.openid && typeof userInfo.openid === 'string' && userInfo.openid.length > 6) {
        openid = userInfo.openid.substring(0, 3) + '***' + userInfo.openid.substring(userInfo.openid.length - 3);
      } else {
        openid = 'oX***abc123';
      }

      let phone = '';
      if (userInfo.phone && typeof userInfo.phone === 'string' && userInfo.phone.length >= 11) {
        phone = userInfo.phone.substring(0, 3) + '****' + userInfo.phone.substring(userInfo.phone.length - 4);
      } else if (userInfo.phoneNumber) {
        phone = userInfo.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }

      this.setData({
        nickname: userInfo.nickName || '轻断食达人',
        avatarUrl: userInfo.avatarUrl || '',
        maskedOpenid: openid,
        phone: phone || '未绑定',
        lastLoginTime: '2026-05-24 09:30',
        lastLoginDevice: 'iPhone',
        lastLoginLocation: '北京',
      });
    } catch (e) {
      console.error('加载用户信息失败:', e);
    }
  },

  onRowClick(e) {
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case 'avatar':
      case 'nickname':
        wx.showToast({ title: '请在微信中修改个人信息', icon: 'none' });
        break;
      case 'password':
        wx.showToast({ title: '暂不支持修改密码', icon: 'none' });
        break;
      case 'phone':
        wx.showToast({ title: '暂仅支持微信登录', icon: 'none' });
        break;
      case 'device':
        wx.showToast({ title: '当前设备已认证', icon: 'none' });
        break;
      default:
        break;
    }
  },

  async onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出当前账号吗？',
      success: async (res) => {
        if (res.confirm) {
          await storage.syncAllToCloud();
          app.globalData.userInfo = null;
          storage.markAsLoggedOut();
          wx.removeStorageSync('accountDestroyed');
          app.eventBus.emit('user-logout');
          wx.switchTab({ url: '/pages/my/index' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
