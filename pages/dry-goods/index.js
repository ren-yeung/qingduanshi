const { ARTICLES_FULL } = require('./articles');

const ARTICLES = Object.values(ARTICLES_FULL).map((a) => ({
  id: a.id,
  title: a.title,
  summary: a.summary,
  tag: a.tag,
}));

Page({
  data: {
    statusBarHeight: 0,
    articles: ARTICLES,
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    const navContentHeight = 44;   // ≈ 88rpx
    const listGap = 21;            // 42rpx ≈ 21px
    this.setData({
      statusBarHeight: info.statusBarHeight,
      listPaddingTop: info.statusBarHeight + navContentHeight + listGap,
    });
  },

  onTapArticle(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/subpackages/article-detail/index?id=${id}` });
  },
});
