/**
 * API 数据源 —— 真实接口请求（预留）
 * @module data/sources/ApiSource
 */
import DataSource from '../DataSource.js';

class ApiSource extends DataSource {
  constructor(options = {}) {
    super();
    this.name = 'ApiSource';
    /** API 基础路径 */
    this.baseURL = options.baseURL ?? '/api';
    /** 请求超时时间（毫秒） */
    this.timeout = options.timeout ?? 10000;
    /** 重试次数 */
    this.retryCount = options.retryCount ?? 2;
  }

  async fetchOverview() {
    return this._request('/overview');
  }

  async fetchSalesData() {
    return this._request('/sales');
  }

  async fetchTrafficData() {
    return this._request('/traffic');
  }

  async fetchRegionalData() {
    return this._request('/regional');
  }

  /**
   * 发起 HTTP 请求
   * @param {string} path
   * @param {object} [options]
   * @returns {Promise<{success: boolean, data: *, timestamp: number}>}
   */
  async _request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    let lastError = null;

    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return this._success(data);
      } catch (err) {
        lastError = err;
        this.logger.warn(`API 请求失败 (第${attempt + 1}次)`, { url, error: err.message });
        if (attempt < this.retryCount) {
          await this._delay(1000 * (attempt + 1)); // 指数退避
        }
      }
    }

    return this._error(lastError?.message ?? '未知错误');
  }

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default ApiSource;
