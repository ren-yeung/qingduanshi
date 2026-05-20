const fasting = require('~/utils/fasting');

Page({
  data: {
    statusBarHeight: 0,

    // 当前计划状态
    planStatus: 'idle', // idle / fasting / eating
    currentPlan: {
      name: '16:8 轻断食',
      fastHours: 16,
      eatHours: 8,
    },

    // 环形进度 (0-1)
    todayProgress: 0,
    ringOffset: 264,

    // 统计数据
    streak: 0,
    maxStreak: 0,
    monthCompletionRate: 0,
    totalFastingHours: 0,

    // 本周数据
    weekDays: [],
    weekStats: {
      completed: 0,
      progress: 0,
      fastingHours: 0,
    },

    // 月度数据
    monthDaysCompleted: 0,
    monthDaysTotal: 0,
    currentWeek: 1,
    weeksToBadge: 4,
    weekGrowth: 0,

    // 历史计划
    historyPlans: [],
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadData();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    // 从断食状态获取进度
    const fastingState = fasting.getCurrentState();
    const todayProgress = Math.round((fastingState.progress || 0) * 100);
    const ringOffset = Math.round(264 * (1 - (fastingState.progress || 0)));

    // 生成本周日期
    const weekDays = this.generateWeekDays();

    // 从存储获取统计数据
    const stats = this.getStats();

    this.setData({
      todayProgress,
      ringOffset,
      weekDays,
      planStatus: fastingState.status,
      currentPlan: fastingState.plan || this.data.currentPlan,
      ...stats,
    });
  },

  generateWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const weekDays = [];
    const dots = ['dot-success', 'dot-success', 'dot-success', 'dot-partial', '', 'dot-future', 'dot-future'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();
      const isFuture = date > today;

      weekDays.push({
        date: this.formatDate(date),
        day: date.getDate(),
        status: isFuture ? 'future' : '',
        isToday,
        dotClass: isToday ? '' : (isFuture ? 'dot-future' : dots[i]),
      });
    }

    return weekDays;
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getStats() {
    // TODO: 从实际数据源获取统计数据
    // 目前使用模拟数据
    return {
      streak: 7,
      maxStreak: 14,
      monthCompletionRate: 85,
      totalFastingHours: 128,
      weekStats: {
        completed: 3,
        progress: 43,
        fastingHours: 48,
      },
      monthDaysCompleted: 18,
      monthDaysTotal: 22,
      currentWeek: 3,
      weeksToBadge: 4,
      weekGrowth: 18,
      historyPlans: [
        {
          id: 1,
          name: '18:6 进阶断食',
          startDate: '2025/05/01',
          endDate: '2025/05/15',
          tag: '连续执行',
          days: 15,
          completionRate: 100,
          icon: '🥗',
          iconClass: 'icon-186',
        },
        {
          id: 2,
          name: '16:8 轻断食',
          startDate: '2025/04/10',
          endDate: '2025/04/30',
          tag: '习惯养成',
          days: 21,
          completionRate: 95,
          icon: '🍃',
          iconClass: 'icon-168',
        },
        {
          id: 3,
          name: '20:4 极限挑战',
          startDate: '2025/03/20',
          endDate: '2025/03/28',
          tag: '尝试体验',
          days: 8,
          completionRate: 62,
          icon: '🔥',
          iconClass: 'icon-204',
        },
      ],
    };
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 切换方案
  onSwitchPlan() {
    wx.navigateTo({
      url: '/pages/fast-plan/index',
    });
  },

  // 暂停/恢复计划（通过切换状态实现）
  onPausePlan() {
    const isPaused = this.data.planStatus === 'idle';
    const action = isPaused ? '恢复' : '暂停';

    wx.showModal({
      title: `${action}计划`,
      content: `确定要${action}当前断食计划吗？`,
      success: (res) => {
        if (res.confirm) {
          if (isPaused) {
            // 恢复：重新开始断食
            const state = fasting.getCurrentState();
            if (state.planId) {
              fasting.startPlan(state.planId, {
                fastHours: state.customFastHours,
                eatHours: state.customEatHours,
              });
              this.setData({ planStatus: fasting.STATUS.FASTING });
              wx.showToast({
                title: '计划已恢复',
                icon: 'success',
              });
            }
          } else {
            // 暂停：结束当前计划
            fasting.stopPlan();
            this.setData({ planStatus: fasting.STATUS.IDLE });
            wx.showToast({
              title: '计划已暂停',
              icon: 'success',
            });
          }
        }
      },
    });
  },

  // 日期点击
  onDayTap(e) {
    const { date } = e.currentTarget.dataset;
    wx.showToast({
      title: `查看 ${date}`,
      icon: 'none',
    });
    // 可扩展：跳转到当日详情
  },

  // 查看全部
  onViewAll() {
    // TODO: 跳转到日历页面
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  },

  // 查看详细报告
  onViewReport() {
    wx.navigateTo({
      url: '/pages/dataCenter/index',
    });
  },

  // 查看历史
  onViewHistory() {
    // TODO: 跳转到历史记录页面
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  },

  // 历史计划点击
  onHistoryItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({
      title: `查看计划 ${id}`,
      icon: 'none',
    });
    // 可扩展：跳转到历史计划详情
  },

  // 创建新计划
  onCreatePlan() {
    wx.navigateTo({
      url: '/pages/fast-plan/index',
    });
  },
});
