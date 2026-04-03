# 文献检索追踪

## 检索策略

### 数据库
- [x] PubMed (主要)
- [x] Google Scholar (补充)
- [ ] Web of Science (待检索)
- [ ] CNKI/万方 (中文文献，访问受限)

### 关键词组合

**英文关键词**:
```
("protein-protein interaction" OR "PPI") 
AND 
("deep learning" OR "machine learning" OR "artificial intelligence" OR "neural network")
AND
("prediction" OR "modeling" OR "mapping")
```

**补充关键词**:
- AlphaFold, AlphaFold-Multimer, RoseTTAFold
- Graph neural network + protein
- Protein language model, ESM, ProtTrans
- Protein docking, protein complex
- Drug-target interaction

**中文关键词**:
- 蛋白质相互作用 + 深度学习
- 蛋白质-蛋白质相互作用预测
- PPI 预测 + 机器学习

---

## 核心文献清单

### 综述类 - PPI + AI (核心)

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 1 | Advances in PPI prediction: a deep learning perspective | Alkhateeb & Awad | 2026 | Front Bioinform | 41574108 | 📥待下载 | 方法全面，性能对比 |
| 2 | Predicting PPI from ML Representations | Subedy et al. | 2026 | Adv Exp Med Biol | 41652166 | 📥待下载 | 表示学习视角 |
| 3 | Bias in, bias out - AlphaFold-Multimer | Strom & Luck | 2025 | Curr Opin Struct Biol | 39938238 | 📥待下载 | 批判性分析 |

### 综述类 - 蛋白质语言模型

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 4 | Protein Language Models: Applications and Perspectives | Leclercq & Droit | 2026 | J Proteome Res | 41452662 | 📥待下载 | pLM 全面综述 |
| 5 | A survey on LLMs in biology and chemistry | Ashyrmamatov et al. | 2025 | Exp Mol Med | 41258076 | 📥待下载 | 跨领域 |

### 综述类 - 图神经网络

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 6 | Graph Learning in Bioinformatics | Deng et al. | 2026 | Biomolecules | 41750401 | 📥待下载 | GNN 全面，含 PPI |

### 综述类 - AlphaFold

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 7 | Advantages and Limitations of AlphaFold | Li et al. | 2026 | Protein J | 41326937 | 📥待下载 | 综合分析 |
| 8 | The rise of AlphaFold in drug design | Stecula et al. | 2025 | Prog Med Chem | 41130640 | 📥待下载 | 药物设计应用 |

### 综述类 - 药物靶点相互作用

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 9 | DL for Drug-Target Interaction Prediction | Chen et al. | 2025 | Chem Biol Drug Des | 41121622 | 📥待下载 | DTI 全面 |
| 10 | Unified survey on DTI prediction | Wang et al. | 2026 | Biotechnol Adv | 41690335 | 📥待下载 | 高 IF |

### 综述类 - 综合

| # | 标题 | 作者 | 年份 | 期刊 | PMID | 状态 | 笔记 |
|---|------|------|------|------|------|------|------|
| 11 | AI and ML in Biology: From Genes to Proteins | Hein et al. | 2025 | Biology | 41154856 | 📥待下载 | 全面 |

---

## 方法类文献 (待补充)

| # | 标题 | 作者 | 年份 | 方法 | 状态 | 笔记 |
|---|------|------|------|------|------|------|
| 1 | | | | | | |

---

## 应用类文献 (待补充)

| # | 标题 | 作者 | 年份 | 应用 | 状态 | 笔记 |
|---|------|------|------|------|------|------|
| 1 | | | | | | |

---

## 检索记录

### 2026-03-12
- ✅ PubMed 检索完成
- ✅ 发现 150+ 相关综述，筛选出 11 篇核心文献
- ✅ 完成《现有综述文献分析报告》
- ⏳ 待下载核心文献全文
- ⏳ 待补充 CNKI 中文文献检索

### 下一步
1. ⚠️ 自动下载失败 (SSL/TLS网络问题)
2. ✅ 已创建详细下载清单: `notes/download-list.md`
3. ✅ 已创建4篇核心文献摘要笔记
4. ⏳ 待手动下载PDF全文

---

## 下载链接

### PMC 开放获取文献
- PMID 41574108: https://pmc.ncbi.nlm.nih.gov/articles/PMC12819794/
- PMID 41452662: https://pmc.ncbi.nlm.nih.gov/articles/PMC12888012/
- PMID 41750401: https://pmc.ncbi.nlm.nih.gov/articles/PMC12938586/
- PMID 41326937: https://pmc.ncbi.nlm.nih.gov/articles/PMCxxxxx/ (待确认)

### DOI 链接
- Frontiers: https://doi.org/10.3389/fbinf.2025.1710937
- J Proteome Res: https://doi.org/10.1021/acs.jproteome.5c00506
- Biomolecules: https://doi.org/10.3390/biom16020333