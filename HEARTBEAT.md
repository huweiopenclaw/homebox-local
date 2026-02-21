# HEARTBEAT.md

## 🚀 Mission Control

**项目位置**: `projects/task-board/`
**访问地址**: http://localhost:3000
**任务数据**: `memory/tasks.json`

### 自动启动检查
Heartbeat 时会检查任务看板是否运行，未运行则自动启动：
```powershell
# 检查端口 3000
netstat -ano | Select-String ":3000"
# 未运行则启动
cd C:\Users\1990h\.openclaw\workspace\projects\task-board
Start-Process npm -ArgumentList "run dev" -WindowStyle Minimized
```

### 手动启动
```bash
cd projects/task-board
npm run dev
```

### 任务同步机制
任务看板使用 `memory/tasks.json` 作为数据源：
- HOC 可以直接编辑此文件来更新任务
- 任务看板会自动从 API 加载任务数据（每 30 秒刷新）
- 用户可以在看板 UI 中添加/编辑任务

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

---

## ✅ 已完成项目

### HomeBox 智能家庭收纳助手
- **APK**: `projects/home-inventory/app/build/app/outputs/flutter-apk/app-release.apk`
- **状态**: 完成 ✅ (2026-02-21)

### HomeBox Local 本地版设计
- **仓库**: https://github.com/huweiopenclaw/homebox-local
- **状态**: 设计完成 ✅ (2026-02-21)
- **文档**: PRD.md, DESIGN.md, android/DESIGN.md, miniprogram/DESIGN.md
