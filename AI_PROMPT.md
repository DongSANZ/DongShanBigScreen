# 东山数据大屏 · AI 执行提示词

> 将以下内容完整复制给 AI，它将按照方案二（Vite + ECharts + 插件化架构）自动构建整个数据大屏项目，并最终在浏览器中展示一个漂亮的可视化大屏页面。

---

## 📋 项目背景

你是一个数据大屏专家。请根据以下要求，从零搭建一个名为 **东山数据大屏 (DongShanBigScreen)** 的数据可视化大屏项目。项目仓库位于 `https://github.com/DongSANZ/DongShanBigScreen`，开源协议为 MIT。

---

## 🏗 技术架构（方案二：Vite + ECharts + 插件化架构）

- **构建工具**：Vite 5
- **语言**：ES6+ JavaScript（模块化）
- **图表库**：ECharts 5
- **测试**：Vitest + jsdom
- **代码质量**：ESLint + Prettier
- **Git 提交规范**：commitlint + husky
- **日志系统**：自研插件化 Logger
- **数据**：前期使用 Mock 数据，架构需支持后期无缝切换真实 API
- **设计原则**：数据适配器模式 + 工厂模式 + 事件总线 + 插件化架构

---

## ⚠️ 核心约束（必须遵守）

1. **严禁单文件堆砌**：所有代码必须按照指定的目录结构分层存放，每个文件职责单一
2. **Mock/API 可切换**：数据层必须使用适配器模式，切换数据源只需修改一行代码
3. **测试完备**：核心模块必须包含单元测试
4. **日志系统**：所有模块使用统一的 Logger，不可使用 `console.log` 裸写
5. **提交规范**：每次提交遵循 Conventional Commits 格式

---

## 📂 一、创建完整目录结构

请按以下结构创建所有目录和文件（不允许省略任何目录）：

```
DongShanBigScreen/
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.cjs
├── vitest.config.js
├── jsdoc.json
├── src/
│   ├── main.js
│   ├── App.js
│   ├── config/
│   │   ├── index.js
│   │   ├── app.config.js
│   │   ├── chart.theme.js
│   │   └── env.js
│   ├── core/
│   │   ├── ScreenManager.js
│   │   ├── EventBus.js
│   │   ├── PluginManager.js
│   │   └── ResizeAdapter.js
│   ├── plugins/
│   │   ├── logger/
│   │   │   ├── index.js
│   │   │   ├── Logger.js
│   │   │   ├── transports/
│   │   │   │   ├── ConsoleTransport.js
│   │   │   │   └── MemoryTransport.js
│   │   │   └── formatters/
│   │   │       └── PrettyFormatter.js
│   │   └── monitor/
│   │       └── index.js
│   ├── data/
│   │   ├── DataSource.js
│   │   ├── DataPipeline.js
│   │   ├── sources/
│   │   │   ├── MockSource.js
│   │   │   └── ApiSource.js
│   │   └── transformers/
│   │       ├── NumberFormatter.js
│   │       └── DateFormatter.js
│   ├── charts/
│   │   ├── BaseChart.js
│   │   ├── ChartFactory.js
│   │   ├── mixins/
│   │   │   ├── autoRefresh.js
│   │   │   └── clickHandler.js
│   │   └── instances/
│   │       ├── BarChart.js
│   │       ├── LineChart.js
│   │       ├── PieChart.js
│   │       ├── RadarChart.js
│   │       └── MapChart.js
│   ├── components/
│   │   ├── StatCard/
│   │   │   ├── StatCard.js
│   │   │   └── StatCard.css
│   │   ├── DataPanel/
│   │   │   ├── DataPanel.js
│   │   │   └── DataPanel.css
│   │   ├── LoadingOverlay/
│   │   │   ├── LoadingOverlay.js
│   │   │   └── LoadingOverlay.css
│   │   └── ErrorBoundary/
│   │       ├── ErrorBoundary.js
│   │       └── ErrorBoundary.css
│   ├── layouts/
│   │   ├── GridLayout.js
│   │   └── layouts/
│   │       └── layout-3x3.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   └── mock/
│       ├── index.js
│       ├── sales.js
│       ├── traffic.js
│       ├── regional.js
│       └── overview.js
├── tests/
│   ├── unit/
│   │   ├── data/
│   │   │   └── MockSource.test.js
│   │   ├── charts/
│   │   │   └── BaseChart.test.js
│   │   ├── core/
│   │   │   └── EventBus.test.js
│   │   └── utils/
│   │       └── Logger.test.js
│   └── integration/
│       └── screen.test.js
```

