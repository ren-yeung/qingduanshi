'use strict';
Component({
  data: {
    delay: 0,
    show: false,
    circularStyle: '',
    inheritColor: true,
    visible: false,
  },
  properties: {
    theme: {
      type: String,
      value: 'circular',
    },
    size: {
      type: String,
      value: '40rpx',
    },
    color: {
      type: String,
      value: '',
    },
  },
  observers: {
    show: function(visible) {
      this.setData({ visible: visible });
    },
    'size, color': function(size, color) {
      var style = "width: " + size + "; height: " + size + ";";
      if (color) {
        style += " color: " + color + ";";
        this.setData({ circularStyle: style, inheritColor: false });
      } else {
        this.setData({ circularStyle: style, inheritColor: true });
      }
    },
  },
  lifetimes: {
    attached: function() {
      var size = this.data.size;
      var color = this.data.color;
      var style = "width: " + size + "; height: " + size + ";";
      if (color) {
        style += " color: " + color + ";";
        this.setData({ circularStyle: style, inheritColor: false });
      } else {
        this.setData({ circularStyle: style, inheritColor: true });
      }
    },
  },
  methods: {
    reset: function() {
      clearTimeout(this.data.delay);
    },
  },
});
