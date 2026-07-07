/**
 * 应用全局配置
 * @module config/app.config
 */
const appConfig = {
  /** 应用名称（中文） */
  name: '东山数据大屏',
  /** 应用名称（英文） */
  nameEn: 'DongShan Big Screen',
  /** 版本号 */
  version: '1.0.0',
  /** 默认数据源类型：'mock' | 'api' */
  dataSource: 'mock',
  /** 数据自动刷新间隔（毫秒） */
  refreshInterval: 30000,
  /** 大屏设计尺寸 */
  designWidth: 1920,
  designHeight: 1080,
  /** 日期格式 */
  dateFormat: 'YYYY-MM-DD',
  /** 时间格式 */
  timeFormat: 'HH:mm:ss',
};

export default appConfig;
