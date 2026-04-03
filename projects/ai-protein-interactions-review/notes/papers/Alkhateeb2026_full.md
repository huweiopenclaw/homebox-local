# Advances in protein-protein interaction prediction: a deep learning perspective

**作者**: Noor Alkhateeb, Mamoun Awad
**期刊**: Frontiers in Bioinformatics
**年份**: 2026
**DOI**: 10.3389/fbinf.2025.1710937
**PMID**: 41574108

---

## Abstract

Protein–protein interactions (PPIs) are vital for regulating various cellular functions and understanding how diseases are developed. The traditional ways to identify the PPIs are costly and time-consuming. In recent years, the disruptive advances in deep learning (DL) have transformed computational PPI prediction by enabling automatic feature extraction from protein sequences and structures. This survey presents a comprehensive analysis of DL-based models developed for PPI prediction, including convolutional neural networks (CNNs), recurrent neural networks (RNNs), deep neural networks (DNNs), graph convolutional networks (GCNs), and ensemble architectures. The review compares their feature representations, learning strategies, and evaluation benchmarks, emphasizing their strengths and limitations in capturing complex dependencies and structural relationships. In addition, the paper elaborates on different benchmarks and biological databases that are commonly used in different experiments for performance comparison. Finally, we outline open challenges and future research directions to enhance model generalization, interpretability, and integration with biological knowledge for reliable PPI prediction.

---

## 1. Introduction

### 核心观点
- PPIs在基因复制、转录、翻译、细胞周期调控、信号转导、免疫反应等生理活动中起关键作用
- PPI mapping（"interactome"）对理解细胞功能和疾病机制至关重要
- PPIs disruption可导致细胞功能障碍，成为治疗靶点（尤其在癌症中）
- 典型PPI界面约1200-2000 Å²，但只有<5%的残基（hotspots）贡献大部分结合自由能

### 实验数据库
- ASEdb (Alanine Scanning Energetics Database)
- BID (Binding Interface Database)
- PINT (Protein-protein Interaction Thermodynamic)
- SKEMPI (Structural Database of Kinetics and Energetics of Mutant Protein Interactions)

### 计算方法分类
1. **知识方法** - 经验函数评估结合自由能变化
2. **分子模拟** - 丙氨酸扫描检测PPIs
3. **机器学习方法** - 更便捷的PPI预测

### 两种预测任务
1. **PPISP (PPI sites prediction)** - 预测孤立蛋白表面的相互作用位点
2. **Pair-wise interaction prediction** - 预测蛋白质对的界面残基（与docking相关）

---

## 2. Feature Generation

### 2.1 Sequence-based Features

| 特征 | 描述 | 维度 |
|------|------|------|
| **PSSM** | Position-specific scoring matrix | N×20 |
| **Evolutionary conservation** | 进化保守性 | - |
| **Residue conservation** | 残基保守性 | - |
| **Raw sequence (One-hot)** | 原始序列编码 | N×20 |
| **Position information (PI)** | 位置信息 | 1 |
| **HSP** | High-scoring segment pair | - |
| **ProtVec1D** | 3-mer氨基酸嵌入 | 100D |
| **HMM profiles** | Hidden Markov Models | - |

### 2.2 Structure-based Features

| 特征 | 描述 | 工具 |
|------|------|------|
| **Secondary structure** | 二级结构 (9D one-hot) | DSSP |
| **RSA** | Relative solvent accessibility | DSSP |
| **PKx** | 解离常数 | - |
| **3D-1D scores** | 三维-一维评分 | - |

### 2.3 Hybrid Features

- **Physical properties** (7D): steric parameter, polarizability, volume, hydrophobicity, isoelectric point, helix probability, sheet probability
- **Hydropathy index** - 疏水性指数
- **Physicochemical characteristics** - 原子数、静电电荷、氢键等

### 2.4 Energy-based Features

- **RAA** (Relative amino acid propensity) - 氨基酸结合倾向性
- **Van Der Waals energy** - 范德华能

### 2.5 Feature Selection Methods

- F-score
- Random Forest
- SVM-RFE
- Hybrid (F-score + mRMR + Decision Tree)

### 2.6 Feature Extraction

- **PCA** - 主成分分析
- **LDA** - 线性判别分析

---

## 3. Deep Learning Models

### 3.1 DNN (Deep Neural Networks)
- 多隐藏层深度嵌套网络架构
- 可自动从原始数据发现表示

### 3.2 CNN (Convolutional Neural Networks)
- 擅长捕获局部模式
- 适合识别相互作用模体或关键结合残基
- 结构：输入层 → 卷积层 → 子采样层 → 全连接层 → 输出层

### 3.3 RNN (Recurrent Neural Networks)
- 处理序列信息
- 适合捕获序列依赖和长程相互作用
- 蛋白质序列本质上是氨基酸线性链

### 3.4 GCN (Graph Convolutional Networks)
- 直接在图结构数据上操作
- 蛋白质可建模为图节点，边表示潜在相互作用
- 捕获蛋白质间关系依赖

### 3.5 Ensemble Learning
- 组合多个模型提高性能
- 弱学习器组合形成强学习器
- 示例：RF + Gradient Boosting + XGBoost + LightGBM → Logistic Regression

---

## 4. PPI Prediction Approaches

### 方法分类
- **Approach A**: 孤立蛋白的位点预测 (PPISP)
- **Approach B**: 蛋白质对的PPI预测

### 发表分析
- 约32篇DL-based PPI预测论文

### 研究贡献分类维度
1. 发表年份
2. 研究贡献
3. 方法类型
4. 数据集类型
5. 输入特征
6. 网络超参数

---

## 5. Comparative Assessment

### Benchmark Datasets

| 数据集 | 描述 |
|--------|------|
| Dset186 | 常用基准数据集 |
| Dset72 | 常用基准数据集 |
| Dset164 | 常用基准数据集 |

### Performance Metrics
- Accuracy, Precision, Recall, F1-score
- AUC-ROC, AUC-PR
- MCC (Matthews Correlation Coefficient)

---

## 6. Limitations and Future Directions

### 主要挑战
1. **数据质量与标注问题**
2. **模型泛化能力**
3. **可解释性**
4. **与生物学知识的整合**
5. **负样本定义**
6. **跨物种泛化**

### 未来方向
- 增强模型泛化
- 提高可解释性
- 整合生物学知识
- 可靠的PPI预测

---

## 关键贡献

1. **系统性综述** - 首次详细讨论蛋白质一级结构在PPI预测中的重要性
2. **特征分类** - 全面分析序列、结构、能量特征
3. **方法对比** - 按特征、基准、贡献、超参数、性能分类
4. **基准整理** - 整理常用数据集和评估指标

## 局限性

1. 主要聚焦序列特征，结构预测部分较少
2. 未深入讨论AlphaFold-Multimer等最新工具
3. 缺乏对实际应用案例的深入讨论

---

*提取日期: 2026-03-12*