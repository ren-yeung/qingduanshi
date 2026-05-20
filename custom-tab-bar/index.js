Component({
  data: {
    value: '',
    list: [
      {
        icon: 'dashboard',
        value: 'overview',
        label: '概览',
      },
      {
        icon: 'edit-1',
        value: 'log',
        label: '日志',
      },
      {
        icon: 'article',
        value: 'dry-goods',
        label: '干货',
      },
      {
        icon: 'user',
        value: 'my',
        label: '我的',
      },
    ],
  },
  lifetimes: {
    ready() {
      this.updateSelected();
      
      // 监听页面切换事件
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const originalOnShow = currentPage.onShow;
        const self = this;
        currentPage.onShow = function() {
          if (originalOnShow) originalOnShow.call(this);
          self.updateSelected();
        };
      }
    },
  },
  methods: {
    updateSelected() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const match = /pages\/([\w-]+)\/index/.exec(curPage.route);
        if (match && match[1]) {
          this.setData({ value: match[1] });
        }
      }
    },
    onTabChange(e) {
      const value = e.detail.value;
      if (value) {
        wx.switchTab({ url: `/pages/${value}/index` });
      }
    },
  },
});
