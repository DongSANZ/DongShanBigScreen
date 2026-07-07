import { describe, it, expect } from 'vitest';
import MockSource from '@/data/sources/MockSource.js';

describe('MockSource', () => {
  const source = new MockSource();

  it('fetchOverview 应该返回正确格式', async () => {
    const result = await source.fetchOverview();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.totalSales).toBeDefined();
    expect(typeof result.timestamp).toBe('number');
  });

  it('fetchSalesData 应该返回月度数据', async () => {
    const result = await source.fetchSalesData();
    expect(result.success).toBe(true);
    expect(result.data.months).toHaveLength(12);
    expect(result.data.sales).toHaveLength(12);
    expect(result.data.target).toHaveLength(12);
  });

  it('fetchTrafficData 应该返回渠道流量', async () => {
    const result = await source.fetchTrafficData();
    expect(result.success).toBe(true);
    expect(result.data.channels).toHaveLength(5);
    expect(result.data.values).toHaveLength(5);
  });

  it('fetchRegionalData 应该返回区域数据', async () => {
    const result = await source.fetchRegionalData();
    expect(result.success).toBe(true);
    expect(result.data.list).toBeDefined();
    expect(result.data.list.length).toBeGreaterThanOrEqual(8);
    expect(result.data.radar).toBeDefined();
  });

  it('模拟延迟应该在合理范围内', async () => {
    const start = Date.now();
    await source.fetchOverview();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(source.delayMin);
    expect(elapsed).toBeLessThan(source.delayMax + 100); // 留一些 margin
  });

  it('errorRate=0 时不应返回错误', async () => {
    const s = new MockSource();
    s.errorRate = 0;
    const results = await Promise.all(
      Array.from({ length: 20 }, () => s.fetchOverview()),
    );
    results.forEach((r) => {
      expect(r.success).toBe(true);
    });
  });
});
