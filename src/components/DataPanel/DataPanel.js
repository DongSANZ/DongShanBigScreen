/**
 * 数据面板组件 —— 标题栏 + 图表容器，带发光装饰边框
 * @module components/DataPanel/DataPanel
 */

/**
 * 创建数据面板容器
 * @param {object} config
 * @param {string} config.title - 面板标题
 * @param {string} config.id - 面板 ID
 * @param {object} [config.style] - 额外样式
 * @returns {{ container: HTMLElement, chartArea: HTMLElement }}
 */
export function createDataPanel(config) {
  const { title, id, style = {} } = config;

  const container = document.createElement('div');
  container.className = 'panel-glow data-panel';
  container.id = id;
  container.style.cssText = `
    padding: var(--panel-padding);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ${typeof style === 'string' ? style : ''}
  `;
  // 额外样式对象
  if (typeof style === 'object') {
    Object.assign(container.style, style);
  }

  // 标题栏
  const titleBar = document.createElement('div');
  titleBar.className = 'panel-title';
  titleBar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  `;

  const titleText = document.createElement('span');
  titleText.textContent = title;

  const timeLabel = document.createElement('span');
  timeLabel.className = 'panel-time';
  timeLabel.style.cssText = `
    font-size: var(--font-size-xs);
    color: var(--color-text-dim);
  `;
  timeLabel.textContent = _formatNow();

  titleBar.appendChild(titleText);
  titleBar.appendChild(timeLabel);

  // 图表容器区
  const chartArea = document.createElement('div');
  chartArea.className = 'data-panel-chart';
  chartArea.style.cssText = 'flex:1; min-height: 0; position: relative;';

  container.appendChild(titleBar);
  container.appendChild(chartArea);

  return { container, chartArea, timeLabel };
}

function _formatNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `更新 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default createDataPanel;
