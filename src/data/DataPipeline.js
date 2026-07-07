/**
 * 数据处理管道 —— 链式数据转换
 * @module data/DataPipeline
 */

class DataPipeline {
  constructor() {
    /** @type {Function[]} */
    this._processors = [];
  }

  /**
   * 添加处理器
   * @param {Function} processor - 处理函数 (data) => transformedData
   * @returns {DataPipeline}
   */
  pipe(processor) {
    if (typeof processor !== 'function') {
      throw new Error('[DataPipeline] 处理器必须是函数');
    }
    this._processors.push(processor);
    return this;
  }

  /**
   * 执行管道处理
   * @param {*} initialData - 初始数据
   * @returns {*}
   */
  async execute(initialData) {
    let result = initialData;
    for (const processor of this._processors) {
      result = await processor(result);
    }
    return result;
  }

  /** 清空管道 */
  clear() {
    this._processors = [];
  }
}

export default DataPipeline;
