# DailyTech 迭代规划文档

> 最后更新: 2026-06-07
> 当前版本: v0.7.8 (package.json) / v0.7.9 (Git tag)

---

## 一、当前功能清单

### 1.1 核心功能

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| RSS 聚合阅读 | ✅ 已实现 | 支持 RSS/Atom 解析，自动提取图片和摘要 |
| Hacker News 集成 | ✅ 已实现 | 通过 Firebase API 获取 Top Stories |
| 内容分类系统 | ✅ 已实现 | 13 个分类标签（AI/安全/Web/移动端等） |
| 文章收藏 | ✅ 已实现 | 本地持久化收藏，支持永久保存 |
| 已读/未读管理 | ✅ 已实现 | 自动标记已读 + 手动全部标为已读 |
| AI 翻译 | ✅ 已实现 | 支持 OpenAI/Anthropic/DeepSeek 等多提供商 |
| 自定义数据源 | ✅ 已实现 | 用户可添加自定义 RSS 源 |
| 代理支持 | ✅ 已实现 | HTTP/HTTPS/SOCKS5 代理配置 |
| 自动更新检查 | ✅ 已实现 | GitHub Releases 检查 + APK 直接下载 |
| 渐进式加载 | ✅ 已实现 | 每批 20 条，滚动触底加载更多 |
| 多种卡片样式 | ✅ 已实现 | 紧凑/舒适/宽松三种布局 |

### 1.2 页面结构

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 文章列表 + 分类筛选 + 浮动刷新按钮 |
| 数据源 | `/discover` | 预设源管理 + 自定义 RSS 添加/删除 |
| 收藏夹 | `/bookmarks` | 已收藏文章列表 |
| 设置 | `/settings` | 代理/外观/阅读/数据/版本管理 |
| AI 翻译 | `/settings/translate` | 翻译提供商配置 + 模型选择 + 连接测试 |
| 文章详情 | `/article/[id]` | 文章内容 + 翻译/分享/收藏/原文链接 |

### 1.3 技术栈

- **前端框架**: SvelteKit 4 + Svelte 4
- **构建工具**: Vite 5
- **UI 组件**: bits-ui / radix-svelte
- **样式**: Tailwind CSS 3 + 自定义毛玻璃设计系统
- **图标**: Lucide Svelte
- **移动封装**: Capacitor 5 (Android)
- **RSS 解析**: 原生 DOMParser
- **日期处理**: date-fns 3
- **数据存储**: localStorage

---

## 二、发现的问题

### 2.1 版本号不一致（严重）

| 位置 | 版本号 | 说明 |
|------|--------|------|
| `package.json` | `0.7.8` | npm 包版本 |
| Git 最新提交 | `0.7.9` | 最后一次提交消息提到"更新版本号为0.7.8" |
| `android/app/build.gradle` | 从 `package.json` 读取 | 自动同步，无问题 |
| `vite.config.ts` | 从 `package.json` 读取 | 自动同步，无问题 |

**问题**: `package.json` 中版本号为 `0.7.8`，但 Git 标签/提交消息暗示应该是 `0.7.9`。版本号更新流程不规范，可能遗漏了 `package.json` 的修改。

**修复建议**: 统一版本号为 `0.7.9`，并建立版本号更新检查清单。

### 2.2 类型系统缺陷（严重）

**问题**: `src/lib/config/sources.ts` 中使用了 `ContentTag.TECH_NEWS`，但该枚举值在 `src/lib/types/source.ts` 的 `ContentTag` 中不存在。

```typescript
// source.ts 中的枚举定义缺少 TECH_NEWS
export enum ContentTag {
  AI = 'ai',
  SECURITY = 'security',
  // ... 其他
  GENERAL = 'general'
  // 没有 TECH_NEWS!
}

// sources.ts 中却使用了它
{ id: 'hackernews', ..., category: ContentTag.TECH_NEWS }  // 编译错误
```

这会导致 TypeScript 编译错误或运行时分类失败，这些源会默认归类为 `GENERAL`。

**修复建议**: 在 `ContentTag` 枚举中添加 `TECH_NEWS = 'technews'` 及其对应的 `TAG_INFO` 配置。

### 2.3 AI 翻译服务代码缺陷

**问题**: `src/lib/services/translate/index.ts` 第 29 行引用了 `provider.endpoint`，但 `AI_PROVIDERS` 配置中没有定义 `endpoint` 字段。

