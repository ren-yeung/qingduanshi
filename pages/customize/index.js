const app = getApp();
const themeConfig = require('~/config/theme');

Page({
  data: {
    statusBarHeight: 0,
    theme: {},               // 当前全局主题色
    activeMode: 'fresh-green',
    modeList: [],
    customColors: {},
    colorPalette: {},

    fontSize: 'medium',
    fontSizes: [
      { value: 'small', label: '小' },
      { value: 'medium', label: '中' },
      { value: 'large', label: '大' },
    ],
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
      modeList: themeConfig.PRESET_MODES.concat([{
        id: 'custom',
        name: '自定义',
        isDefault: false,
        preview: ['🎨', '📄', '🃏'],
      }]),
      colorPalette: themeConfig.CUSTOM_PALETTE,
    });
    this.loadSettings();
  },

  onShow() {
    this.applyTheme();
  },

  // 从存储加载设置
  loadSettings() {
    const settings = wx.getStorageSync('customizeSettings') || {};
    const activeMode = settings.activeMode || 'fresh-green';
    const customColors = settings.customColors || themeConfig.CUSTOM_DEFAULTS;
    const fontSize = settings.fontSize || 'medium';

    this.setData({ activeMode, customColors, fontSize });
    this.applyTheme();
  },

  // 应用当前模式的主题色到页面
  applyTheme() {
    const theme = themeConfig.getThemeColors(this.data.activeMode, this.data.customColors);
    this.setData({ theme });
  },

  // 保存设置并广播
  saveSettings() {
    const { activeMode, customColors, fontSize } = this.data;
    const settings = { activeMode, customColors, fontSize };
    wx.setStorageSync('customizeSettings', settings);

    // 同步到全局
    app.globalData.customizeSettings = settings;
    const theme = themeConfig.getThemeColors(activeMode, customColors);
    app.globalData.theme = theme;

    // 广播主题变更，各页面 onShow 刷新
    app.eventBus.emit('theme-changed', theme);
  },

  // 选择外观模式
  onModeSelect(e) {
    const modeId = e.currentTarget.dataset.id;
    if (modeId === this.data.activeMode) return;

    this.setData({ activeMode: modeId });
    this.applyTheme();
    this.saveSettings();
    wx.showToast({ title: '外观已切换', icon: 'none', duration: 1200 });
  },

  // 自定义配色变化
  onCustomColorChange(e) {
    const { type, value } = e.currentTarget.dataset;
    const customColors = { ...this.data.customColors, [type]: value };
    this.setData({ customColors });
    this.applyTheme();
    this.saveSettings();
  },

  // 切换字体大小
  onFontSizeChange(e) {
    const { size } = e.currentTarget.dataset;
    this.setData({ fontSize: size });
    this.saveSettings();
    wx.showToast({ title: '字体大小已更新', icon: 'none', duration: 1000 });
  },

  // 首页快捷入口
  onShortcutManage() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 恢复默认
  onResetDefault() {
    wx.showModal({
      title: '恢复默认',
      content: '确定要恢复所有个性化设置为默认值吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('customizeSettings');
          app.globalData.customizeSettings = null;
          app.globalData.theme = themeConfig.getThemeColors('fresh-green');
          this.setData({
            activeMode: 'fresh-green',
            customColors: themeConfig.CUSTOM_DEFAULTS,
            fontSize: 'medium',
          });
          this.applyTheme();
          app.eventBus.emit('theme-changed', app.globalData.theme);
          wx.showToast({ title: '已恢复默认', icon: 'none' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
