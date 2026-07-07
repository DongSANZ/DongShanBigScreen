/**
 * 日志格式化器 —— 美化输出
 * @module plugins/logger/formatters/PrettyFormatter
 */

class PrettyFormatter {
  /**
   * 格式化日志条目
   * @param {object} entry
   * @param {string} entry.level - 日志级别
   * @param {string} entry.message - 日志消息
   * @param {object} [entry.meta] - 元数据
   * @param {number} entry.timestamp - 时间戳
   * @returns {string}
   */
  format(entry) {
    const time = this._formatTime(entry.timestamp);
    const level = entry.level.toUpperCase().padEnd(5);
    const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
    return `[${time}] [${level}] ${entry.message}${meta}`;
  }

  /** 格式化时间戳为 YYYY-MM-DD HH:mm:ss */
  _formatTime(timestamp) {
    const d = new Date(timestamp);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
}

export default PrettyFormatter;
