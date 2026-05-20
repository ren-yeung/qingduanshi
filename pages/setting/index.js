const app = getApp();
const storage = require('~/utils/storage');

Page({
  data: {
    isLogin: false,
    menuData: [
      [
        {
          title: '通用设置',
          url: '',
          icon: '⚙️',
        },
        {
          title: '通知设置',
          url: '',
          icon: '🔔',
        },
      ],
      [
        {
          title: '深色模式',
          url: '',
          icon: '🌙',
        },
        {
          title: '字体大小',
          url: '',
          icon: '🔤',
        },
        {
          title: '播放设置',
          url: '',
          icon: '🔊',
        },
      ],
      [
        {
          title: '账号安全',
          url: '',
          icon: '🔒',
        },
        {
          title: '隐私',
          url: '',
          icon: '🔐',
        },
      ],
    ],
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });
    this.checkLogin();
    // 监听登录/注销事件
    app.eventBus.on('user-login-success', this.checkLogin.bind(this));
    app.eventBus.on('user-logout-success', this.checkLogin.bind(this));
  },

  onUnload() {
    app.eventBus.off('user-login-success', this.checkLogin.bind(this));
    app.eventBus.off('user-logout-success', this.checkLogin.bind(this));
  },

  onShow() {
    this.checkLogin();
  },

  checkLogin() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const isLogin = !!(userInfo && (userInfo.openid || userInfo.gender));
    this.setData({ isLogin });
  },

  onEleClick(e) {
    const { title, url } = e.currentTarget.dataset.data;
    if (url) return;
    wx.showToast({ title, icon: 'none' });
  },

  onBack() {
    wx.navigateBack();
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 仅清除内存中的用户信息，让 my 页面显示未登录
          app.globalData.userInfo = null;
          // 保留本地 userInfo，方便静默登录恢复
          // 标记为退出登录状态（不清空 infoCollected 和 userInfo）
          storage.markAsLoggedOut();
          app.eventBus.emit('user-logout');
          wx.switchTab({
            url: '/pages/my/index',
          });
        }
      },
    });
  },

  onDestroyAccount() {
    wx.showModal({
      title: '注销账号',
      content: '注销后所有数据将永久删除，确定要注销吗？',
      success: (res) => {
        if (res.confirm) {
          const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
          if (!userInfo || !userInfo.openid) return;

          wx.showLoading({ title: '注销中...', mask: true });

          // 调用云函数注销用户
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'deleteUser',
              openid: userInfo.openid,
            },
          }).then(() => {
            app.globalData.userInfo = null;
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('infoCollected');
            // 设置注销标记，静默登录时会识别并跳转到信息收集页
            wx.setStorageSync('accountDestroyed', true);
            // 注销账号时清除所有用户数据
            storage.clearUserData();
            // 发送注销账号事件，触发页面数据重置
            app.eventBus.emit('user-destroy');
            wx.hideLoading();
            wx.showToast({ title: '账号已注销', icon: 'none' });
            wx.switchTab({
              url: '/pages/my/index',
            });
          }).catch((err) => {
            wx.hideLoading();
            console.error('注销失败:', err);
            wx.showToast({ title: '注销失败，请重试', icon: 'none' });
          });
        }
      },
    });
  },
});
