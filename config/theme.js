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

/**
 * 获取指定模式的颜色配置
 */
function getThemeColors(modeId, customColors) {
  if (modeId === 'custom' && customColors) {
    // 自定义模式：导航栏颜色始终跟随背景色
    return { ...customColors, navBg: customColors.bgColor };
  }
  const preset = PRESET_MODES.find(m => m.id === modeId);
  return preset ? preset.colors : PRESET_MODES[0].colors;
}

module.exports = {
  PRESET_MODES,
  CUSTOM_DEFAULTS,
  CUSTOM_PALETTE,
  getThemeColors,
};