---

## 🔧 二、项目配置文件

### 2.1 package.json

- 项目名称：`dongshan-big-screen`
- 添加脚本：`dev`、`build`、`preview`、`test`、`lint`、`lint:fix`、`format`、`docs`
- 依赖：`echarts`
- 开发依赖：`vite`、`vitest`、`jsdom`、`eslint`、`prettier`、`@commitlint/cli`、`@commitlint/config-conventional`、`husky`、`lint-staged`、`jsdoc`

### 2.2 vite.config.js

- 配置别名 `@` 指向 `src/`
- 配置开发服务器端口为 3000，启动时自动打开浏览器

### 2.3 .eslintrc.cjs 和 .prettierrc

- ESLint：使用 eslint:recommended，ES2021，module 模式
- Prettier：单引号、分号、尾逗号、2 空格缩进、100 字符换行

### 2.4 commitlint.config.cjs

- 继承 `@commitlint/config-conventional`

### 2.5 vitest.config.js

- 使用 jsdom 环境
- 配置别名同 Vite

---

## 🧱 三、各层实现要求

### 3.1 配置层（src/config/）

- **app.config.js**：导出应用全局配置对象，包含应用名称（中文+英文）、版本号、默认数据源类型（`'mock'`）、刷新间隔（30秒）、日期格式
- **chart.theme.js**：导出 ECharts 自定义主题配置，包含：
  - 配色方案：主色 `#00d4ff`、辅助色板 6 种颜色、背景透明、文字颜色 `#a3c6ff`
  - 这是一个 **深色科技风** 主题
- **env.js**：导出环境判断工具（是否为开发/生产/测试环境）
- **index.js**：统一导出所有配置

### 3.2 核心层（src/core/）

#### EventBus.js —— 事件总线
- 实现 `on(event, callback)`、`off(event, callback)`、`emit(event, data)`、`once(event, callback)`
- 支持错误隔离（某个回调报错不影响其他回调执行）
- 使用 Logger 记录事件触发

#### ScreenManager.js —— 大屏生命周期管理器
- 生命周期阶段：`init → beforeLoad → loadData → render → afterRender → destroy`
- 每个阶段触发对应事件
- 管理全局加载状态
- 集成 EventBus 和 Logger

#### PluginManager.js —— 插件管理器
- `use(plugin)` 注册插件
- 每个插件必须有 `name` 和 `install(pluginManager)` 方法
- `getPlugin(name)` 获取已注册插件

#### ResizeAdapter.js —— 屏幕自适应
- 监听窗口 resize 事件
- 使用缩放（transform: scale）方案实现大屏等比缩放
- 默认设计尺寸 1920×1080

### 3.3 日志插件（src/plugins/logger/）

#### Logger.js —— 日志核心类
- 支持 `debug`、`info`、`warn`、`error` 四个级别
- 支持 `level` 过滤（低于当前级别的日志不输出）
- 支持多个 Transport 同时输出
- 每条日志包含：级别、消息、元数据、时间戳

#### ConsoleTransport.js
- 将日志输出到浏览器控制台
- 不同级别使用不同颜色（`console.log` / `console.warn` / `console.error`）

#### MemoryTransport.js
- 将日志存储在内存数组中（最多保留 500 条）
- 提供 `getLogs()` 和 `clear()` 方法

#### PrettyFormatter.js
- 格式化日志为：`[2024-01-01 12:00:00] [INFO] 消息内容 {元数据}`

