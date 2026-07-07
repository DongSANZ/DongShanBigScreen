/**
 * 雷达图
 * @module charts/instances/RadarChart
 */
import BaseChart from '../BaseChart.js';
import { COLORS } from '@/config/chart.theme.js';

class RadarChart extends BaseChart {
  constructor(container, options = {}) {
    super(container, options);
    this._data = null;
  }

  /**
   * 渲染雷达图
   * @param {object} data - { indicators: [{name, max}], series: [{name, data}] }
   */
  render(data) {
    this._data = data;
    const colors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple];

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 14, 46, 0.9)',
        borderColor: COLORS.primary,
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#a3c6ff', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 3,
        itemGap: 16,
      },
      radar: {
        center: ['50%', '48%'],
        radius: '65%',
        indicator: data.indicators,
        axisName: {
          color: '#a3c6ff',
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: 'rgba(163,198,255,0.15)' } },
        splitLine: { lineStyle: { color: 'rgba(163,198,255,0.12)' } },
        splitArea: {
          areaStyle: {
            color: ['rgba(0,212,255,0.03)', 'rgba(0,212,255,0.06)'],
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: data.series.map((s, i) => ({
            name: s.name,
            value: s.data,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              color: colors[i % colors.length],
              width: 1.5,
            },
            areaStyle: {
              color: `${colors[i % colors.length]}20`,
            },
            itemStyle: {
              color: colors[i % colors.length],
            },
          })),
        },
      ],
    };

    this.setOption(option);
  }

  updateData(data) {
    this.render(data);
  }
}

export default RadarChart;
