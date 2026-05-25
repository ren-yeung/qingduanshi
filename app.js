// app.js
const themeConfig = require('./config/theme');

App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: 'cloudbase-d6g8imz47feab8222',
      traceUser: true,
    });

    // 显示转发按钮（好友分享）
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline'],
    });

    // 获取状态栏高度并设置到全局 CSS 变量
    const info = wx.getSystemInfoSync();
    wx.setStorageSync('statusBarHeight', info.statusBarHeight);

    // 恢复全局用户数据
    const savedUserInfo = wx.getStorageSync('userInfo');
    if (savedUserInfo) {
      this.globalData.userInfo = savedUserInfo;
    }

    // 加载主题设置
    this.loadTheme();

    // 不再强制跳转登录页，允许游客浏览概览页
    // this.checkAndRedirectToLogin();

    // 版本更新检查
    this.checkForUpdate();
  },

  // 加载主题配置
  loadTheme() {
    const settings = wx.getStorageSync('customizeSettings') || {};
    const activeMode = settings.activeMode || 'fresh-green';
    const customColors = settings.customColors || themeConfig.CUSTOM_DEFAULTS;
    const fontFamily = settings.fontFamily || 'system-default';
    const darkMode = settings.darkMode || 'follow';
    const theme = { ...themeConfig.getThemeColors(activeMode, customColors) };

    // 叠加深色模式配色
    if (themeConfig.shouldDark(darkMode)) {
      Object.assign(theme, themeConfig.DARK_MODE_OVERLAY);
    }

    // 注入字体信息
    const fontOption = (themeConfig.FONT_OPTIONS || []).find(f => f.value === fontFamily);
    if (fontOption) {
      theme.fontFamily = fontOption.family;
      theme.fontSizeScale = fontOption.sizeScale || 1;
    } else {
      theme.fontFamily = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif";
      theme.fontSizeScale = 1;
    }

    this.globalData.customizeSettings = settings;
    this.globalData.theme = theme;

    // 广播主题变更，所有使用了 themeBehavior 的页面会自动刷新
    this.eventBus.emit('theme-changed', theme);
  },

  // 获取当前主题（供各页面调用）
  getTheme() {
    if (!this.globalData.theme) {
      this.loadTheme();
    }
    return this.globalData.theme;
  },

  // 获取当前语言
  getLang() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      return settings.language || '简体中文';
    } catch (e) {
      return '简体中文';
    }
  },

  // 获取当前单位制
  getUnit() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      return settings.unitSystem || '公制 (kg/cm)';
    } catch (e) {
      return '公制 (kg/cm)';
    }
  },

  // 检查并跳转登录页
  checkAndRedirectToLogin() {
    const pages = getCurrentPages();
    const curPage = pages[pages.length - 1];
    
    // 只有非登录页面才跳转
    if (!curPage || curPage.route.indexOf('pages/login') === -1) {
      // 如果未登录，跳转到登录页
      if (!this.globalData.userInfo || !this.globalData.userInfo.openid) {
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }
    }
  },

  // 检查更新
  checkForUpdate() {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
  },

  // ========== 全局转发给好友（页面可 override） ==========
  onShareAppMessage() {
    return {
      title: '轻断食 - 科学断食，健康减脂',
      path: '/pages/overview/index',
    };
  },

  // ========== 全局分享到朋友圈（页面可 override） ==========
  onShareTimeline() {
    return {
      title: '轻断食 - 科学断食，健康减脂',
      query: '',
    };
  },

  // ========== 复制当前页面链接 ==========
  copyCurrentLink() {
    const pages = getCurrentPages();
    if (!pages.length) return;
    const curPage = pages[pages.length - 1];
    let path = '/' + curPage.route;
    const options = curPage.options || {};
    const params = Object.keys(options)
      .map(k => `${k}=${options[k]}`)
      .join('&');
    if (params) path += '?' + params;

    wx.setClipboardData({
      data: '轻断食小程序：' + path,
      success: () => {
        wx.showToast({ title: '已复制链接', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '复制失败', icon: 'none' });
      },
    });
  },

  globalData: {
    userInfo: null,  // { openid, userId, nickName, avatarUrl }
    unreadNum: 0,
  },

  eventBus: {
    _events: {},
    on(event, callback) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(callback);
    },
    off(event, callback) {
      if (!this._events[event]) return;
      this._events[event] = this._events[event].filter(cb => cb !== callback);
    },
    emit(event, ...args) {
      if (!this._events[event]) return;
      this._events[event].forEach(callback => callback(...args));
    },
  },
});
