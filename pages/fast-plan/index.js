const { getAllPlans } = require('~/config/fastingPlans');
const fasting = require('~/utils/fasting');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],
  data: {
    statusBarHeight: 0,
    plans: [],
    selectedPlanId: '',
    customFast: 16,
    customEat: 8,
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight, plans: getAllPlans() });
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectPlan(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedPlanId: id });

    if (id === 'custom') {
      return; // 等待用户调整自定义时长
    }

    wx.showModal({
      title: '确认开始',
      content: '是否立即开始该断食计划？',
      success: (res) => {
        if (res.confirm) {
          this.doStart(id);
        }
      },
    });
  },

  onCustomFastChange(e) {
    this.setData({ customFast: Number(e.detail.value) });
  },

  onCustomEatChange(e) {
    this.setData({ customEat: Number(e.detail.value) });
  },

  onStartCustom() {
    const { customFast, customEat } = this.data;
    if (customFast < 1 || customEat < 1) {
      wx.showToast({ title: '时长需大于0', icon: 'none' });
      return;
    }
    this.doStart('custom', { fastHours: customFast, eatHours: customEat });
  },

  doStart(planId, customHours) {
    fasting.startPlan(planId, customHours);
    fasting.requestReminder();
    wx.switchTab({ url: '/pages/overview/index' });
  },
});
