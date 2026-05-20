'use strict';
Component({
  properties: {
    icon: {
      type: String,
      value: '',
    },
    image: {
      type: String,
      value: '',
    },
    shape: {
      type: String,
      value: 'circle',
    },
    size: {
      type: String,
      value: 'medium',
    },
    bordered: {
      type: Boolean,
      value: false,
    },
    alt: {
      type: String,
      value: '头像',
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-avatar',
    isShow: true,
  },
  options: {
    multipleSlots: true,
  },
  methods: {
    hide: function() {
      this.setData({ isShow: false });
    },
    onLoadError: function(e) {
      this.setData({ isShow: false });
      this.triggerEvent('error', e.detail);
    },
  },
});
