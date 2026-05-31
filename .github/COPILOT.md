# GitHub Copilot & AI 功能配置指南

## 🤖 已配置的 AI 功能

### 1. GitHub Copilot Code Review
**文件**: `.github/workflows/copilot-review.yml`

**功能**: 自动审查 Pull Request 代码
- 分析代码质量
- 发现潜在问题
- 提供改进建议

**使用方法**:
1. 创建 Pull Request
2. Copilot 会自动审查代码
3. 在 PR 评论中查看建议

### 2. GitHub Copilot Instructions
**文件**: `.github/copilot-instructions.md`

**功能**: 为 Copilot 提供项目上下文
- 项目技术栈
- 开发规范
- 常用命令

**使用方法**:
1. 在 VS Code 中使用 Copilot Chat
2. Copilot 会根据项目上下文提供建议

### 3. Dependabot (依赖更新)
**文件**: `.github/dependabot.yml`

**功能**: 自动更新项目依赖
- npm 依赖
- GitHub Actions
- Gradle 依赖

**使用方法**:
1. Dependabot 每周一自动检查更新
2. 创建 PR 来更新依赖
3. 你审查并合并 PR

### 4. 自动标签
**文件**: `.github/workflows/auto-label.yml`

**功能**: 自动为 Issue 和 PR 添加标签
- 根据内容自动分类
- 帮助组织和管理

### 5. 欢迎新贡献者
**文件**: `.github/workflows/welcome.yml`

**功能**: 自动欢迎第一次贡献的人
- Issue 和 PR 都会触发
- 提供友好的欢迎消息

### 6. 过期 Issue 清理
**文件**: `.github/workflows/stale.yml`

**功能**: 自动关闭过期的 Issue
- 30 天无活动标记为 stale
- 7 天后自动关闭

### 7. 安全扫描
**文件**: `.github/workflows/security.yml`

**功能**: 自动安全扫描
- CodeQL 代码分析
- 依赖安全检查

### 8. 性能监控
**文件**: `.github/workflows/performance.yml`

**功能**: PR 性能测试
- Lighthouse 评分
- 性能、可访问性、SEO 检查

### 9. GitHub Pages 部署
**文件**: `.github/workflows/pages.yml`

**功能**: 自动部署到 GitHub Pages
- push 到 main 分支自动部署

---

## 🚀 如何启用 GitHub Copilot

### 个人账户
1. 访问 [github.com/settings/copilot](https://github.com/settings/copilot)
2. 选择订阅计划（免费/Pro/Enterprise）
3. 启用 Copilot

### VS Code 集成
1. 安装 GitHub Copilot 扩展
2. 登录 GitHub 账户
3. 开始使用！

### Copilot Chat 命令
在 VS Code 中使用：
- `@workspace` - 询问项目相关问题
- `@terminal` - 询问终端命令
- `@vscode` - 询问 VS Code 功能

---

## 📝 最佳实践

### Copilot Code Review
- 确保 PR 描述清晰
- 小型 PR 更容易审查
- 及时响应 Copilot 的建议

### Dependabot
- 定期审查依赖更新 PR
- 测试后再合并
- 关注安全更新

### 安全扫描
- 定期查看 CodeQL 结果
- 及时修复高危问题
- 保持依赖更新

---

## 🔧 自定义配置

### 修改 Copilot Instructions
编辑 `.github/copilot-instructions.md` 文件，添加：
- 项目特定规范
- 代码风格要求
- 常用模式

### 调整 Dependabot 频率
修改 `.github/dependabot.yml`：
```yaml
schedule:
  interval: "daily"  # 每日
  # 或
  interval: "weekly" # 每周
```

### 自动标签规则
修改 `.github/labeler.yml` 添加新的匹配规则。

---

## 🆘 常见问题

**Q: Copilot Code Review 没有运行？**
A: 确保：
- PR 不是 Draft 状态
- 工作流文件语法正确
- 仓库启用了 GitHub Actions

**Q: Dependabot PR 太多？**
A: 调整 `open-pull-requests-limit` 参数

**Q: 如何禁用某个功能？**
A: 删除对应的 workflow 文件或重命名为 `.yml.disabled`
