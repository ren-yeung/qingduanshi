'use strict';
Component({
  properties: {
    value: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'text',
    },
    password: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    maxlength: {
      type: Number,
      value: 140,
    },
    placeholderStyle: {
      type: String,
      value: '',
    },
    placeholderClass: {
      type: String,
      value: '',
    },
    cursor: {
      type: Number,
      value: 0,
    },
    selectionStart: {
      type: Number,
      value: -1,
    },
    selectionEnd: {
      type: Number,
      value: -1,
    },
    adjustPosition: {
      type: Boolean,
      value: true,
    },
    confirmType: {
      type: String,
      value: 'done',
    },
    confirmHold: {
      type: Boolean,
      value: false,
    },
    cursorColor: {
      type: String,
      value: '',
    },
    autoFocus: {
      type: Boolean,
      value: false,
    },
    focus: {
      type: Boolean,
      value: false,
    },
    clearable: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-input',
    inputValue: '',
    showClear: false,
  },
  observers: {
    value: function(val) {
      this.setData({ inputValue: val || '' });
    },
  },
  lifetimes: {
    ready: function() {
      var value = this.properties.value || '';
      this.setData({ inputValue: value });
    },
  },
  methods: {
    onInput: function(e) {
      var value = e.detail.value;
      this.setData({ inputValue: value, showClear: this.properties.clearable && value.length > 0 });
      this.triggerEvent('input', { value: value });
      this.triggerEvent('change', { value: value });
    },
    onFocus: function(e) {
      this.setData({ showClear: this.properties.clearable && this.data.inputValue.length > 0 });
      this.triggerEvent('focus', e.detail);
    },
    onBlur: function(e) {
      this.setData({ showClear: false });
      this.triggerEvent('blur', e.detail);
    },
    onConfirm: function(e) {
      this.triggerEvent('confirm', e.detail);
    },
    onClear: function() {
      this.setData({ inputValue: '', showClear: false });
      this.triggerEvent('clear', { value: '' });
      this.triggerEvent('change', { value: '' });
    },
  },
});
