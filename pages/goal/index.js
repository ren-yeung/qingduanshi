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
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
      goal: storage.getGoal(),
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

  onSave() {
    const { goal } = this.data;
    if (!goal.calories || goal.calories <= 0) {
      wx.showToast({ title: '请输入有效热量', icon: 'none' });
      return;
    }
    storage.setGoal(goal);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1000);
  },

  onReset() {
    wx.showModal({
      title: '确认重置',
      content: '确定要恢复默认目标吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ goal: storage.DEFAULT_GOAL });
          storage.setGoal(storage.DEFAULT_GOAL);
          wx.showToast({ title: '已恢复默认', icon: 'success' });
        }
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
