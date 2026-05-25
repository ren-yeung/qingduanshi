const app = getApp();
const themeBehavior = require('~/behaviors/theme');
const i18nBehavior = require('../../utils/i18n-behavior');


Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: ['账号安全', '账号信息', '头像', '昵称', '安全设置', '修改密码', '绑定手机号', '登录设备管理', '上次登录：',
    '请输入昵称', '取消', '完成', '昵称不能为空', '修改成功', '修改失败', '上传中', '头像更新成功', '上传失败，请重试'],

  data: {
    statusBarHeight: 0,
    nickname: '',
    avatarUrl: '',
    maskedOpenid: '',
    phone: '',
    lastLoginTime: '',
    lastLoginDevice: '',
    lastLoginLocation: '',
    isEditingNickname: false,
    tempNickname: '',
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadUserInfo();
  },

  onShow() {
    this.i18nRefresh();
    this.loadUserInfo();
  },

  loadUserInfo() {
    try {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};

      let openid = '';
      if (userInfo.openid && typeof userInfo.openid === 'string' && userInfo.openid.length > 6) {
        openid = userInfo.openid.substring(0, 3) + '***' + userInfo.openid.substring(userInfo.openid.length - 3);
      } else {
        openid = 'oX***abc123';
      }

      let phone = '';
      if (userInfo.phone && typeof userInfo.phone === 'string' && userInfo.phone.length >= 11) {
        phone = userInfo.phone.substring(0, 3) + '****' + userInfo.phone.substring(userInfo.phone.length - 4);
      } else if (userInfo.phoneNumber) {
        phone = userInfo.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }

      this.setData({
        nickname: userInfo.nickName || this.$t('轻断食达人'),
        avatarUrl: userInfo.avatarUrl || '',
        maskedOpenid: openid,
        phone: phone || '未绑定',
        lastLoginTime: '2026-05-24 09:30',
        lastLoginDevice: 'iPhone',
        lastLoginLocation: '北京',
      });
    } catch (e) {
      console.error('加载用户信息失败:', e);
    }
  },

  onRowClick(e) {
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case 'avatar':
        this.onChooseAvatar();
        break;
      case 'nickname':
        this.onEditNickname();
        break;
      case 'password':
        wx.showToast({ title: this.$t('暂不支持修改密码'), icon: 'none' });
        break;
      case 'phone':
        wx.showToast({ title: this.$t('暂仅支持微信登录'), icon: 'none' });
        break;
      case 'device':
        wx.showToast({ title: this.$t('当前设备已认证'), icon: 'none' });
        break;
      default:
        break;
    }
  },

  // ===== 头像修改 =====
  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.showLoading({ title: this.$t('上传中'), mask: true });

        try {
          const cloudPath = `avatar/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePath,
          });
          const fileID = uploadRes.fileID;

          // 获取临时链接用于本地显示
          const urlRes = await wx.cloud.getTempFileURL({
            fileList: [fileID],
          });
          const tempFileURL = urlRes.fileList[0].tempFileURL;

          // 更新到云数据库
          await this.updateUserAvatar(fileID);

          // 更新本地数据
          const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
          userInfo.avatarUrl = tempFileURL;
          userInfo.avatarFileID = fileID;
          app.globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);

          this.setData({ avatarUrl: tempFileURL });

          wx.hideLoading();
          wx.showToast({ title: this.$t('头像更新成功'), icon: 'success' });
        } catch (err) {
          wx.hideLoading();
          console.error('上传头像失败:', err);
          wx.showToast({ title: this.$t('上传失败，请重试'), icon: 'none' });
        }
      },
    });
  },

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
      console.log('头像同步到云数据库成功');
    } catch (err) {
      console.error('头像同步到云数据库失败:', err);
    }
  },

  // ===== 昵称修改 =====
  onEditNickname() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    this.setData({
      isEditingNickname: true,
      tempNickname: (userInfo && userInfo.nickName) || this.data.nickname || '',
    });
  },

  onNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value });
  },

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

      this.setData({
        nickname: nickName,
        isEditingNickname: false,
        tempNickname: '',
      });

      wx.showToast({ title: this.$t('修改成功'), icon: 'success' });
    } catch (err) {
      console.error('修改昵称失败:', err);
      wx.showToast({ title: this.$t('修改失败'), icon: 'none' });
    }
  },

  onCancelNickname() {
    this.setData({ isEditingNickname: false, tempNickname: '' });
  },

  onBack() {
    wx.navigateBack();
  },
});