```typescript
// translate/index.ts
const url = `${s.aiBaseUrl}${provider.endpoint}`;  // provider.endpoint 未定义!

// settings.ts 中的 AIProviderConfig 接口
export interface AIProviderConfig {
  name: string;
  description: string;
  baseUrlPlaceholder: string;
  defaultModel: string;
  modelsEndpoint: string;  // 这个是给 fetchModels 用的
  // 没有 endpoint 字段!
}
```

同样，`settings/translate/+page.svelte` 第 54 行和第 199 行也引用了 `provider.endpoint`。

**修复建议**: 在 `AIProviderConfig` 接口和所有提供商配置中添加 `endpoint` 字段，或者直接使用 `/chat/completions` 等硬编码路径。

### 2.4 NewsFilter 组件未被使用

**问题**: `src/lib/components/news/NewsFilter.svelte` 是一个完整的筛选面板组件，但在任何页面中都没有被引用。首页使用的是简单的分类标签栏，而不是这个更强大的筛选器。

**修复建议**: 将 NewsFilter 集成到首页，提供更丰富的筛选功能（排序/状态/来源过滤）。

### 2.5 CSS 变量定义不完整

**问题**: `app.css` 中定义了 `--destructive` 和 `--accent` 相关变量，但 `accent` 色值未定义。在 `NewsCard.svelte` 中使用了 `text-accent` class，但没有对应的 CSS 变量。

```css
/* app.css */
:root {
  --destructive: 0 70% 50%;
  /* 缺少 --accent 定义 */
}
```

**修复建议**: 在 `app.css` 中添加 `--accent` 变量定义。

### 2.6 标签图标显示问题

**问题**: `NewsCard.svelte` 第 53 行直接输出了图标名称字符串而非渲染图标组件：

```svelte
{TAG_INFO[tag].icon} {TAG_INFO[tag].label}
<!-- 输出的是 "brain AI / ML" 而不是图标 + 文字 -->
```

这导致卡片上显示的是图标名称文本（如 "brain"、"shield"）而不是实际的图标。

**修复建议**: 使用 `svelte:component` 动态渲染图标，参照首页 `+page.svelte` 中的 `iconMap` 模式。

### 2.7 Proxy 设置未实际生效

**问题**: 设置页面提供了完整的代理配置（主机/端口/类型），但 `src/lib/services/rss/fetcher.ts` 中的 RSS 请求使用的是公共 CORS 代理列表（allorigins、corsproxy 等），而非用户配置的代理。

**修复建议**: 
- 如果代理用于网络访问（绕过 GFW），需要在 Capacitor 层面配置
- 如果代理用于 CORS，需要将用户配置的代理集成到 fetcher 中
- 明确代理功能的定位并在 UI 上说明

### 2.8 收藏夹数据持久化不完整

**问题**: `BookmarkStorage` 类在 `storage/cache.ts` 中定义了完整的收藏存储逻辑，但实际上收藏状态是通过 `articles` store 直接管理的，`BookmarkStorage` 类未被使用。如果清除缓存，收藏状态会丢失。

**修复建议**: 要么使用 `BookmarkStorage` 作为收藏的持久化层，要么确保收藏状态在缓存清除后能正确恢复。

---

## 三、行业趋势与竞品分析

### 3.1 Folo (RSSNext) 的核心特性

Folo 代表了 2025 年 RSS 阅读器的最新趋势：

1. **AI 深度集成**: 内置 AI 摘要、翻译、内容分析
2. **社交发现**: 关注其他用户，发现新内容源
3. **统一时间线**: RSS + 社交媒体 + 其他来源整合
4. **自动化规则**: 基于内容的自动过滤、通知触发
5. **多视图模式**: 杂志、列表、网格等多种布局
6. **OPML 导入导出**: 方便迁移
7. **键盘快捷键**: 高效导航
8. **收藏/集合管理**: 文章组织和分类

### 3.2 2024-2025 新闻 App 设计趋势

1. **个性化 AI 推荐**: 基于阅读习惯的智能内容推荐
2. **卡片式布局**: 仍是主流，支持快速浏览
3. **离线阅读**: 高度重视的用户需求
4. **智能通知**: 个性化推送，避免信息过载
5. **内容发现**: 热门话题、编辑精选
6. **TL;DR 摘要**: AI 生成的快速摘要帮助决策
7. **性能优先**: 骨架屏、渐进式加载
8. **主题定制**: 深色/浅色模式已是基线

