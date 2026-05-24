const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
    fontSizeIndex: 1, // 0=小 1=标准 2=大 3=特大
    fontSizeLabels: ['小', '标准', '大', '特大'],
    fontSizeScales: [0.9, 1.0, 1.15, 1.3],
    sliderWidth: 0,
    touchStartX: 0,
    dragging: false,
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadSettings();

    // 获取滑块容器宽度
    setTimeout(() => {
      const query = wx.createSelectorQuery().in(this);
      query.select('.slider-track').boundingClientRect(rect => {
        if (rect) {
          this.setData({ sliderWidth: rect.width });
        }
      }).exec();
    }, 200);
  },

  loadSettings() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      const scale = settings.fontSizeScale || 1.0;
      let index = 1;
      if (scale <= 0.92) index = 0;
      else if (scale <= 1.07) index = 1;
      else if (scale <= 1.22) index = 2;
      else index = 3;
      this.setData({ fontSizeIndex: index });
    } catch (e) {
      console.error('加载字体大小设置失败:', e);
    }
  },

  saveFontSize(index) {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      settings.fontSizeScale = this.data.fontSizeScales[index];
      wx.setStorageSync('customizeSettings', settings);

      // 刷新当前页面的字体缩放
      if (typeof app.loadTheme === 'function') {
        app.loadTheme();
      }
    } catch (err) {
      console.error('保存字体大小设置失败:', err);
    }
  },

  onSliderTouchStart(e) {
    this.setData({
      dragging: true,
      touchStartX: e.touches[0].clientX,
    });
  },

  onSliderTouchMove(e) {
    const { sliderWidth } = this.data;
    if (!sliderWidth) return;

    const query = wx.createSelectorQuery().in(this);
    query.select('.slider-track').boundingClientRect(rect => {
      if (!rect) return;
      let ratio = (e.touches[0].clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let index = Math.round(ratio * 3);
      index = Math.max(0, Math.min(3, index));

      if (index !== this.data.fontSizeIndex) {
        this.setData({ fontSizeIndex: index });
      }
    }).exec();
  },

  onSliderTouchEnd() {
    this.setData({ dragging: false });
    this.saveFontSize(this.data.fontSizeIndex);
  },

  onTapSlider(e) {
    const { sliderWidth } = this.data;
    if (!sliderWidth) return;

    const query = wx.createSelectorQuery().in(this);
    query.select('.slider-track').boundingClientRect(rect => {
      if (!rect) return;
      let ratio = (e.detail.x - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let index = Math.round(ratio * 3);
      index = Math.max(0, Math.min(3, index));

      this.setData({ fontSizeIndex: index });
      this.saveFontSize(index);
    }).exec();
  },

  getPreviewStyle() {
    const scale = this.data.fontSizeScales[this.data.fontSizeIndex];
    return `font-size: ${scale}em`;
  },

  onBack() {
    wx.navigateBack();
  },
});
