/**
 * 事件总线 —— 发布/订阅模式实现
 * @module core/EventBus
 */

class EventBus {
  constructor() {
    /** @type {Map<string, Set<{callback: Function, once: boolean}>>} */
    this._events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  on(event, callback) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    const handler = { callback, once: false };
    this._events.get(event).add(handler);
    return () => this.off(event, callback);
  }

  /**
   * 订阅事件（仅触发一次）
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} 取消订阅函数
   */
  once(event, callback) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    const handler = { callback, once: true };
    this._events.get(event).add(handler);
    return () => this.off(event, callback);
  }

  /**
   * 取消订阅
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    const handlers = this._events.get(event);
    if (!handlers) return;
    for (const h of handlers) {
      if (h.callback === callback) {
        handlers.delete(h);
        break;
      }
    }
    if (handlers.size === 0) {
      this._events.delete(event);
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    const handlers = this._events.get(event);
    if (!handlers) return;
    for (const h of handlers) {
      try {
        h.callback(data);
      } catch (err) {
        // 错误隔离：某个回调报错不影响其他回调
        this._logError(event, err);
      }
      if (h.once) {
        handlers.delete(h);
      }
    }
    if (handlers.size === 0) {
      this._events.delete(event);
    }
  }

  /**
   * 移除所有事件监听
   */
  clear() {
    this._events.clear();
  }

  /**
   * 获取事件订阅数量
   * @param {string} [event] - 可选，指定事件名
   * @returns {number}
   */
  count(event) {
    if (event) {
      return this._events.get(event)?.size ?? 0;
    }
    let total = 0;
    this._events.forEach((h) => (total += h.size));
    return total;
  }

  /** @private */
  _logError(event, err) {
    // 在没有 Logger 时降级到 console
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[EventBus] 事件 "${event}" 回调执行错误:`, err);
    }
  }
}

// 全局单例
const eventBus = new EventBus();

export { EventBus };
export default eventBus;