### 3.3 Material Design 3 最佳实践

1. **动态色彩**: 基于壁纸自动生成配色（Android 12+）
2. **语义化色值**: 使用 `primary`、`surface`、`onSurface` 等语义 token
3. **避免纯黑**: 使用深灰色 `#1C1B1F` 而非 `#000000`
4. **对比度**: 至少 4.5:1 的文字对比度
5. **色调海拔**: 使用色调叠加而非阴影表示层级

---

## 四、下一步迭代计划

### 优先级 P0 - 紧急修复（v0.8.0）

#### 任务 1: 修复版本号不一致
- **文件**: `package.json`
- **操作**: 将版本号更新为 `0.7.9` 或最新的正确版本
- **工作量**: 5 分钟
- **验证**: 确认 `package.json`、Git tag、设置页面显示一致

#### 任务 2: 添加 TECH_NEWS 枚举值
- **文件**: `src/lib/types/source.ts`
- **操作**: 
  ```typescript
  export enum ContentTag {
    // ... 现有值
    TECH_NEWS = 'technews',  // 新增
    GENERAL = 'general'
  }
  
  export const TAG_INFO: Record<ContentTag, { label: string; icon: string; keywords: string[] }> = {
    // ... 现有配置
    [ContentTag.TECH_NEWS]: { 
      label: '科技新闻', 
      icon: 'rss', 
      keywords: ['tech', 'news', 'startup', 'product', 'launch'] 
    },
    // ...
  };
  ```
- **工作量**: 10 分钟

#### 任务 3: 修复 AI 翻译 endpoint 问题
- **文件**: `src/lib/types/settings.ts`, `src/lib/services/translate/index.ts`
- **操作**: 
  - 在 `AIProviderConfig` 接口中添加 `endpoint: string` 字段
  - 为每个提供商配置 endpoint:
    - `chat_completion`: `/chat/completions`
    - `response`: `/responses`
    - `anthropic`: `/messages`
- **工作量**: 15 分钟

#### 任务 4: 修复标签图标显示
- **文件**: `src/lib/components/news/NewsCard.svelte`
- **操作**: 
  ```svelte
  <script>
    // 添加 iconMap 导入
    const iconMap = { brain: Brain, shield: Shield, /* ... */ };
    $: TagIcon = iconMap[TAG_INFO[tag]?.icon] || Newspaper;
  </script>
  
  <!-- 替换文本为组件 -->
  <span>
    <svelte:component this={TagIcon} class="w-3 h-3" />
    {TAG_INFO[tag].label}
  </span>
  ```
- **工作量**: 20 分钟

#### 任务 5: 添加 accent 色值定义
- **文件**: `src/app.css`
- **操作**: 
  ```css
  :root {
    --accent: 217 91% 60%;  /* 蓝色调强调色 */
    --accent-foreground: 0 0% 100%;
  }
  ```
- **工作量**: 5 分钟

---

### 优先级 P1 - 功能增强（v0.8.x）

#### 任务 6: 集成 NewsFilter 筛选组件
- **描述**: 将已有的 `NewsFilter.svelte` 集成到首页
- **操作**:
  1. 在首页添加筛选入口按钮（漏斗图标）
  2. 连接 `filter` store 到筛选面板
  3. 保持分类标签栏作为快捷入口
- **工作量**: 1 小时
- **收益**: 用户可以按排序/状态/来源精确筛选

#### 任务 7: 收藏夹持久化
- **描述**: 确保收藏数据独立于文章缓存，清除缓存不会丢失收藏
- **操作**:
  1. 在 `articles.ts` 中，收藏操作同时写入 `BookmarkStorage`
  2. 加载时合并 `BookmarkStorage` 的数据
  3. 清除缓存时保留收藏
- **工作量**: 1.5 小时
- **收益**: 数据安全性提升，用户体验更可靠

#### 任务 8: 完善代理设置
- **描述**: 明确代理功能定位，修复实际生效问题
- **操作**:
  1. 将代理设置改为"CORS 代理"，说明用于解决跨域问题
  2. 在 `fetcher.ts` 中集成用户配置的代理
  3. 提供预设代理列表 + 自定义代理选项
- **工作量**: 2 小时
- **收益**: 网络受限用户能正常使用

#### 任务 9: 改进空状态和错误处理
- **描述**: 统一各页面的空状态和错误提示
- **操作**:
  1. 收藏夹页添加加载状态
  2. 首页错误状态添加详细信息和重试按钮（已有，但可优化）
  3. 添加网络状态检测
