import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '@/core/EventBus.js';

describe('EventBus', () => {
  it('应该正确订阅和触发事件', () => {
    const bus = new EventBus();
    const fn = vi.fn();
    bus.on('test', fn);
    bus.emit('test', { a: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ a: 1 });
  });

  it('once 应该只触发一次', () => {
    const bus = new EventBus();
    const fn = vi.fn();
    bus.once('test', fn);
    bus.emit('test');
    bus.emit('test');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('off 应该取消订阅', () => {
    const bus = new EventBus();
    const fn = vi.fn();
    bus.on('test', fn);
    bus.off('test', fn);
    bus.emit('test');
    expect(fn).not.toHaveBeenCalled();
  });

  it('错误隔离：一个回调报错不影响其他回调', () => {
    const bus = new EventBus();
    const badFn = vi.fn(() => { throw new Error('boom'); });
    const goodFn = vi.fn();
    bus.on('test', badFn);
    bus.on('test', goodFn);
    // 不应抛出错误
    expect(() => bus.emit('test')).not.toThrow();
    expect(goodFn).toHaveBeenCalledTimes(1);
  });

  it('clear 应该移除所有监听', () => {
    const bus = new EventBus();
    bus.on('a', vi.fn());
    bus.on('b', vi.fn());
    bus.clear();
    expect(bus.count()).toBe(0);
  });

  it('count 应该返回正确数量', () => {
    const bus = new EventBus();
    bus.on('a', vi.fn());
    bus.on('a', vi.fn());
    bus.on('b', vi.fn());
    expect(bus.count('a')).toBe(2);
    expect(bus.count()).toBe(3);
  });

  it('on 应该返回取消订阅函数', () => {
    const bus = new EventBus();
    const fn = vi.fn();
    const unsubscribe = bus.on('test', fn);
    unsubscribe();
    bus.emit('test');
    expect(fn).not.toHaveBeenCalled();
  });
});
