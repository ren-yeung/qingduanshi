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

    // 字体选择
    fontFamily: 'system-default',
    fontOptions: [],
    showFontList: false,
    fontCurrentLabel: '系统默认',
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
      fontOptions: themeConfig.FONT_OPTIONS || [],
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
    const fontFamily = settings.fontFamily || 'system-default';

    // 查找当前字体的显示标签
    const fontCurrentLabel = this._findFontLabel(fontFamily);

    this.setData({ activeMode, customColors, fontFamily, fontCurrentLabel });
    this.applyTheme();
  },

  _findFontLabel(fontValue) {
    const opts = this.data.fontOptions || [];
    const found = opts.find(f => f.value === fontValue);
    return found ? found.label : '系统默认';
  },

  // 应用当前模式的主题色到页面
  applyTheme() {
    const theme = themeConfig.getThemeColors(this.data.activeMode, this.data.customColors);

    // 注入字体信息
    const fontOption = (this.data.fontOptions || []).find(f => f.value === this.data.fontFamily);
    if (fontOption) {
      theme.fontFamily = fontOption.family;
      theme.fontSizeScale = fontOption.sizeScale || 1;
    } else {
      theme.fontFamily = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif";
      theme.fontSizeScale = 1;
    }

    this.setData({ theme });
  },

  // 保存设置并广播
  saveSettings() {
    const { activeMode, customColors, fontFamily } = this.data;
    const settings = { activeMode, customColors, fontFamily };
    wx.setStorageSync('customizeSettings', settings);

    // 同步到全局
    app.globalData.customizeSettings = settings;
    const theme = themeConfig.getThemeColors(activeMode, customColors);
    // 注入字体信息到全局 theme
    const fontOption = (this.data.fontOptions || []).find(f => f.value === fontFamily);
    if (fontOption) {
      theme.fontFamily = fontOption.family;
      theme.fontSizeScale = fontOption.sizeScale || 1;
    } else {
      theme.fontFamily = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif";
      theme.fontSizeScale = 1;
    }
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

  // 切换字体 - 展开/收起
  onToggleFontList() {
    this.setData({ showFontList: !this.data.showFontList });
  },

  // 选择字体
  onFontFamilyChange(e) {
    const family = e.currentTarget.dataset.family;
    if (family === this.data.fontFamily) return;

    const fontOption = (this.data.fontOptions || []).find(f => f.value === family);
    this.setData({
      fontFamily: family,
      fontCurrentLabel: fontOption ? fontOption.label : '系统默认',
      showFontList: false,
    });
    this.applyTheme();
    this.saveSettings();
    wx.showToast({ title: '字体已切换', icon: 'none', duration: 1000 });
  },

  // 首页快捷入口 - 跳转概览页面
  onShortcutManage() {
    wx.switchTab({ url: '/pages/overview/index' });
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
            fontFamily: 'system-default',
            fontCurrentLabel: '系统默认',
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
