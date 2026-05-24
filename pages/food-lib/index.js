const { searchFoods, FOODS } = require('./foodDatabase');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['食物库', '搜索食物名称', '蛋白质', '碳水', '脂肪', '（每100g）', '热量'],
  data: {
    statusBarHeight: 0,
    keyword: '',
    foods: FOODS,
    selectedFood: null,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
  },

  onBack() {
    wx.navigateBack();
  },

  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({ keyword, foods: searchFoods(keyword) });
  },

  onSelectFood(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ selectedFood: this.data.foods[index] });
  },

  onCloseDetail() {
    this.setData({ selectedFood: null });
  },
});
