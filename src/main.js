/**
 * 东山数据大屏 · 应用入口
 * @module main
 */
import './styles/global.css';
import { getLogger } from '@/plugins/logger/Logger.js';
import ConsoleTransport from '@/plugins/logger/transports/ConsoleTransport.js';
import MemoryTransport from '@/plugins/logger/transports/MemoryTransport.js';
import PluginManager from '@/core/PluginManager.js';
import LoggerPlugin from '@/plugins/logger/index.js';
import MonitorPlugin from '@/plugins/monitor/index.js';
import ResizeAdapter from '@/core/ResizeAdapter.js';
import App from '@/App.js';

// ============================================================
// 1. 初始化全局日志系统
// ============================================================
const logger = getLogger({
  level: 'debug',
  transports: [
    new ConsoleTransport(),
    new MemoryTransport({ maxSize: 500 }),
  ],
});

logger.info('═══════════════════════════════════');
logger.info('  东山数据大屏 启动中...');
logger.info('  DongShan Big Screen v1.0.0');
logger.info('═══════════════════════════════════');

// ============================================================
// 2. 注册插件
// ============================================================
const pluginManager = new PluginManager();
pluginManager.use(LoggerPlugin);
pluginManager.use(MonitorPlugin);

logger.info(`已注册插件: ${pluginManager.listPlugins().join(', ')}`);

// ============================================================
// 3. 启动屏幕自适应
// ============================================================
const resizeAdapter = new ResizeAdapter({
  designWidth: 1920,
  designHeight: 1080,
  container: document.getElementById('app'),
});
resizeAdapter.start();
logger.info('屏幕自适应已启动');

// ============================================================
// 4. 启动大屏应用
// ============================================================
const app = new App();
app.start().then(() => {
  logger.info('✅ 东山数据大屏启动完成！');
}).catch((err) => {
  logger.error('❌ 大屏启动失败', { error: err.message, stack: err.stack });
});

// ============================================================
// 5. 全局导出（方便调试）
// ============================================================
window.__app = app;
window.__logger = logger;
window.__pluginManager = pluginManager;
