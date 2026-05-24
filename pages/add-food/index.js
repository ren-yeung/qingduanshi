const { searchFoods, FOODS } = require('./foodDatabase');
const i18nBehavior = require('../../utils/i18n-behavior');
const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');

// 根据当前时间判断餐段
function getMealByTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const BREAKFAST_START = 7 * 60;   // 07:00
  const BREAKFAST_END = 9 * 60;     // 09:00
  const LUNCH_START = 11 * 60 + 30; // 11:30
  const LUNCH_END = 13 * 60 + 30;   // 13:30
  const DINNER_START = 17 * 60 + 30; // 17:30
  const DINNER_END = 19 * 60 + 30;  // 19:30

  if (currentMinutes >= BREAKFAST_START && currentMinutes < BREAKFAST_END) {
    return 'breakfast';
  }
  if (currentMinutes >= LUNCH_START && currentMinutes < LUNCH_END) {
    return 'lunch';
  }
  if (currentMinutes >= DINNER_START && currentMinutes < DINNER_END) {
    return 'dinner';
  }
  return 'snack'; // 其他时间为加餐
}

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['记录饮食', '搜索食物名称', '蛋白质', '碳水', '脂肪', '（每100g）', '份量', '克', '确认添加', '请选择食物', '请输入有效份量'],
  data: {
    statusBarHeight: 0,
    date: '',
    meal: '',
    keyword: '',
    foods: FOODS,
    selectedFood: null,
    amount: 100,
    previewCalories: 0,
  },

  onLoad(options) {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    // 如果没有传入 meal 参数，根据当前时间自动判断
    const meal = options.meal || getMealByTime();
    this.setData({ 
      date: options.date || '', 
      meal: meal,
      statusBarHeight: info.statusBarHeight 
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({ keyword, foods: searchFoods(keyword) });
  },

  _updatePreviewCalories() {
    const { selectedFood, amount } = this.data;
    if (selectedFood && amount) {
      this.setData({ previewCalories: Math.round(selectedFood.caloriesPer100g * amount / 100) });
    } else {
      this.setData({ previewCalories: 0 });
    }
  },

  onSelectFood(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ selectedFood: this.data.foods[index] });
    this._updatePreviewCalories();
  },

  onAmountChange(e) {
    this.setData({ amount: Number(e.detail.value) || 0 });
    this._updatePreviewCalories();
  },

  onCloseDetail() {
    this.setData({ selectedFood: null });
  },

  onConfirm() {
    // 防止重复提交
    if (this._submitting) return;
    this._submitting = true;

    const { selectedFood, amount, date, meal } = this.data;
    if (!selectedFood) {
      this._submitting = false;
      wx.showToast({ title: this.$t('请选择食物'), icon: 'none' });
      return;
    }
    if (!amount || amount <= 0) {
      this._submitting = false;
      wx.showToast({ title: this.$t('请输入有效份量'), icon: 'none' });
      return;
    }

    const ratio = amount / 100;
    const foodEntry = {
      name: selectedFood.name,
      amount,
      calories: Math.round(selectedFood.caloriesPer100g * ratio),
      protein: Math.round(selectedFood.protein * ratio * 10) / 10,
      carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
      fat: Math.round(selectedFood.fat * ratio * 10) / 10,
    };

    const records = storage.get(storage.KEYS.DIET_RECORDS, []);
    let record = records.find((r) => r.date === date);
    if (!record) {
      record = { date, meals: {}, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
      records.push(record);
    }
    if (!record.meals[meal]) {
      record.meals[meal] = { foods: [], totalCalories: 0 };
    }
    record.meals[meal].foods.push(foodEntry);
    record.meals[meal].totalCalories = (record.meals[meal].totalCalories || 0) + foodEntry.calories;
    record.totalCalories = (record.totalCalories || 0) + foodEntry.calories;
    record.totalProtein = Math.round(((record.totalProtein || 0) + foodEntry.protein) * 10) / 10;
    record.totalCarbs = Math.round(((record.totalCarbs || 0) + foodEntry.carbs) * 10) / 10;
    record.totalFat = Math.round(((record.totalFat || 0) + foodEntry.fat) * 10) / 10;

    storage.set(storage.KEYS.DIET_RECORDS, records);
    wx.navigateBack();
  },
});
