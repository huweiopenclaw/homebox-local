# Protein Language Models: Applications and Perspectives

**作者**: Leclercq M, Droit A
**期刊**: Journal of Proteome Research
**年份**: 2026
**PMID**: 41452662
**DOI**: 10.1021/acs.jproteome.5c00506

---

## Abstract

Large language models (LLMs) originally developed for human text have been adapted to proteomics as protein language models (pLMs). These models treat amino acid sequences like sentences, and they learn patterns from millions of sequences. pLMs are used for several key tasks, including the prediction of protein structures, annotating protein functions, designing novel protein sequences with specific characteristics, and mapping the interactions between proteins and other molecules. Compared with traditional approaches, pLMs deliver insights more quickly but demand large computing resources and careful data management. Developers are focused on decreasing prediction inaccuracies and biases by exploring more efficient training techniques and smaller models to decrease the resources required. As sequence databases continue to grow, pLMs will improve to uncover links between proteins and disease pathways, speeding drug development and basic research while offering new proteome-scale insights that support experimental design and validation.

---

## 核心内容框架

### 1. pLM 基础概念

**蛋白质序列作为"语言"**:
- 氨基酸 = 单词/Token
- 蛋白质序列 = 句子
- 使用 Transformer 架构捕获上下文关系

**Tokenization**:
- 每个氨基酸分配唯一 token
- 例: "MVLSPADKT" → ["M", "V", "L", "S", "P", "A", "D", "K", "T"]
- 转换为数值向量编码序列上下文

**训练数据**:
- UniRef, UniProt, Big Fantastic Database
- 数百万蛋白质序列
- 同源性感知评估 (避免数据泄漏)

### 2. 主要 pLM 模型

| 模型 | 参数量 | 特点 |
|------|--------|------|
| **ESM-2** | 614M 序列预训练 | 自监督学习，广泛下游应用 |
| **ProtGPT2** | 738M | 自回归生成，50M UniRef50 |
| **ProGen/ProGen2** | 6.4B | 条件生成，280M 序列 |
| **ProtTrans** | - | 大规模预训练 |
| **ProteinBERT** | - | 联合 MLM + GO 注释预测 |
| **ProtT5** | - | 序列-结构联合学习 |
| **ESMFold** | - | 单序列结构预测 |

### 3. 应用领域

#### 3.1 蛋白质序列生成
- **ProGen**: 生成功能蛋白 (人工溶菌酶，活性可比天然)
- **ProtGPT2**: 探索未知序列空间
- **条件生成**: 通过控制标签引导特定属性

#### 3.2 蛋白质功能预测
- 酶活性预测 (EC numbers)
- 结合位点识别
- 超越 BLAST 的同源性方法

#### 3.3 结构预测
- 二级结构预测
- 接触图推断
- RGN2: 端到端骨架坐标预测
- ProstT5: 序列-结构 token 映射

#### 3.4 翻译后修饰 (PTM) 预测
- 磷酸化、乙酰化、泛素化、糖基化
- DeepPTM: ProtBERT + ViT
- PTM-GPT2: 19 种修饰类型
- PTM-Mamba: PTM token 融合

#### 3.5 进化与突变预测
- 突变效应预测
- 稳定性预测 (ESMtherm, TemPL)
- 零样本预测能力

#### 3.6 生物物理性质预测
- 溶解性预测 (NetSolP)
- 聚集倾向
- 相分离 (LLPS)
- 荧光强度

#### 3.7 蛋白质-蛋白质相互作用 ⭐

**关键方法**:
- **ProtBert-BiGRU-Attention**: 序列预测二值 PPI
- **MINT**: 多聚体相互作用 Transformer，交叉注意力处理多蛋白序列
- **SWING**: 建模蛋白质-蛋白质/肽相互作用语言
- **DiffPALM**: MSA-based transformer，检测共进化信号

**结合亲和力预测**:
- **ProBASS**: ESM-2 + ESM-IF1，预测 ΔΔG
- **DG-Affinity**: 抗体-抗原亲和力
- **AntiFormer**: Transformer + GNN

#### 3.8 抗原-受体结合
- TCR-pMHC 结合预测
- 抗体-抗原结合
- 模型: tcrLM, TAPIR, SC-AIR-BERT, MHCRoBERTa

### 4. 挑战与局限

| 挑战 | 描述 |
|------|------|
| **可解释性** | 黑盒模型，难以生物学解释 |
| **数据偏差** | 训练数据偏向特定物种/蛋白家族 |
| **训练-测试泄漏** | 序列/元数据重叠，夸大泛化能力 |
| **Tokenization** | 缺乏明确词边界，单残基 token 缺失高阶模体 |
| **泛化能力** | 稀有/未见家族表现差 |
| **可扩展性** | 二次复杂度，长序列受限 |
| **微调困难** | 有限标注数据易过拟合 |

### 5. 未来方向

1. **结构预测**: 结合进化谱 + 物理精修
2. **动态建模**: 内在无序区、构象变化
3. **功能注释**: 替代手工特征
4. **转化应用**: 药物开发、疫苗设计、个性化医学

---

## 与 PPI 的关键关联

### pLM 在 PPI 预测中的优势
1. **端到端学习**: 从序列直接预测相互作用
2. **长程依赖**: Transformer 捕获远距离残基关系
3. **零样本泛化**: 无需任务特定训练数据
4. **嵌入表示**: 高维向量编码功能信号

### 代表性工作
- **MINT**: 交叉注意力学习相互作用链表示，AUPRC ~0.69
- **ProBASS**: 结合亲和力变化预测，r ≈ 0.8
- **ESM 嵌入**: 广泛用于 PPI 分类器输入

### 局限性
- 序列单一模型可能缺失构象/上下文效应
- 依赖大量标注数据微调
- 缺乏结构上下文

---

*提取日期: 2026-03-12*