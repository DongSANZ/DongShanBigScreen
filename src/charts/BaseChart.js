/**
 * 图表抽象基类 —— 所有图表继承此类
 * @module charts/BaseChart
 */
import * as echarts from 'echarts';
import { getLogger } from '@/plugins/logger/Logger.js';
import { COLORS } from '@/config/chart.theme.js';

class BaseChart {
  /**
   * @param {HTMLElement} container - 图表容器 DOM 元素
   * @param {object} options - 配置选项
   * @param {string} options.id - 图表唯一标识
   */
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('[BaseChart] 容器元素不能为空');
    }
    this.container = container;
    this.id = options.id ?? `chart-${Date.now()}`;
    this.logger = getLogger();

    // 创建 ECharts 实例
    this.chart = echarts.init(container);

    // 公共配置
    this._commonOptions = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 800,
      animationEasing: 'cubicOut',
    };

    this.logger.debug(`图表 "${this.id}" 初始化完成`);
  }

  /**
   * 设置图表配置并渲染
   * @param {object} option - ECharts option 对象
   */
  setOption(option) {
    if (!this.chart || this.chart.isDisposed()) return;
    const merged = this._mergeOptions(option);
    this.chart.setOption(merged, { notMerge: true });
  }

  /**
   * 更新图表数据
   * @param {object} data - 新数据
   */
  updateData(_data) {
    // 子类实现
  }

  /**
   * 响应尺寸变化
   */
  resize() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.resize();
    }
  }

  /**
   * 销毁图表实例
   */
  dispose() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose();
      this.chart = null;
      this.logger.debug(`图表 "${this.id}" 已销毁`);
    }
  }

  /**
   * 显示加载动画
   */
  showLoading() {
    this.chart?.showLoading('default', {
      text: '加载中...',
      color: COLORS.primary,
      textColor: '#a3c6ff',
      maskColor: 'rgba(10, 14, 46, 0.6)',
      zlevel: 0,
    });
  }

  /**
   * 隐藏加载动画
   */
  hideLoading() {
    this.chart?.hideLoading();
  }

  /**
   * 注册 ECharts 事件
   * @param {string} eventName - e.g. 'click'
   * @param {Function} handler
   */
  on(eventName, handler) {
    this.chart?.on(eventName, handler);
  }

  /**
   * 合并公共配置与业务配置
   * @private
   */
  _mergeOptions(option) {
    return {
      ...this._commonOptions,
      ...option,
    };
  }
}

export default BaseChart;
