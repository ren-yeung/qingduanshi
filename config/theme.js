/**
 * 主题配置模块
 * 每个模式定义完整的全局配色方案
 */

// ========== 预设外观模式 ==========
const PRESET_MODES = [
  {
    id: 'fresh-green',
    name: '清新绿',
    isDefault: true,
    colors: {
      // 页面最底层背景
      bgColor: '#f3f3f3',
      // 卡片背景
      cardBg: '#ffffff',
      // 品牌主色（按钮、标签栏选中、高亮）
      brandPrimary: '#2EAF7D',
      // 品牌浅色（选中背景、hover）
      brandLight: '#E8F5EE',
      // 品牌深色
      brandDark: '#1E8A5E',
      // 主文字色
      textPrimary: '#1a1a1a',
      // 次要文字色
      textSecondary: '#999999',
      // 辅助文字色
      textTertiary: '#cccccc',
      // 分割线
      divider: '#f0f0f0',
      // 导航栏背景（与页面背景一致）
      navBg: '#f3f3f3',
      // TabBar 选中色
      tabSelected: '#2EAF7D',
      // TabBar 未选中色
      tabUnselected: '#888888',
    },
    preview: ['#2EAF7D', '#f3f3f3', '#ffffff'],
  },
  {
    id: 'warm-orange',
    name: '暖阳橙',
    isDefault: false,
    colors: {
      bgColor: '#FFF7ED',
      cardBg: '#ffffff',
      brandPrimary: '#F97316',
      brandLight: '#FFF0E5',
      brandDark: '#EA580C',
      textPrimary: '#1a1a1a',
      textSecondary: '#999999',
      textTertiary: '#cccccc',
      divider: '#fef0e6',
      navBg: '#FFF7ED',
      tabSelected: '#F97316',
      tabUnselected: '#888888',
    },
    preview: ['#F97316', '#FFF7ED', '#ffffff'],
  },
  {
    id: 'deep-blue',
    name: '深海蓝',
    isDefault: false,
    colors: {
      bgColor: '#EFF6FF',
      cardBg: '#ffffff',
      brandPrimary: '#3B82F6',
      brandLight: '#DBEAFE',
      brandDark: '#2563EB',
      textPrimary: '#1a1a1a',
      textSecondary: '#999999',
      textTertiary: '#cccccc',
      divider: '#e8f0fe',
      navBg: '#EFF6FF',
      tabSelected: '#3B82F6',
      tabUnselected: '#888888',
    },
    preview: ['#3B82F6', '#EFF6FF', '#ffffff'],
  },
];

// 自定义模式默认值（等同于清新绿）
const CUSTOM_DEFAULTS = {
  bgColor: '#f3f3f3',
  cardBg: '#ffffff',
  brandPrimary: '#2EAF7D',
  brandLight: '#E8F5EE',
  brandDark: '#1E8A5E',
  textPrimary: '#1a1a1a',
  textSecondary: '#999999',
  textTertiary: '#cccccc',
  divider: '#f0f0f0',
  navBg: '#f3f3f3',
  tabSelected: '#2EAF7D',
  tabUnselected: '#888888',
};

// 自定义模式可选色板（品牌色、背景色、卡片色）
const CUSTOM_PALETTE = {
  brandPrimary: [
    { value: '#2EAF7D', name: '翠绿' },
    { value: '#F97316', name: '暖橙' },
    { value: '#3B82F6', name: '天蓝' },
    { value: '#8B5CF6', name: '雅紫' },
    { value: '#EC4899', name: '桃粉' },
    { value: '#EF4444', name: '正红' },
    { value: '#84CC16', name: '嫩绿' },
  ],
  bgColor: [
    { value: '#f3f3f3', name: '浅灰' },
    { value: '#FFF7ED', name: '暖白' },
    { value: '#EFF6FF', name: '冰蓝' },
    { value: '#F0FDF4', name: '浅绿' },
    { value: '#FAF5FF', name: '淡紫' },
  ],
  cardBg: [
    { value: '#ffffff', name: '纯白' },
    { value: '#f8f8f8', name: '浅灰' },
  ],
};

// 可选字体列表（选用有明显视觉差异的字体）
// sizeScale: 视觉补偿系数，传统字体比默认字体视觉偏小，需要放大
const FONT_OPTIONS = [
  { value: 'system-default', label: '系统默认', family: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif", preview: 'Aa 默认', sizeScale: 1 },
  { value: 'kaiti', label: '楷体', family: "'KaiTi', 'STKaiti', 'Kaiti SC', serif", preview: 'Aa 楷体', sizeScale: 1.30 },
  { value: 'songti', label: '宋体', family: "SimSun, 'Songti SC', 'STSong', serif", preview: 'Aa 宋体', sizeScale: 1.35 },
  { value: 'fangsong', label: '仿宋', family: "'FangSong', 'STFangsong', FangSong, serif", preview: 'Aa 仿宋', sizeScale: 1.40 },
];

/**
 * 获取指定模式的颜色配置
 */
function getThemeColors(modeId, customColors) {
  if (modeId === 'custom' && customColors) {
    // 自定义模式：导航栏颜色始终跟随背景色
    return { ...customColors, navBg: customColors.bgColor };
  }
  const preset = PRESET_MODES.find(m => m.id === modeId);
  return preset ? { ...preset.colors } : { ...PRESET_MODES[0].colors };
}

// ========== 深色模式叠加色 ==========
// 当启用深色模式时，这些颜色会覆盖基础色板的背景/文字色
// 品牌色（brandPrimary/brandLight/brandDark）保持不变
const DARK_MODE_OVERLAY = {
  bgColor: '#4a4a4a',
  cardBg: '#555555',
  textPrimary: '#f0f0f0',
  textSecondary: '#c0c0c0',
  textTertiary: '#a0a0a0',
  divider: '#5e5e5e',
  navBg: '#4a4a4a',
  tabUnselected: '#999999',
};

/**
 * 判断当前是否应使用深色模式
 * @param {'follow'|'light'|'dark'} darkMode
 * @returns {boolean}
 */
function shouldDark(darkMode) {
  if (darkMode === 'dark') return true;
  if (darkMode === 'light') return false;
  // 'follow' → 跟随系统
  try {
    const info = wx.getSystemInfoSync();
    return info.theme === 'dark';
  } catch (_) {
    return false;
  }
}

module.exports = {
  PRESET_MODES,
  CUSTOM_DEFAULTS,
  CUSTOM_PALETTE,
  FONT_OPTIONS,
  DARK_MODE_OVERLAY,
  getThemeColors,
  shouldDark,
};
