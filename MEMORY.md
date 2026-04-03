# MEMORY.md - 长期记忆

## 身份
- **我的名字**: HOC (huweiopenclaw)
- **主人**: 主人
- **时区**: Asia/Shanghai (GMT+8)

## GitHub 配置

### 账号
- **用户名**: huweiopenclaw
- **邮箱**: huweiopenclaw@sina.com
- **GitHub 主页**: https://github.com/huweiopenclaw

### SSH Key (已配置 ✅)
- **类型**: ed25519
- **路径**: `~/.ssh/id_ed25519`
- **已在 GitHub 添加**: 2026-02-16
- **使用 SSH 协议推送，无需额外认证**

### 主仓库
- **Workspace**: `git@github.com:huweiopenclaw/openclaw-workspace.git`
- **GitHub CLI**: `gh` 已安装并登录

### Git 快捷操作
```bash
git add -A && git commit -m "message" && git push
```

## 工具配置

### 网络搜索
- 使用 SearchAPI MCP，不用 Brave Search
- 配置: `C:\Users\1990h\.openclaw\config\mcporter.json`
- API Key: `fKxvbvBizVHPyiiCMW7sUao3` (2026-03-12 更新)
- 调用: `npx mcporter call searchapi.search_google q:"query" --config ...`

## 凭证 (来自 USER.md)
- **GitHub/邮箱**: huweiopenclaw@sina.com / openclaw666
- **计算机 PIN**: 159357

## 横向调研 SOP — Phase 3 源码深调任务模板

### 核心三原则（不可违反）
1. **禁止读取纵向报告** — 明确列出禁止路径，子代理只能读源码
2. **给源码根目录，不给具体文件** — 子代理自己决定读什么、读多少
3. **强制源码片段引用** — deep.md 中必须包含至少 5 段实际源码（每段 5-20 行）

### 禁止路径（写入每个子代理任务）
```
禁止读取：
- C:\Users\1990h\Desktop\projects\0000AgentProjects\ResearchReports\*
- C:\Users\1990h\Desktop\projects\0000AgentProjects\ResearchReports-H\*
只能读取：
- C:\Users\1990h\Desktop\projects\0000AgentProjects\Agent-Projects\*
```

### 任务模板
```
## 严格禁止规则（违反任何一条视为任务失败）
1. 禁止读取 C:\...\ResearchReports\ 下的任何文件
2. 禁止读取 C:\...\ResearchReports-H\ 下的任何文件
3. 只能读取 C:\...\Agent-Projects\ 下的源码文件

## 项目：{name}
- 源码根目录：C:\...\Agent-Projects\{dir}
- 语言：{lang}
- Phase 2 分类：{category}

## 分析目标
1. 用 exec 探索源码目录结构，找到核心循环相关文件
2. 用 read 读取你认为关键的源码文件（不限数量，按需深度读取）
3. 基于实际源码内容进行深度分析

## 输出要求
在 C:\...\ResearchReports-H\runtime_loop\.work\analysis\ 下生成：
- {name}_deep.md / _scorecard.md / _classification_review.md

### _deep.md 核心要求：
#### 质量声明（列出实际读取的所有源码文件完整路径）
#### 至少 5 段实际源码片段引用（每段 5-20 行，标注文件路径和行号）
#### 没有真实源码片段引用 = 任务失败
```

### 验证方法
每个子代理完成后，读取 deep.md 中引用的源码片段，与实际源码文件逐行对比，确认代码真实存在。

### 候选代表项目目录对照
| 项目 | 源码目录 | 语言 |
|------|---------|------|
| deer-flow | deer-flow | Python+TS |
| MASFactory | MASFactory | Python |
| vtcode | VTCode | Rust |
| codex | codex | Rust |
| clawdroid | clawdroid | Go |
| openhands | OpenHands | Python |
| claude-code-src | claude-code-src | TypeScript |
| ironclaw | ironclaw | Rust |
| openclaw | openclaw | TypeScript/JS |
| everything-claude-code | everything-claude-code | JS/TS |
| minion-code | minion-code | Python+TS |

### 教训（2026-04-01）
- **Phase 1 信息提取**只读取纵向报告是正确的（SOP 设计如此）
- **Phase 3 源码深调**必须禁止读纵向报告，否则子代理会抄近路
- 纵向报告中已包含大量代码路径、函数名、代码片段，不禁止就无法区分"读了源码"还是"读了报告"
- 一次最多一个子代理，不要并行
- **任务模板改进**:
  1. 任务描述里明确写出"单项目粒度派发，一次一个子代理分析一个项目"
  2. 任务描述里明确要求"必须使用5分制（1-5）评分，避免后续逐个转换
