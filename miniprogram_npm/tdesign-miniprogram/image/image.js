'use strict';
Component({
  data: {
    isLoaded: false,
    isError: false,
  },
  properties: {
    src: {
      type: String,
      value: '',
    },
    mode: {
      type: String,
      value: 'scaleToFill',
    },
    shape: {
      type: String,
      value: 'square',
    },
    loading: {
      type: String,
      value: 'loading',
    },
    error: {
      type: String,
      value: 'error',
    },
    showMenuByLongpress: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onLoad: function(e) {
      this.setData({ isLoaded: true });
      this.triggerEvent('load', e.detail);
    },
    onError: function(e) {
      this.setData({ isError: true });
      this.triggerEvent('error', e.detail);
    },
  },
});
