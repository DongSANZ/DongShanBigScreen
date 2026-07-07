/**
 * 数据源抽象基类 —— 定义数据获取契约
 * @module data/DataSource
 */
import { getLogger } from '@/plugins/logger/Logger.js';

class DataSource {
  constructor() {
    this.logger = getLogger();
    /** @type {string} 数据源名称 */
    this.name = 'AbstractDataSource';
  }

  /**
   * 获取概览指标数据
   * @returns {Promise<{success: boolean, data: any, error?: string, timestamp: number}>}
   */
  async fetchOverview() {
    throw new Error('子类必须实现 fetchOverview()');
  }

  /**
   * 获取销售趋势数据
   * @returns {Promise<{success: boolean, data: any, error?: string, timestamp: number}>}
   */
  async fetchSalesData() {
    throw new Error('子类必须实现 fetchSalesData()');
  }

  /**
   * 获取渠道流量数据
   * @returns {Promise<{success: boolean, data: any, error?: string, timestamp: number}>}
   */
  async fetchTrafficData() {
    throw new Error('子类必须实现 fetchTrafficData()');
  }

  /**
   * 获取区域分布数据
   * @returns {Promise<{success: boolean, data: any, error?: string, timestamp: number}>}
   */
  async fetchRegionalData() {
    throw new Error('子类必须实现 fetchRegionalData()');
  }

  /**
   * 统一响应格式
   * @param {*} data
   * @returns {{success: boolean, data: *, timestamp: number}}
   */
  _success(data) {
    return { success: true, data, timestamp: Date.now() };
  }

  /**
   * 统一错误格式
   * @param {string} error
   * @returns {{success: boolean, data: null, error: string, timestamp: number}}
   */
  _error(error) {
    return { success: false, data: null, error, timestamp: Date.now() };
  }
}

export default DataSource;
