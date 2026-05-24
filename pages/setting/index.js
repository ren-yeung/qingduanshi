const app = getApp();
const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['设置', '通用设置', '通知设置', '深色模式', '字体大小', '播放设置', '账号安全', '关于', '退出登录', '注销账号', '确定要退出登录吗？', '注销后所有数据将永久删除，确定要注销吗？', '清理中', '缓存已清除', '清除失败', '注销中', '账号已注销', '注销失败，请重试', '确定要清除所有本地缓存吗？这不会影响您的账号数据。', '隐私', '隐私政策', '用户协议', '清除缓存', '计算中'],
  data: {
    isLogin: false,
    cacheSize: '...',
    menuData: [
      [
        {
          title: '通用设置',
          url: '/pages/general-settings/index',
          icon: '⚙️',
        },
        {
          title: '通知设置',
          url: '/pages/notify-settings/index',
          icon: '🔔',
        },
      ],
      [
        {
          title: '深色模式',
          url: '/pages/dark-mode/index',
          icon: '🌙',
        },
        {
          title: '字体大小',
          url: '/pages/font-size/index',
          icon: '🔤',
        },
        {
          title: '播放设置',
          url: '/pages/sound-settings/index',
          icon: '🔊',
        },
      ],
      [
        {
          title: '账号安全',
          url: '/pages/account-security/index',
          icon: '🔒',
        },
        {
          title: '隐私',
          url: '/pages/privacy/index',
          icon: '🔐',
        },
        {
          title: '清除缓存',
          action: 'clearCache',
          icon: '🧹',
        },
      ],
    ],
  },

  onLoad() {
    this.i18nRefresh();
    this.translateMenu();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
      cacheSize: this.$t('计算中'),
    });
    this.checkLogin();
    this.getCacheSize();
    // 监听登录/注销事件
    app.eventBus.on('user-login-success', this.checkLogin.bind(this));
    app.eventBus.on('user-logout-success', this.checkLogin.bind(this));
  },

  onUnload() {
    app.eventBus.off('user-login-success', this.checkLogin.bind(this));
    app.eventBus.off('user-logout-success', this.checkLogin.bind(this));
  },

  onShow() {
    this.i18nRefresh();
    this.translateMenu();
    this.checkLogin();
  },

  /** 翻译 menuData 中的菜单项标题 */
  translateMenu() {
    const menuData = [
      [
        { title: this.$t('通用设置'), url: '/pages/general-settings/index', icon: '⚙️' },
        { title: this.$t('通知设置'), url: '/pages/notify-settings/index', icon: '🔔' },
      ],
      [
        { title: this.$t('深色模式'), url: '/pages/dark-mode/index', icon: '🌙' },
        { title: this.$t('字体大小'), url: '/pages/font-size/index', icon: '🔤' },
        { title: this.$t('播放设置'), url: '/pages/sound-settings/index', icon: '🔊' },
      ],
      [
        { title: this.$t('账号安全'), url: '/pages/account-security/index', icon: '🔒' },
        { title: this.$t('隐私'), url: '/pages/privacy/index', icon: '🔐' },
        { title: this.$t('清除缓存'), action: 'clearCache', icon: '🧹' },
      ],
    ];
    this.setData({ menuData });
  },

  checkLogin() {
    // 检查是否是退出登录状态
    const isLoggedOut = wx.getStorageSync('isLoggedOut');
    if (isLoggedOut) {
      this.setData({ isLogin: false });
      return;
    }

    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const isLogin = !!(userInfo && (userInfo.openid || userInfo.gender));
    this.setData({ isLogin });
  },

  onEleClick(e) {
    const { title, url } = e.currentTarget.dataset.data;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  // 获取缓存大小
  getCacheSize() {
    wx.getStorageInfo({
      success: (res) => {
        const sizeKB = res.currentSize;
        let cacheSize;
        if (sizeKB < 1024) {
          cacheSize = sizeKB + 'KB';
        } else {
          cacheSize = (sizeKB / 1024).toFixed(1) + 'MB';
        }
        this.setData({ cacheSize });
      },
      fail: () => {
        this.setData({ cacheSize: '0KB' });
      },
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: this.$t('清除缓存'),
      content: this.$t('确定要清除所有本地缓存吗？这不会影响您的账号数据。'),
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: this.$t('清理中') + '...' });
          wx.clearStorage({
            success: () => {
              wx.hideLoading();
              this.setData({ cacheSize: '0KB' });
              wx.showToast({ title: this.$t('缓存已清除'), icon: 'none' });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: this.$t('清除失败'), icon: 'none' });
            },
          });
        }
      },
    });
  },

  async onLogout() {
    wx.showModal({
      title: this.$t('提示'),
      content: this.$t('确定要退出登录吗？'),
      success: async (res) => {
        if (res.confirm) {
          // 退出前先将本地全部数据同步到云端
          await storage.syncAllToCloud();
          
          // 仅清除内存中的用户信息，让 my 页面显示未登录
          app.globalData.userInfo = null;
          // 保留本地 userInfo，方便静默登录恢复
          // 标记为退出登录状态（不清空 infoCollected 和 userInfo）
          storage.markAsLoggedOut();
          // 清除注销账号标记（退出登录不是注销）
          wx.removeStorageSync('accountDestroyed');
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
      title: this.$t('注销账号'),
      content: this.$t('注销后所有数据将永久删除，确定要注销吗？'),
      success: (res) => {
        if (res.confirm) {
          const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
          if (!userInfo || !userInfo.openid) return;

          wx.showLoading({ title: this.$t('注销中') + '...', mask: true });

          // 调用云函数注销用户
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'deleteUser',
              openid: userInfo.openid,
            },
          }).then(async () => {
            // 删除 user_data 集合中的用户数据
            await wx.cloud.callFunction({
              name: 'syncData',
              data: { action: 'delete' },
            });
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
            wx.showToast({ title: this.$t('账号已注销'), icon: 'none' });
            wx.switchTab({
              url: '/pages/my/index',
            });
          }).catch((err) => {
            wx.hideLoading();
            console.error('注销失败:', err);
            wx.showToast({ title: this.$t('注销失败，请重试'), icon: 'none' });
          });
        }
      },
    });
  },
});
