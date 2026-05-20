const app = getApp();
const storage = require('~/utils/storage');

Page({
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
    const info = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: info.statusBarHeight,
    });

    this.loadRankingData();
    this.loadMyBadgeData();
  },

  onShow() {
    // 每次显示刷新排行
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
      // 从本地存储获取数据
      const fastingPlans = storage.get(storage.KEYS.FASTING_PLANS, []);
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const openid = userInfo.openid;
      
      // 模拟排行榜数据 (实际应从云端获取)
      const mockRankingList = this.generateMockRanking(openid);
      
      // 找到冠军(连续天数最多的)
      const champion = this.findChampion(mockRankingList);
      
      // 找到我的排名
      const myRank = this.findMyRank(mockRankingList, openid, userInfo);
      
      this.setData({
        rankingList: mockRankingList,
        champion: champion,
        myRank: myRank,
      });
      
    } catch (err) {
      console.error('加载排行榜失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 生成模拟排行榜数据
  generateMockRanking(myOpenid) {
    const avatars = ['🦋', '🌸', '🏃', '☀️', '🌙', '🍵', '🌿', '💫', '🎯', '⭐', '🌈', '🎨'];
    const names = ['清风徐来', '健康达人小美', '运动健身王', '阳光小分队', '早睡早起党', '养生小专家', '轻生活倡导者', '元气少女', '活力满满', '自律达人', '星辰大海', '养生专家'];
    
    // 生成排行数据
    const list = [];
    for (let i = 0; i < 12; i++) {
      const streak = 21 - i * 1.5;
      const fastingHours = (streak * 16).toFixed(0);
      
      list.push({
        rank: i + 1,
        userId: `user_${i}`,
        openid: i === 7 ? myOpenid : `mock_${i}`,
        nickName: names[i],
        avatarEmoji: avatars[i],
        avatarUrl: '',
        streak: Math.round(streak),
        fastingHours: fastingHours,
        completionRate: Math.round(100 - i * 3),
        isVip: i === 0,
        isMe: i === 7,
        weightLoss: i < 3 ? `-${(3 - i * 0.5).toFixed(1)}kg` : '-0.5kg',
      });
    }
    
    return list;
  },

  // 找到冠军
  findChampion(list) {
    if (list.length === 0) return null;
    
    const topUser = list[0];
    return {
      title: this.getChampionTitle(),
      name: topUser.nickName,
      streak: topUser.streak,
      fastingHours: topUser.fastingHours,
      weightLoss: topUser.weightLoss,
      completionRate: topUser.completionRate,
    };
  },

  // 获取冠军称号
  getChampionTitle() {
    const titles = ['本周连续断食冠军', '本月断食达人', '减重先锋', '自律标兵'];
    const filterType = this.data.currentFilter;
    
    const titleMap = {
      total: titles[0],
      streak: '连续断食王者',
      monthly: '月度断食冠军',
      weight: '减重达人',
    };
    
    return titleMap[filterType] || titles[0];
  },

  // 找到我的排名
  findMyRank(list, openid, userInfo) {
    const myIndex = list.findIndex(item => item.openid === openid || item.isMe);
    
    if (myIndex === -1) return null;
    
    const myData = list[myIndex];
    const prevRank = myIndex > 0 ? list[myIndex - 1] : null;
    
    let progress = '';
    if (prevRank) {
      const diff = prevRank.streak - myData.streak;
      if (diff > 0) {
        progress = `还差 ${diff} 天追上第 ${prevRank.rank} 名`;
      } else {
        progress = '继续保持！';
      }
    } else {
      progress = '当前第一名！';
    }
    
    return {
      rank: myData.rank,
      nickName: userInfo.nickName || '我',
      avatarUrl: userInfo.avatarUrl || '',
      streak: myData.streak,
      progress: progress,
    };
  },

  // 加载徽章数据
  loadMyBadgeData() {
    const earnedBadges = storage.get(storage.KEYS.EARNED_BADGES, []);
    const allBadges = this.getAllBadgesConfig();
    
    // 标记已获得和新增
    const badges = allBadges.slice(0, 6).map(badge => {
      const earned = earnedBadges.find(b => b.id === badge.id);
      return {
        ...badge,
        earned: !!earned,
        isNew: earned && this.isNewBadge(earned),
      };
    });
    
    this.setData({
      badges: badges,
      totalBadges: allBadges.length,
    });
  },

  // 获取所有徽章配置
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

  // 判断是否是新获得的徽章 (7天内获得)
  isNewBadge(badge) {
    if (!badge.earnedAt) return false;
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return now - badge.earnedAt < sevenDays;
  },

  // 查看用户详情
  onViewUser(e) {
    const { userid } = e.currentTarget.dataset;
    // 暂不实现，可跳转用户主页
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 查看所有徽章
  onViewAllBadges() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 查看单个徽章详情
  onViewBadge(e) {
    const { id } = e.currentTarget.dataset;
    // 暂不实现，可跳转徽章详情页
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },
});
