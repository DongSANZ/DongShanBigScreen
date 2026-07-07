/**
 * 控制台日志输出
 * @module plugins/logger/transports/ConsoleTransport
 */
import PrettyFormatter from '../formatters/PrettyFormatter.js';

class ConsoleTransport {
  constructor(options = {}) {
    this.formatter = options.formatter ?? new PrettyFormatter();
  }

  /**
   * 写入日志到控制台
   * @param {object} entry
   */
  write(entry) {
    const formatted = this.formatter.format(entry);
    switch (entry.level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
      default:
        console.log(formatted);
    }
  }
}

export default ConsoleTransport;
