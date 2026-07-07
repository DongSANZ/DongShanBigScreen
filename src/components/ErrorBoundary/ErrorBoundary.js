/**
 * 错误边界组件 —— 捕获并显示友好错误提示
 * @module components/ErrorBoundary/ErrorBoundary
 */
import { getLogger } from '@/plugins/logger/Logger.js';

/**
 * 包装函数，捕获执行中的错误
 * @param {Function} fn - 可能抛出错误的函数
 * @param {string} context - 错误上下文描述
 * @returns {*} 函数返回值，或错误时返回 null
 */
export function tryCatch(fn, context = 'unknown') {
  const logger = getLogger();
  try {
    return fn();
  } catch (err) {
    logger.error(`[ErrorBoundary] ${context}`, { error: err.message, stack: err.stack });
    return null;
  }
}

/**
 * 创建错误提示 UI
 * @param {string} message - 错误信息
 * @param {Function} [onRetry] - 重试回调
 * @returns {HTMLElement}
 */
export function createErrorUI(message, onRetry) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    gap: 16px;
    color: var(--color-text-dim);
    text-align: center;
    height: 100%;
  `;

  const icon = document.createElement('div');
  icon.style.cssText = `
    font-size: 40px;
    color: var(--color-danger);
    margin-bottom: 8px;
  `;
  icon.textContent = '⚠';

  const msg = document.createElement('div');
  msg.style.cssText = `
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    max-width: 280px;
    line-height: 1.6;
  `;
  msg.textContent = message ?? '数据加载失败，请检查网络连接后重试';

  if (onRetry) {
    const btn = document.createElement('button');
    btn.style.cssText = `
      padding: 8px 24px;
      background: transparent;
      border: 1px solid var(--color-accent);
      color: var(--color-accent);
      border-radius: var(--radius-base);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    `;
    btn.textContent = '重新尝试';
    btn.onmouseenter = () => {
      btn.style.background = 'rgba(0,212,255,0.1)';
    };
    btn.onmouseleave = () => {
      btn.style.background = 'transparent';
    };
    btn.addEventListener('click', onRetry);
    container.appendChild(btn);
  }

  container.appendChild(icon);
  container.appendChild(msg);
  return container;
}

export default { tryCatch, createErrorUI };
