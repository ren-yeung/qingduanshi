const app = getApp();
const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const themeBehavior = require('~/behaviors/theme');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['完善个人信息', '帮助我们为你提供更精准的断食方案', '选择您的性别', '女生', '男生', '选择您的出生年月', '选择您的身高', '选择您当前体重', '开始体验', '请选择出生年月'],
  data: {
    statusBarHeight: 0,
    gender: 'female',
    birthday: '',
    birthdayDisplay: '请选择出生年月',
    birthdayIndex: [0, 0],
    birthdayRange: [[], []],
    height: 160,  // 默认160cm
    weight: 60.0,
    heightTicks: [],
    weightTicks: [],
    heightOffset: 0,     // 身高尺子偏移量
    weightOffset: 0,     // 体重尺子偏移量
    heightTickWidth: 12, // 每个1cm刻度的宽度
    weightTickWidth: 12,
    rulerHalfWidth: 0,   // 容器半宽，用于padding计算
    _rulerWidth: 0,      // 刻度尺容器宽度
  },

  onBack() {
    wx.navigateBack();
  },

  onLoad(options) {
    this.i18nRefresh();
    // 获取系统信息（状态栏高度和屏幕宽度）
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this._screenWidth = info.windowWidth;

    this.initBirthdayPicker();
    this.initRulerTicks();
    
    // 刻度尺容器实际宽度：screenWidth - form-card左右margin(16*2) - form-section左右padding(20*2)
    this._rulerWidth = this._screenWidth - 72;
    // 身高：屏幕显示30cm宽，每1cm的像素宽度 = 屏幕宽 / 30
    this._heightTickWidth = this._rulerWidth / 30;
    // 体重：屏幕显示30kg宽
    this._weightTickWidth = this._rulerWidth / 30;
    
    // 更新到data供WXML使用
    this.setData({
      heightTickWidth: this._heightTickWidth,
      weightTickWidth: this._weightTickWidth,
      rulerHalfWidth: (this._rulerWidth / 2).toFixed(2) - 0  // 转为数字
    });
    
    this._updateHeightOffset();
    this._updateWeightOffset();
  },

  // 初始化刻度尺数据
  initRulerTicks() {
    // 身高刻度：85-250cm，每1cm一个小刻度
    const heightTicks = [];
    for (let i = 85; i <= 250; i++) {
      heightTicks.push({
        value: i,
        major: i % 10 === 0  // 每10cm才显示数字
      });
    }
    
    // 体重刻度：30-150kg，每1kg一个小刻度（视觉刻度），拖动精度0.1kg
    const weightTicks = [];
    for (let i = 30; i <= 150; i++) {
      weightTicks.push({
        value: i,
        major: i % 10 === 0  // 每10kg显示数字
      });
    }
    
    this.setData({ heightTicks, weightTicks });
  },
  
  // 更新身高偏移量
  _updateHeightOffset() {
    // translateX = -(当前刻度) * tickWidth + 容器半宽
    // 这样160cm（刻度75）初始时对齐屏幕中间
    const offset = -(this.data.height - 85) * this._heightTickWidth + this._rulerWidth / 2;
    this.setData({ heightOffset: offset });
  },
  
  // 更新体重偏移量
  _updateWeightOffset() {
    // translateX = -(当前刻度) * tickWidth + 容器半宽
    const offset = -(this.data.weight - 30) * this._weightTickWidth + this._rulerWidth / 2;
    this.setData({ weightOffset: offset });
  },
  
  // ========== 身高尺子触摸事件 ==========
  onHeightTouchStart(e) {
    this._heightTouchStartX = e.touches[0].clientX;
    this._heightTouchStartOffset = this.data.heightOffset;
  },
  
  onHeightTouchMove(e) {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - this._heightTouchStartX;
    let newOffset = this._heightTouchStartOffset + deltaX;
    
    // 限制范围：85cm刻度对齐左边，250cm刻度对齐右边
    const leftBoundary = this._rulerWidth / 2;  // 85cm刻度对齐左边
    const rightBoundary = -(250 - 85) * this._heightTickWidth + this._rulerWidth / 2;  // 250cm刻度对齐右边
    newOffset = Math.max(rightBoundary, Math.min(leftBoundary, newOffset));
    
    // 计算对应的身高值（修正符号）
    const newHeight = Math.round((this._rulerWidth / 2 - newOffset) / this._heightTickWidth + 85);
    const clampedHeight = Math.max(85, Math.min(250, newHeight));
    
    // 更新偏移量和身高值
    this.setData({
      heightOffset: newOffset,
      height: clampedHeight
    });
  },
  
  onHeightTouchEnd(e) {
    // 松手时保持当前位置，不做吸附
    // 当前 offset 和 height 已经在 touchmove 中更新
  },
  
  // ========== 体重尺子触摸事件 ==========
  onWeightTouchStart(e) {
    this._weightTouchStartX = e.touches[0].clientX;
    this._weightTouchStartOffset = this.data.weightOffset;
    // 记录起始时对应的原始体重值，用于平滑计算
    this._weightStartRaw = (this._rulerWidth / 2 - this._weightTouchStartOffset) / this._weightTickWidth + 30;
  },
  
  onWeightTouchMove(e) {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - this._weightTouchStartX;
    let newOffset = this._weightTouchStartOffset + deltaX;
    
    // 限制范围：30kg刻度对齐左边，150kg刻度对齐右边
    const leftBoundary = this._rulerWidth / 2;
    const rightBoundary = -(150 - 30) * this._weightTickWidth + this._rulerWidth / 2;
    newOffset = Math.max(rightBoundary, Math.min(leftBoundary, newOffset));
    
    // 基于起始原始值 + 像素偏移计算体重（避免累加误差导致跳变）
    const deltaWeight = deltaX / this._weightTickWidth;
    let newWeight = this._weightStartRaw - deltaWeight;
    newWeight = Math.round(newWeight * 10) / 10;
    newWeight = Math.max(30, Math.min(150, newWeight));
    
    this.setData({
      weightOffset: newOffset,
      weight: newWeight
    });
  },
  
  onWeightTouchEnd(e) {
    // 松手时保持当前位置，不做吸附
  },

  // 初始化生日选择器
  initBirthdayPicker() {
    const currentYear = new Date().getFullYear();
    const years = [];
    const months = [];

    for (let y = 1950; y <= currentYear; y++) {
      years.push(y + '年');
    }

    for (let m = 1; m <= 12; m++) {
      months.push(m + '月');
    }

    this.setData({
      'birthdayRange': [years, months],
      birthdayIndex: [currentYear - 1950, 0]
    });
  },

  // 设置性别
  setGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ gender });
  },

  // 生日选择变化
  onBirthdayChange(e) {
    const [yearIdx, monthIdx] = e.detail.value;
    const [years, months] = this.data.birthdayRange;
    const year = years[yearIdx].replace('年', '');
    const month = parseInt(months[monthIdx].replace('月', ''));

    this.setData({
      birthday: `${year}-${String(month).padStart(2, '0')}`,
      birthdayDisplay: `${year}年${month}月`,
      birthdayIndex: [yearIdx, monthIdx]
    });
  },



  // 提交表单
  async submitForm() {
    const { gender, birthday, height, weight } = this.data;

    if (!birthday || birthday === '请选择出生年月') {
      wx.showToast({ title: this.$t('请选择出生年月'), icon: 'none' });
      return;
    }

    wx.showLoading({ title: this.$t('保存中...'), mask: true });

    try {
      // 先获取 openid（如果没有的话）
      let openid = app.globalData.userInfo && app.globalData.userInfo.openid;
      if (!openid) {
        const loginRes = await wx.cloud.callFunction({
          name: 'login',
          data: { action: 'login' }
        });
        const loginResult = loginRes.result || loginRes;
        if (loginResult.success && loginResult.data && loginResult.data.openid) {
          openid = loginResult.data.openid;
        }
      }

      if (!openid) {
        wx.hideLoading();
        wx.showToast({ title: this.$t('获取登录信息失败'), icon: 'none' });
        return;
      }

      // 根据生日计算年龄
      const birthYear = parseInt(birthday.split('-')[0]);
      const age = new Date().getFullYear() - birthYear;

      // 保存用户信息到云端
      await wx.cloud.callFunction({
        name: 'login',
        data: {
          action: 'getOrCreateUser',
          openid: openid,
          nickName: '断食用户',
          avatarUrl: '',
          gender: gender,
          birthday: birthday,
          age: age,
          height: height,
          firstWeight: weight
        }
      });

      // 更新本地存储
      const updatedUserInfo = {
        openid: openid,
        gender: gender,
        birthday: birthday,
        height: height,
        firstWeight: weight
      };
      app.globalData.userInfo = updatedUserInfo;
      wx.setStorageSync('userInfo', updatedUserInfo);
      wx.setStorageSync('infoCollected', true);
      // 清除退出登录标记
      storage.clearLoggedOutMark();

      wx.hideLoading();
      wx.showToast({ title: this.$t('设置成功'), icon: 'success' });

      // 标记登录成功，跳转到我的页面
      app.eventBus.emit('user-login-success');
      
      // 从云端恢复全部用户数据（await 确保完成后再跳转）
      await storage.syncAllFromCloud();

      setTimeout(() => {
        wx.switchTab({ url: '/pages/my/index' });
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      console.error('保存信息失败:', err);
      wx.showToast({ title: this.$t('保存失败，请重试'), icon: 'none' });
    }
  }
});
