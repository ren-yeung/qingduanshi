const app = getApp();
const storage = require('~/utils/storage');

Page({
  data: {
    gender: 'female',
    birthday: '',
    birthdayDisplay: '请选择出生年月',
    birthdayIndex: [0, 0],
    birthdayRange: [[], []],
    height: 165,
    weight: 60,
  },

  onLoad(options) {
    this.initBirthdayPicker();
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

  // 身高变化
  onHeightChange(e) {
    this.setData({ height: e.detail.value });
  },

  // 体重变化
  onWeightChange(e) {
    this.setData({ weight: e.detail.value });
  },

  // 提交表单
  async submitForm() {
    const { gender, birthday, height, weight } = this.data;

    if (!birthday || birthday === '请选择出生年月') {
      wx.showToast({ title: '请选择出生年月', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中...', mask: true });

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
        wx.showToast({ title: '获取登录信息失败', icon: 'none' });
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
      wx.showToast({ title: '设置成功', icon: 'success' });

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
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
  }
});
