const app = getApp();
const themeConfig = require('~/config/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [i18nBehavior],
  i18nKeys: ['个性化', '外观模式', '默认', '自定义配色', '品牌色', '页面背景', '卡片色', '显示设置', '字体', '首页快捷入口', '其他', '恢复默认设置'],
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
    this.i18nRefresh();
    this.translateDynamicTexts();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
      colorPalette: themeConfig.CUSTOM_PALETTE,
    });
    this.loadSettings();
  },

  onShow() {
    this.i18nRefresh();
    this.translateDynamicTexts();
    this.applyTheme();
  },

  /** 翻译 modeList 模式名和 fontOptions 字体标签 */
  translateDynamicTexts() {
    const presetModes = themeConfig.PRESET_MODES.map(m => ({ ...m, name: this.$t(m.name) }));
    const modeList = presetModes.concat([{
      id: 'custom',
      name: this.$t('自定义'),
      isDefault: false,
      preview: ['🎨', '📄', '🃏'],
    }]);
    const fontOptions = (themeConfig.FONT_OPTIONS || []).map(f => ({ ...f, label: this.$t(f.label) }));
    const fontOption = fontOptions.find(f => f.value === this.data.fontFamily);
    this.setData({
      modeList,
      fontOptions,
      fontCurrentLabel: fontOption ? fontOption.label : this.$t('系统默认'),
    });
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
    return found ? found.label : this.$t('系统默认');
  },

  // 应用当前模式的主题色到页面
  applyTheme() {
    const theme = { ...themeConfig.getThemeColors(this.data.activeMode, this.data.customColors) };

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

    // 合并到现有设置，避免覆盖 darkMode / language 等其他字段
    const settings = wx.getStorageSync('customizeSettings') || {};
    settings.activeMode = activeMode;
    settings.customColors = customColors;
    settings.fontFamily = fontFamily;
    wx.setStorageSync('customizeSettings', settings);

    // 统一走 app.loadTheme()，包含深色模式判断 + 广播
    app.loadTheme();
  },

  // 选择外观模式
  onModeSelect(e) {
    const modeId = e.currentTarget.dataset.id;
    if (modeId === this.data.activeMode) return;

    this.setData({ activeMode: modeId });
    this.applyTheme();
    this.saveSettings();
    wx.showToast({ title: this.$t('外观已切换'), icon: 'none', duration: 1200 });
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
      fontCurrentLabel: fontOption ? fontOption.label : this.$t('系统默认'),
      showFontList: false,
    });
    this.applyTheme();
    this.saveSettings();
    wx.showToast({ title: this.$t('字体已切换'), icon: 'none', duration: 1000 });
  },

  // 首页快捷入口 - 跳转概览页面
  onShortcutManage() {
    wx.switchTab({ url: '/pages/overview/index' });
  },

  // 恢复默认
  onResetDefault() {
    wx.showModal({
      title: this.$t('恢复默认'),
      content: this.$t('确定要恢复所有个性化设置为默认值吗？'),
      success: (res) => {
        if (res.confirm) {
          // 只重置外观相关字段，保留其他设置（语言、深色模式等）
          const settings = wx.getStorageSync('customizeSettings') || {};
          settings.activeMode = 'fresh-green';
          settings.customColors = themeConfig.CUSTOM_DEFAULTS;
          settings.fontFamily = 'system-default';
          wx.setStorageSync('customizeSettings', settings);

          this.setData({
            activeMode: 'fresh-green',
            customColors: themeConfig.CUSTOM_DEFAULTS,
            fontFamily: 'system-default',
            fontCurrentLabel: this.$t('系统默认'),
          });
          this.applyTheme();
          app.loadTheme();
          wx.showToast({ title: this.$t('已恢复默认'), icon: 'none' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
