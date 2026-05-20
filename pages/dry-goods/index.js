const ARTICLES = [
  {
    id: 1,
    title: '什么是轻断食？',
    summary: '轻断食是一种间歇性禁食的饮食方式，通过在特定时间段内限制进食来促进健康。',
    tag: '入门',
  },
  {
    id: 2,
    title: '16:8 断食法完全指南',
    summary: '每天断食16小时，进食窗口8小时。这是最适合初学者的断食方案。',
    tag: '方法',
  },
  {
    id: 3,
    title: '断食期间可以喝什么？',
    summary: '水、黑咖啡、无糖茶都是断食期间的好伴侣。了解哪些饮品不会打破断食状态。',
    tag: '科普',
  },
  {
    id: 4,
    title: '断食的常见误区',
    summary: '很多人认为断食就是挨饿，其实科学的断食是完全不同的概念。',
    tag: '避坑',
  },
  {
    id: 5,
    title: '如何度过断食初期的不适？',
    summary: '前3天是最难熬的，掌握这些技巧可以帮助你平稳度过适应期。',
    tag: '技巧',
  },
  {
    id: 6,
    title: '断食与运动如何搭配？',
    summary: '在断食期间进行适度运动可以加速燃脂，但要注意运动强度和时机。',
    tag: '运动',
  },
];

Page({
  data: {
    statusBarHeight: 0,
    articles: ARTICLES,
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    // 可扩展为从网络加载文章
  },

  onTapArticle(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({ title: `文章${id}详情页开发中`, icon: 'none' });
  },
});
