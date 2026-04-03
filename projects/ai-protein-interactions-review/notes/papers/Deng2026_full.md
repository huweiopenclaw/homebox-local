# Graph Learning in Bioinformatics: A Survey of Graph Neural Network Architectures, Biological Graph Construction and Bioinformatics Applications

**作者**: Deng L, et al.
**期刊**: Biomolecules
**年份**: 2026
**PMID**: 41750401
**DOI**: 10.3390/biom16020333

---

## Abstract

Graph Neural Networks (GNNs) have become a central methodology for modelling biological systems where entities and their interactions form inherently non-Euclidean structures. From protein interaction networks and gene regulatory circuits to molecular graphs and multi-omics integration, the relational nature of biological data makes GNNs particularly well-suited for capturing complex dependencies that traditional deep learning methods fail to represent. Despite their rapid adoption, the effectiveness of GNNs in bioinformatics depends not only on model design but also on how biological graphs are constructed, parameterised and trained.

---

## 核心框架: 三维视角

### 维度 1: 图构建与表示
### 维度 2: GNN 架构
### 维度 3: 生物医学应用

---

## 1. 生物网络类型

### 1.1 蛋白质-蛋白质相互作用网络 (PPI)
- **节点**: 蛋白质
- **边**: 物理/功能相互作用
- **假设**: 蛋白功能由局部邻域上下文和网络拓扑塑造
- **应用**: 疾病-基因关联预测、通路富集分析、药物靶点识别

### 1.2 基因调控网络 (GRN)
- **节点**: 基因/调控因子
- **边**: 激活/抑制关系 (有向)
- **特点**: 层级性、上下文依赖、时间控制
- **挑战**: 不对称性、反馈回路、条件特异性重连

### 1.3 分子图
- **节点**: 原子/氨基酸残基
- **边**: 共价键/空间邻近
- **假设**: 分子性质源于局部化学环境和结构配置
- **应用**: 量子性质预测、药物筛选、药物-靶点相互作用

### 1.4 知识图谱与异质生物图
- **节点**: 基因、蛋白质、疾病、药物、表型、通路
- **边**: 跨尺度、跨域关系
- **应用**: 药物重定位、疾病机制阐明、多组学关联分析

---

## 2. 数据特征与挑战

| 挑战 | 描述 |
|------|------|
| **噪声** | 实验测量不确定性 |
| **不完整性** | 网络稀疏、缺失边 |
| **异质性** | 多数据源不一致 |
| **上下文依赖** | 条件特异性变化 |

### 代表性数据集

| 数据集 | 任务 | 图类型 | 规模 |
|--------|------|--------|------|
| QM9 | 量子性质预测 | 分子图 | 133,885 |
| ZINC | 分子性质预测 | 分子图 | 12,000 |
| D&D | 蛋白质分类 | 蛋白结构图 | 1,178 |
| MoleculeNet | 多任务 | 分子图 | 7,831 |
| ChEMBL | 药物-靶点 | 生物活性 | 100,000+ |
| PPI | 系统生物学 | PPI 网络 | 24 graphs |

---

## 3. 图构建策略

### 3.1 共现/相似性构建
- 单细胞 RNA-seq: 细胞为节点，kNN/Gaussian 核计算相似性
- 疾病-基因关联: ICD/GO term 共现频率

### 3.2 先验知识构建
- STRING 数据库构建 PPI 网络
- KEGG 通路构建代谢反应图

### 3.3 图结构优化方法

| 方法 | 原理 | 目的 |
|------|------|------|
| **GSL** (Graph Structure Learning) | 邻接矩阵作为可学习参数 | 动态调整边权重/拓扑 |
| **Curvature Rewiring** | Jost-Liu 曲率识别瓶颈边 | 缓解 over-smoothing/over-squashing |
| **Effective Resistance** | 最小化总有效电阻 | 统一边删除/插入优化 |
| **Edge Removal Sampling** | 概率性/策略性删除边 | 稀疏化、防止过平滑 |

### Curvature Rewiring 公式

Jost-Liu 曲率计算:
```
JLC(i,j) = 2/di + 2/dj - 2 + 2·#(i,j)/max(di,dj) + ...
```
- 曲率越小 = 瓶颈边 = 可能被删除
- 曲率越大 = 局部冗余 = 可能添加边

---

## 4. GNN 架构

### 4.1 谱方法 vs 空间方法

**谱方法**:
- 基于图拉普拉斯矩阵特征分解
- 图傅里叶变换
- 公式: x * h_G = U((U^T h) ⊙ (U^T x))

**空间方法**:
- 直接在图结构上消息传递
- 更直观、计算效率更高

### 4.2 主要架构

| 架构 | 特点 | 适用场景 |
|------|------|----------|
| **GCN** | 谱+空间结合，固定聚合权重 | 均匀图、节点分类 |
| **GAT** | 注意力加权邻居聚合 | 异质邻居重要性 |
| **GraphSAGE** | 采样+聚合，可扩展 | 大规模图、归纳学习 |
| **GIN** | 可区分同构图 | 图分类、结构敏感任务 |
| **Transformer-based** | 全局注意力 | 长程依赖、动态图 |

### 4.3 高级范式

- **Self-supervised GNN**: 对比学习、图掩码
- **Heterogeneous GNN**: 多类型节点/边
- **Dynamic GNN**: 时序图、演化网络

---

## 5. 应用领域

### 5.1 疾病-基因关联预测
- 网络邻近性、模块检测
- GNN 传播疾病信号

### 5.2 药物发现
- 分子性质预测
- 药物-靶点相互作用
- 构效关系学习

### 5.3 蛋白质结构与功能 ⭐
- 残基级依赖建模
- 结构域组织
- 相互作用界面识别

### 5.4 多组学整合
- 跨模态关联图
- 系统级分析

### 5.5 生物医学知识图谱
- 药物重定位
- 副作用预测
- 作用机制推断

---

## 6. 训练考量

### 优化技术
- 学习率调度
- 批归一化
- 残差连接

### 正则化策略
- Dropout
- Edge Dropout
- Layer normalization

### 生物数据特有挑战
- 数据稀疏性
- 类别不平衡
- 噪声标签

---

## 7. 未来挑战

| 挑战 | 描述 |
|------|------|
| **时间建模** | 动态生物过程 |
| **可解释性** | 生成可检验假设 |
| **多模态融合** | 整合异质数据源 |
| **图质量** | 噪声、不完整性影响 |
| **可扩展性** | 大规模生物网络 |
| **泛化能力** | 跨物种、跨条件迁移 |

---

## 与 PPI 预测的关键关联

### GNN 在 PPI 中的优势
1. **关系建模**: 直接在相互作用图上学习
2. **端到端**: 无需手工特征工程
3. **可解释**: 注意力权重揭示关键相互作用
4. **多尺度**: 残基级到网络级整合

### 方法框架
```
PPI 图构建 → GNN 架构选择 → 下游任务
     ↓              ↓            ↓
STRING/HPRD    GCN/GAT/...   疾病基因/药物靶点
```

### 代表性应用
- 蛋白质功能预测
- 相互作用界面识别
- 疾病模块发现
- 药物靶点优先排序

---

*提取日期: 2026-03-12*