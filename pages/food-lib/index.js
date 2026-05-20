const { searchFoods, FOODS } = require('./foodDatabase');

Page({
  data: {
    statusBarHeight: 0,
    keyword: '',
    foods: FOODS,
    selectedFood: null,
  },

  onLoad() {
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
