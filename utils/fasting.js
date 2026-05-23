const storage = require('./storage');
const { getPlan } = require('../config/fastingPlans');

const STATUS = {
  IDLE: 'idle',
  FASTING: 'fasting',
  EATING: 'eating',
};

function getCurrentState() {
  const state = storage.get(storage.KEYS.FASTING_STATE, null);
  if (!state || state.status === STATUS.IDLE) {
    return { status: STATUS.IDLE, plan: null };
  }

  const plan = getPlan(state.planId);
  const now = Date.now();
  const end = new Date(state.endTime).getTime();
  const start = new Date(state.startTime).getTime();
  const total = end - start;
  const elapsed = now - start;
  const remaining = Math.max(0, end - now);
  const progress = total > 0 ? Math.min(1, Math.max(0, elapsed / total)) : 0;

  // 自动切换阶段（移除震动，静默切换）
  if (remaining <= 0 && state.status !== STATUS.IDLE) {
    const fastHours = state.customFastHours || plan.fastHours;
    const eatHours = state.customEatHours || plan.eatHours;
    
    const newNow = new Date();
    const newNowStr = newNow.toISOString();
    
    if (state.status === STATUS.FASTING) {
      // 断食结束，切换到进食
      const newEnd = new Date(newNow.getTime() + eatHours * 3600 * 1000);
      const newState = {
        ...state,
        status: STATUS.EATING,
        startTime: newNowStr,
        endTime: newEnd.toISOString(),
      };
      storage.set(storage.KEYS.FASTING_STATE, newState);
      
      // 发送进食开始通知
      sendPhaseNotification('进食开始', '断食结束，可以开始觅食了！', newEnd);
      
      return {
        ...newState,
        plan,
        progress: 0,
        remaining: eatHours * 3600 * 1000,
        remainingText: formatDuration(eatHours * 3600 * 1000),
        elapsed: 0,
        elapsedText: '00:00:00',
        totalText: formatDuration(eatHours * 3600 * 1000),
        isOverdue: false,
      };
    } else {
      // 进食结束，切换回断食
      const newEnd = new Date(newNow.getTime() + fastHours * 3600 * 1000);
      const newState = {
        ...state,
        status: STATUS.FASTING,
        startTime: newNowStr,
        endTime: newEnd.toISOString(),
        currentCycleStart: newNowStr,
      };
      storage.set(storage.KEYS.FASTING_STATE, newState);
      
      // 发送断食开始通知
      sendPhaseNotification('断食开始', '进食窗口结束，开始新一轮断食！', newEnd);
      
      return {
        ...newState,
        plan,
        progress: 0,
        remaining: fastHours * 3600 * 1000,
        remainingText: formatDuration(fastHours * 3600 * 1000),
        elapsed: 0,
        elapsedText: '00:00:00',
        totalText: formatDuration(fastHours * 3600 * 1000),
        isOverdue: false,
      };
    }
  }

  return {
    ...state,
    plan,
    progress,
    remaining,
    remainingText: formatDuration(remaining),
    elapsed,
    elapsedText: formatDuration(elapsed),
    totalText: formatDuration(total),
    isOverdue: now > end,
  };
}