### 3.4 数据层（src/data/）

#### DataSource.js —— 数据源抽象基类
- 定义抽象方法：`fetchOverview()`、`fetchSalesData()`、`fetchTrafficData()`、`fetchRegionalData()`
- 统一返回格式：`{ success: boolean, data: any, error?: string, timestamp: number }`

#### MockSource.js —— Mock 数据源
- 实现 DataSource 所有方法
- 使用 `Promise` 模拟网络延迟（300~800ms 随机）
- 随机 5% 概率触发模拟错误（用于测试错误处理）

#### ApiSource.js —— API 数据源（预留）
- 使用 `fetch` 请求真实 API
- 添加超时处理和错误重试

#### DataPipeline.js —— 数据处理管道
- `pipe(...processors)` 方法串联处理器
- 每个处理器是一个函数，接收数据并返回处理后的数据

#### transformers/NumberFormatter.js —— 数字格式化
- 支持千分位、万/亿单位转换、保留小数位

#### transformers/DateFormatter.js —— 日期格式化
- 支持多种格式输出

### 3.5 图表层（src/charts/）

#### BaseChart.js —— 图表基类
- 构造函数接收容器 DOM 和配置对象
- 管理 ECharts 实例生命周期（init / update / resize / dispose）
- 使用 Logger 记录图表操作
- 集成 EventBus 发送图表事件

#### ChartFactory.js —— 图表工厂
- `static create(type, container, config)` 根据类型创建图表实例
- 支持类型：`bar`、`line`、`pie`、`radar`、`map`
- 返回 BaseChart 子类实例

#### mixins/autoRefresh.js —— 自动刷新混入
- 为图表添加定时刷新能力
- 接收刷新间隔参数

#### mixins/clickHandler.js —— 点击交互混入
- 为图表添加统一的点击事件处理
- 通过 EventBus 发送 `chart:click` 事件

#### instances/ 各图表实现
- **BarChart.js**：柱状图，支持横向/纵向、堆叠模式
- **LineChart.js**：折线图，支持平滑曲线和多系列、面积渐变填充
- **PieChart.js**：饼图，支持环形图、南丁格尔玫瑰图、中心文本
- **RadarChart.js**：雷达图，支持多层填充
- **MapChart.js**：中国地图（需加载地图 JSON）

### 3.6 组件层（src/components/）

#### StatCard —— 统计卡片
- 显示标题、数值、趋势（↑↓箭头 + 百分比）、图标
- 支持 4 种颜色主题（蓝/绿/橙/紫）
- 数值从 0 滚动的数字动画效果

#### DataPanel —— 数据面板
- 组合标题栏 + 图表容器
- 支持边框装饰（发光边框效果）
- 右上角显示数据更新时间

#### LoadingOverlay —— 加载遮罩
- 全屏半透明遮罩
- 居中旋转加载动画（使用 CSS animation）
- 支持显示自定义加载文字

#### ErrorBoundary —— 错误边界
- 捕获子元素渲染错误
- 显示友好错误提示和重试按钮

### 3.7 布局层（src/layouts/）

#### GridLayout.js —— 网格布局引擎
- 读取布局配置，计算每个单元格的绝对位置和尺寸
- 使用 CSS Grid 实现响应式网格

#### layouts/layout-3x3.js —— 3×3 大屏布局
- 顶部横跨一行：标题栏（全宽）
- 中间三列：左侧 2 个卡片、中间地图、右侧 2 个卡片
- 底部横跨一行：3 个柱状图/折线图

### 3.8 样式层（src/styles/）

#### variables.css —— 设计令牌
- 定义 CSS 变量：颜色、字号、间距、圆角、阴影
- 深色科技风配色方案：
  - 背景色：`#0a0e2e`（深蓝黑）
  - 面板背景：`rgba(16, 24, 61, 0.8)`
  - 边框发光：`rgba(0, 212, 255, 0.3)`
  - 文字主色：`#e0e6ff`
  - 文字辅助色：`#a3c6ff`

