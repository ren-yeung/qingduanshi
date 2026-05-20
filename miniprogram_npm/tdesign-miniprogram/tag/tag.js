'use strict';
Component({
  properties: {
    size: {
      type: String,
      value: 'medium',
    },
    shape: {
      type: String,
      value: 'square',
    },
    theme: {
      type: String,
      value: 'default',
    },
    variant: {
      type: String,
      value: 'dark',
    },
    closable: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    maxWidth: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-tag',
    className: '',
    tagStyle: '',
    _icon: null,
    _closable: null,
  },
  options: {
    multipleSlots: true,
  },
  observers: {
    'size, shape, theme, variant, closable, disabled': function() {
      this.setClass();
    },
    maxWidth: function(val) {
      this.setTagStyle();
    },
    icon: function(val) {
      this.setData({ _icon: val });
    },
    closable: function(val) {
      this.setData({ _closable: val ? 'close' : null });
    },
  },
  lifetimes: {
    attached: function() {
      this.setClass();
      this.setTagStyle();
    },
  },
  methods: {
    setClass: function() {
      var classList = [
        't-tag',
        't-tag--' + (this.data.theme || 'default'),
        't-tag--' + (this.data.variant || 'dark'),
        't-tag--' + (this.data.size || 'medium'),
        't-tag--' + (this.data.shape || 'square'),
      ];
      if (this.data.closable) classList.push('t-tag--closable');
      if (this.data.disabled) classList.push('t-tag--disabled');
      this.setData({ className: classList.join(' ') });
    },
    setTagStyle: function() {
      var maxWidth = this.data.maxWidth;
      if (maxWidth) {
        var style = 'max-width:' + maxWidth + ';';
        this.setData({ tagStyle: style });
      }
    },
    handleClick: function(e) {
      if (this.data.disabled) return;
      this.triggerEvent('click', e);
    },
    handleClose: function(e) {
      if (this.data.disabled) return;
      this.triggerEvent('close', e);
    },
  },
});
