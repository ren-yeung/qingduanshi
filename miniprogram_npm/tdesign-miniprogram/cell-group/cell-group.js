'use strict';
Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
  },
  data: {
    prefix: 't',
    classPrefix: 't-cell-group',
  },
  relations: {
    '../cell/cell': {
      type: 'child',
      linked: function() {
        this.updateLastChild();
      },
      unlinked: function() {
        this.updateLastChild();
      },
    },
  },
  methods: {
    updateLastChild: function() {
      var children = this.selectAllComponents('.t-cell');
      var len = children.length;
      children.forEach(function(child, index) {
        child.setData({ isLastChild: index === len - 1 });
      });
    },
  },
});
