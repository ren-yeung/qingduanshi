Page({
  data: {
    list: [
      { rank: 1, name: '我', streak: 5, avatar: '' },
      { rank: 2, name: '好友A', streak: 3, avatar: '' },
      { rank: 3, name: '好友B', streak: 2, avatar: '' },
    ],
  },

  onLoad() {
    // 后续接入微信开放数据域获取真实好友排行
    wx.showToast({ title: '排行榜功能开发中', icon: 'none' });
  },
});
