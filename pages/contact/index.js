const app = getApp();

Page({
  data: {
    statusBarHeight: 0,
    version: '',
    currentYear: new Date().getFullYear(),
    cacheSize: '计算中...',
    updateText: '已是最新',
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
    this.getCacheSize();
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

  // 意见反馈
  onFeedback() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 常见问题
  onFAQ() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
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
    wx.showLoading({ title: '检查中...' });
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      wx.hideLoading();
      if (res.hasUpdate) {
        this.setData({ updateText: '发现新版本' });
        wx.showModal({
          title: '发现新版本',
          content: '是否立即更新到最新版本？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              updateManager.onUpdateReady(() => {
                updateManager.applyUpdate();
              });
            }
          },
        });
      } else {
        this.setData({ updateText: '已是最新' });
        wx.showToast({ title: '已是最新版本', icon: 'none' });
      }
    });

    updateManager.onUpdateFailed(() => {
      wx.hideLoading();
      wx.showToast({ title: '检查更新失败', icon: 'none' });
    });
  },

  // 用户协议
  onUserAgreement() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 隐私政策
  onPrivacyPolicy() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有本地缓存吗？这不会影响您的账号数据。',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清理中...' });
          wx.clearStorage({
            success: () => {
              wx.hideLoading();
              this.setData({ cacheSize: '0KB' });
              wx.showToast({ title: '缓存已清除', icon: 'none' });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '清除失败', icon: 'none' });
            },
          });
        }
      },
    });
  },
});
