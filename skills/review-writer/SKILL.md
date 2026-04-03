# Review Writer - 综述论文写作助手

**Description**: 学术综述论文写作的最佳实践、项目模板和自动化工具。适用于AI、生物信息学、计算机科学等领域的综述写作。

**Version**: 1.0.0
**Created**: 2026-03-13
**Author**: HOC

---

## 📋 目录

1. [快速开始](#快速开始)
2. [写作流程](#写作流程)
3. [项目结构模板](#项目结构模板)
4. [自动化脚本](#自动化脚本)
5. [最佳实践Checklist](#最佳实践checklist)
6. [常见问题与解决方案](#常见问题与解决方案)
7. [引用管理技巧](#引用管理技巧)
8. [LaTeX最佳实践](#latex最佳实践)

---

## 🚀 快速开始

### 创建新综述项目

```bash
# 1. 创建项目目录
mkdir projects/my-review
cd projects/my-review

# 2. 创建标准目录结构
mkdir -p latex/sections perplexity-results scripts

# 3. 复制模板文件
cp ~/.openclaw/workspace/skills/review-writer/templates/OUTLINE.md .
cp ~/.openclaw/workspace/skills/review-writer/templates/main.tex latex/
cp ~/.openclaw/workspace/skills/review-writer/templates/references.bib latex/
cp ~/.openclaw/workspace/skills/review-writer/scripts/* scripts/

# 4. 开始写作
# 编辑OUTLINE.md规划内容
# 收集文献到perplexity-results/
# 开始写作各章节
```

---

## 📝 写作流程

### Phase 1: 规划阶段 (1-2天)

#### 1.1 确定目标期刊和要求

**关键问题**:
- [ ] 目标期刊是什么？
- [ ] 字数要求（通常6,000-12,000词）
- [ ] 参考文献数量要求（通常100-300篇）
- [ ] 图表要求
- [ ] 格式要求（LaTeX/Word）

**常见期刊要求**:

| 期刊 | 字数 | 参考文献 | 格式 |
|------|------|----------|------|
| Nature Reviews MCB | 6,000-8,000 | 150-200 | LaTeX |
| Cell | 8,000-12,000 | 100-150 | Word |
| Trends in Biochem | 4,000-5,000 | 80-100 | Word |
| Current Opinion | 2,000-3,000 | 50-80 | Word |

#### 1.2 制定详细Outline

**OUTLINE.md模板**:

```markdown
# [论文标题]

## 论文基本信息

| 项目 | 内容 |
|------|------|
| **Title** | [标题] |
| **中文标题** | [中文标题] |
| **Article Type** | Review Article |
| **Target Journal** | [目标期刊] |
| **Expected Length** | [字数范围] |
| **References** | [参考文献数量] |

## 核心论点

1. [论点1]
2. [论点2]
3. [论点3]

## 章节规划

### 1. Introduction (~XXX words)
- 背景
- 问题陈述
- 文章结构

### 2. [Section 2标题] (~XXX words)
- 2.1 子章节
- 2.2 子章节
- 目标引用数: XX

### N. Conclusion (~XXX words)
- 总结
- 展望

## 图表规划

### Figure 1: [标题]
- 内容: [描述]
- 类型: [流程图/对比表/时间线]

## 参考文献

- 核心文献: [列出10-20篇关键文献]
```

#### 1.3 文献收集

**文献来源**:
1. **Google Scholar** - 通用搜索
2. **PubMed** - 生物医学文献
3. **arXiv** - 最新预印本
4. **Semantic Scholar** - AI相关
5. **Perplexity AI** - 快速收集（推荐）

**文献收集策略**:
```bash
# 使用Perplexity收集文献
# 提示词示例:
"请帮我收集关于[主题]的最新研究论文，包括:
1. 领域奠基性论文（高引用）
2. 近3年重要突破
3. 综述文章
4. 方法学论文
5. 应用案例

每篇论文请提供: 标题、作者、年份、期刊、DOI、引用数、简要描述"
```

**文献存储格式** (JSON):
```json
{
  "title": "论文标题",
  "authors": ["作者1", "作者2"],
  "year": 2024,
  "journal": "期刊名",
  "doi": "10.xxxx/xxx",
  "citations": 100,
  "abstract": "摘要",
  "category": "分类标签",
  "keywords": ["关键词1", "关键词2"],
  "first_author": "第一作者姓氏"
}
```

---

### Phase 2: 写作阶段 (1-2周)

#### 2.1 写作顺序策略

**推荐顺序**:
```
核心章节 → 支撑章节 → Introduction → Conclusion
```

**具体步骤**:
1. **先写核心章节** - 论文的主要创新点（通常Section 2-3）
2. **再写支撑章节** - 方法、应用、挑战等
3. **最后写Introduction** - 需要概括全文
4. **Conclusion倒数第二** - 总结全文
5. **Abstract最后写** - 高度浓缩的版本

**为什么这个顺序？**
- ✅ 核心章节确立论文基调
- ✅ Introduction需要了解全文内容
- ✅ 避免后期大幅修改Introduction
- ✅ Conclusion需要总结所有章节

#### 2.2 字数控制

**每个章节的字数分配**:

```
Introduction:    5-10%  (~400-800词)
核心章节:        50-60% (~3,000-5,000词)
支撑章节:        20-30% (~1,200-2,400词)
Conclusion:      5-10%  (~400-800词)
```

**实时监控字数**:
```bash
# 使用统计脚本
python scripts/count_stats.py

# 输出示例:
# section1_introduction.tex: ~538 words
# section2_prediction.tex: ~1,354 words
# Total: ~8,406 words (目标: 6,000-8,000)
```

#### 2.3 内容写作技巧

**段落结构**:
```
[主题句] → [支撑论据] → [引用] → [过渡句]
```

**避免的写作方式**:
- ❌ 过度使用itemized lists
- ❌ 没有引用支持的断言
- ❌ 重复相同内容
- ❌ 过度使用被动语态

**推荐的写作方式**:
- ✅ 自然段落叙述
- ✅ 每个子章节至少1个引用
- ✅ 使用对比和举例
- ✅ 保持段落间的逻辑连贯

---

### Phase 3: 完善阶段 (3-5天)

#### 3.1 引用验证

**使用验证脚本**:
```bash
python scripts/verify_citations.py
```

**检查清单**:
- [ ] 所有`\cite{}`都在references.bib中
- [ ] 没有重复引用
- [ ] 引用格式正确
- [ ] 引用分布均匀（每个章节都有引用）

#### 3.2 内容审查

**审查checklist**:
- [ ] 字数达标
- [ ] 参考文献数量达标
- [ ] 每个章节逻辑连贯
- [ ] 没有拼写错误
- [ ] 图表编号正确
- [ ] 交叉引用正确

#### 3.3 最终编译

```bash
# LaTeX编译
cd latex
tectonic -X compile main.tex

# 检查PDF
open main.pdf
```

---

## 📁 项目结构模板

### 标准目录结构

```
my-review/
├── OUTLINE.md              # 详细规划
├── README.md               # 项目说明
│
├── latex/                  # LaTeX源文件
│   ├── main.tex           # 主文件
│   ├── references.bib     # 参考文献
│   ├── sections/          # 各章节
│   │   ├── section1_introduction.tex
│   │   ├── section2_[name].tex
│   │   ├── section3_[name].tex
│   │   ├── ...
│   │   └── sectionN_conclusion.tex
│   └── figures/           # 图片文件
│
├── perplexity-results/     # 文献收集
│   ├── all_papers_merged.json
│   ├── category1_papers.json
│   └── category2_papers.json
│
├── scripts/                # 辅助脚本
│   ├── count_stats.py     # 字数统计
│   ├── verify_citations.py # 引用验证
│   └── merge_papers.py    # 合并文献
│
└── drafts/                 # 草稿和笔记
    ├── notes.md
    └── ideas.md
```

### LaTeX主文件模板 (main.tex)

```latex
\documentclass[12pt]{article}

% 基础包
\usepackage[utf8]{inputenc}
\usepackage{graphicx}
\usepackage{amsmath}
\usepackage{hyperref}
\usepackage{natbib}

% 页面设置
\usepackage[margin=1in]{geometry}

% 标题信息
\title{[论文标题]}
\author{[作者]}
\date{\today}

\begin{document}

\maketitle
\begin{abstract}
[摘要]
\end{abstract}

% 各章节
\input{sections/section1_introduction}
\input{sections/section2_[name]}
\input{sections/section3_[name]}
\input{sections/section4_[name]}
\input{sections/sectionN_conclusion}

% 参考文献
\bibliographystyle{unsrtnat}
\bibliography{references}

\end{document}
```

---

## 🤖 自动化脚本

### 脚本1: 字数统计 (count_stats.py)

```python
#!/usr/bin/env python3
"""
综述论文字数统计脚本
功能: 统计各章节字数、总字数、引用数量
"""

import os
import re
import sys

def count_words_in_tex(tex_file):
    """统计tex文件的字数"""
    with open(tex_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 移除LaTeX命令
    text = re.sub(r'\\[a-zA-Z]+(\{[^}]*\})?', '', content)
    text = re.sub(r'[{}\\~$[\]%]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    
    return len(text.split())

def count_citations(tex_file):
    """统计引用数量"""
    with open(tex_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cites = re.findall(r'\\cite\{([^}]+)\}', content)
    unique_cites = set()
    for cite in cites:
        unique_cites.update([c.strip() for c in cite.split(',')])
    
    return len(unique_cites)

def main(sections_dir='latex/sections'):
    """主函数"""
    if not os.path.exists(sections_dir):
        print(f"Error: Directory {sections_dir} not found")
        sys.exit(1)
    
    sections = sorted([f for f in os.listdir(sections_dir) if f.endswith('.tex')])
    
    total_words = 0
    total_cites = 0
    
    print("="*70)
    print("REVIEW PAPER STATISTICS")
    print("="*70)
    
    for section in sections:
        path = os.path.join(sections_dir, section)
        words = count_words_in_tex(path)
        cites = count_citations(path)
        total_words += words
        
        print(f"{section:<40} ~{words:>5} words  ({cites:>2} citations)")
    
    print("="*70)
    print(f"{'TOTAL':<40} ~{total_words:>5} words")
    print("="*70)

if __name__ == '__main__':
    main()
```

### 脚本2: 引用验证 (verify_citations.py)

```python
#!/usr/bin/env python3
"""
引用验证脚本
功能: 检查所有\cite{}引用是否存在于references.bib中
"""

import os
import re
import sys

def extract_bib_keys(bib_file):
    """提取bib文件中的所有keys"""
    with open(bib_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    keys = set(re.findall(r'@\w+\{(\w+)', content))
    return keys

def extract_citations(tex_file):
    """提取tex文件中的所有引用"""
    with open(tex_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cites = re.findall(r'\\cite\{([^}]+)\}', content)
    unique_cites = set()
    for cite in cites:
        unique_cites.update([c.strip() for c in cite.split(',')])
    
    return unique_cites

def main(bib_file='latex/references.bib', sections_dir='latex/sections'):
    """主函数"""
    if not os.path.exists(bib_file):
        print(f"Error: {bib_file} not found")
        sys.exit(1)
    
    # 获取bib keys
    bib_keys = extract_bib_keys(bib_file)
    
    # 获取所有引用
    all_cites = set()
    sections = sorted([f for f in os.listdir(sections_dir) if f.endswith('.tex')])
    
    for section in sections:
        path = os.path.join(sections_dir, section)
        cites = extract_citations(path)
        all_cites.update(cites)
    
    # 检查缺失
    missing = all_cites - bib_keys
    
    print("="*70)
    print("CITATION VERIFICATION")
    print("="*70)
    print(f"Total citations needed: {len(all_cites)}")
    print(f"Total references in bib: {len(bib_keys)}")
    
    if missing:
        print(f"\n❌ Missing from references.bib: {len(missing)}")
        for cite in sorted(missing):
            print(f"  - {cite}")
        return False
    else:
        print("\n✅ All citations verified!")
        return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
```

### 脚本3: 合并文献 (merge_papers.py)

```python
#!/usr/bin/env python3
"""
文献合并脚本
功能: 合并多个JSON文件中的文献，并生成references.bib条目
"""

import os
import json
import sys

def merge_json_files(directory='perplexity-results'):
    """合并目录下所有JSON文件"""
    all_papers = []
    
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            path = os.path.join(directory, filename)
            with open(path, 'r', encoding='utf-8') as f:
                papers = json.load(f)
                if isinstance(papers, list):
                    all_papers.extend(papers)
    
    # 去重
    unique_papers = []
    seen_titles = set()
    
    for paper in all_papers:
        title = paper.get('title', '').lower()
        if title not in seen_titles:
            seen_titles.add(title)
            unique_papers.append(paper)
    
    return unique_papers

def paper_to_bib(paper):
    """将论文信息转换为BibTeX格式"""
    first_author = paper.get('first_author', 'Unknown').split()[-1]
    year = paper.get('year', '')
    key = f"{first_author.lower()}{year}"
    
    bib_entry = f"""@article{{{key},
  title={{{paper.get('title', 'Unknown')}}},
  author={{{paper.get('first_author', 'Unknown')} and others}},
  journal={{{paper.get('journal', 'Unknown')}}},
  year={{{year}}},
"""
    
    if paper.get('doi'):
        bib_entry += f"  doi={{{paper['doi']}}},\n"
    
    bib_entry += "}\n"
    
    return key, bib_entry

def main():
    """主函数"""
    papers = merge_json_files()
    
    print(f"Merged {len(papers)} unique papers")
    
    # 保存合并后的文件
    output_path = 'perplexity-results/all_papers_merged.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to {output_path}")
    
    # 生成bib条目（可选）
    print("\nSample BibTeX entries:")
    for paper in papers[:3]:
        key, entry = paper_to_bib(paper)
        print(entry)

if __name__ == '__main__':
    main()
```

---

## ✅ 最佳实践Checklist

### 写作前检查

- [ ] **目标期刊确定**
  - [ ] 字数要求
  - [ ] 参考文献数量
  - [ ] 格式要求
  
- [ ] **Outline完成**
  - [ ] 每个章节的字数目标
  - [ ] 每个章节的核心内容
  - [ ] 图表规划
  
- [ ] **文献收集**
  - [ ] 收集足够数量的文献（目标数量的1.5倍）
  - [ ] 按章节分类整理
  - [ ] 阅读核心文献
  
- [ ] **环境准备**
  - [ ] LaTeX环境测试
  - [ ] 脚本准备就绪
  - [ ] Git仓库初始化

### 写作中检查

**每周检查**:
- [ ] 字数进度
- [ ] 引用添加情况
- [ ] 编译测试
- [ ] Git commit

**每完成一个章节**:
- [ ] 字数达标
- [ ] 引用数量合理（每节至少10-15个）
- [ ] 编译无错
- [ ] 逻辑连贯

**写作技巧**:
- [ ] 避免过度使用列表
- [ ] 使用自然段落
- [ ] 每段有主题句
- [ ] 段落间有过渡
- [ ] 适当使用对比和举例

### 完成后检查

**内容审查**:
- [ ] 总字数达标
- [ ] 总引用数达标
- [ ] 每节引用分布均匀
- [ ] 逻辑连贯
- [ ] 没有拼写错误
- [ ] 没有语法错误

**技术审查**:
- [ ] 所有引用验证通过
- [ ] 所有图片加载正确
- [ ] 所有交叉引用正确
- [ ] 编译无warning
- [ ] PDF显示正常

**最终检查**:
- [ ] Abstract符合要求
- [ ] Keywords准确
- [ ] Author信息正确
- [ ] 致谢完整
- [ ] 利益冲突声明
- [ ] 参考文献格式正确

---

## 🔧 常见问题与解决方案

### 问题1: 字数超标

**症状**: 写完后发现字数远超目标

**解决方案**:
1. 识别冗余章节
2. 合并重复内容
3. 删除不必要的列表和表格
4. 精简引言和结论
5. 使用自动化脚本监控

**预防措施**:
- ✅ 写作过程中实时监控字数
- ✅ 每个章节设定明确目标
- ✅ 先写核心观点，再补充细节

### 问题2: 引用不足

**症状**: 参考文献数量不够

**解决方案**:
1. 从文献库中筛选相关文献
2. 添加数据库和工具引用
3. 补充方法学文献
4. 添加对比综述

**预防措施**:
- ✅ 提前收集足够文献（1.5倍目标）
- ✅ 写作时同步添加引用
- ✅ 使用文献管理工具

### 问题3: 引用幻觉

**症状**: 引用的文献不存在或引用错误

**解决方案**:
1. 使用验证脚本检查
2. 手动验证每个引用
3. 添加到references.bib

**预防措施**:
- ✅ 严格验证每个引用
- ✅ 使用自动化脚本
- ✅ 不编造引用

### 问题4: LaTeX编译错误

**症状**: 编译失败或warning过多

**常见错误**:
- `\cite{}`中的key不存在
- 特殊字符未转义
- 括号不匹配
- 图片路径错误

**解决方案**:
```bash
# 清理中间文件
rm *.aux *.log *.bbl *.blg

# 重新编译
tectonic -X compile main.tex
```

**预防措施**:
- ✅ 定期编译测试
- ✅ 使用LaTeX IDE
- ✅ 检查特殊字符

### 问题5: 写作进度缓慢

**症状**: 写作效率低，进度慢

**解决方案**:
1. 制定详细的每日目标
2. 先写容易的章节
3. 使用语音输入
4. 设定写作时间块

**技巧**:
- ✅ 番茄工作法（25分钟写作+5分钟休息）
- ✅ 先写大纲，再填充内容
- ✅ 不追求完美，先完成再修改

---

## 📚 引用管理技巧

### BibTeX格式规范

**期刊文章**:
```bibtex
@article{key2024,
  title={论文标题},
  author={姓, 名 and 姓, 名},
  journal={期刊名},
  volume={卷号},
  number={期号},
  pages={页码},
  year={2024},
  publisher={出版社},
  doi={10.xxxx/xxx}
}
```

**会议论文**:
```bibtex
@inproceedings{key2024,
  title={论文标题},
  author={姓, 名 and 姓, 名},
  booktitle={会议名},
  pages={页码},
  year={2024},
  organization={组织}
}
```

**预印本**:
```bibtex
@article{key2024,
  title={论文标题},
  author={姓, 名 and 姓, 名},
  journal={arXiv preprint arXiv:2401.xxxxx},
  year={2024}
}
```

### 引用Key命名规范

**推荐格式**: `第一作者姓氏年份`

示例:
- `jumper2021alphafold` - AlphaFold2
- `watson2023rfdiffusion` - RFdiffusion
- `chen2024survey` - 综述文章

**特殊情况**:
- 同作者同年多篇文章: `作者年份关键词`
- 多作者: 用第一作者
- 中文作者: 用拼音

### 引用分布策略

**每个章节的引用数量**:
- Introduction: 10-15个
- 核心章节: 30-50个/节
- 支撑章节: 15-25个/节
- Conclusion: 5-10个

**引用类型分布**:
- 方法学论文: 30-40%
- 应用案例: 20-30%
- 综述文章: 10-15%
- 数据库/工具: 10-15%
- 理论基础: 10-15%

---

## 📐 LaTeX最佳实践

### 文件组织

**主文件** (`main.tex`):
- 只包含文档类、包、基本设置
- 使用`\input{}`引入各章节
- 保持简洁

**章节文件** (`section*.tex`):
- 每个章节一个文件
- 不重复`\documentclass`等
- 清晰的注释

### 常用包

```latex
% 基础
\usepackage[utf8]{inputenc}
\usepackage{graphicx}
\usepackage{amsmath}

% 引用
\usepackage{natbib}

% 超链接
\usepackage{hyperref}

% 表格
\usepackage{booktabs}

% 图片
\usepackage{subfig}

% 代码
\usepackage{listings}
```

### 特殊字符转义

| 字符 | 转义 |
|------|------|
| & | \& |
| % | \% |
| $ | \$ |
| # | \# |
| _ | \_ |
| { } | \{ \} |
| ~ | \~{} |
| ^ | \^{} |

### 编译器选择

**推荐**: Tectonic
- 自动下载依赖
- 无需配置
- 跨平台

**命令**:
```bash
tectonic -X compile main.tex
```

---

## 🎓 进阶技巧

### 技巧1: 使用Git版本控制

```bash
# 初始化
git init
git add .
git commit -m "Initial commit"

# 写作过程中
git add sections/section2_xxx.tex
git commit -m "Complete section 2"

# 大修改前
git checkout -b major-revision
```

### 技巧2: 使用自动化工作流

```bash
# 创建Makefile
all: compile verify

compile:
	tectonic -X compile latex/main.tex

verify:
	python scripts/verify_citations.py
	python scripts/count_stats.py

watch:
	ls latex/sections/*.tex | entr make compile
```

### 技巧3: 文献管理工具集成

**Zotero导出到BibTeX**:
1. 安装Better BibTeX插件
2. 设置自动导出
3. 选择保持更新

**Mendeley导出**:
1. File → Export
2. 选择BibTeX格式
3. 保存到项目目录

### 技巧4: 协作写作

**Overleaf**:
- 实时协作
- 版本控制
- 评论功能

**Git + GitHub**:
- 分支管理
- Pull Request
- Code Review

---

## 📖 参考资源

### LaTeX学习

- [Overleaf Documentation](https://www.overleaf.com/learn)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)
- [BibTeX Guide](https://en.wikipedia.org/wiki/BibTeX)

### 学术写作

- [The Elements of Style](https://www.gutenberg.org/ebooks/37134)
- [Academic Phrasebank](https://www.phrasebank.manchester.ac.uk/)
- [Writing for Science](https://www.nature.com/documents/nature-final-artwork.pdf)

### 工具

- [Zotero](https://www.zotero.org/) - 文献管理
- [Overleaf](https://www.overleaf.com/) - 在线LaTeX
- [Grammarly](https://www.grammarly.com/) - 语法检查
- [Hemingway](https://hemingwayapp.com/) - 可读性检查

---

## 📝 更新日志

**v1.0.0 (2026-03-13)**:
- 初始版本
- 包含完整写作流程
- 包含自动化脚本
- 包含最佳实践checklist

---

## 🤝 贡献

如有改进建议，请:
1. 提交Issue
2. 提交Pull Request
3. 联系HOC

---

*此Skill基于"From Prediction to Design"综述写作经验总结而成。*
