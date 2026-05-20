'use strict';
Component({
  properties: {
    name: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: '',
    },
    size: {
      type: String,
      value: '48rpx',
    },
    prefix: {
      type: String,
      value: 't',
    },
  },
  data: {
    classPrefix: 't-icon',
    isImage: false,
    iconStyle: '',
  },
  observers: {
    'name, color, size': function(name, color, size) {
      this.setIconStyle();
    },
  },
  methods: {
    onTap: function(e) {
      this.triggerEvent('click', e.detail);
    },
    setIconStyle: function() {
      var name = this.data.name;
      var color = this.data.color;
      var size = this.data.size;
      var isImage = name.indexOf('/') !== -1;
      var fontSize = this.addUnit(size);
      var style = '';
      if (color) {
        style += 'color:' + color + ';';
      }
      if (size) {
        style += 'font-size:' + fontSize + ';';
      }
      if (isImage) {
        style += 'width:' + fontSize + ';height:' + fontSize + ';';
      }
      this.setData({ isImage: isImage, iconStyle: style });
    },
    addUnit: function(val) {
      if (typeof val === 'number') {
        return val + 'rpx';
      }
      return val || '';
    },
  },
  lifetimes: {
    attached: function() {
      this.setIconStyle();
    },
  },
});
