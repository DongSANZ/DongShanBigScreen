/**
 * 加载遮罩组件 —— 科技感旋转加载动画
 * @module components/LoadingOverlay/LoadingOverlay
 */

/**
 * 创建加载遮罩
 * @param {string} [text='数据加载中...'] - 加载文字
 * @returns {HTMLElement}
 */
export function createLoadingOverlay(text = '数据加载中...') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 14, 46, 0.92);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  `;

  // 科技感六边形旋转动画
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 60px;
    height: 60px;
    position: relative;
    margin-bottom: 24px;
  `;

  // 外圈旋转
  const outerRing = document.createElement('div');
  outerRing.style.cssText = `
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-top-color: var(--color-accent);
    border-right-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  // 内圈反向旋转
  const innerRing = document.createElement('div');
  innerRing.style.cssText = `
    position: absolute;
    inset: 10px;
    border: 2px solid transparent;
    border-bottom-color: var(--color-purple);
    border-left-color: var(--color-purple);
    border-radius: 50%;
    animation: spin 1.5s linear infinite reverse;
  `;

  // 中心六边形
  const hex = document.createElement('div');
  hex.style.cssText = `
    position: absolute;
    inset: 18px;
    background: var(--color-accent);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    animation: pulse 1.5s ease-in-out infinite;
  `;

  spinner.appendChild(outerRing);
  spinner.appendChild(innerRing);
  spinner.appendChild(hex);

  // 文字
  const label = document.createElement('div');
  label.style.cssText = `
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
    letter-spacing: 2px;
    animation: pulse 2s ease-in-out infinite;
  `;
  label.textContent = text;

  // 进度点动画
  const dots = document.createElement('span');
  dots.style.cssText = 'display: inline-block;';
  dots.textContent = '';
  let dotCount = 0;
  setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    dots.textContent = '.'.repeat(dotCount);
  }, 400);

  label.appendChild(dots);
  overlay.appendChild(spinner);
  overlay.appendChild(label);

  return overlay;
}

/**
 * 淡出并移除加载遮罩
 * @param {HTMLElement} overlay
 * @returns {Promise<void>}
 */
export function hideLoadingOverlay(overlay) {
  return new Promise((resolve) => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      resolve();
    }, 500);
  });
}

export default createLoadingOverlay;
