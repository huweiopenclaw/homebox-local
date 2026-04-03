# 文献摘要笔记: Leclercq & Droit (2026)

## 基本信息
- **标题**: Protein Language Models: Applications and Perspectives
- **作者**: Mickael Leclercq, Arnaud Droit
- **期刊**: Journal of Proteome Research
- **年份**: 2026
- **PMID**: 41452662
- **DOI**: 10.1021/acs.jproteome.5c00506
- **开放获取**: PMC12888012

---

## 摘要

最初为人类文本开发的大语言模型 (LLMs) 已被适应到蛋白质组学中，成为蛋白质语言模型 (pLMs)。这些模型将氨基酸序列视为句子，并从数百万序列中学习模式。pLMs被用于多项关键任务，包括蛋白质结构预测、蛋白质功能注释、设计具有特定特征的新蛋白质序列，以及映射蛋白质与其他分子之间的相互作用。与传统方法相比，pLMs提供更快速的洞察，但需要大量计算资源和仔细的数据管理。开发者正专注于通过探索更高效的训练技术和更小的模型来减少预测不准确性和偏差，以降低所需资源。随着序列数据库的持续增长，pLMs将改进以揭示蛋白质与疾病通路之间的联系，加速药物开发和基础研究，同时提供支持实验设计和验证的蛋白质组规模的新洞察。

---

## 关键词
- biophysical property prediction
- computational scalability and efficiency
- de novo protein sequence generation
- post-translational modification prediction
- protein function annotation
- protein language models (pLMs)
- protein structure prediction
- protein−protein interaction modeling
- sequence embeddings
- transformer architectures

---

## 主要内容框架

### 1. pLM发展时间线
- ESM系列 (Facebook/Meta)
- ProtTrans系列
- ProtBERT, ProtT5
- AlphaFold的序列编码器

### 2. 应用领域
| 应用 | 方法 | 效果 |
|------|------|------|
| 结构预测 | 序列嵌入→结构预测 | 接近实验精度 |
| 功能注释 | 序列相似性+功能域 | 大规模自动化 |
| 序列设计 | 生成模型 | 定向进化 |
| PPI建模 | 相互作用界面预测 | 高通量筛选 |

### 3. 挑战与局限
- 计算资源需求大
- 训练数据偏差
- 预测可解释性
- 长序列处理困难

---

## 与PPI的关联

pLMs在PPI预测中的应用：
1. **序列嵌入作为特征**
   - 替代传统特征工程
   - 捕获进化信息

2. **相互作用界面预测**
   - 基于序列预测结合位点
   - 辅助结构预测

3. **PPI网络分析**
   - 蛋白质功能相似性
   - 网络模块识别

---

## 可借鉴之处

1. **pLM发展时间线图** - 可用于综述背景部分
2. **应用分类框架** - 按功能组织方法
3. **挑战讨论** - 计算资源、数据偏差

---

*笔记创建: 2026-03-12*