const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');
const unitUtil = require('~/utils/unit');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: [
    '我的目标', '每日摄入目标', '热量', '蛋白质', '碳水', '脂肪',
    '体重目标', '我的身高', '目标体重', '说明',
    '热量：每日摄入的总能量目标', '蛋白质：帮助维持肌肉和代谢',
    '碳水：提供日常活动能量', '脂肪：维持激素和细胞健康',
    '恢复默认目标', '保存', '请输入',
    '确认重置', '确定要恢复默认目标吗？', '请输入有效热量', '保存成功', '已恢复默认',
  ],
  data: {
    statusBarHeight: 0,
    goal: {
      calories: 1600,
      protein: 124,
      carbs: 162,
      fat: 55,
    },
    weightGoal: {
      height: '',
      target: '',
    },
    inputKey: 0,
    weightUnitLabel: 'kg',
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    const wg = storage.getWeightGoal() || { height: '', target: '' };
    // 如果已有目标体重，按当前单位转换显示
    if (wg.target) {
      wg.target = unitUtil.formatWeightRaw(parseFloat(wg.target));
    }
    this.setData({
      statusBarHeight: info.statusBarHeight,
      goal: storage.getGoal(),
      weightGoal: wg,
      weightUnitLabel: unitUtil.getWeightUnitLabel(),
    });
  },

  onCaloriesChange(e) {
    this.setData({ 'goal.calories': Number(e.detail.value) || 0 });
  },

  onProteinChange(e) {
    this.setData({ 'goal.protein': Number(e.detail.value) || 0 });
  },

  onCarbsChange(e) {
    this.setData({ 'goal.carbs': Number(e.detail.value) || 0 });
  },

  onFatChange(e) {
    this.setData({ 'goal.fat': Number(e.detail.value) || 0 });
  },

  onHeightChange(e) {
    this.setData({ 'weightGoal.height': e.detail.value });
  },

  onWeightTargetChange(e) {
    this.setData({ 'weightGoal.target': e.detail.value });
  },

  onSave() {
    const { goal, weightGoal } = this.data;
    if (!goal.calories || goal.calories <= 0) {
      wx.showToast({ title: this.$t('请输入有效热量'), icon: 'none' });
      return;
    }
    storage.setGoal(goal);
    // 目标体重转回 kg 存储
    storage.setWeightGoal({
      height: weightGoal.height,
      target: weightGoal.target ? unitUtil.toKg(parseFloat(weightGoal.target)) : '',
    });
    wx.showToast({ title: this.$t('保存成功'), icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1000);
  },

  onReset() {
    wx.showModal({
      title: this.$t('确认重置'),
      content: this.$t('确定要恢复默认目标吗？'),
      success: (res) => {
        if (res.confirm) {
          storage.setGoal(storage.DEFAULT_GOAL);
          storage.setWeightGoal({ height: '', target: '' });
          // 直接填入全新数值对象
          this.setData({
            goal: { calories: '1600', protein: '124', carbs: '162', fat: '55' },
            weightGoal: { height: '', target: '' },
          });
          wx.showToast({ title: this.$t('已恢复默认'), icon: 'success' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
