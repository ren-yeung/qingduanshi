const storage = require('~/utils/storage');
const themeBehavior = require('~/behaviors/theme');
const unitUtil = require('~/utils/unit');
const i18nBehavior = require('../../utils/i18n-behavior');

Page({
  behaviors: [themeBehavior, i18nBehavior],
  i18nKeys: [
    '数据统计', '近7天', '近30天', '体重趋势',
    '暂无数据，快去记录体重吧', '当前体重', '最低体重', '平均体重', 'BMI', '记录明细',
  ],
  data: {
    statusBarHeight: 0,
    range: 7, // 7 or 30
    weightRecords: [],
    stats: {
      current: '--',
      lowest: '--',
      average: '--',
      bmi: '--',
    },
    weightUnit: 'kg',
  },

  onLoad() {
    this.i18nRefresh();
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadData();
  },

  onBack() {
    wx.navigateBack();
  },

  onShow() {
    this.i18nRefresh();
    this.loadData();
    this.setData({ weightUnit: unitUtil.getWeightUnitLabel() });
  },

  onChangeRange(e) {
    const range = Number(e.currentTarget.dataset.range);
    this.setData({ range }, () => {
      this.loadData();
    });
  },

  loadData() {
    const allRecords = storage.get(storage.KEYS.WEIGHT_RECORDS, []);
    const range = this.data.range;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range);
    const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

    const records = allRecords.filter((r) => r.date >= cutoffStr);
    // 为每条记录附加转换后的显示值
    const displayRecords = records.map(r => ({
      ...r,
      weightDisplay: unitUtil.formatWeightRaw(r.weight),
    }));
    this.setData({ weightRecords: displayRecords });
    // computeStats 需要原始 records（weight 是 kg）
    this.computeStats(records);
    this.computeStats(records);

    if (records.length > 0) {
      this.drawChart(displayRecords);
    }
  },

  computeStats(records) {
    if (records.length === 0) {
      this.setData({ stats: { current: '--', lowest: '--', average: '--', bmi: '--' } });
      return;
    }
    const weights = records.map((r) => unitUtil.formatWeightRaw(r.weight));
    const current = weights[weights.length - 1];
    const lowest = Math.min(...weights);
    const average = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);

    const latestBody = storage.get(storage.KEYS.BODY_DATA, []).find((r) => r.date === records[records.length - 1].date);
    const bmi = latestBody && latestBody.bmi ? latestBody.bmi : records[records.length - 1].bmi || '--';

    this.setData({
      stats: { current, lowest, average, bmi },
    });
  },

  drawChart(records) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#weightChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const width = res[0].width;
        const height = res[0].height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const padding = { top: 30, right: 20, bottom: 40, left: 40 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const weights = records.map((r) => r.weightDisplay || r.weight);
        const minW = Math.min(...weights);
        const maxW = Math.max(...weights);
        const rangeW = maxW - minW || 1;

        // 画网格线
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padding.top + (chartH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padding.left, y);
          ctx.lineTo(width - padding.right, y);
          ctx.stroke();

          const label = (maxW - (rangeW / 4) * i).toFixed(1);
          ctx.fillStyle = '#999';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(label, padding.left - 8, y + 3);
        }

        // 画折线
        ctx.strokeStyle = this.data.theme.brandPrimary || '#2EAF7D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        records.forEach((r, i) => {
          const x = padding.left + (chartW / (records.length - 1 || 1)) * i;
          const w = r.weightDisplay || r.weight;
          const y = padding.top + chartH - ((w - minW) / rangeW) * chartH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // 画点和日期
        records.forEach((r, i) => {
          const x = padding.left + (chartW / (records.length - 1 || 1)) * i;
          const w = r.weightDisplay || r.weight;
          const y = padding.top + chartH - ((w - minW) / rangeW) * chartH;

          ctx.fillStyle = this.data.theme.brandPrimary || '#2EAF7D';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#999';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          const dateStr = r.date.slice(5);
          ctx.fillText(dateStr, x, height - 12);
        });
      });
  },
});
