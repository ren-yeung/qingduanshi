'use strict';
Component({
  properties: {
    count: {
      type: Number,
      value: 0,
    },
    maxCount: {
      type: Number,
      value: 99,
    },
    showZero: {
      type: Boolean,
      value: false,
    },
    dot: {
      type: Boolean,
      value: false,
    },
    shape: {
      type: String,
      value: 'circle',
    },
    color: {
      type: String,
      value: '',
    },
  },
  data: {
    displayCount: '0',
    visible: false,
  },
  observers: {
    'count, maxCount': function(count, maxCount) {
      var displayCount = count > maxCount ? maxCount + '+' : count;
      this.setData({ displayCount: displayCount });
    },
    'count, showZero, dot': function(count, showZero, dot) {
      var visible = dot || (count > 0 || showZero);
      this.setData({ visible: visible });
    },
  },
  lifetimes: {
    attached: function() {
      var count = this.data.count;
      var maxCount = this.data.maxCount;
      var showZero = this.data.showZero;
      var dot = this.data.dot;
      var displayCount = count > maxCount ? maxCount + '+' : count;
      var visible = dot || (count > 0 || showZero);
      this.setData({ displayCount: displayCount, visible: visible });
    },
  },
});
