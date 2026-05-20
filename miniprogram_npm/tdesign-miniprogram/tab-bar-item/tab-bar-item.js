'use strict';
Component({
  properties: {
    badgeProps: {
      type: Object,
      value: {},
    },
    icon: {
      type: String,
      value: '',
    },
    selectedIcon: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    label: {
      type: String,
      value: '',
    },
    subTabBarItems: {
      type: Array,
      value: [],
    },
  },
  data: {
    active: false,
  },
  lifetimes: {
    attached: function() {
      this.updateActive();
    },
  },
  pageLifetimes: {
    show: function() {
      this.updateActive();
    },
  },
  methods: {
    updateActive: function() {
      var parent = this.getTabBar();
      if (parent) {
        var currentValue = this.data.value;
        var parentValue = parent.data.value;
        this.setData({ active: currentValue === parentValue });
      }
    },
    getTabBar: function() {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.tabBar) {
        return currentPage.tabBar;
      }
      return null;
    },
    onTabBarChange: function() {
      this.triggerEvent('change', { value: this.data.value });
    },
  },
});
