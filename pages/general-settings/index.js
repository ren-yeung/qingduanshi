const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');
const i18n = require('~/utils/i18n');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['通用设置', '语言与地区', '语言', '单位制', '默认行为', '默认断食方案', '每周起始日', '自动同步数据', '仅WiFi下同步', '同步提示'],

  data: {
    statusBarHeight: 0,
    language: '简体中文',
    unitSystem: '公制 (kg/cm)',
    defaultPlan: '16:8 间歇性断食',
    weekStartDay: '周一',
    autoSync: true,
    wifiOnly: false,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadSettings();
  },

  onShow() {
    this.i18nRefresh();
    this.loadSettings();
  },

  loadSettings() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      const lang = settings.language || '简体中文';
      const unit = settings.unitSystem || '公制 (kg/cm)';
      this.setData({
        language: lang,
        unitSystem: unit,
        defaultPlan: settings.defaultPlan || '16:8 间歇性断食',
        weekStartDay: settings.weekStartDay || '周一',
        autoSync: settings.autoSync !== false,
        wifiOnly: settings.wifiOnly === true,
      });
      this.updateI18n(lang, unit);
    } catch (e) {
      console.error('加载通用设置失败:', e);
    }
  },

  /** 根据当前语言/单位刷新动态值（静态文本由 i18nRefresh 处理） */
  updateI18n(lang, unit) {
    const t = (key) => i18n.t(key, lang === 'English' ? 'en' : 'zh-CN');
    const u = unit || this.data.unitSystem;
    this.setData({
      langVal: t(lang || this.data.language),
      unitVal: t(u),
    });
  },

  saveSetting(key, value) {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      settings[key] = value;
      wx.setStorageSync('customizeSettings', settings);
    } catch (e) {
      console.error('保存设置失败:', e);
    }
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = !this.data[key];
    this.setData({ [key]: value });
    this.saveSetting(key, value);
  },

  onRowClick(e) {
    const that = this;
    const { type } = e.currentTarget.dataset;

    if (type === 'language') {
      wx.showActionSheet({
        itemList: ['简体中文', 'English'],
        success(res) {
          const selected = res.tapIndex === 0 ? '简体中文' : 'English';
          if (selected !== that.data.language) {
            that.setData({ language: selected });
            that.saveSetting('language', selected);
            that.updateI18n(selected);
            app.eventBus.emit('language-changed', selected);
          }
        },
      });
    } else if (type === 'unitSystem') {
      wx.showActionSheet({
        itemList: ['公制 (kg/cm)', '斤/cm'],
        success(res) {
          const selected = res.tapIndex === 0 ? '公制 (kg/cm)' : '斤/cm';
          if (selected !== that.data.unitSystem) {
            that.setData({ unitSystem: selected });
            that.saveSetting('unitSystem', selected);
            app.eventBus.emit('unit-changed', selected);
          }
        },
      });
    } else if (type === 'defaultPlan') {
      wx.showToast({ title: this.$t('请在首页选择方案'), icon: 'none' });
    } else if (type === 'weekStartDay') {
      wx.showActionSheet({
        itemList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        success(res) {
          const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
          that.setData({ weekStartDay: days[res.tapIndex] });
          that.saveSetting('weekStartDay', days[res.tapIndex]);
        },
      });
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