#### reset.css
- 标准 CSS Reset

#### global.css
- 全局样式：字体引入（使用系统字体栈）、body 背景色、滚动条样式
- 大屏容器全屏样式

#### themes/dark.css —— 深色主题（默认启用）
#### themes/light.css —— 浅色主题（预留）

### 3.9 Mock 数据（src/mock/）

#### overview.js —— 概览指标数据
```json
{
  "totalSales": { "value": 126580, "unit": "万元", "trend": 12.5 },
  "totalOrders": { "value": 8942, "unit": "单", "trend": -3.2 },
  "activeUsers": { "value": 36521, "unit": "人", "trend": 8.7 },
  "conversionRate": { "value": 6.8, "unit": "%", "trend": 2.1 }
}
```

#### sales.js —— 近 12 个月的销售趋势数据
- 包含每月销售额和目标值两个系列
- 12 条数据，数值范围 8000~15000（万元）

#### traffic.js —— 近 7 天各渠道流量数据
- 5 个渠道（直接访问、搜索引擎、社交媒体、邮件营销、广告投放）
- 7 天的数据，每天每个渠道一条

#### regional.js —— 全国各区域销售分布数据
- 至少包含 8~10 个省份/城市的数据
- 每项包含：名称、数值、经纬度（用于地图标注）

#### index.js
- 统一导出所有 Mock 数据，带 300~800ms 模拟延迟

### 3.10 主入口文件

#### index.html
- 设置 `lang="zh-CN"`
- 引入 `src/main.js`（type="module"）
- meta viewport 设置
- title：东山数据大屏

#### src/main.js
- 创建全局 Logger 实例
- 注册日志插件
- 创建 PluginManager 并注册 Monitor 插件
- 创建 EventBus 实例
- 创建 ScreenManager 并启动大屏生命周期
- 创建 App 实例并挂载

#### src/App.js
- 大屏应用主控制器
- 负责：
  1. 初始化数据源（MockSource）
  2. 加载所有 4 组数据（概览、销售、流量、区域）
  3. 根据 3×3 布局渲染所有组件和图表
  4. 启动自动刷新定时器
  5. 处理错误重试

### 3.11 测试文件（tests/）

至少实现以下测试用例：

#### MockSource.test.js
- 测试所有 fetch 方法返回正确格式
- 测试数据不为空

#### BaseChart.test.js
- 测试图表初始化创建 ECharts 实例
- 测试 dispose 方法正确清理

#### EventBus.test.js
- 测试 on + emit 基本流程
- 测试 off 取消订阅
- 测试 once 只触发一次

#### Logger.test.js
- 测试不同级别日志输出
- 测试 level 过滤
- 测试多 Transport 同时工作

---

## 🎨 四、视觉设计要求

### 整体风格
**深色科技风 + 东山文化元素**

### 配色方案
```
主背景色：    #0a0e2e  （深邃星空蓝）
面板背景：    rgba(16, 24, 61, 0.85)
主强调色：    #00d4ff  （科技蓝）
辅助强调色：  #00ff88  （数据绿）
警告色：      #ff6b6b  （警示红）
暖色强调：    #ffaa00  （温暖橙）
紫色强调：    #a855f7  （神秘紫）
边框发光：    rgba(0, 212, 255, 0.25)
```

### 面板设计
- 每个面板使用半透明背景 + 1px 发光边框
- 面板四角添加装饰性 L 形角标（使用 CSS 伪元素）
- 标题栏左侧带一条 3px 宽的强调色竖线
- 面板之间间距统一为 16px

### 标题设计
- 页面顶部标题栏：高度 80px，居中显示 **"东山数据大屏"**
- 标题下方有一条从左到右渐变的发光装饰线
- 标题栏右侧显示当前日期时间（实时更新）

### 数字动画
- 统计卡片的数值从 0 开始，800ms 内滚动到目标值（使用 requestAnimationFrame）
- 图表首次加载时带入场动画

