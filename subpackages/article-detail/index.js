const { ARTICLES_FULL } = require('../../pages/dry-goods/articles');
const { ARTICLES_FULL_EN } = require('../../pages/dry-goods/articles-en');
const themeBehavior = require('../../behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');
const i18n = require('../../utils/i18n');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['文章详情', '文章不存在', '小贴士', '优势', '注意', '为什么适合', '为什么需要谨慎', '为什么避免', '推荐运动', '可以放心尝试', '请慎重，建议先咨询医生', '以上人群都', '以上人群请'],
  data: {
    statusBarHeight: 0,
    article: null,
  },

  onLoad(options) {
    this.i18nRefresh();
    const lang = i18n.getCurrentLang();
    const source = lang === 'en' ? ARTICLES_FULL_EN : ARTICLES_FULL;
    const id = parseInt(options.id);
    const article = source[id];
    if (!article) {
      wx.showToast({ title: this.$t('文章不存在'), icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const info = wx.getSystemInfoSync();
    const navContentHeight = 35;
    this.setData({
      statusBarHeight: info.statusBarHeight,
      headerMarginTop: info.statusBarHeight + navContentHeight,
      article,
      // UI strings that appear in WXML
      tipLabel: this.$t('小贴士'),
      prosLabel: this.$t('优势'),
      consLabel: this.$t('注意'),
      whyGoodLabel: this.$t('为什么适合') + '：',
      whyCautionLabel: this.$t('为什么需要谨慎') + '：',
      whyAvoidLabel: this.$t('为什么避免') + '：',
      recommendLabel: this.$t('推荐运动'),
      yesHint: this.$t('以上人群都') + this.$t('可以放心尝试') + ' 🎉',
      noHint: this.$t('以上人群请') + this.$t('请慎重，建议先咨询医生') + ' 🤔',
    });
    wx.setNavigationBarTitle({ title: article.coverTitle });
  },

  onShow() {
    this.i18nRefresh();
  },

  onBack() {
    wx.navigateBack();
  },
});
