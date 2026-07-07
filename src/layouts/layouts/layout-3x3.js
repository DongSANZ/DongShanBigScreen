/**
 * 3×3 大屏布局配置
 *
 * 布局示意（1920×1080，80px 标题栏，15px 间距）：
 * ┌──────────────────────────────────────────────┐
 * │              标 题 栏 (独立)                  │
 * ├──────────┬──────────┬──────────┬─────────────┤
 * │  Stat 1  │  Stat 2  │  Stat 3  │  Stat 4     │  row 0
 * ├──────────┼──────────┼──────────┼─────────────┤
 * │          │          │          │             │
 * │  Sales   │   Map    │ Traffic  │  Radar      │  row 1+2
 * │          │          │          │             │
 * └──────────┴──────────┴──────────┴─────────────┘
 *
 * @module layouts/layouts/layout-3x3
 */

const HEADER_HEIGHT = 80;
const PANEL_GAP = 15;
const SCREEN_W = 1920;
const SCREEN_H = 1080;

/**
 * 获取 3×3 布局配置
 * @returns {object}
 */
export function getLayoutConfig() {
  const contentTop = HEADER_HEIGHT + PANEL_GAP;
  // 第一行（概览卡片行）高度
  const overviewRowH = 130;
  // 剩下区域
  const chartAreaTop = contentTop + overviewRowH + PANEL_GAP;
  const chartAreaH = SCREEN_H - chartAreaTop - PANEL_GAP;

  // 列划分
  const colW1 = 570;  // 左列宽
  const colW2 = 750;  // 中列宽（地图）
  const colW3 = 560;  // 右列宽

  return {
    /** 标题栏 */
    header: {
      x: 0,
      y: 0,
      w: SCREEN_W,
      h: HEADER_HEIGHT,
    },
    /** 概览卡片（第一行，4等分） */
    overviewRow: {
      x: PANEL_GAP,
      y: contentTop,
      totalW: SCREEN_W - PANEL_GAP * 2,
      h: overviewRowH,
      count: 4,
    },
    /** 第二行左 - 销售趋势 */
    salesChart: {
      x: PANEL_GAP,
      y: chartAreaTop,
      w: colW1,
      h: chartAreaH,
    },
    /** 第二行中 - 地图 */
    mapChart: {
      x: PANEL_GAP * 2 + colW1,
      y: chartAreaTop,
      w: colW2,
      h: chartAreaH,
    },
    /** 第二行右上方 - 流量饼图 */
    trafficPie: {
      x: PANEL_GAP * 3 + colW1 + colW2,
      y: chartAreaTop,
      w: colW3,
      h: chartAreaH / 2 - PANEL_GAP / 2,
    },
    /** 第二行右下方 - 雷达图 */
    radarChart: {
      x: PANEL_GAP * 3 + colW1 + colW2,
      y: chartAreaTop + chartAreaH / 2 + PANEL_GAP / 2,
      w: colW3,
      h: chartAreaH / 2 - PANEL_GAP / 2,
    },
  };
}

export { HEADER_HEIGHT, PANEL_GAP, SCREEN_W, SCREEN_H };
export default getLayoutConfig;
