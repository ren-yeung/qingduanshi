/**
 * 主题 Behavior — 所有页面引入后自动获得 theme 数据 + 主题变更监听
 * 用法: 在 Page({ behaviors: [themeBehavior], ... }) 中添加
 */
const app = getApp();

/** 将 hex 颜色转为 rgb 字符串（不含括号） */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return parseInt(h[0]+h[0], 16) + ',' + parseInt(h[1]+h[1], 16) + ',' + parseInt(h[2]+h[2], 16);
  }
  return parseInt(h.slice(0,2), 16) + ',' + parseInt(h.slice(2,4), 16) + ',' + parseInt(h.slice(4,6), 16);
}

module.exports = Behavior({
  data: {
    theme: {},
  },

  pageLifetimes: {
    show() {
      this.loadTheme();
      // 注册主题变更监听
      if (!this.__themeListener) {
        this.__themeListener = (t) => {
          const t2 = { ...t };
          if (t.brandPrimary) t2.brandPrimaryRgb = hexToRgb(t.brandPrimary);
          if (t.brandDark) t2.brandDarkRgb = hexToRgb(t.brandDark);
          this.setData({ theme: t2 });
        };
      }
      app.eventBus.on('theme-changed', this.__themeListener);
    },
    hide() {
      if (this.__themeListener) {
        app.eventBus.off('theme-changed', this.__themeListener);
      }
    },
  },

  methods: {
    loadTheme() {
      const theme = app.getTheme();
      if (theme) {
        const t = { ...theme };
        if (t.brandPrimary) t.brandPrimaryRgb = hexToRgb(t.brandPrimary);
        if (t.brandDark) t.brandDarkRgb = hexToRgb(t.brandDark);
        this.setData({ theme: t });
      }
    },
  },
});
