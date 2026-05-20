/**
 * 云函数调用工具
 */

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传递给云函数的数据
 * @returns {Promise}
 */
function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name,
        data,
      })
      .then((res) => {
        if (res.result.success) {
          resolve(res.result);
        } else {
          wx.showToast({
            title: res.result.message || '请求失败',
            icon: 'none',
          });
          reject(res.result);
        }
      })
      .catch((err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
        });
        reject(err);
      });
  });
}

/**
 * 登录云函数
 */
export function login() {
  return callCloudFunction('login', { action: 'login' });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return callCloudFunction('getUserInfo', { action: 'getUserInfo' });
}

/**
 * 更新用户信息
 * @param {object} userData - 用户数据
 */
export function updateUserInfo(userData) {
  return callCloudFunction('getUserInfo', { action: 'updateUserInfo', userData });
}

/**
 * 获取断食计划
 * @param {string} planType - 计划类型（可选）
 */
export function getFastingPlans(planType) {
  return callCloudFunction('getUserInfo', { action: 'getFastingPlans', planType });
}

/**
 * 保存断食记录
 * @param {object} record - 记录数据
 */
export function saveFastingRecord(record) {
  return callCloudFunction('getUserInfo', { action: 'saveFastingRecord', record });
}

export default {
  callCloudFunction,
  login,
  getUserInfo,
  updateUserInfo,
  getFastingPlans,
  saveFastingRecord,
};