### 加载状态
- 页面初始化时显示加载动画（旋转的六边形科技感图标）
- 数据加载完成后淡出

### 适配
- 默认设计尺寸 1920×1080
- 使用 CSS transform scale 等比缩放适配不同分辨率

---

## 🗺 五、3×3 大屏布局具体规划

```
┌──────────────────────────────────────────────────────┐
│              标    题    栏    (title-bar)            │
│          东山数据大屏  ·  DongShan Big Screen         │
│──────────────────────────────────────────────────────│
│                   数据概览指标行                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ 销售总额  │ │ 订单总量  │ │ 活跃用户  │ │ 转化率   ││
│  │ ¥126,580 │ │   8,942  │ │  36,521  │ │  6.8%   ││
│  │  ↑12.5%  │ │  ↓3.2%   │ │  ↑8.7%   │ │  ↑2.1%  ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├──────────────────────┬───────────────────────────────┤
│                      │                               │
│    📊 月度销售趋势    │      🗺 全国销售分布地图       │
│    (折线图+柱状图)    │                               │
│                      │                               │
├──────────────────────┼───────────────────────────────┤
│                      │                               │
│   🍩 渠道流量占比     │     📡 各区域指标雷达图        │
│    (环形饼图)         │                               │
│                      │                               │
└──────────────────────┴───────────────────────────────┘
```

布局配置（layout-3x3.js）：
- **第一行**（top）：4 个 StatCard 横向排列
- **第二行左**（middle-left）：月度销售趋势（柱状图 + 折线图混合）
- **第二行右**（middle-right）：中国地图销售分布
- **第三行左**（bottom-left）：渠道流量占比环形饼图
- **第三行右**（bottom-right）：各区域指标雷达图

---

## 🚦 六、执行步骤（按顺序执行）

### 第一步：初始化项目
1. 使用 `npm create vite@latest` 创建项目（或手动初始化 package.json）
2. 安装所有依赖
3. 初始化 Git（如果未初始化）
4. 配置 husky 和 lint-staged
5. 提交：`chore: 初始化项目结构和依赖`

### 第二步：创建目录和配置文件
1. 按目录结构创建所有空目录
2. 创建 vite.config.js、eslint、prettier、commitlint、vitest 等配置文件
3. 提交：`chore: 添加项目配置文件和目录结构`

### 第三步：实现核心层
1. 实现 EventBus.js 并编写测试
2. 实现 ScreenManager.js
3. 实现 PluginManager.js
4. 实现 ResizeAdapter.js
5. 验证测试通过
6. 提交：`feat: 实现核心层（事件总线、大屏管理器、插件管理器、自适应）`

### 第四步：实现日志插件系统
1. 实现 PrettyFormatter
2. 实现 ConsoleTransport、MemoryTransport
3. 实现 Logger 核心类
4. 实现插件入口
5. 编写测试并验证通过
6. 提交：`feat: 实现插件化日志系统`

### 第五步：实现数据层
1. 实现 DataSource 抽象基类
2. 实现 MockSource（含模拟延迟和错误）
3. 实现 ApiSource（预留）
4. 实现 DataPipeline
5. 实现 transformers
6. 编写 MockSource 测试
7. 提交：`feat: 实现数据层（数据源适配器+管道+Mock数据）`

### 第六步：创建 Mock 数据
1. 创建 overview.js、sales.js、traffic.js、regional.js
2. 确保数据真实合理（销售数据有季节性波动、流量数据各渠道占比约 30/25/20/15/10）
3. 创建 index.js 导出入口
4. 提交：`feat: 添加完整的 Mock 数据集`

### 第七步：实现样式系统
1. 创建 variables.css（深色科技风设计令牌）
2. 创建 reset.css、global.css
3. 创建 dark.css 主题
4. 添加发光边框、角标装饰、标题栏等 CSS 特效
5. 提交：`feat: 实现深色科技风样式系统和设计令牌`

