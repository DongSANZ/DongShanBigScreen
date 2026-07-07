/**
 * 性能监控插件
 * @module plugins/monitor
 */

const MonitorPlugin = {
  name: 'monitor',

  install(_manager) {
    const logger = window.__logger;

    // 监控页面性能指标
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              logger?.info(`[Monitor] LCP: ${(entry.startTime / 1000).toFixed(2)}s`);
            }
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // 静默失败
      }
    }

    // 全局错误捕获
    window.addEventListener('error', (e) => {
      logger?.error('[Monitor] 全局错误', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      });
    });

    // Promise 未捕获错误
    window.addEventListener('unhandledrejection', (e) => {
      logger?.error('[Monitor] 未捕获的 Promise 错误', {
        reason: e.reason?.message ?? String(e.reason),
      });
    });

    logger?.info('监控插件安装完成');
  },
};

export default MonitorPlugin;
