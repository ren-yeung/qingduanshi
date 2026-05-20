'use strict';
Component({
  properties: {
    content: {
      type: String,
      value: '',
    },
    theme: {
      type: String,
      value: 'default',
    },
    size: {
      type: String,
      value: 'medium',
    },
    underline: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    prefixIcon: {
      type: String,
      value: '',
    },
    suffixIcon: {
      type: String,
      value: '',
    },
    hover: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    onClick: function() {
      if (this.data.disabled) return;
      this.triggerEvent('click');
    },
  },
});
