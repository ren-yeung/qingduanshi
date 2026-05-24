const { getAllPlans } = require('~/config/fastingPlans');
const i18nBehavior = require('../../utils/i18n-behavior');
const i18n = require('~/utils/i18n');
const fasting = require('~/utils/fasting');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: [
    '选择断食计划', '难度', '断食时长', '进食时长', '开始自定义计划',
    '16:8 轻断食', '18:6 轻断食', '20:4 轻断食', 'OMAD 一日一餐',
    '5:2 断食法', '隔日断食', '自定义',
    '每天断食16小时，进食窗口8小时。适合初学者，最容易坚持。',
    '每天断食18小时，进食窗口6小时。进阶方案，燃脂效率更高。',
    '每天断食20小时，进食窗口4小时。高阶方案，需要较强自律。',
    '每天只吃一顿，其余23小时断食。极限方案，效果显著。',
    '每周5天正常饮食，2天断食日（热量控制在500-600千卡）。',
    '断食日（极低热量）与正常日交替进行。效果最强但挑战最大。',
    '完全自定义你的断食与进食时长。',
    '断食 ', ' 进食 ', '小时', '确认开始',
    '是否立即开始该断食计划？', '时长需大于0',
  ],
  data: {
    statusBarHeight: 0,
    plans: [],
    selectedPlanId: '',
    customFast: 16,
    customEat: 8,
    // UI labels
    diffLabel: '难度',
    fastLabel: '断食 ',
    eatLabel: ' 进食 ',
    hourLabel: '小时',
    fastDurationLabel: '断食时长',
    eatDurationLabel: '进食时长',
  },

  onLoad() {
    this.i18nRefresh();
    this.translatePlansAndLabels();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
  },

  onShow() {
    this.i18nRefresh();
    this.translatePlansAndLabels();
  },

  /** 根据当前语言翻译计划数据和 UI 标签 */
  translatePlansAndLabels() {
    const plans = getAllPlans().map((p) => ({
      ...p,
      name: this.$t(p.name),
      description: this.$t(p.description),
    }));
    this.setData({
      plans,
      diffLabel: this.$t('难度'),
      fastLabel: this.$t('断食 '),
      eatLabel: this.$t(' 进食 '),
      hourLabel: this.$t('小时'),
      fastDurationLabel: this.$t('断食时长'),
      eatDurationLabel: this.$t('进食时长'),
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectPlan(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedPlanId: id });

    if (id === 'custom') {
      return;
    }

    wx.showModal({
      title: this.$t('确认开始'),
      content: this.$t('是否立即开始该断食计划？'),
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
      wx.showToast({ title: this.$t('时长需大于0'), icon: 'none' });
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
