/**
 * 柱状图
 * @module charts/instances/BarChart
 */
import BaseChart from '../BaseChart.js';
import { COLORS } from '@/config/chart.theme.js';

class BarChart extends BaseChart {
  constructor(container, options = {}) {
    super(container, options);
    this._data = null;
  }

  /**
   * 渲染柱状图
   * @param {object} data - { categories: string[], series: [{name, data, color?}] }
   * @param {object} [style]
   * @param {boolean} [style.horizontal=false] - 是否横向
   * @param {boolean} [style.stacked=false] - 是否堆叠
   */
  render(data, style = {}) {
    this._data = data;
    const { horizontal = false, stacked = false } = style;

    const seriesColors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple, COLORS.cyan];
    const series = data.series.map((s, i) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      barWidth: horizontal ? 20 : '40%',
      barGap: '30%',
      stack: stacked ? 'total' : undefined,
      itemStyle: {
        color: s.color ?? seriesColors[i % seriesColors.length],
        borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
        borderColor: 'transparent',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: s.color ?? seriesColors[i % seriesColors.length],
        },
      },
      label: {
        show: false,
      },
    }));

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 14, 46, 0.9)',
        borderColor: COLORS.primary,
        textStyle: { color: '#e0e6ff', fontSize: 12 },
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#a3c6ff', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16,
      },
      grid: horizontal
        ? { left: 80, right: 30, top: 10, bottom: 30 }
        : { left: 50, right: 30, top: 10, bottom: 40 },
      [horizontal ? 'yAxis' : 'xAxis']: {
        type: 'category',
        data: data.categories,
        axisLine: { lineStyle: { color: 'rgba(163,198,255,0.2)' } },
        axisLabel: { color: '#6b7fa8', fontSize: 11 },
      },
      [horizontal ? 'xAxis' : 'yAxis']: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(163,198,255,0.08)' } },
        axisLabel: { color: '#6b7fa8', fontSize: 11 },
      },
      series,
    };

    this.setOption(option);
  }

  updateData(data) {
    this.render(data);
  }
}

export default BarChart;
