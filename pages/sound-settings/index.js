const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['播放设置', '提示音效', '振动反馈', '铃声选择', '动画效果', '过渡动画', '打卡动效', '成就特效', '电量提示', '提示铃声', '页面过渡动画', '打卡成功动效', '成就解锁特效', '关闭动画和振动可略微减少电量消耗', '清脆', '柔和'],

  data: {
    statusBarHeight: 0,
    soundEnabled: true,
    vibrateEnabled: true,
    ringtone: '轻柔',
    transitionAnim: true,
    checkinAnim: true,
    achievementAnim: true,
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadSettings();
  },

  loadSettings() {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      this.setData({
        soundEnabled: settings.soundEnabled !== false,
        vibrateEnabled: settings.vibrateEnabled !== false,
        ringtone: settings.ringtone || '轻柔',
        transitionAnim: settings.transitionAnim !== false,
        checkinAnim: settings.checkinAnim !== false,
        achievementAnim: settings.achievementAnim !== false,
      });
    } catch (e) {
      console.error('加载播放设置失败:', e);
    }
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

  onRingtoneClick() {
    const that = this;
    wx.showActionSheet({
      itemList: ['轻柔', '清脆', '欢快', '静音'],
      success(res) {
        const tones = ['轻柔', '清脆', '欢快', '静音'];
        that.setData({ ringtone: tones[res.tapIndex] });
        that.saveSetting('ringtone', tones[res.tapIndex]);
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
