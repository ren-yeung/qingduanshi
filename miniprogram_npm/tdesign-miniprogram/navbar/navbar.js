'use strict';
Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    titleMaxLength: {
      type: Number,
      value: 100,
    },
    visible: {
      type: Boolean,
      value: true,
    },
    animation: {
      type: Boolean,
      value: true,
    },
    delta: {
      type: Number,
      value: 1,
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-navbar',
    showTitle: '',
    visibleClass: '',
  },
  observers: {
    visible: function(val) {
      var cls = 't-navbar' + (val ? '--visible' : '--hide');
      if (this.data.animation) {
        cls += '-animation';
      }
      this.setData({ visibleClass: cls });
    },
    'title, titleMaxLength': function(title, titleMaxLength) {
      var maxLen = titleMaxLength || 100;
      var showTitle = title.slice(0, maxLen);
      if (maxLen < title.length) {
        showTitle += '...';
      }
      this.setData({ showTitle: showTitle });
    },
  },
  lifetimes: {
    attached: function() {
      var title = this.data.title;
      var titleMaxLength = this.data.titleMaxLength;
      var maxLen = titleMaxLength || 100;
      var showTitle = title.slice(0, maxLen);
      if (maxLen < title.length) {
        showTitle += '...';
      }
      this.setData({ showTitle: showTitle });
    },
  },
  methods: {
    goBack: function() {
      var delta = this.data.delta;
      var self = this;
      this.triggerEvent('go-back');
      if (delta > 0) {
        wx.navigateBack({
          delta: delta,
          fail: function(err) {
            self.triggerEvent('fail', err);
          },
          complete: function(res) {
            self.triggerEvent('complete', res);
          },
          success: function(res) {
            self.triggerEvent('success', res);
          },
        });
      }
    },
  },
});
