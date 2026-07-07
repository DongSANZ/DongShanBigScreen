/**
 * 折线图
 * @module charts/instances/LineChart
 */
import BaseChart from '../BaseChart.js';
import { COLORS } from '@/config/chart.theme.js';

class LineChart extends BaseChart {
  constructor(container, options = {}) {
    super(container, options);
    this._data = null;
  }

  /**
   * 渲染折线图
   * @param {object} data - { categories: string[], series: [{name, data, type?, color?, areaStyle?}] }
   */
  render(data) {
    this._data = data;
    const seriesColors = [COLORS.primary, COLORS.warning, COLORS.success, COLORS.purple, COLORS.cyan];

    const series = data.series.map((s, i) => {
      const color = s.color ?? seriesColors[i % seriesColors.length];
      return {
        name: s.name,
        type: s.type ?? 'line',
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color,
          width: 2,
          shadowBlur: 8,
          shadowColor: color,
        },
        itemStyle: {
          color,
          borderColor: 'rgba(10, 14, 46, 0.8)',
          borderWidth: 2,
        },
        areaStyle: s.areaStyle ?? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${color}40` },
            { offset: 1, color: `${color}05` },
          ]),
        },
      };
    });

    // 引用全局 echarts（通过 window），因为在模块作用域内可能未直接导入
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
        itemWidth: 20,
        itemHeight: 3,
        itemGap: 16,
      },
      grid: { left: 50, right: 30, top: 10, bottom: 40 },
      xAxis: {
        type: 'category',
        data: data.categories,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(163,198,255,0.2)' } },
        axisLabel: { color: '#6b7fa8', fontSize: 11 },
      },
      yAxis: {
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

// 需要引用全局 echarts 以支持 LinearGradient
import * as echarts from 'echarts';

export default LineChart;