- **评分卡验证不能只看分数**: 检查工具调用历史确认子代理确实只读了 Agent-Projects 下的文件，而不是读纵向报告； 随机抽查几个项目，源码片段与实际文件对比验证真实性
- **评分卡非5分制导致后续批量转换效率低**: 子代理可能用10分制、也可能用100分制，必须逐个手动重写
- 批次1的批量3个/子代理如果超时就全部白费
- 重做单项目模式后效率更高
- **注册表回写**: Phase 3 结束后需要将源码分析结论回写到 classification_registry.md
- **补齐 SOP 文件**: analysis_checklist.md、 progress.md 是 SOP 要求生成但之前可能忘记
- **计划灵活调整**: 保持灵活，复杂项目单项目派发，简单项目可批量3个；根据项目复杂度灵活调整

---

## 横向调研 — 通用原则（2026-04-03，memory_system 维度总结）

### 全流程六条铁律

1. **单项目单代理，绝不并行**
   - Phase 3 必须一次只派一个子代理分析一个项目
   - 并行会导致文件覆盖冲突、资源争抢、误派难回收
   - 每个项目约 5-8 分钟，70 个项目约 6-8 小时，这是不可压缩的时间

2. **派发前检查活跃列表**
   - 用 `subagents list` 确认当前无活跃子代理
   - 防止重复派发同一项目（本维度发生了 3 次误派）
   - 防止在已杀掉子代理的超时通知上浪费时间

3. **被杀子代理的通知一律 NO_REPLY**
   - 已被 kill 的子代理可能仍会发送超时通知
   - 对这些通知回复 NO_REPLY，不要当作新任务处理

4. **Phase 3 和 Phase 3.5 之间必须加"数据提取"步骤**
   - Phase 3 产出了 70 个独立的 scorecard + classification_review
   - Phase 3.5 需要汇总这些数据，但让子代理直接读 140 个文件太重
   - **正确做法**：用脚本/命令批量提取所有评分和分类，生成一个结构化 JSON，再交给子代理做汇总
   - 本维度让子代理直接做数据提取+汇总，导致 43 分钟运行且输出混乱

5. **Phase 3.5 按类别分步执行，不要一个大任务包揽**
   - 本维度把 7 个类别总结 + 代表确认 + 类型评分 + 完成报告 + 最终报告全部压给一个子代理
   - 子代理上下文溢出，输出质量严重下降
   - **正确做法**：
     - 步骤 A：脚本提取数据 → 生成 project_data.json
     - 步骤 B：逐类派子代理生成 category_{X}_summary.md（7 个小任务）
     - 步骤 C：主代理自己生成 overview、代表确认、类型评分（数据已结构化）
     - 步骤 D：派子代理生成 final_report.md（输入是结构化数据）

6. **Phase 0-1 应自动检测项目语言**
   - Phase 2 的语言标注有 ~10% 错误（从纵向报告推断不可靠）
   - 应从 package.json / go.mod / Cargo.toml / pyproject.toml 等文件自动检测
   - 正确的语言标注影响 Phase 3 子代理的探索效率

### 分类经验

- **Phase 2 分类置信度应标注**：低置信度的项目在 Phase 3 重点审查
- **分类边界在源码分析后会模糊**：本维度 8/70（11%）项目分类被修正
- **B类（滑动窗口/截断）可能被取消**：shrew 被修正为"无记忆管理"，说明某些分类可能在源码分析后为空
- **增加 "Z 无记忆管理" 备选分类**：有些项目根本不实现该维度

### 评分经验

- **Phase 2 评分与 Phase 3 评分差异可达 ±1.0**：
  - 上调最大：claw0 +1.0, nanobot +1.4, moltis +1.3
  - 下调最大：fast-agent -1.47, shrew -1.05
- **Phase 2 评分应标注为"初步评估"**，避免给人精确的错觉
- **强制 5 分制必须写在任务描述开头**（不是末尾），子代理可能只读前半段

### 工具/技术经验

- **PowerShell 中文编码问题**：提取数据时 PowerShell 命令反复报错（中文变量名/正则匹配）
  - **解决**：用 Node.js 脚本代替 PowerShell 做数据提取
  - 或让子代理自己写 Python/JS 脚本提取
- **子代理成功率约 90%**：70 个中约 7 个需要重派（超时/崩溃）
  - 重派成功率 100%，不需要担心
- **子代理运行时间 4-10 分钟**：大多数 5-7 分钟，设置 3600s 超时绰绰有余
- **进度追踪**：全程没有维护 progress.md，导致多次被问进度时无法精确回答
  - **必须维护 progress.md**，每完成一个项目就更新

---

### 威胁列表
