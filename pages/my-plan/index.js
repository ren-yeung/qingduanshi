const fasting = require('~/utils/fasting');
const storage = require('~/utils/storage');
const { getPlan } = require('~/config/fastingPlans');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],
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

    // 身体维度
    bodyStats: null,
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

        if (days >= 21) tag = '习惯养成';
        else if (days >= 14) tag = '连续执行';
        else if (days >= 7) tag = '稳定执行';
        else tag = '尝试体验';

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

    // ===== 身体维度数据 =====
    const userInfo = wx.getStorageSync('userInfo') || {};
    const firstWeight = parseFloat(userInfo.firstWeight) || 0;
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const weightGoal = storage.getWeightGoal();
    const bodyData = storage.get(storage.KEYS.BODY_DATA, []);

    let bodyStats = null;
    if (firstWeight && (weightRecords.length > 0 || weightGoal)) {
      const sorted = [...weightRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
      const latestWeight = sorted.length > 0
        ? sorted[sorted.length - 1].weight
        : firstWeight;
      const targetWeight = weightGoal ? parseFloat(weightGoal.target) : null;

      const lostWeight = firstWeight - latestWeight;
      const targetLoss = targetWeight ? firstWeight - targetWeight : null;
      const progress = targetLoss && targetLoss > 0
        ? Math.min(100, Math.round(lostWeight / targetLoss * 100))
        : 0;

      const latestBody = bodyData.length > 0 ? bodyData[bodyData.length - 1] : null;

      bodyStats = {
        firstWeight: firstWeight.toFixed(1),
        latestWeight: latestWeight.toFixed(1),
        targetWeight: targetWeight ? targetWeight.toFixed(1) : null,
        lostWeight: lostWeight.toFixed(1),
        targetLoss: targetLoss ? targetLoss.toFixed(1) : null,
        progress,
        bmi: latestBody ? latestBody.bmi : (sorted.length > 0 ? sorted[sorted.length - 1].bmi : null),
        bodyFat: latestBody ? latestBody.bodyFat : null,
        waist: latestBody ? latestBody.waist : null,
        hip: latestBody ? latestBody.hip : null,
      };
    }

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
      bodyStats,
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

  // 查看身体维度详情
  onViewBodyDetail() {
    wx.navigateTo({
      url: '/pages/body-dimension/index',
    });
  },

  // 创建新计划
  onCreatePlan() {
    wx.navigateTo({
      url: '/pages/fast-plan/index',
    });
  },
});
