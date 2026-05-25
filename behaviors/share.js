/**
 * 全局分享 Behavior — 给所有页面注入 onShareAppMessage + onShareTimeline
 * 用法:
 *   const shareBehavior = require('../../behaviors/share');
 *   Page({ behaviors: [shareBehavior, ...], ... })
 *
 * 如果页面需要自定义分享标题/路径，直接在页面中覆盖 onShareAppMessage 即可
 */
module.exports = Behavior({
  methods: {
    onShareAppMessage() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      const path = curPage ? `/${curPage.route}` : '/pages/overview/index';
      return {
        title: '轻断食 - 科学断食，健康减脂',
        path,
      };
    },

    onShareTimeline() {
      return {
        title: '轻断食 - 科学断食，健康减脂',
        query: '',
      };
    },

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
  },
});
