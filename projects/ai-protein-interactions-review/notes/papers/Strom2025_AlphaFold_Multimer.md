# Bias in, bias out - AlphaFold-Multimer and the structural complexity of protein interfaces

**作者**: Strom JM, Luck K
**期刊**: Current Opinion in Structural Biology
**年份**: 2025
**PMID**: 39938238
**DOI**: 10.1016/j.sbi.2025.103002

---

## Abstract

A structural understanding of protein-protein interactions is a key component of many facets of applied molecular biology research. AlphaFold-Multimer (AF-MM) provided a breakthrough in the ability to predict protein-protein interface structure. However, the available training data for this model and the resulting benchmarking and validation efforts show a bias toward interactions between more ordered regions of proteins. Here we highlight some of the successes and limitations of AF-MM and discuss available methods and future directions to enable balanced prediction of all interface types.

---

## 核心观点

### AF-MM 的突破
- 蛋白质-蛋白质界面结构预测的重大进展
- 能够预测多聚体复合物结构

### 关键问题：数据偏差

| 偏差类型 | 描述 |
|----------|------|
| **训练数据偏差** | 偏向有序区域之间的相互作用 |
| **基准测试偏差** | 验证数据同样偏向有序区域 |
| **界面类型偏差** | 无序区域界面预测能力不足 |

### 界面结构复杂性

**有序区域界面**:
- 结构稳定、可预测
- AF-MM 表现良好

**无序区域界面**:
- 构象动态、难预测
- AF-MM 训练数据不足
- 预测准确度下降

### 未来方向
1. 平衡训练数据覆盖所有界面类型
2. 开发专门针对无序区域的预测方法
3. 整合多种验证策略

---

## 与 PPI 预测的关联

### 对综述写作的启示
1. **批判性视角**: 需要指出 AF-MM 的局限性
2. **差异化定位**: 强调界面类型多样性
3. **方法论讨论**: 训练数据偏差对模型泛化的影响

---

*提取日期: 2026-03-12*