### 第八步：实现图表层
1. 实现 BaseChart.js
2. 实现 ChartFactory.js
3. 实现 BarChart、LineChart、PieChart、RadarChart、MapChart
4. 实现 autoRefresh 和 clickHandler mixins
5. 配置 chart.theme.js 自定义主题
6. 编写测试
7. 提交：`feat: 实现图表层（基类+工厂+5种图表+混入）`

### 第九步：实现通用组件
1. 实现 StatCard（含数字滚动动画）
2. 实现 DataPanel（含发光边框）+ 标题装饰线
3. 实现 LoadingOverlay（含科技感旋转加载动画）
4. 实现 ErrorBoundary
5. 提交：`feat: 实现通用组件（统计卡片+数据面板+加载遮罩+错误边界）`

### 第十步：实现布局和主页面组装
1. 实现 GridLayout
2. 实现 layout-3x3 布局配置
3. 实现 App.js（主控制器，串联所有模块）
4. 实现 main.js（入口，启动应用）
5. 实现 index.html
6. 提交：`feat: 实现3×3大屏布局和主页面组装`

### 第十一步：启动验证
1. 运行 `npm run dev` 启动开发服务器
2. 确认浏览器自动打开
3. 确认页面展示完整（4 个指标卡、4 个图表、标题栏、加载动画）
4. 确认所有图表正确渲染
5. 确认数字滚动动画正常
6. 确认面板发光边框效果正常
7. 确认自动刷新机制运行正常
8. 如有问题立即修复
9. 提交修复（如果有）

### 第十二步：最终检查
1. 运行 `npm run lint` 确保无错误
2. 运行 `npm test` 确保所有测试通过
3. 确认所有文件已提交
4. Push 到 GitHub

---

## ✅ 验收标准

| 验收项 | 标准 |
|--------|------|
| 页面加载 | 看到加载动画 → 数据加载完成 → 完整大屏展示 |
| 指标卡片 | 4 个卡片显示正确数值 + 趋势箭头 + 数字滚动动画 |
| 柱状图 | 展示近 12 个月销售数据，柱子 + 折线双系列 |
| 地图 | 中国地图展示各区域销售分布（散点/热力）|
| 饼图 | 环形图展示渠道流量占比，带图例 |
| 雷达图 | 展示各区域多维指标对比 |
| 标题栏 | 居中标题 + 底部发光装饰线 + 实时时钟 |
| 发光边框 | 面板四角有 L 形装饰 + 边框发光效果 |
| 自适应 | 缩放浏览器窗口，大屏等比缩放 |
| 自动刷新 | 每 30 秒数据自动更新，图表平滑过渡 |
| 代码质量 | ESLint 零错误，所有测试通过 |
| 模块化 | 所有文件职责单一，无单文件堆砌 |
| Mock/API | 切换数据源只需修改 `src/main.js` 中一行代码 |

---

## 🎯 最终效果预期

打开浏览器后，你将看到一个全屏的**深色科技风数据大屏**，包含：

- 🏷 顶部居中标题"东山数据大屏"，下方发光装饰线，右侧实时时钟
- 📊 第一行 4 个统计指标卡（销售总额、订单总量、活跃用户、转化率），数值带入场动画
- 📈 左侧月度销售趋势图（柱状图 + 折线图叠加）
- 🗺 右侧中国地图销售分布
- 🍩 左下渠道流量占比环形图
- 📡 右下各区域指标雷达图
- ✨ 所有面板带发光边框和四角装饰
- 🔄 每 30 秒数据自动刷新

---

## 📌 注意事项

1. **每个步骤执行完确认无报错后再进行下一步**
2. **所有 import 使用 ES Module 语法，别名使用 `@/`**
3. **ECharts 按需引入或全量引入均可**
4. **地图组件需要加载中国地图 GeoJSON，使用 CDN 或本地 JSON**
5. **CSS 动画使用 GPU 加速属性（transform、opacity）**
6. **所有 console 调用替换为 Logger**
7. **提交信息严格遵循 Conventional Commits 格式**
8. **代码注释使用中文，JSDoc 格式**
