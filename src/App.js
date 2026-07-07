/**
 * 大屏应用主控制器
 * @module App
 */
import { getLogger } from '@/plugins/logger/Logger.js';
import MockSource from '@/data/sources/MockSource.js';
import ChartFactory from '@/charts/ChartFactory.js';
import { createStatCard } from '@/components/StatCard/StatCard.js';
import { createDataPanel } from '@/components/DataPanel/DataPanel.js';
import { createLoadingOverlay, hideLoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay.js';
import { createErrorUI } from '@/components/ErrorBoundary/ErrorBoundary.js';
import { getLayoutConfig } from '@/layouts/layouts/layout-3x3.js';
import { COLORS } from '@/config/chart.theme.js';

class App {
  constructor() {
    this.logger = getLogger();
    this.dataSource = new MockSource();
    this.layout = getLayoutConfig();
    this.charts = {};
    this.refreshTimer = null;
    this.refreshInterval = 30000;
  }

  /**
   * 启动应用
   */
  async start() {
    const appEl = document.getElementById('app');
    if (!appEl) {
      this.logger.error('根容器 #app 不存在');
      return;
    }

    // 显示加载动画
    const loading = createLoadingOverlay('东山数据大屏加载中');
    appEl.appendChild(loading);

    try {
      // 并行加载所有数据
      const [overview, sales, traffic, regional] = await Promise.all([
        this.dataSource.fetchOverview(),
        this.dataSource.fetchSalesData(),
        this.dataSource.fetchTrafficData(),
        this.dataSource.fetchRegionalData(),
      ]);

      if (!overview.success) throw new Error(overview.error);

      // 渲染标题栏
      this._renderHeader(appEl);

      // 渲染概览指标行
      this._renderOverview(appEl, overview.data);

      // 渲染图表区域
      this._renderSalesChart(appEl, sales.data);
      this._renderMapChart(appEl, regional.data);
      this._renderTrafficPie(appEl, traffic.data);
      this._renderRadarChart(appEl, regional.data);

      // 启动自动刷新
      this._startAutoRefresh(appEl);

      this.logger.info('大屏应用渲染完成');
    } catch (err) {
      this.logger.error('大屏应用启动失败', { error: err.message });
      const errorUI = createErrorUI(err.message, () => this.start());
      appEl.appendChild(errorUI);
    } finally {
      await hideLoadingOverlay(loading);
    }
  }

  /** 渲染标题栏 */
  _renderHeader(appEl) {
    const header = document.createElement('div');
    header.id = 'header-bar';
    header.style.cssText = `
      position: absolute;
      left: ${this.layout.header.x}px;
      top: ${this.layout.header.y}px;
      width: ${this.layout.header.w}px;
      height: ${this.layout.header.h}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
    `;

    // 主标题
    const title = document.createElement('h1');
    title.style.cssText = `
      font-size: var(--font-size-title);
      font-weight: 700;
      color: transparent;
      background: linear-gradient(180deg, #e0e6ff 0%, #a3c6ff 50%, #00d4ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      letter-spacing: 8px;
      margin-bottom: 8px;
      text-shadow: none;
      filter: drop-shadow(0 0 20px rgba(0,212,255,0.4));
    `;
    title.textContent = '东山数据大屏';

    // 副标题
    const subtitle = document.createElement('div');
    subtitle.style.cssText = `
      font-size: var(--font-size-sm);
      color: var(--color-text-dim);
      letter-spacing: 6px;
      margin-bottom: 10px;
    `;
    subtitle.textContent = 'DongShan · Big Screen';

    // 发光装饰线
    const glowLine = document.createElement('div');
    glowLine.className = 'glow-line';
    glowLine.style.cssText = 'width: 400px;';

    // 右侧时间
    const clock = document.createElement('div');
    clock.id = 'header-clock';
    clock.style.cssText = `
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--font-size-md);
      color: var(--color-text-secondary);
      font-family: var(--font-family-mono);
      letter-spacing: 2px;
    `;
    this._updateClock(clock);
    setInterval(() => this._updateClock(clock), 1000);

    header.appendChild(title);
    header.appendChild(subtitle);
    header.appendChild(glowLine);
    header.appendChild(clock);
    appEl.appendChild(header);
  }

  /** 更新实时时钟 */
  _updateClock(el) {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    el.textContent = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  /** 渲染概览指标行（4 个 StatCard） */
  _renderOverview(appEl, data) {
    const { overviewRow } = this.layout;
    const cardW = (overviewRow.totalW - 16 * 3) / 4;

    const cards = [
      { ...data.totalSales, label: '销售总额', theme: 'blue', icon: 'sales' },
      { ...data.totalOrders, label: '订单总量', theme: 'green', icon: 'orders' },
      { ...data.activeUsers, label: '活跃用户', theme: 'orange', icon: 'users' },
      { ...data.conversionRate, label: '转化率', theme: 'purple', icon: 'conversion' },
    ];

    cards.forEach((card, i) => {
      const el = createStatCard(card);
      el.style.position = 'absolute';
      el.style.left = `${overviewRow.x + i * (cardW + 16)}px`;
      el.style.top = `${overviewRow.y}px`;
      el.style.width = `${cardW}px`;
      el.style.height = `${overviewRow.h}px`;
      appEl.appendChild(el);
    });
  }

  /** 渲染月度销售趋势图 */
  _renderSalesChart(appEl, data) {
    const { salesChart } = this.layout;
    const { container, chartArea } = createDataPanel({
      title: '月度销售趋势',
      id: 'panel-sales',
    });
    container.style.position = 'absolute';
    container.style.left = `${salesChart.x}px`;
    container.style.top = `${salesChart.y}px`;
    container.style.width = `${salesChart.w}px`;
    container.style.height = `${salesChart.h}px`;
    appEl.appendChild(container);

    const chart = ChartFactory.create('line', chartArea, { id: 'chart-sales' });
    chart.render({
      categories: data.months,
      series: [
        { name: '销售额', data: data.sales, color: COLORS.primary, areaStyle: null },
        { name: '目标值', data: data.target, color: COLORS.warning, type: 'line',
          areaStyle: null, lineStyle: { type: 'dashed', width: 1.5 } },
      ],
    });
    this.charts.sales = chart;
  }

  /** 渲染中国地图 */
  _renderMapChart(appEl, data) {
    const { mapChart } = this.layout;
    const { container, chartArea } = createDataPanel({
      title: '全国销售分布',
      id: 'panel-map',
    });
    container.style.position = 'absolute';
    container.style.left = `${mapChart.x}px`;
    container.style.top = `${mapChart.y}px`;
    container.style.width = `${mapChart.w}px`;
    container.style.height = `${mapChart.h}px`;
    appEl.appendChild(container);

    const chart = ChartFactory.create('map', chartArea, { id: 'chart-map' });

    // 为地图数据添加经纬度
    const lngLatMap = {
      '广东': [113.28, 23.12], '江苏': [118.78, 32.04], '浙江': [120.15, 30.28],
      '山东': [117.0, 36.65], '北京': [116.40, 39.90], '上海': [121.47, 31.23],
      '四川': [104.06, 30.67], '湖北': [114.29, 30.58], '河南': [113.65, 34.76],
      '福建': [119.30, 26.08],
    };

    const items = data.list.map((item) => ({
      ...item,
      lng: lngLatMap[item.province]?.[0] ?? 116,
      lat: lngLatMap[item.province]?.[1] ?? 36,
    }));

    chart.render({ items });
    this.charts.map = chart;
  }

  /** 渲染渠道流量占比环形图 */
  _renderTrafficPie(appEl, data) {
    const { trafficPie } = this.layout;
    const { container, chartArea } = createDataPanel({
      title: '渠道流量占比',
      id: 'panel-traffic',
    });
    container.style.position = 'absolute';
    container.style.left = `${trafficPie.x}px`;
    container.style.top = `${trafficPie.y}px`;
    container.style.width = `${trafficPie.w}px`;
    container.style.height = `${trafficPie.h}px`;
    appEl.appendChild(container);

    const chart = ChartFactory.create('pie', chartArea, { id: 'chart-pie' });
    chart.render({
      seriesName: '流量来源',
      config: { radius: ['45%', '70%'] },
      items: data.channels.map((name, i) => ({ name, value: data.values[i] })),
    });
    this.charts.pie = chart;
  }

  /** 渲染各区域指标雷达图 */
  _renderRadarChart(appEl, data) {
    const { radarChart } = this.layout;
    const { container, chartArea } = createDataPanel({
      title: '区域能力雷达',
      id: 'panel-radar',
    });
    container.style.position = 'absolute';
    container.style.left = `${radarChart.x}px`;
    container.style.top = `${radarChart.y}px`;
    container.style.width = `${radarChart.w}px`;
    container.style.height = `${radarChart.h}px`;
    appEl.appendChild(container);

    const indicators = [
      { name: '销售额', max: 100 },
      { name: '服务质量', max: 100 },
      { name: '增长率', max: 100 },
      { name: '满意度', max: 100 },
      { name: '覆盖率', max: 100 },
    ];

    const chart = ChartFactory.create('radar', chartArea, { id: 'chart-radar' });
    chart.render({
      indicators,
      series: data.radar.map((r) => ({
        name: r.name,
        data: [r.sales, r.service, r.growth, r.satisfaction, r.coverage],
      })),
    });
    this.charts.radar = chart;
  }

  /** 启动自动刷新 */
  _startAutoRefresh(appEl) {
    this.refreshTimer = setInterval(async () => {
      try {
        const [overview, sales, traffic, regional] = await Promise.all([
          this.dataSource.fetchOverview(),
          this.dataSource.fetchSalesData(),
          this.dataSource.fetchTrafficData(),
          this.dataSource.fetchRegionalData(),
        ]);

        if (overview.success) {
          // 更新 StatCard 数值
          const statValues = appEl.querySelectorAll('.stat-value');
          const cards = [overview.data.totalSales, overview.data.totalOrders, overview.data.activeUsers, overview.data.conversionRate];
          statValues.forEach((el, i) => {
            if (cards[i]) {
              el.dataset.target = cards[i].value;
              this._animateUpdate(el, cards[i].value);
            }
          });
        }
        if (sales.success) this.charts.sales?.updateData(sales.data);
        if (traffic.success) this.charts.pie?.updateData(traffic.data);
        if (regional.success) {
          this.charts.map?.updateData(regional.data);
          this.charts.radar?.updateData(regional.data);
        }

        this.logger.debug('自动刷新完成');
      } catch (err) {
        this.logger.warn('自动刷新失败', { error: err.message });
      }
    }, this.refreshInterval);
  }

  /** 数值更新动画 */
  _animateUpdate(el, target) {
    const duration = 600;
    const start = performance.now();
    const from = parseFloat(el.textContent.replace(/,/g, '')) || 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = from + (target - from) * eased;

      if (Number.isInteger(target)) {
        el.textContent = Math.round(current).toLocaleString('zh-CN');
      } else {
        el.textContent = current.toFixed(2);
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /** 停止自动刷新 */
  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    Object.values(this.charts).forEach((chart) => chart?.dispose());
  }
}

export default App;
