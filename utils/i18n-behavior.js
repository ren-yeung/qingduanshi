/**
 * i18n 行为组件 - 为页面提供多语言支持
 * 
 * 使用方式:
 *   const i18nBehavior = require('../../utils/i18n-behavior');
 *   Page({ behaviors: [i18nBehavior, ...], i18nKeys: ['保存', '取消', ...], ... })
 *   
 *   在 WXML 中按索引使用: {{t0 || '保存'}}  {{t1 || '取消'}}
 *   （中文回退值用于可读性和降级展示，tN 对应 i18nKeys 数组第 N 项）
 */
const i18n = require('./i18n');

module.exports = Behavior({
  data: {},
  lifetimes: {
    attached() {
      this._i18nHandler = (lang) => {
        this.i18nRefresh();
      };
      // 监听语言变更事件
      try {
        const app = getApp();
        if (app && app.eventBus) {
          app.eventBus.on('language-changed', this._i18nHandler);
        }
      } catch (e) {}
    },
    detached() {
      try {
        const app = getApp();
        if (app && app.eventBus) {
          app.eventBus.off('language-changed', this._i18nHandler);
        }
      } catch (e) {}
    }
  },
  methods: {
    /**
     * 刷新当前页面的所有 i18n 翻译
     * 按 i18nKeys 数组索引生成 t0, t1, t2... 变量
     */
    i18nRefresh() {
      const keys = this.i18nKeys || [];
      if (keys.length === 0) return;
      const lang = i18n.getCurrentLang();
      const updates = {};
      keys.forEach((key, idx) => {
        updates['t' + idx] = i18n.t(key, lang);
      });
      this.setData(updates);
    },

    /** JS 代码中使用: this.$t('保存') */
    $t(key) {
      return i18n.t(key);
    },
  },
});
