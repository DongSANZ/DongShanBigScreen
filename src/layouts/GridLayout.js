/**
 * 网格布局引擎 —— 根据布局配置计算单元格位置
 * @module layouts/GridLayout
 */

class GridLayout {
  /**
   * @param {object} config - 布局配置
   * @param {number} config.cols - 列数
   * @param {number} config.rows - 行数
   * @param {number} config.gap - 间距（像素）
   * @param {number} config.width - 总宽度
   * @param {number} config.height - 总高度
   * @param {Array<{row, col, rowSpan?, colSpan?}>} config.cells - 单元格配置
   * @param {HTMLElement} config.container - 容器元素
   */
  constructor(config) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.gap = config.gap ?? 16;
    this.width = config.width;
    this.height = config.height;
    this.cells = config.cells ?? [];
    this.container = config.container;
  }

  /**
   * 计算某个单元格的绝对像素位置和尺寸
   * @param {number} row - 起始行（从 0 开始）
   * @param {number} col - 起始列（从 0 开始）
   * @param {number} [rowSpan=1] - 行跨度
   * @param {number} [colSpan=1] - 列跨度
   * @returns {{ x: number, y: number, w: number, h: number }}
   */
  getCellRect(row, col, rowSpan = 1, colSpan = 1) {
    const cellW = (this.width - this.gap * (this.cols + 1)) / this.cols;
    const cellH = (this.height - this.gap * (this.rows + 1)) / this.rows;

    return {
      x: this.gap + col * (cellW + this.gap),
      y: this.gap + row * (cellH + this.gap),
      w: cellW * colSpan + this.gap * (colSpan - 1),
      h: cellH * rowSpan + this.gap * (rowSpan - 1),
    };
  }

  /**
   * 放置元素到指定单元格
   * @param {HTMLElement} el - 要放置的元素
   * @param {number} row
   * @param {number} col
   * @param {number} [rowSpan=1]
   * @param {number} [colSpan=1]
   */
  place(el, row, col, rowSpan = 1, colSpan = 1) {
    const rect = this.getCellRect(row, col, rowSpan, colSpan);
    el.style.position = 'absolute';
    el.style.left = `${rect.x}px`;
    el.style.top = `${rect.y}px`;
    el.style.width = `${rect.w}px`;
    el.style.height = `${rect.h}px`;
    this.container.appendChild(el);
  }
}

export default GridLayout;
