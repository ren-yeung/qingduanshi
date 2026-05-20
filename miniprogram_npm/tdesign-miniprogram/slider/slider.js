'use strict';
Component({
  properties: {
    value: {
      type: Number,
      value: 0,
    },
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 100,
    },
    step: {
      type: Number,
      value: 1,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    showValue: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    currentValue: 0,
    sliderStyles: '',
  },
  observers: {
    value: function(val) {
      this.setData({ currentValue: val });
    },
  },
  lifetimes: {
    attached: function() {
      var value = this.properties.value || 0;
      this.setData({ currentValue: value });
    },
  },
  methods: {
    onChange: function(e) {
      var value = e.detail.value;
      this.setData({ currentValue: value });
      this.triggerEvent('change', { value: value });
    },
  },
});
