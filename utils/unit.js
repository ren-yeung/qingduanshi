/**
 * 单位转换工具
 * 使用方式: const { formatWeight, formatWeightRaw } = require('~/utils/unit');
 */

/**
 * 获取当前单位制
 * @returns {'metric'|'jin'}
 */
function getUnitSystem() {
  try {
    const settings = wx.getStorageSync('customizeSettings') || {};
    return settings.unitSystem === '斤/cm' ? 'jin' : 'metric';
  } catch (e) {
    return 'metric';
  }
}

/**
 * 获取体重单位标签
 * @returns {string} e.g. 'kg' or '斤'
 */
function getWeightUnitLabel() {
  const unit = getUnitSystem();
  return unit === 'jin' ? '斤' : 'kg';
}

/**
 * 获取身高/腰围/臀围单位标签
 * @returns {string} 'cm'
 */
function getLengthUnitLabel() {
  return 'cm';
}

/**
 * 格式化体重显示（kg → 斤 转换 + 单位标签）
 * @param {number} kg - 公斤数
 * @param {boolean} [showUnit=true] - 是否显示单位
 * @returns {string} e.g. "65.5 kg" 或 "131.0 斤"
 */
function formatWeight(kg, showUnit) {
  if (kg == null || isNaN(kg)) return '--';
  const unit = getUnitSystem();
  const value = unit === 'jin' ? (kg * 2).toFixed(1) : Number(kg).toFixed(1);
  if (showUnit === false) return value;
  return value + ' ' + getWeightUnitLabel();
}

/**
 * 获取纯数值（无单位，用于图表/输入等）
 * @param {number} kg - 公斤数
 * @returns {number}
 */
function formatWeightRaw(kg) {
  if (kg == null || isNaN(kg)) return 0;
  const unit = getUnitSystem();
  return unit === 'jin' ? Number((kg * 2).toFixed(1)) : Number(kg);
}

/**
 * 将当前单位下的值转回 kg（用于存储）
 * @param {number} value - 用户在当前单位下的输入值
 * @returns {number} kg
 */
function toKg(value) {
  if (value == null || isNaN(value)) return 0;
  const unit = getUnitSystem();
  return unit === 'jin' ? Number((value / 2).toFixed(1)) : Number(value);
}

module.exports = {
  getUnitSystem,
  getWeightUnitLabel,
  getLengthUnitLabel,
  formatWeight,
  formatWeightRaw,
  toKg,
};