- **工作量**: 1 小时
- **收益**: 错误场景体验提升

#### 任务 10: 文章详情页增强
- **描述**: 改进阅读体验
- **操作**:
  1. 添加字体大小调节
  2. 添加行间距调节
  3. 添加"从上次阅读位置继续"功能
  4. 优化代码块显示（添加复制按钮）
- **工作量**: 3 小时
- **收益**: 阅读体验显著提升

---

### 优先级 P2 - 体验优化（v0.9.x）

#### 任务 11: 下拉刷新
- **描述**: 实现原生感的下拉刷新手势
- **操作**:
  1. 使用已有的 `PullToRefresh.svelte` 组件
  2. 集成到首页和收藏夹
  3. 添加触觉反馈（Capacitor Haptics）
- **工作量**: 2 小时
- **收益**: 更自然的刷新交互

#### 任务 12: OPML 导入导出
- **描述**: 支持标准 OPML 格式的订阅源迁移
- **操作**:
  1. 实现 OPML XML 解析器
  2. 实现 OPML XML 生成器
  3. 使用 Capacitor Filesystem API 处理文件读写
  4. 在数据源页面添加导入/导出按钮
- **工作量**: 3 小时
- **收益**: 降低用户迁移成本

#### 任务 13: 深色/浅色主题切换
- **描述**: 实现完整的主题系统
- **操作**:
  1. 定义 light/dark 两套 CSS 变量
  2. 在设置中添加主题切换
  3. 跟随系统主题
  4. 重构现有硬编码颜色为 CSS 变量
- **工作量**: 4 小时
- **收益**: 满足不同用户偏好，符合设计规范

#### 任务 14: 性能优化
- **描述**: 减少内存占用和提升流畅度
- **操作**:
  1. 文章列表虚拟滚动（大列表场景）
  2. 图片懒加载优化（已有基础）
  3. 减少不必要的 store 订阅
  4. Web Worker 解析 RSS（避免 UI 卡顿）
- **工作量**: 4 小时
- **收益**: 大数据量下保持流畅

#### 任务 15: 通知系统
- **描述**: 新文章推送通知
- **操作**:
  1. 使用 Capacitor Local Notifications
  2. 后台定时检查新内容
  3. 可配置的通知频率和源
  4. 通知跳转到对应文章
- **工作量**: 5 小时
- **收益**: 提升用户粘性

---

### 优先级 P3 - 高级功能（v1.0+）

#### 任务 16: AI 内容摘要
- **描述**: 利用已有的 AI 翻译基础设施，扩展为内容摘要
- **操作**:
  1. 在文章详情页添加"AI 摘要"按钮
  2. 在卡片上显示 AI 生成的一句话摘要
  3. 支持自定义摘要长度
- **工作量**: 3 小时
- **收益**: 帮助用户快速决策是否阅读全文

#### 任务 17: 文章搜索
- **描述**: 全文搜索已加载的文章
- **操作**:
  1. 实现本地全文搜索索引
  2. 在首页添加搜索入口
  3. 搜索结果高亮关键词
  4. 支持按标题/内容/来源搜索
- **工作量**: 4 小时
- **收益**: 快速定位内容

#### 任务 18: 阅读统计
- **描述**: 记录和展示用户的阅读习惯
- **操作**:
  1. 记录每日阅读数量
  2. 记录阅读时长
  3. 生成周报/月报
  4. 分类偏好分析
- **工作量**: 5 小时
- **收益**: 增加用户粘性，提供洞察

#### 任务 19: 自动化规则
- **描述**: 受 Folo 启发，实现基于规则的内容处理
- **操作**:
  1. 规则编辑器 UI
  2. 条件：标题关键词、来源、分类
  3. 动作：自动收藏、自动翻译、推送通知
- **工作量**: 8 小时
- **收益**: 高级用户的效率工具

#### 任务 20: Widget 支持
- **描述**: Android 桌面小组件
- **操作**:
  1. 使用 Capacitor 插件或原生 Android Widget
  2. 显示最新文章列表
  3. 显示未读数量角标
  4. 快速刷新按钮
- **工作量**: 6 小时
- **收益**: 提升日常使用频率

---

## 五、技术债务清单

