/**
 * 数字格式化工具
 * @module data/transformers/NumberFormatter
 */

/**
 * 格式化数字显示
 * @param {number} value - 原始数值
 * @param {object} [options]
 * @param {number} [options.decimals=0] - 保留小数位数
 * @param {boolean} [options.useUnit=true] - 是否使用万/亿单位
 * @returns {string}
 */
export function formatNumber(value, options = {}) {
  const { decimals = 0, useUnit = true } = options;
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (useUnit) {
    if (absValue >= 100000000) {
      return `${sign}${(absValue / 100000000).toFixed(decimals + 1)}亿`;
    }
    if (absValue >= 10000) {
      return `${sign}${(absValue / 10000).toFixed(decimals + 1)}万`;
    }
  }

  return `${sign}${absValue.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * 添加千分位分隔符
 * @param {number} value
 * @returns {string}
 */
export function withCommas(value) {
  return value.toLocaleString('zh-CN');
}

/**
 * 格式化为百分比
 * @param {number} value
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function asPercent(value, decimals = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * 缩短数字（1.2k, 3.5M）
 * @param {number} value
 * @returns {string}
 */
export function shorten(value) {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}
