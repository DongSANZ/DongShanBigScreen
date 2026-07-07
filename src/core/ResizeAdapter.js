/**
 * 屏幕自适应适配器 —— 使用 transform scale 等比缩放
 * @module core/ResizeAdapter
 */
import eventBus from './EventBus.js';

class ResizeAdapter {
  /**
   * @param {object} options
   * @param {number} options.designWidth - 设计稿宽度，默认 1920
   * @param {number} options.designHeight - 设计稿高度，默认 1080
   * @param {HTMLElement} options.container - 需要缩放的容器元素
   */
  constructor(options = {}) {
    this.designWidth = options.designWidth ?? 1920;
    this.designHeight = options.designHeight ?? 1080;
    this.container = options.container ?? document.getElementById('app');

    if (!this.container) {
      throw new Error('[ResizeAdapter] 容器元素不存在');
    }

    this._onResize = this._onResize.bind(this);
    this._debounceTimer = null;
  }

  /** 启动自适应监听 */
  start() {
    this.resize();
    window.addEventListener('resize', this._onResize);
  }

  /** 停止监听 */
  stop() {
    window.removeEventListener('resize', this._onResize);
  }

  /** 立即执行缩放 */
  resize() {
    if (!this.container) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算缩放比例（取较小的比例，保证全部可见）
    const scaleX = windowWidth / this.designWidth;
    const scaleY = windowHeight / this.designHeight;
    const scale = Math.min(scaleX, scaleY);

    // 居中偏移
    const offsetX = (windowWidth - this.designWidth * scale) / 2;
    const offsetY = (windowHeight - this.designHeight * scale) / 2;

    this.container.style.width = `${this.designWidth}px`;
    this.container.style.height = `${this.designHeight}px`;
    this.container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    this.container.style.transformOrigin = 'left top';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';

    eventBus.emit('screen:resize', {
      windowWidth,
      windowHeight,
      scale,
      offsetX,
      offsetY,
    });
  }

  /** 防抖处理 */
  _onResize() {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this.resize(), 150);
  }
}

export default ResizeAdapter;
