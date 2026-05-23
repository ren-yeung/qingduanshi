const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { filterType = 'total', timeRange = 'week', limit = 30 } = event;
  const wxContext = cloud.getWXContext();
  const myOpenid = wxContext.OPENID;

  const now = new Date();

  // 计算时间范围起点
  let rangeStart = null;
  if (timeRange === 'week') {
    const dayOfWeek = now.getDay();
    rangeStart = new Date(now);
    rangeStart.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    rangeStart.setHours(0, 0, 0, 0);
  } else if (timeRange === 'month') {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  try {
    // 1. 查询 users 集合获取用户资料 + 历史数据
    const { data: users } = await db.collection('users')
      .field({
        openid: true,
        nickName: true,
        avatarUrl: true,
        firstWeight: true,
        fastingHistory: true,
        streakData: true,
        weightRecords: true,
        fastingState: true,
      })
      .limit(50)
      .get();

    // 2. 查询 user_data 集合获取实时断食数据
    const { data: userDataList } = await db.collection('user_data')
      .field({
        _openid: true,
        fastingHistory: true,
        fastingState: true,
        streakData: true,
        weightRecords: true,
      })
      .limit(50)
      .get();

    // 按 openid 索引 user_data
    const userDataMap = {};
    (userDataList || []).forEach(ud => {
      if (ud._openid) {
        userDataMap[ud._openid] = ud;
      }
    });

    // 3. 为每个用户计算排行指标（优先用 user_data 的实时数据）
    const ranked = users.map(user => {
      const ud = userDataMap[user.openid] || {};

      // 优先使用 user_data 的数据（更实时），否则用 users 的数据
      const history = ud.fastingHistory || user.fastingHistory || [];
      const streakData = ud.streakData || user.streakData || null;
      const weightRecords = ud.weightRecords || user.weightRecords || [];
      const firstWeight = parseFloat(user.firstWeight) || 0;

      // 统计
      let totalMs = 0;
      let weekMs = 0;
      let monthMs = 0;
      const dateSet = new Set();

      history.forEach(record => {
        const start = new Date(record.startTime).getTime();
        const end = new Date(record.endTime).getTime();
        const duration = Math.max(0, end - start);
        totalMs += duration;

        if (record.startTime) {
          dateSet.add(dateKey(new Date(record.startTime)));
        }

        if (rangeStart && new Date(record.startTime) >= rangeStart) {
          if (timeRange === 'week') weekMs += duration;
          if (timeRange === 'month') monthMs += duration;
        } else if (timeRange === 'all') {
          weekMs += duration;
          monthMs += duration;
        }
      });

      const totalHours = Math.floor(totalMs / 3600000);
      const weekHours = Math.floor(weekMs / 3600000);
      const monthHours = Math.floor(monthMs / 3600000);

      // 连续天数
      let streak = 0;
      if (streakData && typeof streakData === 'object' && streakData.currentStreak) {
        streak = streakData.currentStreak;
      } else if (streakData && typeof streakData === 'number') {
        streak = streakData;
      } else {
        streak = computeCurrentStreak(dateSet);
      }

      // 本月完成天数
      const yearMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
      let monthDays = 0;
      dateSet.forEach(date => {
        if (date.startsWith(yearMonth)) monthDays++;
      });

      // 减重
      let weightLoss = 0;
      if (firstWeight > 0 && weightRecords.length > 0) {
        const sorted = [...weightRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
        const latestWeight = parseFloat(sorted[sorted.length - 1].weight) || firstWeight;
        weightLoss = Math.round((firstWeight - latestWeight) * 10) / 10;
      }

      // 排序分数
      let sortScore = 0;
      if (filterType === 'total') {
        sortScore = totalHours;
      } else if (filterType === 'streak') {
        sortScore = streak;
      } else if (filterType === 'monthly') {
        sortScore = monthDays;
      }

      return {
        openid: user.openid,
        nickName: user.nickName || '匿名用户',
        avatarUrl: user.avatarUrl || '',
        totalHours,
        streak,
        monthDays,
        weekHours,
        monthHours,
        weightLoss,
        completionRate: monthDays > 0 ? Math.round(monthDays / now.getDate() * 100) : 0,
        sortScore,
      };
    });

    // 过滤掉完全没有数据的用户
    const activeUsers = ranked.filter(u => u.totalHours > 0 || u.streak > 0);

    // 排序、分配排名
    activeUsers.sort((a, b) => b.sortScore - a.sortScore);

    let currentRank = 0;
    let lastScore = -1;
    activeUsers.forEach((item, index) => {
      if (item.sortScore !== lastScore) {
        currentRank = index + 1;
        lastScore = item.sortScore;
      }
      item.rank = currentRank;
      item.isMe = item.openid === myOpenid;
    });

    // 冠军
    const champion = activeUsers.length > 0 ? {
      title: getChampionTitle(filterType, timeRange),
      name: activeUsers[0].nickName,
      streak: activeUsers[0].streak,
      fastingHours: timeRange === 'week' ? activeUsers[0].weekHours
        : timeRange === 'month' ? activeUsers[0].monthHours
        : activeUsers[0].totalHours,
      weightLoss: activeUsers[0].weightLoss > 0 ? `-${activeUsers[0].weightLoss}kg` : '0kg',
      completionRate: activeUsers[0].completionRate,
    } : null;

    // 我的排名
    const me = activeUsers.find(r => r.isMe);
    let myRank = null;
    if (me) {
      const meIdx = activeUsers.findIndex(r => r.isMe);
      const prev = meIdx > 0 ? activeUsers[meIdx - 1] : null;
      let progress = '';
      if (!prev) {
        progress = '当前第一名！';
      } else {
        const diff = prev.sortScore - me.sortScore;
        const unitLabel = filterType === 'total' ? 'h'
          : filterType === 'streak' ? '天'
          : '天';
        progress = diff > 0 ? `还差 ${diff}${unitLabel} 追上第 ${prev.rank} 名` : '继续保持！';
      }

      myRank = {
        rank: me.rank,
        nickName: me.nickName,
        avatarUrl: me.avatarUrl,
        streak: me.streak,
        progress,
        sortScore: me.sortScore,
      };
    }

    // 构建排名列表
    const rankingList = activeUsers.slice(0, limit).map(r => ({
      rank: r.rank,
      userId: r.openid,
      openid: r.openid,
      nickName: r.nickName,
      avatarEmoji: '',
      avatarUrl: r.avatarUrl,
      streak: r.streak,
      fastingHours: timeRange === 'week' ? r.weekHours
        : timeRange === 'month' ? r.monthHours
        : r.totalHours,
      completionRate: r.completionRate,
      isVip: r.rank <= 1,
      isMe: r.isMe,
      weightLoss: r.weightLoss > 0 ? `-${r.weightLoss}kg` : '0kg',
    }));

    return {
      success: true,
      data: { champion, rankingList, myRank, total: activeUsers.length },
    };
  } catch (error) {
    console.error('getLeaderboard error:', error);
    return {
      success: false,
      message: error.message || '排行数据获取失败',
    };
  }
};

// ===== 辅助函数 =====

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function computeCurrentStreak(dateSet) {
  const arr = Array.from(dateSet).sort();
  if (arr.length === 0) return 0;

  const today = dateKey(new Date());
  if (!dateSet.has(today)) return 0;

  let streak = 0;
  const now = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (dateSet.has(dateKey(d))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getChampionTitle(filterType, timeRange) {
  const prefix = timeRange === 'week' ? '本周'
    : timeRange === 'month' ? '本月'
    : '历史';

  const suffixMap = {
    total: '断食总冠军',
    streak: '连续断食王者',
    monthly: '月度断食达人',
  };

  return `${prefix}${suffixMap[filterType] || '断食冠军'}`;
}
