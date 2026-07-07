/**
 * 内存日志存储 —— 保留最近 N 条日志
 * @module plugins/logger/transports/MemoryTransport
 */

class MemoryTransport {
  constructor(options = {}) {
    /** 最大存储条数 */
    this.maxSize = options.maxSize ?? 500;
    /** @type {object[]} */
    this._logs = [];
  }

  /**
   * 写入日志到内存
   * @param {object} entry
   */
  write(entry) {
    this._logs.push({ ...entry });
    if (this._logs.length > this.maxSize) {
      this._logs.shift();
    }
  }

  /**
   * 获取所有存储的日志
   * @param {object} [filter] - 过滤条件
   * @param {string} [filter.level] - 按级别过滤
   * @returns {object[]}
   */
  getLogs(filter = {}) {
    let logs = [...this._logs];
    if (filter.level) {
      logs = logs.filter((l) => l.level === filter.level);
    }
    return logs;
  }

  /** 清空日志 */
  clear() {
    this._logs = [];
  }
}

export default MemoryTransport;
