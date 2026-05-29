# DailyTech

技术资讯聚合阅读器 - 基于 SvelteKit + Capacitor 构建的 Android 应用

## ✨ 功能特性

- 📰 **多源聚合** - 22+ 高质量技术 RSS 源
- 🏷️ **板块分类** - AI、CS研究、安全、Web开发、游戏开发等
- 📖 **完整内容** - 解析 RSS 全文，支持富文本显示
- 🎨 **主题定制** - 8种预设颜色 + 自定义 HSL
- 🌐 **代理设置** - 解决跨域问题
- 📱 **原生体验** - Capacitor 打包 Android 应用

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建 Android APK

```bash
# 完整流程
npm run build && npx cap sync && cd android && ./gradlew assembleRelease

# APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

## 📁 项目结构

```
src/
├── lib/
│   ├── components/      # UI 组件
│   │   ├── layout/      # 布局组件
│   │   ├── news/        # 新闻组件
│   │   └── ui/          # shadcn-svelte 组件
│   ├── config/          # 数据源配置
│   ├── services/        # 服务层 (RSS, API)
│   ├── stores/          # 状态管理
│   ├── types/           # TypeScript 类型
│   └── utils/           # 工具函数
├── routes/              # 页面路由
│   ├── +page.svelte     # 首页
│   ├── article/         # 文章详情
│   ├── bookmarks/       # 收藏夹
│   ├── discover/        # 数据源管理
│   └── settings/        # 设置
└── app.css              # 全局样式
```

## 📦 技术栈

- **框架**: SvelteKit + adapter-static
- **UI**: shadcn-svelte + Tailwind CSS
- **移动端**: Capacitor 5
- **状态管理**: Svelte Stores
- **RSS解析**: DOMParser (浏览器原生)

## 📄 License

MIT
