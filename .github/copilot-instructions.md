# DailyTech 项目指南

## 项目概述
DailyTech 是一个基于 Capacitor 的跨平台新闻阅读应用，支持 Android 和 iOS。

## 技术栈
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **跨平台**: Capacitor
- **包管理**: npm

## 项目结构
- `src/` - Vue 源代码
- `android/` - Android 原生项目
- `ios/` - iOS 原生项目
- `public/` - 静态资源

## 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 3 Composition API 风格
- 保持代码简洁，遵循 KISS 原则
- 避免重复代码，遵循 DRY 原则

## 常用命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npx cap sync android` - 同步 Android 项目
- `npx cap sync ios` - 同步 iOS 项目

## 注意事项
- 修改原生功能后需要重新 sync
- Android 签名使用 secrets 中的 KEYSTORE_BASE64
- 版本发布通过 GitHub Actions 自动化
