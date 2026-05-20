'use strict';
Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    note: {
      type: String,
      value: '',
    },
    leftIcon: {
      type: String,
      value: '',
    },
    rightIcon: {
      type: String,
      value: '',
    },
    arrow: {
      type: Boolean,
      value: false,
    },
    url: {
      type: String,
      value: '',
    },
    jumpType: {
      type: String,
      value: 'navigateTo',
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-cell',
    isLastChild: false,
    _leftIcon: '',
    _rightIcon: '',
    _arrow: '',
  },
  relations: {
    '../cell-group/cell-group': {
      type: 'parent',
    },
  },
  options: {
    multipleSlots: true,
  },
  observers: {
    leftIcon: function(val) {
      this.setIcon('_leftIcon', val, '');
    },
    rightIcon: function(val) {
      this.setIcon('_rightIcon', val, '');
    },
    arrow: function(val) {
      this.setIcon('_arrow', val, 'chevron-right');
    },
  },
  methods: {
    setIcon: function(key, val, defaultVal) {
      var iconVal = val || defaultVal;
      this.setData({ [key]: iconVal });
    },
    onClick: function(e) {
      this.triggerEvent('click', e.detail);
      this.jumpLink();
    },
    jumpLink: function() {
      var url = this.data.url;
      var jumpType = this.data.jumpType;
      if (url) {
        wx[jumpType]({ url: url });
      }
    },
  },
});
