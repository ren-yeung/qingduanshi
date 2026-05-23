const app = getApp();
const fasting = require('~/utils/fasting');
const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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
  behaviors: [themeBehavior],
  data: {
    statusBarHeight: 0,
    todayDate: '',
    fastingState: { status: 'idle', plan: null, progress: 0, remainingText: '00:00:00', elapsedText: '00:00' },
    todayStats: {
      weight: '--',
      calories: 0,
      calorieTarget: storage.DEFAULT_GOAL.calories,
      calorieRemaining: storage.DEFAULT_GOAL.calories,
      calorieProgress: 0,
      carbs: 0,
      carbsRemaining: 162,
      protein: 0,
      proteinRemaining: 124,
      fat: 0,
      fatRemaining: 55,
    },
    checkedIn: false,
    streak: 0,
  },

  async onShow() {
    this.setTodayDate();
    this.refreshState();
    await this.loadTodayStats();
    this.loadCheckInStatus();
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    
    // 监听注销账号事件（只注销账号会清空数据并重置页面）
    app.eventBus.on('user-destroy', this.onUserDestroy.bind(this));
  },

  onUnload() {
    // 取消事件监听
    app.eventBus.off('user-destroy', this.onUserDestroy.bind(this));
    this.clearTimer();
  },

  // 注销账号后重置页面数据
  onUserDestroy() {
    this.clearTimer();
    this.setData({
      fastingState: { status: 'idle', plan: null, progress: 0, remainingText: '00:00:00', elapsedText: '00:00' },
      todayStats: {
        weight: '--',
        calories: 0,
        calorieTarget: storage.DEFAULT_GOAL.calories,
        calorieRemaining: storage.DEFAULT_GOAL.calories,
        calorieProgress: 0,
        carbs: 0,
        carbsRemaining: 162,
        protein: 0,
        proteinRemaining: 124,
        fat: 0,
        fatRemaining: 55,
      },
      checkedIn: false,
      streak: 0,
    });
  },

  setTodayDate() {
    const d = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const weekday = weekdays[d.getDay()];
    const str = `${month}月${date}日 ${weekday}`;
    this.setData({ todayDate: str });
  },

  onHide() {
    // 不清除计时器，让后台运行时计时器继续工作
    // 依赖 getCurrentState() 在 onShow() 时自动计算后台流逝的时间
  },

  onUnload() {
    this.clearTimer();
  },

  refreshState() {
    const state = fasting.getCurrentState();
    // 临时测试：设为11小时（68.75%进度）
    state.progress = 0.6875;
    state.elapsed = 11 * 3600 * 1000;
    state.elapsedText = '11:00:00';
    state.remaining = 5 * 3600 * 1000;
    state.remainingText = '05:00:00';
    this.setData({ fastingState: state });
    this.startTimerIfNeeded();
  },

  startTimerIfNeeded() {
    if (this._timer) return;
    if (this.data.fastingState.status === 'idle') return;

    // 不清除计时器，让 getCurrentState() 自动处理阶段切换
    this._timer = setInterval(() => {
      const state = fasting.getCurrentState();
      this.setData({ fastingState: state });
    }, 1000);
  },

  clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  async loadTodayStats() {
    const today = getTodayStr();

    let calories = 0, carbs = 0, protein = 0, fat = 0;

    // 读取今日饮食记录
    const dietRecords = storage.get(storage.KEYS.DIET_RECORDS, []);
    const todayDiet = dietRecords.find((r) => r.date === today);

    if (todayDiet) {
      calories = todayDiet.totalCalories || 0;
      carbs = todayDiet.totalCarbs || 0;
      protein = todayDiet.totalProtein || 0;
      fat = todayDiet.totalFat || 0;
    }

    // 容错：如果营养素字段为0或undefined，从foods数组重新计算
    if (todayDiet && (carbs === 0 || protein === 0 || fat === 0)) {
      let totalCarbs = 0, totalProtein = 0, totalFat = 0, totalCalories = 0;
      Object.values(todayDiet.meals || {}).forEach((meal) => {
        (meal.foods || []).forEach((food) => {
          totalCarbs += food.carbs || 0;
          totalProtein += food.protein || 0;
          totalFat += food.fat || 0;
          totalCalories += food.calories || 0;
        });
      });
      carbs = Math.round(totalCarbs * 10) / 10;
      protein = Math.round(totalProtein * 10) / 10;
      fat = Math.round(totalFat * 10) / 10;
      calories = totalCalories;
    }

    const goal = storage.getGoal();
    const remaining = Math.max(0, goal.calories - calories);
    const progress = Math.min(100, Math.round((calories / goal.calories) * 100));

    // 体重：优先取今日记录，没有则取最近一次记录的体重
    let todayWeight = null;

    // 1. 先看本地有没有今天的记录
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    todayWeight = weightRecords.find((r) => r.date === today);

    // 2. 如果今天没有，取本地最近一条记录
    if (!todayWeight && weightRecords.length > 0) {
      const latest = weightRecords[weightRecords.length - 1];
      todayWeight = { date: latest.date, weight: latest.weight, bmi: latest.bmi };
    }

    // 3. 如果本地没有，从云端获取最近一条体重记录
    if (!todayWeight) {
      try {
        const res = await wx.cloud.callFunction({
          name: 'bodyData',
          data: { action: 'getList', limit: 30, endDate: today },
        });
        if (res.result && res.result.success && res.result.data && res.result.data.length > 0) {
          const records = res.result.data;
          const todayRecord = records.find((r) => r.date === today);
          const latestRecord = records[records.length - 1];
          const target = todayRecord || latestRecord;
          todayWeight = { date: target.date, weight: target.weight, bmi: target.bmi };
        }
      } catch (err) {
        console.error('获取云端体重失败:', err);
      }
    }

    // 4. 如果没有任何记录，兜底使用首次登录时填写的体重
    if (!todayWeight) {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo && userInfo.firstWeight) {
        todayWeight = { date: today, weight: userInfo.firstWeight, bmi: null };
      }
    }

    this.setData({
      'todayStats.weight': todayWeight ? todayWeight.weight : '--',
      'todayStats.calories': calories,
      'todayStats.calorieTarget': goal.calories,
      'todayStats.calorieRemaining': Math.round(remaining * 10) / 10,
      'todayStats.calorieProgress': progress,
      'todayStats.carbs': carbs,
      'todayStats.carbsRemaining': Math.round(Math.max(0, goal.carbs - carbs) * 10) / 10,
      'todayStats.protein': protein,
      'todayStats.proteinRemaining': Math.round(Math.max(0, goal.protein - protein) * 10) / 10,
      'todayStats.fat': fat,
      'todayStats.fatRemaining': Math.round(Math.max(0, goal.fat - fat) * 10) / 10,
    });
  },

  loadCheckInStatus() {
    // 判断是否是首次登录
    const isFirstLogin = !wx.getStorageSync('infoCollected');
    if (isFirstLogin) {
      this.setData({ checkedIn: false, streak: 0 });
      return;
    }

    const history = storage.get(storage.KEYS.CHECK_IN_HISTORY, []);
    const today = getTodayStr();
    const checkedIn = history.some((h) => h.date === today);
    const streakData = storage.get(storage.KEYS.STREAK_DATA, { currentStreak: 0 });
    this.setData({ checkedIn, streak: streakData.currentStreak });
  },

  // 检查是否已登录，未登录时弹窗提示并跳转登录
  checkLoginAndPrompt() {
    const userInfo = wx.getStorageSync('userInfo');
    const isLoggedOut = wx.getStorageSync('isLoggedOut');
    if (!userInfo || isLoggedOut) {
      wx.showModal({
        title: '需要登录',
        content: '请先登录后再使用此功能',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/my/index' });
          }
        },
      });
      return false;
    }
    return true;
  },

  onCheckIn() {
    if (this.data.checkedIn) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }

    // 登录验证
    if (!this.checkLoginAndPrompt()) return;

    const history = storage.get(storage.KEYS.CHECK_IN_HISTORY, []);
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    let streakData = storage.get(storage.KEYS.STREAK_DATA, { currentStreak: 0, longestStreak: 0 });

    if (history.some((h) => h.date === yesterday)) {
      streakData.currentStreak += 1;
    } else {
      streakData.currentStreak = 1;
    }

    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }

    history.push({ date: today, streak: streakData.currentStreak, timestamp: Date.now() });
    storage.set(storage.KEYS.CHECK_IN_HISTORY, history.slice(-365));
    storage.set(storage.KEYS.STREAK_DATA, streakData);

    wx.navigateTo({
      url: `/pages/check-in/index?streak=${streakData.currentStreak}`,
    });

    this.setData({ checkedIn: true, streak: streakData.currentStreak });
  },

  onStartFasting() {
    wx.navigateTo({
      url: '/pages/fast-plan/index',
    });
  },

  onToggleState() {
    fasting.toggleState();
    this.refreshState();
  },

  onStopFasting() {
    wx.showModal({
      title: '确认结束',
      content: '确定要结束当前断食周期吗？',
      success: (res) => {
        if (res.confirm) {
          fasting.stopPlan();
          this.refreshState();
        }
      },
    });
  },

  onNotification() {
    wx.navigateTo({
      url: '/pages/notifications/index',
    });
  },

  onSettings() {
    wx.navigateTo({
      url: '/pages/setting/index',
    });
  },

  goToDataCenter() {
    // 登录验证
    if (!this.checkLoginAndPrompt()) return;
    wx.navigateTo({
      url: '/pages/dataCenter/index',
    });
  },

  goToAddFood() {
    // 登录验证
    if (!this.checkLoginAndPrompt()) return;
    const date = getTodayStr();
    const meal = getMealByTime();
    wx.navigateTo({
      url: `/pages/add-food/index?date=${date}&meal=${meal}`,
    });
  },

  goToAddBody() {
    // 登录验证
    if (!this.checkLoginAndPrompt()) return;
    const date = getTodayStr();
    wx.navigateTo({
      url: `/pages/add-body/index?date=${date}&mode=new`,
    });
  },
});
