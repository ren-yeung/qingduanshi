const app = getApp();

// 基准色：图标原始绿色 #2EAF7D 的色相（HSL H ≈ 152°）
const BASE_HUE = 152;

/**
 * 将 hex 颜色转为 HSL，返回色相角度 (0-360)
 */
function getHue(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return Math.round(h * 360);
}

Component({
  data: {
    value: '',
    activeColor: '#2EAF7D',
    iconFilter: 'none',
    tabs: [
      { icon: '/static/icon_overview.png', selectedIcon: '/static/icon_overview_selected.png', value: 'overview', label: '概览' },
      { icon: '/static/icon_log.png', selectedIcon: '/static/icon_log_selected.png', value: 'log', label: '日志' },
      { icon: '/static/icon_goods.png', selectedIcon: '/static/icon_goods_selected.png', value: 'dry-goods', label: '干货' },
      { icon: '/static/icon_my.png', selectedIcon: '/static/icon_my_selected.png', value: 'my', label: '我的' },
    ],
  },

  lifetimes: {
    ready() {
      this.refreshActiveColor();

      if (!this.__themeListener) {
        this.__themeListener = () => this.refreshActiveColor();
      }
      app.eventBus.on('theme-changed', this.__themeListener);
      this.updateSelected();

      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const originalOnShow = currentPage.onShow;
        const self = this;
        currentPage.onShow = function () {
          if (originalOnShow) originalOnShow.call(this);
          self.updateSelected();
          self.refreshActiveColor();
        };
      }
    },
    detached() {
      if (this.__themeListener) {
        app.eventBus.off('theme-changed', this.__themeListener);
      }
    },
  },

  methods: {
    refreshActiveColor() {
      const theme = app.getTheme();
      if (!theme || !theme.brandPrimary) return;

      const targetColor = theme.brandPrimary;
      const targetHue = getHue(targetColor);

      // 计算从基准绿色到目标颜色的色相旋转角度
      // 图标原始是绿色(H≈152°)，旋转到目标色相
      let delta = targetHue - BASE_HUE;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      const filter = delta === 0 ? 'none' : `hue-rotate(${delta}deg)`;this.setData({
        activeColor: targetColor,
        iconFilter: filter,
      });
    },
    updateSelected() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const match = /pages\/([\w-]+)\/index/.exec(curPage.route);
        if (match && match[1]) {
          this.setData({ value: match[1] });
        }
      }
    },
    onTabTap(e) {
      const val = e.currentTarget.dataset.value;
      if (val && val !== this.data.value) {
        wx.switchTab({ url: `/pages/${val}/index` });
      }
    },
  },
});