function formatDuration(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startPlan(planId, customHours, startTime) {
  const plan = getPlan(planId);
  if (!plan) return false;

  const fastHours = plan.type === 'custom' && customHours ? customHours.fastHours : plan.fastHours;
  const eatHours = plan.type === 'custom' && customHours ? customHours.eatHours : plan.eatHours;

  const start = startTime ? new Date(startTime) : new Date();
  const end = new Date(start.getTime() + fastHours * 3600 * 1000);

  const state = {
    planId,
    customFastHours: fastHours,
    customEatHours: eatHours,
    status: STATUS.FASTING,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    currentCycleStart: start.toISOString(),
  };

  storage.set(storage.KEYS.FASTING_STATE, state);
  
  // 首次开始计划时请求一次订阅权限
  requestReminder();
  
  // 同步到云端
  syncToCloud(state);
  
  return state;
}

function toggleState() {
  const state = storage.get(storage.KEYS.FASTING_STATE, null);
  if (!state || state.status === STATUS.IDLE) return null;

  const plan = getPlan(state.planId);
  const now = new Date();
  const nowStr = now.toISOString();

  const fastHours = state.customFastHours || plan.fastHours;
  const eatHours = state.customEatHours || plan.eatHours;

  if (state.status === STATUS.FASTING) {
    const end = new Date(now.getTime() + eatHours * 3600 * 1000);
    const newState = {
      ...state,
      status: STATUS.EATING,
      startTime: nowStr,
      endTime: end.toISOString(),
    };
    storage.set(storage.KEYS.FASTING_STATE, newState);
    syncToCloud(newState);
    return newState;
  } else {
    const end = new Date(now.getTime() + fastHours * 3600 * 1000);
    const newState = {
      ...state,
      status: STATUS.FASTING,
      startTime: nowStr,
      endTime: end.toISOString(),
      currentCycleStart: nowStr,
    };
    storage.set(storage.KEYS.FASTING_STATE, newState);
    syncToCloud(newState);
    return newState;
  }
}

function stopPlan() {
  const state = storage.get(storage.KEYS.FASTING_STATE, null);
  if (!state || state.status === STATUS.IDLE) return false;

  const history = storage.get(storage.KEYS.FASTING_HISTORY, []);
  history.unshift({
    planId: state.planId,
    startTime: state.currentCycleStart,
    endTime: new Date().toISOString(),
    status: state.status,
  });
  storage.set(storage.KEYS.FASTING_HISTORY, history.slice(0, 100));

  storage.set(storage.KEYS.FASTING_STATE, { status: STATUS.IDLE });
  
  // 同步 idle 状态 + 最新历史记录到云端
  syncToCloud({ status: STATUS.IDLE }, { fastingHistory: history.slice(0, 100) });
  
  return true;
}

// 订阅消息模板ID配置
const TEMPLATE_IDS = {
  // 日程提醒模板（用于断食/进食阶段切换提醒）
  SCHEDULE: 'sjW91ev2qCqzGHKxo0MFEe1RNarlwTLWJyZp7r4ZChU',
};

function requestReminder() {
  // 每次断食开始时都弹出订阅请求，让用户选择是否接收阶段切换提醒
  wx.requestSubscribeMessage({
    tmplIds: [TEMPLATE_IDS.SCHEDULE],
    success(res) {
      console.log('订阅消息结果', res);
      // 用户同意或拒绝都记录状态，微信会自动处理权限状态
      if (res[TEMPLATE_IDS.SCHEDULE] === 'accept') {
        storage.set(storage.KEYS.SUBSCRIBE_REMINDER, true);
      }
    },
    fail(err) {
      console.error('订阅消息失败', err);
    },
  });
}

// 发送阶段切换通知
function sendPhaseNotification(title, content, endTime) {
  // 调用云函数发送订阅消息
  wx.cloud.callFunction({
    name: 'sendNotification',
    data: {
      templateId: TEMPLATE_IDS.SCHEDULE,
      title: title,
      content: content,
      endTime: endTime,
    },
    success(res) {
      console.log('发送通知成功', res);
    },
    fail(err) {
      console.error('发送通知失败', err);
    },
  });
}

// ========== 云端同步 ==========

/** 将当前本地断食状态推送到云端（仅已登录时生效，fire-and-forget） */
function syncToCloud(state, extraData) {
  const app = getApp();
  if (!app.globalData.userInfo || !app.globalData.userInfo.openid) return;

  const cloudData = {
    status: state.status,
    planId: state.planId || null,
    customFastHours: state.customFastHours || null,
    customEatHours: state.customEatHours || null,
    startTime: state.startTime || null,
    endTime: state.endTime || null,
    currentCycleStart: state.currentCycleStart || null,
  };

  const syncPayload = { fastingState: cloudData };
  
  // 如果提供了额外数据（如 fastingHistory），一并同步
  if (extraData) {
    Object.assign(syncPayload, extraData);
  }

  wx.cloud.callFunction({
    name: 'syncData',
    data: { action: 'upload', syncData: syncPayload }
  }).catch(err => console.error('[syncToCloud] 失败:', err));
}

/** 从云端拉取断食状态并覆盖本地存储 */
async function syncFromCloud() {
  try {
    const res = await wx.cloud.callFunction({ name: 'getUserInfo' });
    const result = res.result || res;
    if (result.success && result.data && result.data.fastingState) {
      storage.set(storage.KEYS.FASTING_STATE, result.data.fastingState);
      console.log('[syncFromCloud] 已从云端恢复断食状态');
      return true;
    }
    console.log('[syncFromCloud] 云端无断食记录');
    return false;
  } catch (err) {
    console.error('[syncFromCloud] 失败:', err);
    return false;
  }
}

module.exports = {
  STATUS,
  getCurrentState,
  startPlan,
  toggleState,
  stopPlan,
  syncToCloud,
  syncFromCloud,
  requestReminder,
  sendPhaseNotification,
  TEMPLATE_IDS,
};
