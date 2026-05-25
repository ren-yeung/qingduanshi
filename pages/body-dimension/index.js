const app = getApp();
const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');
const unitUtil = require('~/utils/unit');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['身体维度', '最新体重', '较上周', 'BMI', '体脂率', '腰围', '臀围', 'BMI 指数', '记录今天的数据', '历史记录', '目标进度', '修改', '目标', '已减', '趋势变化', '近30天', '区间', '累计变化', '记录次数', '记录历史', '全部', '暂无记录，开始记录你的身体数据吧', '立即记录', '向上滑动回到顶部', '偏瘦', '正常范围', '偏胖', '肥胖'],
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
    
    // 目标进度（真实数据，加载后更新）
    goal: {
      current: '--',
      target: '--',
      lost: '--',
      total: '--',
      remain: '--',
      progress: 0,
      weeks: '--',
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
    this.i18nRefresh();
    this.translateChartTypes();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadOverviewData();
    this.loadHistoryData();
  },

  onShow() {
    this.i18nRefresh();
    this.translateChartTypes();
    // 每次显示时刷新数据
    this.loadOverviewData();
    this.loadHistoryData();
    this.setData({ weightUnit: unitUtil.getWeightUnitLabel() });
  },

  translateChartTypes() {
    this.setData({
      chartTypes: [
        { type: 'weight', name: this.$t('体重') },
        { type: 'bodyfat', name: this.$t('体脂率') },
        { type: 'waist', name: this.$t('腰围') },
        { type: 'hip', name: this.$t('臀围') },
      ],
    });
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadOverviewData(),
      this.loadHistoryData(),
    ]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载总览数据
  async loadOverviewData() {
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const bodyData = storage.get(storage.KEYS.BODY_DATA, []);

    // 按日期排序（最新在前）
    const sortedWeight = [...weightRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    const sortedBody = [...bodyData].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedWeight.length > 0) {
      const latest = sortedWeight[0];
      const previous = sortedWeight[1] || null;

      // 获取身高计算BMI
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const height = userInfo.height || 170; // cm
      const heightM = height / 100;
      const bmi = (latest.weight / (heightM * heightM)).toFixed(1);

      // 计算体重变化（与上一次记录对比）
      let change = 0;
      let changeType = 'down';
      if (previous) {
        change = (latest.weight - previous.weight).toFixed(1);
        changeType = change > 0 ? 'up' : 'down';
        change = Math.abs(change);
      }

      // BMI指示条位置（BMI范围 15-35）
      const bmiPos = Math.min(Math.max((bmi - 15) / 20 * 100, 0), 100);

      // BMI分类
      let category = this.$t('正常范围'), categoryClass = '', icon = '✅';
      if (bmi < 18.5) {
        category = this.$t('偏瘦'); categoryClass = 'warning'; icon = '📉';
      } else if (bmi < 24) {
        category = this.$t('正常范围'); categoryClass = ''; icon = '✅';
      } else if (bmi < 28) {
        category = this.$t('偏胖'); categoryClass = 'warning'; icon = '⚠️';
      } else {
        category = this.$t('肥胖'); categoryClass = 'danger'; icon = '🚨';
      }

      // 获取最新的身体维度数据
      const latestBody = sortedBody.length > 0 ? sortedBody[0] : null;

      this.setData({
        overview: {
          weight: unitUtil.formatWeightRaw(latest.weight),
          change: change,
          changeType: changeType,
          bmi: bmi,
          bodyFat: latestBody ? (latestBody.bodyFat || '--') : '--',
          waist: latestBody ? (latestBody.waist || '--') : '--',
          hip: latestBody ? (latestBody.hip || '--') : '--',
        },
        bmiCategory: category,
        bmiCategoryClass: categoryClass,
        bmiCategoryIcon: icon,
        bmiPosition: bmiPos,
      });

      // 加载完overview后再计算目标进度
      this.loadGoalData(sortedWeight);
    } else {
      // 无体重记录时，也尝试加载目标
      this.loadGoalData([]);
    }
  },

  // 加载目标数据（基于真实体重记录）
  loadGoalData(sortedWeight) {
    const weightGoal = storage.getWeightGoal();

    if (!sortedWeight) {
      const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
      sortedWeight = [...weightRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 获取信息收集时录入的初始体重（users 数据集 firstWeight 字段）
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const firstWeight = parseFloat(userInfo.firstWeight) || 0;

    if (!weightGoal || !firstWeight) {
      // 无目标或未设置初始体重
      this.setData({
        goal: {
          current: firstWeight ? unitUtil.formatWeightRaw(firstWeight) : '--',
          target: weightGoal ? unitUtil.formatWeightRaw(parseFloat(weightGoal.target)) : '--',
          lost: '--',
          total: '--',
          remain: '--',
          progress: 0,
          weeks: '--',
        }
      });
      return;
    }

    const targetWeight = parseFloat(weightGoal.target);

    // 最新体重
    const latestWeight = sortedWeight.length > 0 ? parseFloat(sortedWeight[0].weight) : firstWeight;

    // 已减体重 = 初始体重 - 最新体重
    const lostWeight = (firstWeight - latestWeight).toFixed(1);
    // 目标减重 = 初始体重 - 目标体重
    const targetLoss = (firstWeight - targetWeight).toFixed(1);
    // 剩余需减 = 最新体重 - 目标体重
    const remain = Math.max(0, (latestWeight - targetWeight)).toFixed(1);
    // 进度 = 已减 / 目标减重 * 100
    const progress = parseFloat(targetLoss) > 0
      ? Math.min(100, Math.round(parseFloat(lostWeight) / parseFloat(targetLoss) * 100))
      : 0;
    // 预计每周减0.5kg
    const weeks = Math.ceil(parseFloat(remain) / 0.5);

    this.setData({
      goal: {
        current: unitUtil.formatWeightRaw(firstWeight),
        target: unitUtil.formatWeightRaw(targetWeight),
        lost: unitUtil.formatWeightRaw(parseFloat(lostWeight)),
        total: unitUtil.formatWeightRaw(parseFloat(targetLoss)),
        remain: unitUtil.formatWeightRaw(parseFloat(remain)),
        progress: progress,
        weeks: weeks,
      }
    });
  },

  // 加载历史记录（合并体重记录和身体维度数据）
  loadHistoryData() {
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const bodyData = storage.get(storage.KEYS.BODY_DATA, []);

    // 将 bodyData 按日期建立索引
    const bodyMap = {};
    bodyData.forEach(b => { bodyMap[b.date] = b; });

    // 合并：以体重记录为主，用 bodyData 补充体脂/腰围/臀围
    const mergedRecords = weightRecords.map(record => {
      const body = bodyMap[record.date] || {};
      return {
        date: record.date,
        weight: record.weight,
        bodyFat: body.bodyFat || null,
        waist: body.waist || null,
        hip: body.hip || null,
        mood: body.mood || 4,
      };
    });

    // 按日期倒序排列
    mergedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 格式化显示
    const formatRecords = mergedRecords.slice(0, 10).map(record => {
      const date = new Date(record.date);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']; // keys in i18n

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
        dow: translatedDow,
        bmi: bmi,
        mood: `${this.$t('心情 ')}${mood}`,
      };
    });

    this.setData({ historyList: formatRecords });
    this.loadChartData(mergedRecords);
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
    
    // 重新合并最新数据
    const weightRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const bodyData = storage.get(storage.KEYS.BODY_DATA, []);
    const bodyMap = {};
    bodyData.forEach(b => { bodyMap[b.date] = b; });
    const mergedRecords = weightRecords.map(record => {
      const body = bodyMap[record.date] || {};
      return {
        date: record.date,
        weight: record.weight,
        bodyFat: body.bodyFat || null,
        waist: body.waist || null,
        hip: body.hip || null,
      };
    });
    mergedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.loadChartData(mergedRecords);
  },

  // 记录今天的数据（与概览页记录体重跳转一致）
  onRecordToday() {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    wx.navigateTo({
      url: `/pages/add-body/index?date=${date}&mode=new`,
    });
  },

  // 查看历史记录（带日期选择器）
  onViewHistory() {
    wx.navigateTo({
      url: '/pages/body-history/index',
    });
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

  // 查看单条记录（跳转 add-body 编辑模式）
  onViewRecord(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/add-body/index?id=${id}&mode=edit`,
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
