# HEARTBEAT.md

## 🚀 Mission Control

**项目位置**: `projects/task-board/`
**访问地址**: http://localhost:3000
**任务数据**: `memory/tasks.json`

### 任务同步机制
任务看板现在使用 `memory/tasks.json` 作为数据源：
- HOC 可以直接编辑此文件来更新任务
- 任务看板会自动从 API 加载任务数据
- 使用 `node scripts/sync-task.js` 命令行工具管理任务

```bash
# 添加任务
node projects/task-board/scripts/sync-task.js add "任务标题" --status "进行中" --priority "高" --project "项目名"

# 更新任务
node projects/task-board/scripts/sync-task.js update task-001 --status "已完成"

# 列出任务
node projects/task-board/scripts/sync-task.js list
```

### 功能
- 🏢 **办公室视图**：数字办公室，查看团队工作状态
- 📋 **看板视图**：待办 / 进行中 / 已完成 / 已取消
- 📅 **日历视图**：月历显示所有计划任务
- 🧠 **记忆系统**：搜索、分类、Markdown 文档
- 👥 **团队视图**：子代理团队结构展示

### 办公室区域
- 🎯 指挥中心 - HOC
- 💻 开发区 - CodeDev, BugHunter, TestRunner
- ✍️ 写作区 - ContentWriter, DocMaster
- 🎨 设计区 - UIDesigner, DataViz
- 🔍 研究区 - WebSearcher, DataAnalyst
- 📋 运营区 - TaskManager, Scheduler

### 启动命令
```bash
cd projects/task-board; npm run dev
```

---

## ✅ 已完成项目

### HomeBox 智能家庭收纳助手
- **APK**: `projects/home-inventory/app/build/app/outputs/flutter-apk/app-release.apk`
- **状态**: 完成 ✅ (2026-02-21)

### HomeBox Local 本地版设计
- **仓库**: https://github.com/huweiopenclaw/homebox-local
- **状态**: 设计完成 ✅ (2026-02-21)
- **文档**: PRD.md, DESIGN.md, android/DESIGN.md, miniprogram/DESIGN.md
