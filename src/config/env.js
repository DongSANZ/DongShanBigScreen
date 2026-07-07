/**
 * 环境判断工具
 * @module config/env
 */

const MODE = import.meta.env.MODE;

const env = {
  /** 当前构建模式 */
  mode: MODE,

  /** 是否为开发环境 */
  isDev: MODE === 'development',

  /** 是否为生产环境 */
  isProd: MODE === 'production',

  /** 是否为测试环境 */
  isTest: MODE === 'test',

  /**
   * 获取环境变量
   * @param {string} key
   * @param {*} fallback
   * @returns {*}
   */
  get(key, fallback = undefined) {
    return import.meta.env[key] ?? fallback;
  },
};

export default env;
