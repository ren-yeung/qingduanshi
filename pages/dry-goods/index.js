const { ARTICLES_FULL } = require('./articles');
const { ARTICLES_FULL_EN } = require('./articles-en');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');
const i18n = require('~/utils/i18n');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['干货', '轻断食干货'],
  data: {
    statusBarHeight: 0,
    articles: [],
  },

  /** 根据语言加载对应版本的文章列表 */
  loadArticles() {
    const lang = i18n.getCurrentLang();
    const source = lang === 'en' ? ARTICLES_FULL_EN : ARTICLES_FULL;
    const articles = Object.values(source).map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      tag: a.tag,
    }));
    this.setData({ articles });
  },

  onLoad() {
    this.i18nRefresh();
    this.loadArticles();
    const info = wx.getSystemInfoSync();
    const navContentHeight = 44;
    const listGap = 21;
    this.setData({
      statusBarHeight: info.statusBarHeight,
      listPaddingTop: info.statusBarHeight + navContentHeight + listGap,
    });
  },

  onShow() {
    this.i18nRefresh();
    this.loadArticles();
  },

  onTapArticle(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/subpackages/article-detail/index?id=${id}` });
  },
});
