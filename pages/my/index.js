const app = getApp();
const storage = require('~/utils/storage');
const i18nBehavior = require('../../utils/i18n-behavior');
const shareBehavior = require('~/behaviors/share');

Page({
  behaviors: [i18nBehavior, shareBehavior],
  i18nKeys: [
    '我的', '请输入昵称', '完成', '小小的新用户', '点击头像登录',
    '我的目标', '数据统计', '食物库', '断食计划',
    '我的计划', '身体维度', '排行榜', '我的订单', '个性化', '联系我们', '使用教程', '消息通知', '设置',
  ],
  data: {
    statusBarHeight: 0,
    isLogin: false,
    userInfo: {},
    theme: {},
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
      { name: '我的计划', icon: '📋', url: '/pages/my-plan/index', type: 'plan' },
      { name: '身体维度', icon: '📏', url: '/pages/body-dimension/index', type: 'body' },
      { name: '排行榜', icon: '🏆', url: '/pages/leaderboard/index', type: 'rank' },
      { name: '我的订单', icon: '🛍️', type: 'order' },
      { name: '个性化', icon: '🎨', url: '/pages/customize/index', type: 'custom' },
      { name: '联系我们', icon: '💬', url: '/pages/contact/index', type: 'contact' },
      { name: '使用教程', icon: '▶️', url: '/subpackages/article-detail/index?id=1', type: 'tutorial' },
      { name: '消息通知', icon: '🔔', url: '/pages/notifications/index', type: 'notify' },
      { name: '设置', icon: '⚙️', url: '/pages/setting/index', type: 'setting' },
    ],
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadTheme();
    this.translateMenuNames();
    // 监听主题变更
    this._themeHandler = (theme) => { this.setData({ theme }); };
    app.eventBus.on('theme-changed', this._themeHandler);
  },

  onUnload() {
    if (this._themeHandler) {
      app.eventBus.off('theme-changed', this._themeHandler);
    }
  },

  onShow() {
    this.i18nRefresh();
    this.translateMenuNames();
    this.checkLogin();
    this.loadStreak();
    this.loadTheme();
  },

  translateMenuNames() {
    const t = this.$t.bind(this);
    this.setData({
      gridList: [
        { name: t('我的目标'), icon: 'target', url: '/pages/goal/index', type: 'goal' },
        { name: t('数据统计'), icon: 'chart', url: '/pages/dataCenter/index', type: 'data' },
        { name: t('食物库'), icon: 'app', url: '/pages/food-lib/index', type: 'food' },
        { name: t('断食计划'), icon: 'time', url: '/pages/fast-plan/index', type: 'fast' },
      ],
      menuList: [
        { name: t('我的计划'), icon: '📋', url: '/pages/my-plan/index', type: 'plan' },
        { name: t('身体维度'), icon: '📏', url: '/pages/body-dimension/index', type: 'body' },
        { name: t('排行榜'), icon: '🏆', url: '/pages/leaderboard/index', type: 'rank' },
        { name: t('我的订单'), icon: '🛍️', type: 'order' },
        { name: t('个性化'), icon: '🎨', url: '/pages/customize/index', type: 'custom' },
        { name: t('联系我们'), icon: '💬', url: '/pages/contact/index', type: 'contact' },
        { name: t('使用教程'), icon: '▶️', url: '/subpackages/article-detail/index?id=1', type: 'tutorial' },
        { name: t('消息通知'), icon: '🔔', url: '/pages/notifications/index', type: 'notify' },
        { name: t('设置'), icon: '⚙️', url: '/pages/setting/index', type: 'setting' },
      ],
    });
  },

  loadTheme() {
    const theme = app.getTheme();
    if (theme) this.setData({ theme });
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
          nickName: result.data.nickName || this.$t('小小的新用户'),
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
    console.log('[onLogin] 开始登录流程');

    // 检查是否注销过账号，注销过必须重新收集信息
    const accountDestroyed = wx.getStorageSync('accountDestroyed');
    console.log('[onLogin] accountDestroyed:', accountDestroyed);
    if (accountDestroyed) {
      console.log('[onLogin] 已注销账号，跳转信息收集页');
      wx.navigateTo({ url: '/pages/info-collection/index' });
      return;
    }

    // 检查是否已完善过信息
    const infoCollected = wx.getStorageSync('infoCollected');

    // 检查是否是退出登录状态（有 isLoggedOut 标记说明之前登录过）
    const isLoggedOut = wx.getStorageSync('isLoggedOut');

    console.log('[onLogin] infoCollected:', infoCollected, 'isLoggedOut:', isLoggedOut);

    // 如果未完善信息 且 不是退出登录状态，才跳转信息收集页
    if (!infoCollected && !isLoggedOut) {
      console.log('[onLogin] 未完善信息且非退出登录，跳转信息收集页');
      wx.navigateTo({ url: '/pages/info-collection/index' });
      return;
    }

    // 已完善信息或退出登录状态，执行静默登录
    console.log('[onLogin] 执行静默登录');
    this.doSilentLogin();
  },

  // 执行静默登录
  doSilentLogin() {
    console.log('[doSilentLogin] 开始调用云函数获取openid');
    wx.showLoading({ title: this.$t('登录中'), mask: true });

    // 调用云函数获取 openid（静默获取）
    wx.cloud.callFunction({
      name: 'login',
      data: { action: 'login' }
    }).then(res => {
      console.log('[doSilentLogin] 云函数返回:', JSON.stringify(res.result || res));
      const result = res.result || res;
      if (result.success && result.data && result.data.openid) {
        console.log('[doSilentLogin] 获取到openid:', result.data.openid, '，执行silentLogin');
        return this.silentLogin(result.data.openid);
      } else {
        console.error('[doSilentLogin] 云函数返回格式异常:', result);
        wx.hideLoading();
        wx.showToast({ title: this.$t('登录失败，请重试'), icon: 'none' });
      }
    }).catch((err) => {
      console.error('[doSilentLogin] 云函数调用失败:', err);
      wx.hideLoading();
      wx.showToast({ title: this.$t('登录失败，请检查网络'), icon: 'none' });
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
          nickName: result.data.nickName || this.$t('小小的新用户'),
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
        
        // 从云端恢复全部用户数据（await 确保完成后再提示成功）
        await storage.syncAllFromCloud();
        
        // 恢复完成后刷新页面数据
        this.loadStreak();
        
        wx.hideLoading();
        wx.showToast({ title: this.$t('登录成功'), icon: 'success' });
        this.setData({ isLogin: true, userInfo: userData });
      } else {
        console.error('[silentLogin] 云函数返回失败:', result);
        throw new Error(result.message || '登录失败');
      }
    } catch (err) {
      console.error('[silentLogin] 静默登录异常:', err);
      wx.hideLoading();
      // 不再跳转登录页，仅提示错误，用户可重试
      wx.showToast({ title: this.$t('登录失败，请重试'), icon: 'none' });
    }
  },

  onNavigate(e) {
    const { url, type } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: this.$t('功能开发中'), icon: 'none' });
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
      wx.showToast({ title: this.$t('昵称不能为空'), icon: 'none' });
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

      wx.showToast({ title: this.$t('修改成功'), icon: 'success' });
    } catch (err) {
      console.error('修改昵称失败:', err);
      wx.showToast({ title: this.$t('修改失败'), icon: 'none' });
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
        wx.showLoading({ title: this.$t('上传中'), mask: true });
        
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
          wx.showToast({ title: this.$t('头像更新成功'), icon: 'success' });
        } catch (err) {
          wx.hideLoading();
          console.error('上传头像失败:', err);
          wx.showToast({ title: this.$t('上传失败，请重试'), icon: 'none' });
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
