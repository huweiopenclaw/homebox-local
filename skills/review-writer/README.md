# Review Writer Skill

## 简介

Review Writer 是一个专门用于学术综述论文写作的Skill，包含了完整的工作流程、项目模板和自动化工具。

## 功能特点

- ✅ 完整的写作流程指导
- ✅ 标准化的项目结构模板
- ✅ 自动化统计和验证脚本
- ✅ 最佳实践Checklist
- ✅ 常见问题解决方案
- ✅ LaTeX模板文件
- ✅ BibTeX格式示例

## 快速开始

### 1. 创建新项目

```bash
# 创建项目目录
mkdir my-review && cd my-review

# 复制模板
cp -r ~/.openclaw/workspace/skills/review-writer/templates/* .
cp -r ~/.openclaw/workspace/skills/review-writer/scripts/* scripts/

# 编辑规划
nano OUTLINE.md

# 开始写作
nano latex/sections/section1_introduction.tex
```

### 2. 使用自动化脚本

```bash
# 统计字数
python scripts/count_stats.py

# 验证引用
python scripts/verify_citations.py

# 详细报告
python scripts/count_stats.py --verbose
python scripts/verify_citations.py --report
```

### 3. 编译PDF

```bash
cd latex
tectonic -X compile main.tex
```

## 目录结构

```
review-writer/
├── SKILL.md          # 完整的写作指南
├── README.md         # 本文件
├── templates/        # 模板文件
│   ├── OUTLINE.md   # Outline模板
│   ├── main.tex     # LaTeX主文件模板
│   └── references.bib # BibTeX模板
└── scripts/         # 自动化脚本
    ├── count_stats.py     # 字数统计
    └── verify_citations.py # 引用验证
```

## 核心写作流程

```
规划阶段 → 写作阶段 → 完善阶段
   ↓          ↓          ↓
Outline   核心章节   引用验证
文献收集   支撑章节   内容审查
环境准备   Intro     最终编译
           Conclusion
```

## 写作顺序建议

```
核心章节 → 支撑章节 → Introduction → Conclusion
```

**为什么这个顺序？**
- 核心章节确立论文基调
- Introduction需要概括全文
- 避免后期大幅修改Introduction

## 常用命令

```bash
# 查看统计
python scripts/count_stats.py --verbose

# 验证引用
python scripts/verify_citations.py --report

# 编译PDF
cd latex && tectonic -X compile main.tex

# Git版本控制
git add . && git commit -m "Update section 2"
```

## 目标参考

### 字数目标
- **Nature Reviews**: 6,000-8,000 词
- **Cell**: 8,000-12,000 词
- **Trends**: 4,000-5,000 词

### 参考文献数量
- **高质量综述**: 150-200 篇
- **一般综述**: 80-150 篇
- **快速综述**: 50-80 篇

## 关键经验

### ✅ 成功经验
1. 完善的outline是成功的一半
2. 文献预收集至关重要
3. 严格的引用验证
4. 实时监控字数
5. 合理的写作顺序

### ⚠️ 常见陷阱
1. 字数超标
2. 引用不足
3. 引用幻觉
4. 过度使用列表
5. 写作顺序不当

## 更多信息

详细指南请查看 `SKILL.md`

## 版本历史

- **v1.0.0** (2026-03-13): 初始版本，基于"From Prediction to Design"综述写作经验

---

*Created by HOC*
