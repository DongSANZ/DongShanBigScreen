/**
 * 自动刷新混入 —— 为图表添加定时刷新能力
 * @module charts/mixins/autoRefresh
 */

/**
 * 为图表实例添加自动刷新
 * @param {import('../BaseChart.js').default} chartInstance - 图表实例
 * @param {Function} fetchDataFn - 获取数据的函数
 * @param {number} [interval=30000] - 刷新间隔（毫秒）
 * @returns {Function} 停止刷新的函数
 */
export function applyAutoRefresh(chartInstance, fetchDataFn, interval = 30000) {
  if (!chartInstance || typeof fetchDataFn !== 'function') return () => {};

  let timer = null;

  const refresh = async () => {
    try {
      const result = await fetchDataFn();
      if (result?.success && chartInstance.updateData) {
        chartInstance.updateData(result.data);
      }
    } catch (err) {
      chartInstance.logger?.warn(`图表 "${chartInstance.id}" 自动刷新失败`, { error: err.message });
    }
  };

  timer = setInterval(refresh, interval);

  return () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
