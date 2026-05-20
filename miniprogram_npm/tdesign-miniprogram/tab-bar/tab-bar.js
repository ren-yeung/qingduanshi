'use strict';
Component({
  properties: {
    value: {
      type: String,
      value: '',
    },
    fixed: {
      type: Boolean,
      value: false,
    },
    border: {
      type: Boolean,
      value: true,
    },
    split: {
      type: Boolean,
      value: true,
    },
    theme: {
      type: String,
      value: 'default',
    },
    color: {
      type: String,
      value: '',
    },
    selectedColor: {
      type: String,
      value: '#0052d9',
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    handleChange: function(e) {
      var value = e.detail.value;
      if (value !== this.data.value) {
        this.setData({ value: value });
        this.updateChildrenActive();
        this.triggerEvent('change', { value: value });
      }
    },
    updateChildrenActive: function() {
      var children = this.selectAllComponents('.t-tab-bar-item');
      children.forEach(function(child) {
        if (child.updateActive) {
          child.updateActive();
        }
      });
    },
  },
});
