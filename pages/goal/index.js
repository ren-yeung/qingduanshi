const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],
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
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
      goal: storage.getGoal(),
      weightGoal: storage.getWeightGoal() || { height: '', target: '' },
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
      wx.showToast({ title: '请输入有效热量', icon: 'none' });
      return;
    }
    storage.setGoal(goal);
    storage.setWeightGoal(weightGoal);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1000);
  },

  onReset() {
    wx.showModal({
      title: '确认重置',
      content: '确定要恢复默认目标吗？',
      success: (res) => {
        if (res.confirm) {
          storage.setGoal(storage.DEFAULT_GOAL);
          storage.setWeightGoal({ height: '', target: '' });
          // 直接填入全新数值对象
          this.setData({
            goal: { calories: '1600', protein: '124', carbs: '162', fat: '55' },
            weightGoal: { height: '', target: '' },
          });
          wx.showToast({ title: '已恢复默认', icon: 'success' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
