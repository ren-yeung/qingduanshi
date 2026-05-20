const app = getApp();
const storage = require('~/utils/storage');

Page({
  data: {
    statusBarHeight: 0,
    isLogin: false,
    userInfo: {},
    defaultAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    isEditingNickname: false,
    tempNickname: '',
    streakData: { currentStreak: 0, longestStreak: 0 },
    gridList: [
      { name: '我的目标', icon: 'target', url: '/pages/goal/index', type: 'goal' },
      { name: '数据统计', icon: 'chart', url: '/pages/dataCenter/index', type: 'data' },
      { name: '食物库', icon: 'app', url: '/pages/food-lib/index', type: 'food' },
      { name: '断食计划', icon: 'time', url: '/pages/fast-plan/index', type: 'fast' },
    ],
    menuList: [
      { name: '我的计划', icon: '📋', type: 'plan' },
      { name: '身体维度', icon: '📏', type: 'body' },
      { name: '排行榜', icon: '🏆', url: '/pages/leaderboard/index', type: 'rank' },
      { name: '我的订单', icon: '🛍️', type: 'order' },
      { name: '个性化', icon: '🎨', type: 'custom' },
      { name: '联系我们', icon: '💬', type: 'contact' },
      { name: '使用教程', icon: '▶️', type: 'tutorial' },
      { name: '消息通知', icon: '🔔', type: 'notify' },
      { name: '设置', icon: '⚙️', url: '/pages/setting/index', type: 'setting' },
    ],
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
  },

  onShow() {
    this.checkLogin();
    this.loadStreak();
  },

  async checkLogin() {
    // 检查是否是退出登录状态
    const isLoggedOut = wx.getStorageSync('isLoggedOut');
    if (isLoggedOut) {
      this.setData({ isLogin: false, userInfo: {} });
      return;
    }

    // 优先从全局数据获取
    let userInfo = app.globalData.userInfo;
    
    // 如果全局没有，从本地存储获取
    if (!userInfo || !userInfo.openid) {
      userInfo = wx.getStorageSync('userInfo');
    }
    
    // 有 openid 或已收集过信息就算登录状态
    if (userInfo && (userInfo.openid || userInfo.gender)) {
      this.setData({ isLogin: true, userInfo });
      
      // 从云端同步最新用户数据
      await this.syncUserInfoFromCloud(userInfo.openid);
    } else {
      this.setData({ isLogin: false, userInfo: {} });
    }
  },

  // 从云端同步最新用户数据
  async syncUserInfoFromCloud(openid) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {
          action: 'getOrCreateUser',
          openid: openid,
        }
      });
      console.log('同步用户信息返回:', res);

      const result = res.result || res;
      if (result.success && result.data) {
        const cloudUserInfo = {
          openid: openid,
          userId: result.data.userId,
          nickName: result.data.nickName || '小小的新用户',
          avatarUrl: result.data.avatarUrl || '',
          avatarFileID: result.data.avatarFileID || '',
          gender: result.data.gender,
          birthday: result.data.birthday,
          age: result.data.age,
          height: result.data.height,
          firstWeight: result.data.firstWeight || 0,
        };

        // 如果有头像文件ID，获取临时访问链接
        if (cloudUserInfo.avatarFileID) {
          try {
            const urlRes = await wx.cloud.getTempFileURL({
              fileList: [cloudUserInfo.avatarFileID],
            });
            if (urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL) {
              cloudUserInfo.avatarUrl = urlRes.fileList[0].tempFileURL;
            }
          } catch (e) {
            console.error('获取头像临时链接失败:', e);
          }
        }
        
        // 更新全局和本地存储
        app.globalData.userInfo = cloudUserInfo;
        wx.setStorageSync('userInfo', cloudUserInfo);
        
        // 更新页面数据
        this.setData({ userInfo: cloudUserInfo });
        console.log('已更新用户昵称为:', cloudUserInfo.nickName);
      }
    } catch (err) {
      console.error('同步用户信息失败:', err);
    }
  },

  loadStreak() {
    const streakData = storage.get(storage.KEYS.STREAK_DATA, { currentStreak: 0, longestStreak: 0 });
    this.setData({ streakData });
  },

  onLogin() {
    // 检查是否注销过账号，注销过必须重新收集信息
    const accountDestroyed = wx.getStorageSync('accountDestroyed');
    if (accountDestroyed) {
      wx.navigateTo({ url: '/pages/info-collection/index' });
      return;
    }

    // 检查是否已完善过信息
    const infoCollected = wx.getStorageSync('infoCollected');

    // 检查是否是退出登录状态（有 isLoggedOut 标记说明之前登录过）
    const isLoggedOut = wx.getStorageSync('isLoggedOut');

    // 如果未完善信息 且 不是退出登录状态，才跳转信息收集页
    if (!infoCollected && !isLoggedOut) {
      wx.navigateTo({ url: '/pages/info-collection/index' });
      return;
    }

    // 已完善信息或退出登录状态，执行静默登录
    this.doSilentLogin();
  },

  // 执行静默登录
  doSilentLogin() {
    wx.showLoading({ title: '登录中...', mask: true });

    // 调用云函数获取 openid（静默获取）
    wx.cloud.callFunction({
      name: 'login',
      data: { action: 'login' }
    }).then(res => {
      const result = res.result || res;
      if (result.success && result.data && result.data.openid) {
        // 已有 openid，静默登录
        return this.silentLogin(result.data.openid);
      } else {
        wx.hideLoading();
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '登录失败，请检查网络', icon: 'none' });
    });
  },

  // 静默登录
  async silentLogin(openid) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {
          action: 'getOrCreateUser',
          openid: openid,
        }
      });

      const result = res.result || res;

      if (result.success && result.data) {
        const userData = {
          openid: openid,
          userId: result.data.userId,
          nickName: result.data.nickName || '小小的新用户',
          avatarUrl: result.data.avatarUrl || '',
          avatarFileID: result.data.avatarFileID || '',
          gender: result.data.gender,
          birthday: result.data.birthday,
          age: result.data.age,
          height: result.data.height,
          firstWeight: result.data.firstWeight || 0,
        };

        // 如果有头像文件ID，获取临时访问链接
        if (userData.avatarFileID) {
          try {
            const urlRes = await wx.cloud.getTempFileURL({
              fileList: [userData.avatarFileID],
            });
            if (urlRes.fileList && urlRes.fileList[0] && urlRes.fileList[0].tempFileURL) {
              userData.avatarUrl = urlRes.fileList[0].tempFileURL;
            }
          } catch (e) {
            console.error('获取头像临时链接失败:', e);
          }
        }
        
        app.globalData.userInfo = userData;
        wx.setStorageSync('userInfo', userData);
        wx.removeStorageSync('accountDestroyed');
        // 恢复 infoCollected 标记（有用户信息说明已完善过）
        wx.setStorageSync('infoCollected', true);
        // 清除退出登录标记
        storage.clearLoggedOutMark();
        app.eventBus.emit('user-login-success');
        
        wx.hideLoading();
        this.setData({ isLogin: true, userInfo: userData });
        wx.showToast({ title: '登录成功', icon: 'success' });
      } else {
        throw new Error(result.message || '登录失败');
      }
    } catch (err) {
      wx.hideLoading();
      console.error('静默登录失败:', err);
      wx.navigateTo({ url: '/pages/login/login' });
    }
  },

  onNavigate(e) {
    const { url, type } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  // 点击编辑昵称
  onEditNickname() {
    if (!this.data.isLogin) return;
    this.setData({ 
      isEditingNickname: true,
      tempNickname: this.data.userInfo.nickName || ''
    });
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value });
  },

  // 确认修改昵称
  async onConfirmNickname() {
    const nickName = this.data.tempNickname.trim();
    
    if (!nickName) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }

    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.openid) return;

    try {
      await wx.cloud.callFunction({
        name: 'login',
        data: {
          action: 'updateUserNickname',
          openid: userInfo.openid,
          nickName: nickName,
        }
      });

      // 更新本地数据
      userInfo.nickName = nickName;
      app.globalData.userInfo = userInfo;
      wx.setStorageSync('userInfo', userInfo);
      
      // 退出编辑模式
      this.setData({ 
        userInfo,
        isEditingNickname: false,
        tempNickname: ''
      });

      wx.showToast({ title: '修改成功', icon: 'success' });
    } catch (err) {
      console.error('修改昵称失败:', err);
      wx.showToast({ title: '修改失败', icon: 'none' });
    }
  },

  // 选择并上传头像
  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.showLoading({ title: '上传中...', mask: true });
        
        try {
          // 上传到云存储
          const cloudPath = `avatar/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePath,
          });
          
          const fileID = uploadRes.fileID;
          
          // 获取云存储的临时链接（仅用于本地即时显示）
          const urlRes = await wx.cloud.getTempFileURL({
            fileList: [fileID],
          });
          
          const tempFileURL = urlRes.fileList[0].tempFileURL;
          
          // 更新到云数据库（保存 fileID，避免临时链接过期）
          await this.updateUserAvatar(fileID);
          
          // 更新本地数据（创建新对象触发视图更新）
          const userInfo = Object.assign({}, this.data.userInfo, {
            avatarUrl: tempFileURL,
            avatarFileID: fileID,
          });
          app.globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          this.setData({ userInfo });
          
          wx.hideLoading();
          wx.showToast({ title: '头像更新成功', icon: 'success' });
        } catch (err) {
          wx.hideLoading();
          console.error('上传头像失败:', err);
          wx.showToast({ title: '上传失败，请重试', icon: 'none' });
        }
      },
      fail: (err) => {
        console.log('选择取消或失败:', err);
      }
    });
  },

  // 更新用户头像到云数据库
  async updateUserAvatar(fileID) {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.openid) return;
    
    try {
      await wx.cloud.callFunction({
        name: 'login',
        data: {
          action: 'updateUserAvatar',
          openid: userInfo.openid,
          avatarFileID: fileID,
        }
      });
      console.log('头像更新到云数据库成功');
    } catch (err) {
      console.error('更新头像到云数据库失败:', err);
    }
  },
});
