/**
 * 统计指标卡片组件
 * @module components/StatCard/StatCard
 */

const ICONS = {
  sales: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="4" height="13" rx="1"/><rect x="9" y="3" width="4" height="17" rx="1"/><rect x="16" y="10" width="4" height="10" rx="1"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  conversion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
};

const THEMES = {
  blue: { accent: '#00d4ff', glow: 'rgba(0,212,255,0.2)', bg: 'rgba(0,212,255,0.06)' },
  green: { accent: '#00ff88', glow: 'rgba(0,255,136,0.2)', bg: 'rgba(0,255,136,0.06)' },
  orange: { accent: '#ffaa00', glow: 'rgba(255,170,0,0.2)', bg: 'rgba(255,170,0,0.06)' },
  purple: { accent: '#a855f7', glow: 'rgba(168,85,247,0.2)', bg: 'rgba(168,85,247,0.06)' },
};

/**
 * 创建 StatCard 组件
 * @param {object} config
 * @param {string} config.label - 标签文字
 * @param {number} config.value - 数值
 * @param {string} config.unit - 单位
 * @param {number} config.trend - 趋势百分比（正数为涨，负数为跌）
 * @param {string} config.icon - 图标 key
 * @param {string} [config.theme='blue'] - 颜色主题
 * @returns {HTMLElement}
 */
export function createStatCard(config) {
  const { label, value, unit, trend, icon, theme = 'blue' } = config;
  const t = THEMES[theme] ?? THEMES.blue;
  const trendUp = trend >= 0;

  const card = document.createElement('div');
  card.className = 'stat-card panel-glow';
  card.style.cssText = `
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: default;
    transition: all var(--transition-base);
    min-width: 0;
  `;

  // 图标区
  const iconWrap = document.createElement('div');
  iconWrap.style.cssText = `
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: ${t.bg};
    border: 1px solid ${t.glow};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${t.accent};
  `;
  iconWrap.innerHTML = ICONS[icon] ?? ICONS.sales;

  // 内容区
  const content = document.createElement('div');
  content.style.cssText = 'flex:1; min-width: 0;';

  const labelEl = document.createElement('div');
  labelEl.style.cssText = `
    font-size: var(--font-size-sm);
    color: var(--color-text-dim);
    margin-bottom: 6px;
  `;
  labelEl.textContent = label;

  // 数值行
  const valueRow = document.createElement('div');
  valueRow.style.cssText = 'display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px;';

  const valueEl = document.createElement('span');
  valueEl.className = 'stat-value';
  valueEl.style.cssText = `
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    font-family: var(--font-family-mono);
  `;
  valueEl.textContent = '0';
  valueEl.dataset.target = value;

  const unitEl = document.createElement('span');
  unitEl.style.cssText = `
    font-size: var(--font-size-sm);
    color: var(--color-text-dim);
  `;
  unitEl.textContent = unit;

  valueRow.appendChild(valueEl);
  valueRow.appendChild(unitEl);

  // 趋势行
  const trendEl = document.createElement('div');
  trendEl.style.cssText = `
    font-size: var(--font-size-xs);
    color: ${trendUp ? 'var(--color-success)' : 'var(--color-danger)'};
    display: flex;
    align-items: center;
    gap: 3px;
  `;
  trendEl.innerHTML = `${trendUp ? '↑' : '↓'} ${Math.abs(trend).toFixed(1)}%`;

  content.appendChild(labelEl);
  content.appendChild(valueRow);
  content.appendChild(trendEl);

  card.appendChild(iconWrap);
  card.appendChild(content);

  // 启动数字滚动动画
  _animateNumber(valueEl, value);

  // Hover 发光增强
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 4px 28px ${t.glow}, 0 0 40px ${t.glow}`;
    card.style.borderColor = t.accent;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
    card.style.borderColor = '';
  });

  return card;
}

/**
 * 数字滚动动画
 * @param {HTMLElement} el
 * @param {number} target
 */
function _animateNumber(el, target) {
  const duration = 800;
  const start = performance.now();
  const from = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = from + (target - from) * eased;

    if (Number.isInteger(target)) {
      el.textContent = Math.round(current).toLocaleString('zh-CN');
    } else {
      el.textContent = current.toFixed(2);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export { THEMES };
export default createStatCard;
