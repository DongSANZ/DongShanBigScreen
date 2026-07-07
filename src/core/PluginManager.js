/**
 * 插件管理器
 * @module core/PluginManager
 */
import eventBus from './EventBus.js';

class PluginManager {
  constructor() {
    /** @type {Map<string, object>} */
    this._plugins = new Map();
  }

  /**
   * 注册并安装一个插件
   * @param {object} plugin - 插件对象，必须包含 name 和 install 方法
   * @param {string} plugin.name - 插件名称
   * @param {Function} plugin.install - 插件安装函数，接收 pluginManager 实例
   */
  use(plugin) {
    if (!plugin.name || typeof plugin.install !== 'function') {
      throw new Error(`[PluginManager] 插件必须包含 "name" 属性和 "install" 方法`);
    }
    if (this._plugins.has(plugin.name)) {
      console.warn(`[PluginManager] 插件 "${plugin.name}" 已注册，将被覆盖`);
    }
    plugin.install(this);
    this._plugins.set(plugin.name, plugin);
    eventBus.emit('plugin:installed', { name: plugin.name });
  }

  /**
   * 获取已注册的插件
   * @param {string} name
   * @returns {object|undefined}
   */
  getPlugin(name) {
    return this._plugins.get(name);
  }

  /**
   * 检查插件是否已注册
   * @param {string} name
   * @returns {boolean}
   */
  hasPlugin(name) {
    return this._plugins.has(name);
  }

  /**
   * 获取所有插件名称
   * @returns {string[]}
   */
  listPlugins() {
    return Array.from(this._plugins.keys());
  }
}

export default PluginManager;
