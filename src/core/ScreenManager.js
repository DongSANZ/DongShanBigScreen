/**
 * 大屏生命周期管理器
 * @module core/ScreenManager
 */
import eventBus from './EventBus.js';

/** 生命周期阶段 */
const LIFECYCLE = {
  INIT: 'init',
  BEFORE_LOAD: 'beforeLoad',
  LOAD_DATA: 'loadData',
  RENDER: 'render',
  AFTER_RENDER: 'afterRender',
  ERROR: 'error',
  DESTROY: 'destroy',
};

class ScreenManager {
  constructor(options = {}) {
    this.refreshInterval = options.refreshInterval ?? 30000;
    this._currentStage = null;
    this._refreshTimer = null;
    this._isLoading = false;
    this._error = null;
  }

  /** 当前生命周期阶段 */
  get stage() {
    return this._currentStage;
  }

  /** 是否正在加载 */
  get isLoading() {
    return this._isLoading;
  }

  /** 错误信息 */
  get error() {
    return this._error;
  }

  /**
   * 启动大屏生命周期
   */
  async start() {
    try {
      await this._transition(LIFECYCLE.INIT);
      await this._transition(LIFECYCLE.BEFORE_LOAD);
      await this._transition(LIFECYCLE.LOAD_DATA);
      await this._transition(LIFECYCLE.RENDER);
      await this._transition(LIFECYCLE.AFTER_RENDER);
      this._startAutoRefresh();
    } catch (err) {
      this._error = err;
      this._transition(LIFECYCLE.ERROR, { error: err });
    }
  }

  /**
   * 手动刷新数据
   */
  async refresh() {
    try {
      this._isLoading = true;
      eventBus.emit('screen:beforeRefresh');
      await this._transition(LIFECYCLE.LOAD_DATA);
      await this._transition(LIFECYCLE.RENDER);
      eventBus.emit('screen:afterRefresh');
    } catch (err) {
      this._error = err;
      eventBus.emit('screen:error', { error: err });
    } finally {
      this._isLoading = false;
    }
  }

  /**
   * 销毁大屏实例
   */
  destroy() {
    this._stopAutoRefresh();
    this._transition(LIFECYCLE.DESTROY);
    eventBus.clear();
  }

  /** 执行生命周期过渡 */
  async _transition(stage, extra = {}) {
    this._currentStage = stage;
    eventBus.emit(`lifecycle:${stage}`, { stage, ...extra });
  }

  /** 启动自动刷新 */
  _startAutoRefresh() {
    if (this.refreshInterval > 0) {
      this._refreshTimer = setInterval(() => {
        this.refresh();
      }, this.refreshInterval);
    }
  }

  /** 停止自动刷新 */
  _stopAutoRefresh() {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
  }
}

export { LIFECYCLE };
export default ScreenManager;
