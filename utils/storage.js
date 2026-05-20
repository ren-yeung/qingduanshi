// 本地存储数据层，统一 key 管理与序列化
const PREFIX = 'fasting_';

const KEYS = {
  USER_INFO: 'userInfo',
  SETTINGS: 'settings',
  FASTING_STATE: 'fastingState',
  FASTING_HISTORY: 'fastingHistory',
  WEIGHT_RECORDS: 'weightRecords',
  BODY_DATA: 'bodyData',
  DIET_RECORDS: 'dietRecords',
  STREAK_DATA: 'streakData',
  CHECK_IN_HISTORY: 'checkInHistory',
  GOAL: 'goal',
};

// 饮食目标默认值
const DEFAULT_GOAL = {
  calories: 1600,
  protein: 124,
  carbs: 162,
  fat: 55,
};

// 获取饮食目标（用户设置值优先，否则使用默认值）
function getGoal() {
  const savedGoal = get(KEYS.GOAL);
  return savedGoal || DEFAULT_GOAL;
}

// 保存饮食目标
function setGoal(goal) {
  return set(KEYS.GOAL, goal);
}

function getKey(key) {
  return PREFIX + key;
}

function get(key, defaultValue = null) {
  try {
    const raw = wx.getStorageSync(getKey(key));
    return raw !== undefined && raw !== '' ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(getKey(key), JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage set error:', e);
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(getKey(key));
    return true;
  } catch (e) {
    return false;
  }
}

function clear() {
  try {
    wx.clearStorageSync();
    return true;
  } catch (e) {
    return false;
  }
}

// 清除用户相关数据（注销时调用）
function clearUserData() {
  try {
    // 保留目标设置（可选）和设备设置，其他用户数据全部清除
    remove(KEYS.WEIGHT_RECORDS);
    remove(KEYS.BODY_DATA);
    remove(KEYS.DIET_RECORDS);
    remove(KEYS.STREAK_DATA);
    remove(KEYS.CHECK_IN_HISTORY);
    remove(KEYS.FASTING_STATE);
    remove(KEYS.FASTING_HISTORY);
    // 保留 GOAL 和 SETTINGS
    return true;
  } catch (e) {
    return false;
  }
}

// 判断是否真正首次登录（未完成信息收集或已注销账号）
function isFirstTimeLogin() {
  return !wx.getStorageSync('infoCollected');
}

// 退出登录时，标记为"假首次登录"（已完成信息收集，但已退出登录）
function markAsLoggedOut() {
  wx.setStorageSync('isLoggedOut', true);
}

// 静默登录成功后，清除退出登录标记
function clearLoggedOutMark() {
  wx.removeStorageSync('isLoggedOut');
}

module.exports = {
  KEYS,
  DEFAULT_GOAL,
  getGoal,
  setGoal,
  get,
  set,
  remove,
  clear,
  clearUserData,
  isFirstTimeLogin,
  markAsLoggedOut,
  clearLoggedOutMark,
};
