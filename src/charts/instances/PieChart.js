/**
 * 饼图 / 环形图
 * @module charts/instances/PieChart
 */
import BaseChart from '../BaseChart.js';
import { COLORS } from '@/config/chart.theme.js';

class PieChart extends BaseChart {
  constructor(container, options = {}) {
    super(container, options);
    this._data = null;
  }

  /**
   * 渲染饼图
   * @param {object} data - { seriesName: string, items: [{name, value}], config?: {radius?, rose?} }
   */
  render(data) {
    this._data = data;
    const radius = data.config?.radius ?? ['45%', '72%'];
    const roseType = data.config?.rose ? 'area' : undefined;

    const colors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple, COLORS.cyan, COLORS.danger];

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 14, 46, 0.9)',
        borderColor: COLORS.primary,
        textStyle: { color: '#e0e6ff', fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { color: '#a3c6ff', fontSize: 11 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
      },
      series: [
        {
          name: data.seriesName ?? '数据',
          type: 'pie',
          radius,
          roseType,
          center: ['38%', '52%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: 'rgba(10, 14, 46, 0.6)',
            borderWidth: 3,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#e0e6ff',
            },
            scaleSize: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0,212,255,0.4)',
          },
          data: data.items.map((item, i) => ({
            ...item,
            itemStyle: { color: item.color ?? colors[i % colors.length] },
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

export default PieChart;
