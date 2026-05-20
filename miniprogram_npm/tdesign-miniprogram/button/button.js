'use strict';
Component({
  properties: {
    theme: {
      type: String,
      value: 'default',
    },
    size: {
      type: String,
      value: 'medium',
    },
    variant: {
      type: String,
      value: 'base',
    },
    shape: {
      type: String,
      value: 'rectangle',
    },
    plain: {
      type: Boolean,
      value: false,
    },
    block: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    icon: {
      type: String,
      value: '',
    },
    ghost: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-button',
    className: '',
    _icon: null,
  },
  options: {
    multipleSlots: true,
  },
  observers: {
    'theme, size, plain, block, shape, disabled, loading, variant': function() {
      this.setClass();
    },
    icon: function(val) {
      this.setData({ _icon: val });
    },
  },
  lifetimes: {
    attached: function() {
      this.setClass();
    },
  },
  methods: {
    setClass: function() {
      var classList = [
        't-button',
        't-button--' + (this.data.variant || 'base'),
        't-button--' + (this.data.theme || 'default'),
        't-button--' + (this.data.shape || 'rectangle'),
        't-button--size-' + (this.data.size || 'medium'),
      ];
      if (this.data.block) classList.push('t-button--block');
      if (this.data.disabled) classList.push('t-button--disabled');
      if (this.data.ghost) classList.push('t-button--ghost');
      this.setData({ className: classList.join(' ') });
    },
    handleTap: function(e) {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('tap', e.detail);
    },
    getuserinfo: function(e) {
      this.triggerEvent('getuserinfo', e.detail);
    },
    contact: function(e) {
      this.triggerEvent('contact', e.detail);
    },
    getphonenumber: function(e) {
      this.triggerEvent('getphonenumber', e.detail);
    },
    opensetting: function(e) {
      this.triggerEvent('opensetting', e.detail);
    },
    chooseavatar: function(e) {
      this.triggerEvent('chooseavatar', e.detail);
    },
  },
});
