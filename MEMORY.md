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

## workspace_filesystem 横向调研（2026-04-05）

### 状态：✅ 全部完成
- Phase 0-2 ✅ 准备+信息提取
- Phase 3 ✅ 源码深调 70/70
- Phase 3.5 ✅ 数据提取+汇总
- Phase 4 ✅ 最终报告（8200字）
- 路径：`ResearchReports-H\workspace_filesystem\`
- 最终报告：`ResearchReports-H\workspace_filesystem\final_report.md`

### 最终分类（8类70项目）
- Cat 1 VFS: 5 项目 (均分 4.00)
- Cat 2 Sandbox: 3 项目 (均分 3.29)
- Cat 3 IDE: 3 项目 (均分 4.71) — 最高分
- Cat 4 Confirm: 0 项目
- Cat 5 Path: 15 项目 (均分 3.57)
- Cat 6 Direct I/O: 12 项目 (均分 2.14) — 最低分
- Cat 7/8: 少量
- 未分类: 30 项目 (phase3_category 为空)

### 关键发现
- 整体平均分：3.15/5 (63.0%)
- 强项：路径安全 (3.67/5)、跨平台 (3.58/5)
- 弱项：并发安全 (2.65/5)、编辑机制 (2.85/5)
- 重分类率：30% (21/70)
- 标杆：agentpool (4.71/5)、claude-code-src (4.86/5)、cline

### 技术亮点
- **SafePath 类型系统** (zeptoclaw)：编译时强制路径验证
- **os.Root OS 级沙箱** (picoclaw)：Go 1.22+ 内核级隔离
- **6 种运行时隔离** (zeptoclaw)：Docker/Apple/Landlock/Firejail/Bubblewrap/Native
- **四层路径验证** (vtcode)：Rust 实现的纵深防御

### 教训
- 18 个项目因无源码/无法访问导致无评分
- Phase 3.5 数据提取子代理对非标准格式处理不佳，30 个项目 phase3_category 为空
- 分类体系边界模糊（Path-Guarded vs Sandbox），需更清晰定义

---

## 横向调研 — 通用原则（2026-04-04，两个维度验证后 v3）

### 全流程铁律

1. **单项目单代理，绝不并行**
   - Phase 3 必须一次只派一个子代理分析一个项目
   - push-based 调度：等完成通知 → 派下一个 → 等通知，零浪费
   - 每个项目约 4-7 分钟，70 个项目约 4-6 小时，不可压缩

2. **派发前检查活跃列表**
   - 用 `subagents list` 确认无活跃子代理
   - 防止 compaction 后上下文丢失导致重复派发

3. **被杀子代理的通知一律 NO_REPLY**
   - 已被 kill 的子代理可能仍会发送超时通知

4. **Phase 3.5 数据提取交给子代理，不用正则脚本**
   - 子代理写的 scorecard 格式千差万别（/10, /100, 表格, 加粗...）
   - Node.js 正则提取只有 ~50% 命中率
   - **正确做法**：派子代理直接读所有文件自行提取，虽慢（~17分钟），但质量高

5. **Phase 3.5 按步骤分任务**
   - Step A: 子代理提取数据 → project_data.json
   - Step B: 子代理生成类别总结 + Phase 3.5 报告
   - Step C: 子代理生成 Phase 4 最终报告
   - 不要把所有汇总压给一个子代理

6. **语言标注仅供参考，不影响分析质量**
   - Phase 0-1 语言错误率 ~15%，子代理会自动发现真实语言
   - 无需花时间提前修正

### 分类经验（两个维度对比）

- **分类修正率因维度而异**：memory_system 11%, tool_system 34%
- **分类边界越模糊，修正率越高**：tool_system 的 Registry/Plugin/MCP-first 边界不清晰
- **小类别可能只有 1-2 个项目**：H.Delegation 只有 2 个，考虑合并或取消
- **Phase 2 分类置信度应标注**：低置信度项目在 Phase 3 重点审查

### 评分经验

- **强制 5 分制写在任务描述开头**（不是末尾），子代理可能只读前半段
- **Phase 2 评分应标注为"初步评估"**，实际差异可达 ±1.0 以上
- **某些维度天然强弱分化**：tool_system 的 Execution 平均 4.5（强），Discovery 平均 3.88（弱）

### 效率基准（两个维度平均）

| 指标 | 数值 |
|------|------|
| 子代理成功率 | 95%+（tool_system 33/33 满分） |
| 单项目运行时间 | 4-7 分钟 |
| token/子代理 | 50-130k |
| 超时设置 | 3600s 绰绰有余 |
| Phase 3.5 时间 | 15-20 分钟 |
| Phase 4 时间 | 5-10 分钟 |

### 工具/技术经验

- **PowerShell 中文编码问题**：用 Node.js 脚本代替 PowerShell
- **进度追踪**：必须维护 progress.md，每完成一个项目就更新
- **STAR 项目处理**：给更多要求（8 段代码而非 5 段），产出更丰富
- **自动化程度**：70 个项目可完全无人干预连续跑完

---

## tool_system 横向调研（2026-04-03 ~ 04-04）

### 状态：✅ 全部完成
- Phase 0-1 ✅ 准备+信息提取
- Phase 2 ✅ 初步分类（8类70项目）
- Phase 3 ✅ 源码深调 70/70
- Phase 3.5 ✅ 数据提取+汇总
- Phase 4 ✅ 最终报告（5931字）
- 路径：`ResearchReports-H\tool_system\`
- 最终报告：`ResearchReports-H\tool_system\final_report.md`

### 最终分类（8类70项目）
- A.Minimalist: 8 项目 (均分 3.3)
- B.Registry: 24 项目 (均分 4.32) — 最多
- C.Decorator-driven: 7 项目 (均分 4.13)
- D.Declarative/DSL: 6 项目 (均分 3.9)
- E.MCP-first: 10 项目 (均分 4.59) — 最高分
- F.Plugin ecosystem: 7 项目 (均分 4.18)
- G.Enterprise: 6 项目 (均分 4.49)
- H.Delegation/Proxy: 2 项目 (均分 3.95)

### 关键发现
- 满分项目：openclaw、picoclaw、zeptoclaw、moltis
- MCP-first 类别平均分最高（4.59）
- Tool Discovery 是最弱维度（均分 3.88）
- 34% 项目在 Phase 3 被修正分类
- 语言标注错误率 ~15%（子代理自动修正）

### 威胁列表
