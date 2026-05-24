const app = getApp();
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior],

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
