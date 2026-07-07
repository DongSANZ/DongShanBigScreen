/**
 * 中国地图图表
 * @module charts/instances/MapChart
 */
import BaseChart from '../BaseChart.js';
import { COLORS } from '@/config/chart.theme.js';
import * as echarts from 'echarts';

/** 中国地图 GeoJSON CDN 地址（需在 index.html 中引入） */
const CHINA_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

class MapChart extends BaseChart {
  constructor(container, options = {}) {
    super(container, options);
    this._geoLoaded = false;
    this._data = null;
  }

  /**
   * 注册地图 GeoJSON 数据
   * @returns {Promise<void>}
   */
  async loadGeoJSON() {
    if (this._geoLoaded) return;

    try {
      // 先尝试从全局获取已注册的地图
      const geo = echarts.getMap('china');
      if (geo) {
        this._geoLoaded = true;
        return;
      }
    } catch {
      // 未注册
    }

    try {
      const res = await fetch(CHINA_GEOJSON_URL);
      const geoJson = await res.json();
      echarts.registerMap('china', geoJson);
      this._geoLoaded = true;
      this.logger.info('中国地图 GeoJSON 加载成功');
    } catch (err) {
      this.logger.error('中国地图 GeoJSON 加载失败', { error: err.message });
      // 降级：使用散点图模拟（在中国中心位置显示）
      this._geoLoaded = false;
    }
  }

  /**
   * 渲染地图
   * @param {object} data - { items: [{name, value}] }
   */
  async render(data) {
    this._data = data;

    await this.loadGeoJSON();

    if (!this._geoLoaded) {
      this._renderFallback(data);
      return;
    }

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 14, 46, 0.9)',
        borderColor: COLORS.primary,
        textStyle: { color: '#e0e6ff', fontSize: 12 },
        formatter: (params) => {
          if (params.seriesType === 'effectScatter') {
            return `${params.name}<br/>销售额: ${params.value[2]} 万元`;
          }
          return `${params.name}<br/>销售额: ${params.value ?? '--'} 万元`;
        },
      },
      geo: {
        map: 'china',
        roam: false,
        zoom: 1.15,
        center: [105, 36],
        itemStyle: {
          areaColor: 'rgba(16, 30, 70, 0.7)',
          borderColor: 'rgba(0, 212, 255, 0.4)',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(0, 212, 255, 0.25)',
          },
          label: { show: false },
        },
        label: { show: false },
      },
      series: [
        {
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data: data.items.map((item) => ({
            name: item.name,
            value: item.value,
          })),
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: data.items.map((item) => ({
            name: item.name,
            value: [item.lng ?? 116, item.lat ?? 36, item.value],
          })),
          symbolSize: (val) => Math.sqrt(val[2]) / 8,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3,
            period: 4,
            color: COLORS.primary,
          },
          itemStyle: {
            color: COLORS.accent ?? COLORS.primary,
            shadowBlur: 10,
            shadowColor: COLORS.primary,
          },
          zlevel: 1,
        },
      ],
      visualMap: {
        min: Math.min(...data.items.map((i) => i.value)),
        max: Math.max(...data.items.map((i) => i.value)),
        left: 20,
        bottom: 20,
        text: ['高', '低'],
        textStyle: { color: '#a3c6ff', fontSize: 11 },
        inRange: {
          color: ['rgba(0,212,255,0.15)', 'rgba(0,212,255,0.5)', 'rgba(0,212,255,0.85)'],
        },
        calculable: true,
      },
    };

    this.setOption(option);
  }

  /**
   * 降级渲染 — 使用柱状图代替地图
   */
  _renderFallback(data) {
    const top10 = [...data.items].sort((a, b) => b.value - a.value).slice(0, 10);

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 14, 46, 0.9)',
        borderColor: COLORS.primary,
      },
      grid: { left: 80, right: 30, top: 10, bottom: 20 },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(163,198,255,0.08)' } },
        axisLabel: { color: '#6b7fa8' },
      },
      yAxis: {
        type: 'category',
        data: top10.map((i) => i.name),
        axisLine: { lineStyle: { color: 'rgba(163,198,255,0.2)' } },
        axisLabel: { color: '#a3c6ff', fontSize: 12 },
      },
      series: [
        {
          type: 'bar',
          data: top10.map((i) => ({
            value: i.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: COLORS.primary },
                { offset: 1, color: COLORS.purple },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            color: '#a3c6ff',
            fontSize: 11,
          },
        },
      ],
    };

    this.setOption(option);
    this.logger.info('地图降级为横向柱状图（GeoJSON 加载失败）');
  }

  updateData(data) {
    this.render(data);
  }
}

export default MapChart;