| 编号 | 问题 | 严重程度 | 预计工作量 |
|------|------|----------|-----------|
| TD-1 | 版本号不一致 | 高 | 5 min |
| TD-2 | TECH_NEWS 枚举缺失 | 高 | 10 min |
| TD-3 | AI endpoint 未定义 | 高 | 15 min |
| TD-4 | 标签图标显示为文本 | 中 | 20 min |
| TD-5 | accent CSS 变量缺失 | 低 | 5 min |
| TD-6 | NewsFilter 组件未使用 | 中 | 1 h |
| TD-7 | 收藏持久化不完整 | 高 | 1.5 h |
| TD-8 | 代理设置未生效 | 中 | 2 h |
| TD-9 | 硬编码颜色值过多 | 低 | 4 h |
| TD-10 | 缺少单元测试 | 中 | 持续 |

---

## 六、版本发布计划

| 版本 | 主题 | 目标日期 | 核心任务 |
|------|------|----------|----------|
| v0.8.0 | 稳定性修复 | 本周 | P0 全部任务（#1-#5） |
| v0.8.1 | 筛选与收藏 | 下周 | P1 任务（#6-#9） |
| v0.8.2 | 阅读体验 | 2 周后 | P1 任务（#10） |
| v0.9.0 | 交互优化 | 3 周后 | P2 任务（#11-#13） |
| v0.9.1 | 性能与通知 | 4 周后 | P2 任务（#14-#15） |
| v1.0.0 | AI 与搜索 | 6 周后 | P3 任务（#16-#17） |
| v1.1.0 | 高级功能 | 8 周后 | P3 任务（#18-#20） |

---

## 七、附录：文件清单

### 关键文件路径

```
src/
├── app.css                              # 全局样式 + CSS 变量
├── routes/
│   ├── +layout.svelte                   # 根布局 + 更新检查 + 返回键处理
│   ├── +page.svelte                     # 首页：文章列表 + 分类筛选
│   ├── article/[id]/+page.svelte        # 文章详情页路由
│   ├── bookmarks/+page.svelte           # 收藏夹
│   ├── discover/+page.svelte            # 数据源管理
│   ├── settings/
│   │   ├── +page.svelte                 # 设置主页
│   │   └── translate/+page.svelte       # AI 翻译配置
│   └── sources/+page.svelte             # 重定向到 discover
├── lib/
│   ├── config/sources.ts                # 预设数据源配置
│   ├── types/
│   │   ├── news.ts                      # Article 类型定义
│   │   ├── settings.ts                  # AppSettings + AI_PROVIDERS
│   │   └── source.ts                    # ContentTag 枚举 + SourceConfig
│   ├── stores/
│   │   ├── articles.ts                  # 文章状态管理
│   │   ├── sources.ts                   # 数据源状态管理
│   │   ├── settings.ts                  # 设置状态管理
│   │   └── ui.ts                        # UI 状态
│   ├── services/
│   │   ├── rss/fetcher.ts               # RSS 抓取（代理/直连）
│   │   ├── rss/parser.ts                # RSS XML 解析
│   │   ├── apis/hackernews.ts           # Hacker News API
│   │   ├── classifier/index.ts          # 文章分类
│   │   ├── translate/index.ts           # AI 翻译服务
│   │   ├── storage/cache.ts             # 缓存存储
│   │   └── updater/index.ts             # 版本更新检查
│   ├── components/
│   │   ├── news/
│   │   │   ├── NewsCard.svelte          # 文章卡片
│   │   │   ├── NewsList.svelte          # 文章列表（分组）
│   │   │   ├── NewsFilter.svelte        # 筛选面板（未使用）
│   │   │   ├── ArticleDetail.svelte     # 文章详情组件
│   │   │   └── SourceBadge.svelte       # 来源标签
│   │   ├── layout/BottomNav.svelte      # 底部导航
│   │   └── shared/
│   │       ├── UpdateDialog.svelte      # 更新弹窗
│   │       ├── ExitDialog.svelte        # 退出确认弹窗
│   │       └── EmptyState.svelte        # 空状态组件
│   └── utils/
│       ├── date.ts                      # 日期工具
│       ├── id.ts                        # ID 生成
│       └── text.ts                      # 文本工具
android/
└── app/build.gradle                     # Android 构建配置
vite.config.ts                           # Vite 配置 + 版本注入
package.json                             # 项目配置 + 版本号
```

---

*文档结束。建议从 P0 任务开始执行，确保基础稳定性后再进行功能迭代。*
