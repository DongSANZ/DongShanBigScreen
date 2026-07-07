/**
 * 点击交互混入 —— 统一的图表点击事件处理
 * @module charts/mixins/clickHandler
 */
import eventBus from '@/core/EventBus.js';

/**
 * 为图表添加点击事件处理
 * @param {import('../BaseChart.js').default} chartInstance
 * @param {object} [options]
 * @param {boolean} [options.emitGlobal=true] - 是否发送全局事件
 */
export function applyClickHandler(chartInstance, options = {}) {
  const { emitGlobal = true } = options;

  chartInstance.on('click', (params) => {
    chartInstance.logger?.debug(`图表 "${chartInstance.id}" 点击事件`, { params });

    if (emitGlobal) {
      eventBus.emit('chart:click', {
        chartId: chartInstance.id,
        params,
      });
    }
  });
}
