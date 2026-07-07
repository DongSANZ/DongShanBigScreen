/**
 * 日期格式化工具
 * @module data/transformers/DateFormatter
 */

/**
 * 格式化日期
 * @param {Date|number|string} date - 日期
 * @param {string} [fmt='YYYY-MM-DD HH:mm:ss'] - 格式模板
 * @returns {string}
 */
export function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const pad = (n) => String(n).padStart(2, '0');

  const tokens = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };

  let result = fmt;
  for (const [key, val] of Object.entries(tokens)) {
    result = result.replace(key, val);
  }
  return result;
}

/**
 * 获取相对时间描述
 * @param {number} timestamp
 * @returns {string}
 */
export function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return `${seconds}秒前`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
  return `${Math.floor(seconds / 86400)}天前`;
}
