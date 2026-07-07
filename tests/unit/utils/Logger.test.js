import { describe, it, expect, vi } from 'vitest';
import { Logger } from '@/plugins/logger/Logger.js';

describe('Logger', () => {
  it('应该正确记录不同级别的日志', () => {
    const transport = { write: vi.fn() };
    const logger = new Logger({ level: 'debug', transports: [transport] });

    logger.debug('debug msg');
    logger.info('info msg');
    logger.warn('warn msg');
    logger.error('error msg');

    expect(transport.write).toHaveBeenCalledTimes(4);
    expect(transport.write).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'info', message: 'info msg' }),
    );
  });

  it('应该过滤低于当前级别的日志', () => {
    const transport = { write: vi.fn() };
    const logger = new Logger({ level: 'warn', transports: [transport] });

    logger.debug('debug msg');
    logger.info('info msg');
    logger.warn('warn msg');
    logger.error('error msg');

    expect(transport.write).toHaveBeenCalledTimes(2);
  });

  it('应该记录时间戳', () => {
    const transport = { write: vi.fn() };
    const logger = new Logger({ level: 'info', transports: [transport] });

    const before = Date.now();
    logger.info('test');
    const after = Date.now();

    const entry = transport.write.mock.calls[0][0];
    expect(entry.timestamp).toBeGreaterThanOrEqual(before);
    expect(entry.timestamp).toBeLessThanOrEqual(after);
  });

  it('多 Transport 应同时工作', () => {
    const t1 = { write: vi.fn() };
    const t2 = { write: vi.fn() };
    const logger = new Logger({ level: 'info', transports: [t1, t2] });

    logger.info('multi');
    expect(t1.write).toHaveBeenCalledTimes(1);
    expect(t2.write).toHaveBeenCalledTimes(1);
  });

  it('Transport 写入失败不影响其他 Transport', () => {
    const badTransport = { write: vi.fn(() => { throw new Error('fail'); }) };
    const goodTransport = { write: vi.fn() };
    const logger = new Logger({ level: 'info', transports: [badTransport, goodTransport] });

    expect(() => logger.info('test')).not.toThrow();
    expect(goodTransport.write).toHaveBeenCalled();
  });
});
