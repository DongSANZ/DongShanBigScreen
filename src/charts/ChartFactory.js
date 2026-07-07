/**
 * 图表工厂 —— 根据类型创建图表实例
 * @module charts/ChartFactory
 */
import BarChart from './instances/BarChart.js';
import LineChart from './instances/LineChart.js';
import PieChart from './instances/PieChart.js';
import RadarChart from './instances/RadarChart.js';
import MapChart from './instances/MapChart.js';

/** 图表类型到构造函数的映射 */
const CHART_MAP = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  radar: RadarChart,
  map: MapChart,
};

class ChartFactory {
  /**
   * 创建图表实例
   * @param {string} type - 图表类型: 'bar' | 'line' | 'pie' | 'radar' | 'map'
   * @param {HTMLElement} container - 容器 DOM
   * @param {object} [options] - 额外配置
   * @returns {import('./BaseChart.js').default}
   */
  static create(type, container, options = {}) {
    const ChartClass = CHART_MAP[type];
    if (!ChartClass) {
      throw new Error(`[ChartFactory] 不支持的图表类型: "${type}"，支持的类型: ${Object.keys(CHART_MAP).join(', ')}`);
    }
    return new ChartClass(container, options);
  }

  /**
   * 注册自定义图表类型
   * @param {string} type
   * @param {typeof import('./BaseChart.js').default} ChartClass
   */
  static register(type, ChartClass) {
    CHART_MAP[type] = ChartClass;
  }

  /**
   * 获取支持的图表类型
   * @returns {string[]}
   */
  static listTypes() {
    return Object.keys(CHART_MAP);
  }
}

export default ChartFactory;
