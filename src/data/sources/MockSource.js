/**
 * Mock 数据源 —— 模拟网络请求
 * @module data/sources/MockSource
 */
import DataSource from '../DataSource.js';
import { overviewData, salesData, trafficData, regionalData } from '@/mock/index.js';

class MockSource extends DataSource {
  constructor() {
    super();
    this.name = 'MockSource';
    /** 模拟延迟范围 [min, max] 毫秒 */
    this.delayMin = 300;
    this.delayMax = 800;
    /** 模拟错误概率 */
    this.errorRate = 0;
  }

  async fetchOverview() {
    return this._simulate(() => overviewData);
  }

  async fetchSalesData() {
    return this._simulate(() => salesData);
  }

  async fetchTrafficData() {
    return this._simulate(() => trafficData);
  }

  async fetchRegionalData() {
    return this._simulate(() => regionalData);
  }

  /**
   * 模拟异步请求（延迟 + 随机错误）
   * @param {Function} dataFn - 返回数据的函数
   * @returns {Promise<{success: boolean, data: *, timestamp: number}>}
   */
  async _simulate(dataFn) {
    return new Promise((resolve) => {
      const delay = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
      setTimeout(() => {
        if (Math.random() < this.errorRate) {
          resolve(this._error('模拟网络错误，请重试'));
        } else {
          resolve(this._success(dataFn()));
        }
      }, delay);
    });
  }
}

export default MockSource;
