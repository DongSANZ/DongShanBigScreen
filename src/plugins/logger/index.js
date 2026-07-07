/**
 * 日志插件 —— 向 PluginManager 注册
 * @module plugins/logger
 */
import Logger from './Logger.js';
import ConsoleTransport from './transports/ConsoleTransport.js';
import MemoryTransport from './transports/MemoryTransport.js';

const LoggerPlugin = {
  name: 'logger',

  /**
   * @param {import('../../core/PluginManager.js').default} manager
   */
  install(_manager) {
    const memoryTransport = new MemoryTransport({ maxSize: 500 });
    const logger = new Logger({
      level: 'debug',
      transports: [
        new ConsoleTransport(),
        memoryTransport,
      ],
    });

    // 挂载到 window，方便全局访问
    window.__logger = logger;
    window.__memoryTransport = memoryTransport;

    logger.info('日志插件安装完成', { transports: ['Console', 'Memory'] });
  },
};

export default LoggerPlugin;
export { Logger, ConsoleTransport, MemoryTransport };
