const fasting = require('~/utils/fasting');
const i18nBehavior = require('../../utils/i18n-behavior');
const storage = require('~/utils/storage');
const { getPlan } = require('~/config/fastingPlans');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['我的计划', '进行中', '已结束', '每日断食', '小时', '进食窗口', '今日', '连续天数', '最长连续', '本月完成率', '累计断食', '切换方案', '结束计划', '本周概览', '查看全部', '日', '一', '二', '三', '四', '五', '六', '已完成', '周进度', '本周断食', '连续中', '成就数据', '详细报告', '累计断食总时长', '天', '历史最长连续', '保持记录中', '本月完成天数', '持续坚持周期', '第', '周', '历史计划', '更多', '完成率', '暂无历史计划', '创建新计划', '向上滑动回到顶部', '较上周', '周后解锁徽章'],
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
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadData();
  },

  onShow() {
    this.i18nRefresh();
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

    // 从存储获取统计数据
    const stats = this.getStats();
    const dateSet = stats._dateSet;
    delete stats._dateSet;

    // 生成本周日期（使用真实数据）
    const weekDays = this.generateWeekDays(dateSet);

    this.setData({
      todayProgress,
      weekDays,
      planStatus: fastingState.status,
      currentPlan: fastingState.plan || this.data.currentPlan,
      ...stats,
    });

    // 绘制环形进度条
    this.drawRing(fastingState.progress || 0);
  },

  generateWeekDays(dateSet) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const key = this.dateKey(date);

      const isToday = date.toDateString() === today.toDateString();
      const isFuture = date > today;
      const hasRecord = dateSet.has(key);

      let dotClass = '';
      if (isFuture) {
        dotClass = 'dot-future';
      } else if (isToday) {
        dotClass = '';
      } else if (hasRecord) {
        dotClass = 'dot-success';
      } else {
        dotClass = '';
      }

      weekDays.push({
        date: key,
        day: date.getDate(),
        status: isFuture ? 'future' : '',
        isToday,
        dotClass,
      });
    }

    return weekDays;
  },

  dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  pad(n) {
    return String(n).padStart(2, '0');
  },

  getStats() {
    const history = storage.get(storage.KEYS.FASTING_HISTORY, []);
    const fastingState = fasting.getCurrentState();
    const now = new Date();
    const todayKey = this.dateKey(now);

    // 从历史记录 + 当前状态构建活跃日期集合
    const dateSet = new Set();
    history.forEach(record => {
      dateSet.add(this.dateKey(new Date(record.startTime)));
    });
    if (fastingState.status !== 'idle' && fastingState.currentCycleStart) {
      dateSet.add(todayKey);
    }

    const sortedDates = Array.from(dateSet).sort();

    // 1. 连续天数（从今天往回数）
    const streak = this.computeStreak(dateSet);

    // 2. 最长连续
    const maxStreak = this.computeMaxStreak(sortedDates);

    // 3. 本月完成率
    const monthDaysTotal = now.getDate();
    const yearMonth = `${now.getFullYear()}-${this.pad(now.getMonth() + 1)}`;
    let monthDaysCompleted = 0;
    sortedDates.forEach(date => {
      if (date.startsWith(yearMonth)) monthDaysCompleted++;
    });
    const monthCompletionRate = monthDaysTotal > 0
      ? Math.round(monthDaysCompleted / monthDaysTotal * 100)
      : 0;

    // 4. 累计断食小时
    let totalMs = 0;
    history.forEach(record => {
      const start = new Date(record.startTime).getTime();
      const end = new Date(record.endTime).getTime();
      if (end > start) totalMs += end - start;
    });
    if (fastingState.status !== 'idle' && fastingState.currentCycleStart) {
      const ongoing = now.getTime() - new Date(fastingState.currentCycleStart).getTime();
      if (ongoing > 0) totalMs += ongoing;
    }
    const totalFastingHours = Math.floor(totalMs / 3600000);

    // ===== 本周数据 =====
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    let weekCompleted = 0;
    let weekMs = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      if (d > now) break;
      const dKey = this.dateKey(d);
      if (dateSet.has(dKey)) {
        weekCompleted++;
        history.forEach(record => {
          if (this.dateKey(new Date(record.startTime)) === dKey) {
            const s = new Date(record.startTime).getTime();
            const e = new Date(record.endTime).getTime();
            weekMs += Math.max(0, e - s);
          }
        });
      }
    }
    if (fastingState.status !== 'idle' && fastingState.currentCycleStart) {
      const cycleStart = new Date(fastingState.currentCycleStart);
      if (cycleStart >= monday) {
        weekMs += now.getTime() - cycleStart.getTime();
      }
    }
    const weekFastingHours = Math.floor(weekMs / 3600000);
    const weekProgress = Math.round(weekCompleted / 7 * 100);

    // 上周增长
    const lastMonday = new Date(monday);
    lastMonday.setDate(monday.getDate() - 7);
    let lastWeekMs = 0;
    history.forEach(record => {
      const recStart = new Date(record.startTime);
      if (recStart >= lastMonday && recStart < monday) {
        lastWeekMs += Math.max(0, new Date(record.endTime).getTime() - recStart.getTime());
      }
    });
    const weekGrowth = weekFastingHours - Math.floor(lastWeekMs / 3600000);

    // 坚持周数
    let earliestDate = now;
    if (sortedDates.length > 0) {
      earliestDate = new Date(sortedDates[0]);
    }
    const currentWeek = Math.max(1, Math.floor((now.getTime() - earliestDate.getTime()) / (7 * 24 * 3600 * 1000)) + 1);
    const weeksToBadge = Math.max(0, 4 - currentWeek);

    // ===== 历史计划（按 planId 归组）=====
    const planMap = {};
    history.forEach(record => {
      if (!record.planId) return;
      if (!planMap[record.planId]) {
        const plan = getPlan(record.planId);
        planMap[record.planId] = {
          planId: record.planId,
          name: plan ? plan.name : record.planId,
          records: [],
        };
      }
      planMap[record.planId].records.push(record);
    });

    const historyPlans = Object.values(planMap)
      .map(group => {
        const recs = group.records;
        const first = recs[recs.length - 1];
        const last = recs[0];
        const uniqueDates = new Set(recs.map(r => this.dateKey(new Date(r.startTime))));
        const startDate = new Date(first.startTime);
        const endDate = new Date(last.endTime);
        const periodDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1);
        const completionRate = Math.min(100, Math.round(uniqueDates.size / periodDays * 100));
        const days = uniqueDates.size;

        const plan = getPlan(group.planId);
        const diff = plan ? plan.difficulty : 0;
        let icon, iconClass, tag;
        if (diff >= 4) { icon = '🔥'; iconClass = 'icon-204'; }
        else if (diff >= 2) { icon = '🥗'; iconClass = 'icon-186'; }
        else { icon = '🍃'; iconClass = 'icon-168'; }

        if (days >= 21) tag = this.$t('习惯养成');
        else if (days >= 14) tag = this.$t('连续执行');
        else if (days >= 7) tag = this.$t('稳定执行');
        else tag = this.$t('尝试体验');

        return {
          id: group.planId,
          name: group.name,
          startDate: `${startDate.getFullYear()}/${this.pad(startDate.getMonth() + 1)}/${this.pad(startDate.getDate())}`,
          endDate: `${endDate.getFullYear()}/${this.pad(endDate.getMonth() + 1)}/${this.pad(endDate.getDate())}`,
          tag,
          days,
          completionRate,
          icon,
          iconClass,
        };
      })
      .sort((a, b) => b.days - a.days);

    return {
      streak,
      maxStreak,
      monthCompletionRate,
      totalFastingHours,
      weekStats: {
        completed: weekCompleted,
        progress: weekProgress,
        fastingHours: weekFastingHours,
      },
      monthDaysCompleted,
      monthDaysTotal,
      currentWeek,
      weeksToBadge,
      weekGrowth,
      historyPlans,
      _dateSet: dateSet,
    };
  },

  computeStreak(dateSet) {
    const now = new Date();
    if (!dateSet.has(this.dateKey(now))) return 0;

    let streak = 0;
    for (let i = 0; ; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      if (dateSet.has(this.dateKey(d))) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },

  computeMaxStreak(sortedDates) {
    if (sortedDates.length === 0) return 0;

    let max = 1, cur = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) {
        cur++;
        max = Math.max(max, cur);
      } else {
        cur = 1;
      }
    }
    return Math.max(max, cur);
  },

  drawRing(progress) {
    const sysInfo = wx.getSystemInfoSync();
    const scale = sysInfo.windowWidth / 750;

    const size = 216 * scale;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10 * scale;
    const lineWidth = 14 * scale;

    const ctx = wx.createCanvasContext('progressRing', this);

    // 背景环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.setStrokeStyle('#F0F0F0');
    ctx.setLineWidth(lineWidth);
    ctx.stroke();

    // 进度环
    if (progress > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (progress * 2 * Math.PI);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.setStrokeStyle(this.data.theme.brandPrimary || '#2EAF7D');
      ctx.setLineWidth(lineWidth);
      ctx.setLineCap('round');
      ctx.stroke();
    }

    ctx.draw();
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

  // 结束计划
  onEndPlan() {
    wx.showModal({
      title: this.$t('结束计划'),
      content: this.$t('确定要结束当前断食计划吗？') + ' ' + this.$t('结束后可以从历史记录中查看。'),
      success: (res) => {
        if (res.confirm) {
          fasting.stopPlan();
          this.setData({ planStatus: fasting.STATUS.IDLE });
          wx.showToast({
            title: this.$t('计划已结束'),
            icon: 'success',
          });
        }
      },
    });
  },

  // 日期点击
  onDayTap(e) {
    const { date } = e.currentTarget.dataset;
    wx.showToast({
      title: this.$t('查看') + ' ' + date,
      icon: 'none',
    });
    // 可扩展：跳转到当日详情
  },

  // 查看全部
  onViewAll() {
    // TODO: 跳转到日历页面
    wx.showToast({
      title: this.$t('功能开发中'),
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
      title: this.$t('功能开发中'),
      icon: 'none',
    });
  },

  // 历史计划点击
  onHistoryItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({
      title: 'Plan ' + id,
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
