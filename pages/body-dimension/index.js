const app = getApp();
const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],
  data: {
    statusBarHeight: 0,

    // 数据总览
    overview: {
      weight: '--',
      change: '--',
      changeType: 'down',
      bmi: '--',
      bodyFat: '--',
      waist: '--',
      hip: '--',
    },
    
    // BMI状态
    bmiCategory: '计算中',
    bmiCategoryClass: '',
    bmiCategoryIcon: '',
    bmiPosition: 50,
    
    // 目标进度（虚拟数据）
    goal: {
      current: '66.0',
      target: '60.0',
      lost: '4.8',
      total: '6.0',
      remain: '1.2',
      progress: 80,
      weeks: 6,
    },
    
    // 图表类型
    chartTypes: [
      { type: 'weight', name: '体重' },
      { type: 'bodyfat', name: '体脂率' },
      { type: 'waist', name: '腰围' },
      { type: 'hip', name: '臀围' },
    ],
    currentChartType: 'weight',
    
    // 图表数据
    chartData: [],
    chartXLabels: [],
    chartSummary: {
      range: '--',
      change: '--',
      count: 0,
    },
    
    // 历史记录
    historyList: [],
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadOverviewData();
    this.loadGoalData();
    this.loadHistoryData();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadOverviewData();
    this.loadHistoryData();
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadOverviewData(),
      this.loadGoalData(),
      this.loadHistoryData(),
    ]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载总览数据
  async loadOverviewData() {
    // 获取最新一条身体记录
    const records = storage.get(storage.KEYS.BODY_RECORDS, []);
    
    if (records.length > 0) {
      const latest = records[0];
      const previous = records[1] || null;
      
      // 计算BMI (需要身高)
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const height = userInfo.height || 170; // cm
      const heightM = height / 100;
      const bmi = (latest.weight / (heightM * heightM)).toFixed(1);
      
      // 计算体重变化
      let change = 0;
      let changeType = 'down';
      if (previous) {
        change = (latest.weight - previous.weight).toFixed(1);
        changeType = change > 0 ? 'up' : 'down';
        change = Math.abs(change);
      }
      
      // 计算BMI位置 (BMI范围 15-35)
      const bmiPos = Math.min(Math.max((bmi - 15) / 20 * 100, 0), 100);
      
      // 计算BMI分类
      let category = '正常范围', categoryClass = '', icon = '✅';
      if (bmi < 18.5) {
        category = '偏瘦'; categoryClass = 'warning'; icon = '📉';
      } else if (bmi < 24) {
        category = '正常范围'; categoryClass = ''; icon = '✅';
      } else if (bmi < 28) {
        category = '偏胖'; categoryClass = 'warning'; icon = '⚠️';
      } else {
        category = '肥胖'; categoryClass = 'danger'; icon = '🚨';
      }
      
      this.setData({
        overview: {
          weight: latest.weight,
          change: change,
          changeType: changeType,
          bmi: bmi,
          bodyFat: latest.bodyFat || '--',
          waist: latest.waist || '--',
          hip: latest.hip || '--',
        },
        bmiCategory: category,
        bmiCategoryClass: categoryClass,
        bmiCategoryIcon: icon,
        bmiPosition: bmiPos,
      });
    }
  },

  // 加载目标数据
  loadGoalData() {
    const goal = storage.get(storage.KEYS.BODY_GOAL, null);
    
    if (goal) {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const currentWeight = this.data.overview.weight !== '--' ? this.data.overview.weight : (userInfo.firstWeight || '--');
      
      if (currentWeight !== '--' && goal.targetWeight) {
        const total = (currentWeight - goal.targetWeight).toFixed(1);
        const lost = (currentWeight - goal.targetWeight + parseFloat(total)).toFixed(1);
        const remain = Math.max(0, goal.targetWeight - currentWeight).toFixed(1);
        const progress = total > 0 ? Math.min(Math.round((parseFloat(lost) / parseFloat(total)) * 100), 100) : 0;
        // 预计每周减0.5kg
        const weeks = Math.ceil(remain / 0.5);
        
        this.setData({
          goal: {
            current: currentWeight,
            target: goal.targetWeight,
            lost: lost,
            total: total,
            remain: remain,
            progress: progress,
            weeks: weeks,
          }
        });
      } else {
        this.setData({
          goal: {
            current: currentWeight,
            target: goal.targetWeight || '--',
            lost: '--',
            total: '--',
            remain: '--',
            progress: 0,
            weeks: '--',
          }
        });
      }
    }
  },

  // 加载历史记录
  loadHistoryData() {
    const records = storage.get(storage.KEYS.BODY_RECORDS, []);
    
    // 格式化日期显示
    const formatRecords = records.slice(0, 10).map(record => {
      const date = new Date(record.date);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      
      // 计算BMI
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const height = userInfo.height || 170;
      const heightM = height / 100;
      const bmi = (record.weight / (heightM * heightM)).toFixed(1);
      
      // 心情emoji
      const moods = ['😢', '😔', '😐', '🙂', '😊', '😃', '🤩'];
      const mood = moods[record.mood - 1] || '🙂';
      
      return {
        ...record,
        day: date.getDate(),
        dow: weekdays[date.getDay()],
        bmi: bmi,
        mood: `心情 ${mood}`,
      };
    });
    
    this.setData({ historyList: formatRecords });
    this.loadChartData(records);
  },

  // 加载图表数据
  loadChartData(records) {
    if (records.length === 0) return;
    
    // 取最近7条记录
    const recentRecords = records.slice(0, 7).reverse();
    
    // 根据当前选中类型获取数据
    const type = this.data.currentChartType;
    const dataMap = {
      weight: 'weight',
      bodyfat: 'bodyFat',
      waist: 'waist',
      hip: 'hip',
    };
    
    const dataKey = dataMap[type] || 'weight';
    const chartData = recentRecords.map(r => r[dataKey] || 0);
    
    // X轴标签
    const xLabels = recentRecords.map(r => {
      const date = new Date(r.date);
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    });
    
    // 计算摘要
    let summary = { range: '--', change: '--', count: recentRecords.length };
    if (chartData.length >= 2) {
      const first = chartData[0];
      const last = chartData[chartData.length - 1];
      summary.range = `${first} → ${last}`;
      const diff = (last - first).toFixed(1);
      summary.change = diff > 0 ? `↑ ${diff}` : `↓ ${Math.abs(diff)}`;
    }
    
    this.setData({
      chartData: chartData,
      chartXLabels: xLabels,
      chartSummary: summary,
    });
  },

  // 切换图表类型
  onSwitchChart(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.currentChartType) return;
    
    this.setData({ currentChartType: type });
    
    const records = storage.get(storage.KEYS.BODY_RECORDS, []);
    this.loadChartData(records);
  },

  // 记录今天的数据
  onRecordToday() {
    wx.navigateTo({
      url: '/pages/body-record/index', // 假设有录入页面
    });
  },

  // 查看历史
  onViewHistory() {
    // 滚动到历史记录区域
  },

  // 编辑目标
  onEditGoal() {
    wx.navigateTo({
      url: '/pages/goal/index',
    });
  },

  // 查看更多
  onViewMore() {
    wx.navigateTo({
      url: '/pages/body-trend/index',
    });
  },

  // 查看全部历史
  onViewAll() {
    wx.navigateTo({
      url: '/pages/body-history/index',
    });
  },

  // 查看单条记录
  onViewRecord(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/body-record/index?id=${id}`,
    });
  },

  // 图表触摸事件
  onTouchChart(e) {
    // 可以添加图表交互，如显示具体数值
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },
});
