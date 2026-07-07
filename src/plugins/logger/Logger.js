/**
 * 日志核心类
 * @module plugins/logger/Logger
 */

/** 日志级别权重 */
const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  /**
   * @param {object} options
   * @param {string} [options.level='info'] - 最低输出级别
   * @param {Array} [options.transports=[]] - 日志输出目标
   */
  constructor(options = {}) {
    this.level = options.level ?? 'info';
    this.transports = options.transports ?? [];
  }

  /**
   * 添加输出目标
   * @param {object} transport
   */
  addTransport(transport) {
    this.transports.push(transport);
  }

  /** DEBUG 级别日志 */
  debug(message, meta = {}) {
    this._log('debug', message, meta);
  }

  /** INFO 级别日志 */
  info(message, meta = {}) {
    this._log('info', message, meta);
  }

  /** WARN 级别日志 */
  warn(message, meta = {}) {
    this._log('warn', message, meta);
  }

  /** ERROR 级别日志 */
  error(message, meta = {}) {
    this._log('error', message, meta);
  }

  /** 内部日志写入 */
  _log(level, message, meta) {
    if (LEVELS[level] < LEVELS[this.level]) return;

    const entry = {
      level,
      message,
      meta,
      timestamp: Date.now(),
    };

    this.transports.forEach((transport) => {
      try {
        transport.write(entry);
      } catch (err) {
        // Transport 写入失败不影响其他 Transport
        console.warn(`[Logger] Transport 写入失败:`, err);
      }
    });
  }
}

/** 全局 Logger 单例 */
let globalLogger = null;

/**
 * 获取或创建全局 Logger 实例
 * @param {object} [options]
 * @returns {Logger}
 */
function getLogger(options) {
  if (options) {
    globalLogger = new Logger(options);
  }
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}

export { Logger, getLogger, LEVELS };
export default Logger;
