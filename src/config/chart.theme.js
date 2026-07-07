/**
 * ECharts 自定义主题配置 —— 深色科技风
 * @module config/chart.theme
 */

/** 主色调色板 */
const COLORS = {
  primary: '#00d4ff',
  success: '#00ff88',
  warning: '#ffaa00',
  danger: '#ff6b6b',
  purple: '#a855f7',
  cyan: '#22d3ee',
  blue: '#3b82f6',
  text: '#a3c6ff',
  textDim: '#6b7fa8',
};

/** ECharts 主题配置 */
const chartTheme = {
  color: [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.purple,
    COLORS.cyan,
    COLORS.blue,
  ],

  backgroundColor: 'transparent',

  textStyle: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
  },

  title: {
    textStyle: { color: '#e0e6ff', fontSize: 16, fontWeight: 'bold' },
    subtextStyle: { color: COLORS.textDim, fontSize: 12 },
  },

  legend: {
    textStyle: { color: COLORS.text, fontSize: 12 },
    pageTextStyle: { color: COLORS.text },
  },

  tooltip: {
    axisPointer: {
      lineStyle: { color: 'rgba(0,212,255,0.3)', width: 1 },
      crossStyle: { color: 'rgba(0,212,255,0.3)', width: 1 },
    },
  },

  grid: {
    left: 50,
    right: 30,
    top: 40,
    bottom: 30,
    containLabel: true,
  },

  xAxis: {
    axisLine: { lineStyle: { color: 'rgba(163,198,255,0.2)' } },
    axisTick: { lineStyle: { color: 'rgba(163,198,255,0.2)' } },
    splitLine: { lineStyle: { color: 'rgba(163,198,255,0.08)' } },
    axisLabel: { color: COLORS.textDim, fontSize: 11 },
  },

  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(163,198,255,0.1)' } },
    axisLabel: { color: COLORS.textDim, fontSize: 11 },
  },

  /** 颜色常量引用 */
  COLORS,
};

export { COLORS };
export default chartTheme;
