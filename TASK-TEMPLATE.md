# 任务分解模板

## 使用方法

当收到复杂任务时，按此模板分解并更新到 `memory/tasks.json`。

---

## 任务分解清单

### 1️⃣ 分析阶段
- [ ] 任务目标是什么？
- [ ] 预计总耗时？
- [ ] 涉及哪些技能领域？
- [ ] 有哪些子任务？

### 2️⃣ 分配阶段
- [ ] 每个子任务选哪个 agent？（参考 AGENTS.md）
- [ ] 子任务之间有依赖吗？
- [ ] 哪些可以并行执行？

### 3️⃣ 执行阶段
- [ ] 更新 `memory/tasks.json`
- [ ] 启动子代理
- [ ] 监控进度
- [ ] 汇总结果

---

## 任务类型 → Agent 映射

| 任务类型 | 首选 Agent | 备选 Agent |
|----------|-----------|-----------|
| 新功能代码 | CodeDev | HOC |
| Bug 修复 | BugHunter | CodeDev |
| 测试编写 | TestRunner | CodeDev |
| UI 设计 | UIDesigner | HOC |
| 数据可视化 | DataViz | UIDesigner |
| 文档编写 | DocMaster | ContentWriter |
| 内容创作 | ContentWriter | DocMaster |
| 网络调研 | WebSearcher | DataAnalyst |
| 数据分析 | DataAnalyst | WebSearcher |
| 日程管理 | Scheduler | TaskManager |
| 项目协调 | TaskManager | HOC |

---

## 示例：开发"物品管理"功能

**用户请求**: "帮我开发物品管理功能"

**分解结果**:

```json
{
  "tasks": [
    {
      "id": "task-100",
      "title": "物品管理 - 数据模型设计",
      "status": "进行中",
      "assignee": "CodeDev",
      "priority": "高",
      "project": "homebox-local"
    },
    {
      "id": "task-101",
      "title": "物品管理 - 列表页 UI",
      "status": "待办",
      "assignee": "UIDesigner",
      "priority": "高",
      "project": "homebox-local",
      "dependsOn": ["task-100"]
    },
    {
      "id": "task-102",
      "title": "物品管理 - 搜索功能",
      "status": "待办",
      "assignee": "CodeDev",
      "priority": "中",
      "project": "homebox-local",
      "dependsOn": ["task-100"]
    },
    {
      "id": "task-103",
      "title": "物品管理 - 单元测试",
      "status": "待办",
      "assignee": "TestRunner",
      "priority": "中",
      "project": "homebox-local",
      "dependsOn": ["task-100", "task-102"]
    }
  ]
}
```

**并行执行**:
- task-100 先执行（数据模型）
- task-101、task-102 可并行（UI 和搜索）
- task-103 最后执行（测试）
