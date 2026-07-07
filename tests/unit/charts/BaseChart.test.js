import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock ECharts —— jsdom 不支持 Canvas，用 mock 替代
vi.mock('echarts', () => {
  const createMockChart = () => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(function () { this._disposed = true; }),
    isDisposed: vi.fn(function () { return !!this._disposed; }),
    on: vi.fn(),
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
    _disposed: false,
  });

  return {
    init: vi.fn(() => createMockChart()),
    graphic: {
      LinearGradient: vi.fn(),
    },
    getMap: vi.fn(() => { throw new Error('not registered'); }),
    registerMap: vi.fn(),
    default: {
      init: vi.fn(() => createMockChart()),
      graphic: { LinearGradient: vi.fn() },
    },
  };
});

import BaseChart from '@/charts/BaseChart.js';

describe('BaseChart', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('应该正确创建 ECharts 实例', () => {
    const chart = new BaseChart(container, { id: 'test-chart' });
    expect(chart.chart).toBeDefined();
    expect(chart.id).toBe('test-chart');
    expect(chart.chart.isDisposed()).toBe(false);
  });

  it('空容器应该抛出错误', () => {
    expect(() => new BaseChart(null)).toThrow('容器元素不能为空');
  });

  it('dispose 应该正确清理', () => {
    const chart = new BaseChart(container);
    chart.dispose();
    expect(chart.chart).toBeNull();
  });

  it('setOption 不应该在 disposed 后执行', () => {
    const chart = new BaseChart(container);
    chart.dispose();
    expect(() => chart.setOption({})).not.toThrow();
  });

  it('resize 应该正确响应', () => {
    const chart = new BaseChart(container);
    expect(() => chart.resize()).not.toThrow();
  });

  it('showLoading 和 hideLoading', () => {
    const chart = new BaseChart(container);
    expect(() => chart.showLoading()).not.toThrow();
    expect(() => chart.hideLoading()).not.toThrow();
  });
});
