const app = getApp();
const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['排行榜', '天连续断食', '本周减重', '我', '暂无排行数据', '数据每日凌晨更新', '已获成就', '全部', '个'],
  data: {
    statusBarHeight: 0,

    // 筛选类型
    filterTypes: [
      { type: 'total', name: '总榜', icon: '🏆' },
      { type: 'streak', name: '连续天数', icon: '🔥' },
      { type: 'monthly', name: '本月断食', icon: '📅' },
    ],
    currentFilter: 'total',

    // 时间范围
    timeRanges: [
      { type: 'week', name: '本周' },
      { type: 'month', name: '本月' },
      { type: 'all', name: '历史' },
    ],
    currentTimeRange: 'week',

    // 冠军数据
    champion: null,

    // 排行榜列表
    rankingList: [],

    // 我的排名
    myRank: null,

    // 成就徽章
    badges: [],
    totalBadges: 0,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadRankingData();
    this.loadMyBadgeData();
  },

  onShow() {
    this.i18nRefresh();
    this.loadRankingData();
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadRankingData(),
      this.loadMyBadgeData(),
    ]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 切换筛选类型
  onSwitchFilter(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.currentFilter) return;

    this.setData({ currentFilter: type });
    this.loadRankingData();
  },

  // 切换时间范围
  onSwitchTimeRange(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.currentTimeRange) return;

    this.setData({ currentTimeRange: type });
    this.loadRankingData();
  },

  // 加载排行榜数据
  async loadRankingData() {
    wx.showLoading({ title: '加载中...', mask: true });

    try {
      const { currentFilter, currentTimeRange } = this.data;

      const res = await wx.cloud.callFunction({
        name: 'getLeaderboard',
        data: {
          filterType: currentFilter,
          timeRange: currentTimeRange,
          limit: 30,
        },
      });

      const result = res.result || res;

      if (result.success && result.data) {
        const { champion, rankingList, myRank } = result.data;

        this.setData({
          champion,
          rankingList: rankingList || [],
          myRank,
        });
      } else {
        console.error('排行榜数据获取失败:', result.message);
        this.setData({ rankingList: [], champion: null, myRank: null });
      }
    } catch (err) {
      console.error('加载排行榜失败:', err);
      this.setData({ rankingList: [], champion: null, myRank: null });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载徽章数据
  loadMyBadgeData() {
    const earnedBadges = storage.get(storage.KEYS.EARNED_BADGES, []);
    const allBadges = this.getAllBadgesConfig();

    const badges = allBadges.slice(0, 6).map(badge => {
      const earned = earnedBadges.find(b => b.id === badge.id);
      return {
        ...badge,
        earned: !!earned,
        isNew: earned && this.isNewBadge(earned),
      };
    });

    this.setData({
      badges,
      totalBadges: allBadges.length,
    });
  },

  getAllBadgesConfig() {
    return [
      { id: 'streak_7', name: '7天连续', icon: '🔥' },
      { id: 'early_bird', name: '早鸟早起', icon: '🌙' },
      { id: 'month_master', name: '月度达人', icon: '📅' },
      { id: 'streak_21', name: '21天挑战', icon: '⭐' },
      { id: 'diamond', name: '钻石会员', icon: '💎' },
      { id: 'champion_road', name: '冠军之路', icon: '👑' },
      { id: 'streak_30', name: '30天挑战', icon: '🎯' },
      { id: 'weight_master', name: '减重大师', icon: '💪' },
      { id: 'perfect_month', name: '完美月度', icon: '🌈' },
      { id: 'century', name: '百日挑战', icon: '🏆' },
    ];
  },

  isNewBadge(badge) {
    if (!badge.earnedAt) return false;
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return now - badge.earnedAt < sevenDays;
  },

  // 查看用户详情
  onViewUser(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onViewAllBadges() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onViewBadge(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },
});
