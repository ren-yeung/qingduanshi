const { ARTICLES_FULL } = require('../../pages/dry-goods/articles');

Page({
  data: {
    statusBarHeight: 0,
    article: null,
  },

  onLoad(options) {
    const id = parseInt(options.id);
    const article = ARTICLES_FULL[id];
    if (!article) {
      wx.showToast({ title: '文章不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const info = wx.getSystemInfoSync();
    const navContentHeight = 44; // navbar content height (88rpx ≈ 44px on standard device)
    this.setData({
      statusBarHeight: info.statusBarHeight,
      headerMarginTop: info.statusBarHeight + navContentHeight,
      article,
    });
    // 动态设置标题（用于分享等）
    wx.setNavigationBarTitle({ title: article.coverTitle });
  },

  onBack() {
    wx.navigateBack();
  },
});
