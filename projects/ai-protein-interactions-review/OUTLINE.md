# From Prediction to Design: A Paradigm Shift in AI-Driven Protein-Protein Interaction Research

## 论文基本信息 | Paper Information

| 项目 | 内容 |
|------|------|
| **Title** | From Prediction to Design: A Paradigm Shift in AI-Driven Protein-Protein Interaction Research |
| **中文标题** | 从预测到设计：AI驱动的蛋白质相互作用研究的范式转变 |
| **Article Type** | Review Article |
| **Target Journal** | Nature Reviews Molecular Cell Biology (IF ~100) / Current Opinion in Structural Biology (IF ~6) / Trends in Biochemical Sciences (IF ~14) |
| **Expected Length** | 6000-8000 words (main text) |
| **References** | ~150-200 key references |
| **Figures** | 4-6 main figures |
| **Tables** | 2-3 tables |

---

## 核心论点 | Core Thesis

**中心思想：** AI驱动的蛋白质-蛋白质相互作用(PPI)研究正在经历一个根本性的范式转变——从"预测会发生什么"到"设计我们想要什么"。这一转变由蛋白质语言模型、扩散模型、等变神经网络等技术突破共同驱动，将深刻影响药物发现、合成生物学等领域的研究范式。

**核心贡献：**
1. 首次系统阐述PPI研究中"预测→设计"的范式转变
2. 基于271篇文献分析，绘制完整的技术演进路径图
3. 解构设计范式的技术基础、核心任务与关键挑战
4. 提出预测-设计融合的未来发展方向

---

## 详细大纲 | Detailed Outline

---

### 1. Introduction | 引言

**字数：** ~800 words

#### 1.1 PPI的科学重要性
- 蛋白质-蛋白质相互作用是细胞生命活动的分子基础
- 估计人类细胞中存在~650,000种PPIs (BioPlex估计)
- PPI异常与疾病的关联：癌症、神经退行性疾病、感染性疾病
- PPI作为药物靶点：~60%的药物靶点涉及PPI

**关键引用：**
- BioPlex 3.0 (Huttlin et al., 2021, Cell)
- STRING数据库 (Szklarczyk et al., 2021, NAR)
- DIP数据库 (Xenarios et al., 2002, NAR)

#### 1.2 AI在PPI研究中的角色演变
- **早期阶段 (2001-2015)：** 经典机器学习（SVM、随机森林）
- **深度学习阶段 (2016-2020)：** CNN、RNN引入序列处理
- **Transformer时代 (2021-2022)：** 蛋白质语言模型爆发
- **生成式AI阶段 (2023-present)：** 从预测到设计的转变

**关键引用：**
- Bock & Gough (2001) - 首次SVM用于PPI预测
- PIPR (Chen et al., 2019) - 残差RCNN标杆
- ESM-2 (Lin et al., 2023, Science) - 150亿参数PLM

#### 1.3 本文视角：预测→设计的范式转变
- 定义"预测范式"：给定输入，推断输出
- 定义"设计范式"：给定目标，创造解决方案
- 范式转变的技术驱动力
- 本文的结构安排

**写作要点：**
- 开篇要有冲击力，吸引读者
- 清晰界定文章范围和独特视角
- 为读者提供明确的阅读路线图

---

### 2. The Prediction Paradigm: Methods and Limitations

**字数：** ~1500 words

#### 2.1 任务分类与方法概览

**PPI预测任务分类：**

| 任务类型 | 输入 | 输出 | 代表方法 |
|----------|------|------|----------|
| 二元分类 | 蛋白质序列对 | 是否相互作用 | PIPR, D-SCRIPT |
| 网络推断 | 蛋白质集合 | 相互作用网络 | STRING, GNN方法 |
| 结合位点预测 | 单蛋白序列/结构 | 界面残基 | MaSIF, GraphPPIS |
| 亲和力预测 | 复合物+突变 | ΔΔG | FoldX, mCSM-PPI2 |
| 复合物结构 | 蛋白质序列对 | 3D复合物结构 | AF-Multimer, DiffDock-PP |

#### 2.2 序列预测方法

**演进路径：**
```
手工特征 → 深度学习 → 预训练模型

├── 手工特征时代
│   ├── 氨基酸组成 (AAC)
│   ├── 联合三元组 (Shen et al., 2007)
│   ├── PSSM进化信息
│   └── 自协方差描述符 (Guo et al., 2008)
│
├── 深度学习时代
│   ├── DeepPPI (Du et al., 2017) - 首次DNN
│   ├── DPPI (Hashemifar et al., 2018) - Siamese CNN
│   └── PIPR (Chen et al., 2019) - 残差RCNN
│
└── 预训练模型时代
    ├── ESM嵌入 + 微调
    ├── ProtTrans嵌入
    └── PLM-interact (2025) - 专用PPI-PLM
```

**关键引用：**
- Shen et al. (2007, PNAS) - 联合三元组
- PIPR (Chen et al., 2019, Bioinformatics)
- D-SCRIPT (Sledzieski et al., 2021, Bioinformatics)
- PLM-interact (Zhao et al., 2025, Nature Communications)

#### 2.3 结构预测方法

**复合物结构预测的里程碑：**

| 时间 | 方法 | 贡献 |
|------|------|------|
| 2003 | HADDOCK | 信息驱动对接，引入实验约束 |
| 2014 | ZDOCK 3.0 | FFT加速，形状互补评分 |
| 2017 | ClusPro | 自动化对接服务器 |
| 2021 | RoseTTAFold | 三轨道神经网络 |
| 2022 | AlphaFold-Multimer | 多链复合物预测突破 |
| 2023 | DiffDock-PP | 扩散模型用于对接 |
| 2024 | AlphaFold 3 | 通用分子相互作用预测 |

**关键引用：**
- HADDOCK (Dominguez et al., 2003, JACS)
- AlphaFold-Multimer (Evans et al., 2022)
- DiffDock-PP (Ketata et al., 2023, ICLR)
- AlphaFold 3 (Abramson et al., 2024, Nature)

#### 2.4 预测范式的根本局限性

**局限性一：数据依赖性**
- 预测模型依赖已有数据，难以外推到新颖相互作用
- 训练数据偏向模式生物（人类、酵母、小鼠）
- 负样本构建的系统性偏差

**局限性二：评估困境**
- 数据泄漏导致性能高估（Bernett et al., 2024）
- 不同研究采用不同评估协议，难以公平比较
- "简单vs困难"预测问题（Park & Marcotte, 2012）

**局限性三：被动发现模式**
- 预测回答"是否会相互作用"，而非"如何创造相互作用"
- 对于新药开发，研究者需要的是设计能力而非预测能力
- 预测无法直接指导蛋白质工程

**局限性四：静态假设**
- 大多数方法假设PPI是静态的
- 忽略时间依赖性、组织特异性、条件响应性
- 动态相互作用网络的建模不足

**关键引用：**
- Bernett et al. (2024, Briefings in Bioinformatics) - 数据泄漏分析
- Park & Marcotte (2012, Proteins) - 简单vs困难预测
- McGary & Marcotte (2010, Briefings in Bioinformatics) - 动态相互作用组

---

### 3. The Emergence of Design Paradigm

**字数：** ~1500 words

#### 3.1 范式转变的技术驱动力

**驱动力一：结构预测能力的突破**
- AlphaFold2 (2021)：单体结构预测接近实验精度
- AlphaFold-Multimer (2022)：复合物预测突破
- AlphaFold 3 (2024)：通用分子相互作用预测
- 意义：提供高质量的"设计参考"和"验证工具"

**驱动力二：生成式模型的引入**
- 扩散模型在图像生成的成功→迁移到蛋白质结构
- DiffDock (2022) 展示扩散模型用于分子对接的可行性
- RFdiffusion (2023) 实现通用蛋白质骨架生成
- 意义：从"判别式"到"生成式"的能力跃迁

**驱动力三：蛋白质语言模型的规模化**
- ESM-2 (2023)：150亿参数，从序列预测结构
- SaProt (2024)：结构感知词表
- MINT (2025)：专用PPI建模
- 意义：学习蛋白质空间的隐含规律，为设计提供"语言知识"

**驱动力四：等变神经网络的发展**
- SE(3)-Transformer：旋转平移等变
- GVP (Jing et al., 2021)：几何向量感知器
- EGNN, PaiNN：能量守恒等变网络
- 意义：尊重物理对称性，保证生成结构的物理合理性

**关键引用：**
- AlphaFold2 (Jumper et al., 2021, Nature)
- RFdiffusion (Watson et al., 2023, Nature)
- ESM-2 (Lin et al., 2023, Science)
- GVP (Jing et al., 2021, ICLR)

#### 3.2 关键里程碑工作

**里程碑一：RFdiffusion (2023, Nature)**
```
贡献：
- 首次实现通用蛋白质骨架生成
- 可条件生成：给定靶点，生成结合蛋白骨架
- 实验验证：设计的结合蛋白有功能活性

技术要点：
- 基于RoseTTAFold的预训练表示
- 扩散模型生成骨架坐标
- 条件生成支持多种设计任务

影响力：
- 引用数快速增长（>500 in 2 years）
- 开启"蛋白质设计"研究热潮
```

**里程碑二：ProteinMPNN (2022, Science)**
```
贡献：
- 给定骨架结构，设计序列
- 解决"骨架→序列"的逆向折叠问题
- 高成功率：实验验证>50%

技术要点：
- 图神经网络处理骨架图
- 自回归序列生成
- 支持部分序列约束

影响力：
- 与RFdiffusion形成设计闭环
- 成为序列设计的标准工具
```

**里程碑三：AlphaProteo (2024)**
```
贡献：
- DeepMind的蛋白质结合体设计系统
- 针对多种靶蛋白设计高亲和力结合剂
- 实验验证：多个设计达到nM级别亲和力

技术要点：
- 结合结构预测与生成模型
- 大规模虚拟筛选+优化
- 湿实验验证闭环

影响力：
- 证明AI设计蛋白质的实用性
- 展示从预测到设计的完整流程
```

**里程碑四：AlphaFold 3 (2024, Nature)**
```
贡献：
- 统一框架：蛋白质-DNA/RNA/小分子/离子相互作用
- 扩展了"可预测"的相互作用类型
- 为设计提供更全面的参考

技术要点：
- 多模态输入处理
- 扩散模型生成复合物结构
- 通用分子相互作用建模

影响力：
- 重新定义PPI预测的范围
- 为设计更复杂的分子系统提供基础
```

#### 3.3 预测与设计的关系

```
预测与设计的辩证关系：

┌─────────────────────────────────────────────────────────┐
│                     预测能力                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              设计能力                            │   │
│  │   ┌─────────────────────────────────────────┐   │   │
│  │   │         验证能力                         │   │   │
│  │   │  (设计结果需要预测模型验证)              │   │   │
│  │   └─────────────────────────────────────────┘   │   │
│  │   (设计依赖于预测模型提供的结构/功能知识)       │   │
│  └─────────────────────────────────────────────────┘   │
│  (预测是设计的基础能力)                                 │
└─────────────────────────────────────────────────────────┘

设计流程中的预测应用：
1. 靶点结构预测（AlphaFold）
2. 设计候选生成（RFdiffusion）
3. 序列优化（ProteinMPNN）
4. 结构验证（AlphaFold预测设计物的结构）
5. 亲和力预测（验证设计质量）
```

**关键引用：**
- RFdiffusion (Watson et al., 2023, Nature)
- ProteinMPNN (Dauparas et al., 2022, Science)
- AlphaProteo (Zambaldi et al., 2024)
- AlphaFold 3 (Abramson et al., 2024, Nature)

---

### 4. Core Tasks in the Design Era

**字数：** ~1200 words

#### 4.1 蛋白质结合体设计 (Protein Binder Design)

**任务定义：**
- 输入：靶蛋白结构/序列
- 输出：能够特异性结合靶蛋白的蛋白质序列和结构
- 应用：治疗性结合蛋白、实验工具蛋白、生物传感器

**方法分类：**

| 方法类型 | 代表工作 | 技术路线 |
|----------|----------|----------|
| 基于骨架生成 | RFdiffusion | 扩散模型生成骨架+ProteinMPNN设计序列 |
| 基于模板设计 | 实验结构模板 | 模板匹配+序列优化 |
| 端到端设计 | AlphaProteo | 联合优化序列和结构 |

**技术要点：**
- 表位选择：确定靶蛋白上的结合位点
- 骨架设计：生成互补的骨架结构
- 序列优化：设计具有稳定性和亲和力的序列
- 筛选验证：预测亲和力、特异性、可表达性

**关键引用：**
- RFdiffusion binder design (Watson et al., 2023)
- Cao et al. (2022) - 设计SARS-CoV-2中和蛋白
- AlphaProteo (2024)

#### 4.2 抗体设计 (Antibody Design)

**任务特殊性：**
- 抗体具有高度保守的框架区和高度可变的CDR区
- CDR-H3是决定特异性的关键，也是设计难点
- 需要考虑可开发性（稳定性、免疫原性等）

**方法进展：**

| 方法 | 功能 | 技术路线 |
|------|------|----------|
| DeepAb/IgFold | 抗体结构预测 | 深度学习预测CDR构象 |
| ImmuneBuilder | 免疫蛋白结构预测 | 专门化的抗体/TCR/NB预测 |
| ABodyBuilder3 | 抗体结构预测 | ESM嵌入+优化 |
| HADDOCK-AI | 抗体-抗原对接 | 结构预测+对接 |

**设计流程：**
```
抗原表位识别 → CDR设计 → 框架区优化 → 整体稳定性评估 → 实验验证
```

**关键引用：**
- DeepAb (Ruffolo et al., 2022, Patterns)
- IgFold (Ruffolo et al., 2023, Nature Communications)
- ImmuneBuilder (Abanades et al., 2023, Communications Chemistry)
- HADDOCK-AI (Giulini et al., 2024, Bioinformatics)

#### 4.3 相互作用界面优化 (Interface Optimization)

**任务类型：**
- **亲和力提升：** 增强结合强度
- **特异性改造：** 改变结合偏好
- **稳定性优化：** 提高复合物稳定性

**技术路线：**

```
给定：复合物结构 + 优化目标

方法一：序列突变扫描
├── 基于物理方法：FoldX, Rosetta ddG
├── 基于学习的方法：mCSM-PPI2, GeoPPI
└── 结合亲和力预测模型指导突变设计

方法二：界面重新设计
├── 固定骨架，重新设计界面残基
├── 使用ProteinMPNN或类似工具
└── 筛选高亲和力候选

方法三：骨架调整
├── 使用扩散模型微调界面区域
├── RFdiffusion partial diffusion
└── 保持整体结构，优化界面几何
```

**关键引用：**
- FoldX (Guerois et al., 2005, NAR)
- mCSM-PPI2 (Rodrigues et al., 2019, NAR)
- GeoPPI (Liu et al., 2021, PLOS Computational Biology)
- DDMut-PPI (Zhou et al., 2024, NAR)

#### 4.4 全新相互作用网络设计 (De Novo Network Design)

**前沿方向：**
- 设计全新的蛋白质-蛋白质相互作用对
- 构建人工信号通路
- 设计自组装蛋白复合物

**挑战：**
- 需要同时设计多个蛋白质
- 保证相互作用特异性（避免交叉反应）
- 维持各蛋白的独立稳定性

**代表性工作：**
- 设计symmetric oligomers (Bennett et al.)
- 设计自组装蛋白笼 (Hsia et al., Nature)

---

### 5. Key Enabling Technologies

**字数：** ~1200 words

#### 5.1 生成式模型 (Generative Models)

**扩散模型 (Diffusion Models):**
```
原理：
- 前向过程：逐步添加噪声
- 反向过程：学习去噪
- 条件生成：给定靶点，生成结合蛋白

在PPI中的应用：
├── DiffDock-PP: 蛋白质对接
├── RFdiffusion: 蛋白质骨架生成
├── FrameDiff: 刚体运动扩散
└── Chroma: 全原子蛋白质生成
```

**自回归模型 (Autoregressive Models):**
```
原理：
- 序列生成：逐token预测
- 可选：结构token序列

在PPI中的应用：
├── ProteinMPNN: 序列设计
├── ESM-IF1: 逆向折叠
└── ProGen2: 蛋白质序列生成
```

**Flow-based模型:**
```
应用较少，但值得关注：
├── Flow matching for protein docking
└── Normalizing flows for structure generation
```

**关键引用：**
- DiffDock (Corso et al., 2022, ICLR)
- RFdiffusion (Watson et al., 2023, Nature)
- ProteinMPNN (Dauparas et al., 2022, Science)
- ESM-IF1 (Hsu et al., 2022, ICML)

#### 5.2 结构感知表示 (Structure-Aware Representations)

**等变神经网络 (Equivariant Neural Networks):**

| 方法 | 等变性类型 | 应用 |
|------|------------|------|
| SE(3)-Transformer | SE(3)等变 | 结构预测、对接 |
| GVP | 方向等变 | 结构预测、界面预测 |
| EGNN | E(n)等变 | 分子动力学、结构生成 |
| PaiNN | 标量-向量分离 | 属性预测 |

**几何深度学习 (Geometric Deep Learning):**
```
核心思想：
- 在非欧空间（流形、图）上进行学习
- 蛋白质表面作为流形
- 残基接触图作为图

代表性工作：
├── MaSIF: 分子表面学习
├── dMaSIF: 高效表面学习
├── PeSTo: 结构Transformer
└── GearNet: 几何感知预训练
```

**关键引用：**
- SE(3)-Transformer (Fuchs et al., 2020)
- GVP (Jing et al., 2021, ICLR)
- MaSIF (Gainza et al., 2020, Nature Methods)
- GearNet (Zhang et al., 2023, ICLR)

#### 5.3 蛋白质语言模型 (Protein Language Models)

**发展历程：**
```
2021: ESM-1b (Rives et al., PNAS)
      - 650M参数，250M序列预训练
      
2021: ProtTrans (Elnaggar et al., TPAMI)
      - 多种Transformer架构比较
      
2023: ESM-2 (Lin et al., Science)
      - 15B参数，从序列预测结构
      
2024: SaProt (Su et al., ICLR)
      - 结构感知词表
      
2025: MINT (Ullanat et al., Nature Communications)
      - 专用PPI建模
      
2025: PLM-interact (Zhao et al., Nature Communications)
      - 扩展ESM-2用于PPI
```

**对PPI设计的影响：**
- 提供丰富的蛋白质序列表示
- 学习进化和功能约束
- 支持零样本/少样本预测
- 为设计提供"语言规则"

**关键引用：**
- ESM-1b (Rives et al., 2021, PNAS)
- ESM-2 (Lin et al., 2023, Science)
- ProtTrans (Elnaggar et al., 2021, TPAMI)
- SaProt (Su et al., 2024, ICLR)
- MINT (Ullanat et al., 2025, Nature Communications)

#### 5.4 端到端设计流程

**典型流程：**
```
Step 1: 靶点准备
├── 获取实验结构 (PDB)
├── 或预测结构 (AlphaFold)
└── 识别结合位点/表位

Step 2: 骨架生成
├── 条件扩散生成 (RFdiffusion)
├── 或模板设计
└── 生成多个候选骨架

Step 3: 序列设计
├── 给定骨架设计序列 (ProteinMPNN)
├── 支持约束（半胱氨酸位置等）
└── 生成序列库

Step 4: 结构验证
├── 预测设计物的结构 (AlphaFold)
├── 评估与设计目标的一致性
└── 过滤不一致的设计

Step 5: 亲和力/特异性预测
├── 使用预测模型评估亲和力
├── 评估特异性（交叉反应风险）
└── 排序候选

Step 6: 实验验证
├── 基因合成与表达
├── 结合实验 (SPR, BLI, ELISA)
└── 结构验证 (如需要)
```

---

### 6. Challenges and Open Problems

**字数：** ~1000 words

#### 6.1 评估挑战

**预测任务评估问题（遗留挑战）：**
- 数据泄漏导致性能高估（Bernett et al., 2024）
- 需要建立无泄漏、标准化的基准
- 不同评估协议导致方法难以比较

**设计任务的新评估挑战：**
```
设计任务需要全新的评估体系：

├── 成功率评估
│   ├── 多少设计能成功表达？
│   ├── 多少设计能成功结合？
│   └── 亲和力分布如何？
│
├── 新颖性评估
│   ├── 设计是否与已知蛋白相似？
│   ├── 是否"抄袭"了已知结构？
│   └── 如何衡量创新性？
│
├── 可设计性评估
│   ├── 序列空间中可设计的比例
│   ├── 结构空间中可实现的比例
│   └── 可设计性的理论边界
│
└── 实用性评估
    ├── 稳定性
    ├── 特异性
    ├── 可开发性
    └── 体内功能
```

**关键引用：**
- Bernett et al. (2024, Briefings in Bioinformatics)

#### 6.2 实验验证闭环

**计算与实验的鸿沟：**
- 设计成功率：实验室报告的成功率差异很大（5%-50%）
- 验证成本高：湿实验验证需要时间和资源
- 反馈缺失：设计失败的原因难以追溯

**解决方案方向：**
- 高通量实验平台整合
- 自动化设计-验证循环
- 失败案例的系统性分析

#### 6.3 可设计空间

**核心问题：**
- 并非所有相互作用都可以设计
- 存在"不可设计"的区域
- 可设计性的边界在哪里？

**影响因素：**
```
影响可设计性的因素：

├── 靶点因素
│   ├── 表位特征（平坦vs凹陷）
│   ├── 表面电荷分布
│   └── 动态性/柔性
│
├── 设计约束
│   ├── 序列长度限制
│   ├── 稳定性要求
│   └── 特异性要求
│
└── 物理约束
    ├── 能量景观
    ├── 折叠动力学
    └── 溶解度
```

#### 6.4 动态与条件特异性

**设计动态相互作用：**
- 设计"在正确时间/地点起作用"的相互作用
- 条件响应性设计（pH、配体、翻译后修饰）
- 别构调节的设计

**挑战：**
- 预测模型多假设静态结构
- 动态过程建模困难
- 条件特异性数据稀缺

#### 6.5 多体复合物设计

**超越二元相互作用：**
- 许多生物过程涉及多蛋白复合物
- 需要同时设计多个界面
- 保证组装的正确顺序和化学计量

**代表性挑战：**
- 设计三体/四体复合物
- 设计自组装蛋白笼
- 设计功能性蛋白机器

#### 6.6 可解释性

**黑盒问题：**
- 深度学习模型决策过程不透明
- 设计为何成功/失败？
- 如何指导下一步优化？

**解决方向：**
- 注意力可视化
- 关键残基识别
- 生物学先验整合

**关键引用：**
- MGPPI (2024) - Grad-WAM可解释性方法

---

### 7. Applications and Impact

**字数：** ~800 words

#### 7.1 药物发现

**治疗性蛋白设计：**
```
应用场景：

├── 抗体药物设计
│   ├── 针对肿瘤靶点的抗体
│   ├── 抗感染抗体
│   └── 双特异性抗体设计
│
├── 蛋白质替代疗法
│   ├── 酶替代
│   ├── 细胞因子类似物
│   └── 受体激动剂/拮抗剂
│
├── 酶抑制剂设计
│   ├── 蛋白质抑制剂
│   ├── 竞争性结合剂
│   └── 变构调节剂
│
└── 新兴应用
    ├── PROTAC连接子设计
    ├── 药物偶联物
    └── 递送载体设计
```

**案例研究：**
- SARS-CoV-2中和抗体设计
- IL-2变体设计（选择性激活免疫细胞）
- PD-1/PD-L1抑制剂设计

**关键引用：**
- Cao et al. (2022) - SARS-CoV-2 mini-protein inhibitors
- Silverman et al. - IL-2设计

#### 7.2 合成生物学

**应用方向：**
- 设计人工信号通路
- 构建生物传感器
- 设计代谢通路酶复合物
- 编程细胞行为

**案例：**
- 设计synNotch受体
- 设计光控蛋白相互作用
- 设计细胞命运控制器

#### 7.3 基础研究

**假设验证：**
- 设计特定相互作用的蛋白质
- 验证相互作用机制假说
- 探索序列-功能关系

**工具开发：**
- 实验工具蛋白设计
- 分离/富集工具
- 成像探针

---

### 8. Future Outlook

**字数：** ~600 words

#### 8.1 预测-设计融合

**迭代设计流程：**
```
未来愿景：预测与设计形成紧密闭环

     ┌──────────────────────────────────────────┐
     │                                          │
     ▼                                          │
  [设计] ──→ [预测验证] ──→ [评估] ──→ [优化] ──┘
     │            │            │
     │            │            │
     ▼            ▼            ▼
  新候选      结构/亲和力    成功率
  生成        预测          分析

迭代优化直至达到设计目标
```

#### 8.2 通向"蛋白质智能"

**能力层次：**
```
Level 1: 理解
├── 解析蛋白质序列、结构、功能
└── 理解相互作用机制

Level 2: 预测
├── 预测相互作用
├── 预测结构
└── 预测功能

Level 3: 设计
├── 设计新蛋白质
├── 设计新相互作用
└── 设计新功能

Level 4: 创造 (Emerging)
├── 创造全新生物系统
├── 解决未知的生物学问题
└── 突破自然进化的限制
```

#### 8.3 对生物学研究范式的影响

**范式转变：**
- 从"发现驱动"到"假设驱动"
- 从"试错筛选"到"理性设计"
- 从"观察自然"到"创造自然"

---

### 9. Conclusion

**字数：** ~400 words

**核心信息总结：**
1. AI驱动的PPI研究正在经历从预测到设计的范式转变
2. 这一转变由PLM、扩散模型、等变网络等技术突破驱动
3. 设计范式将深刻影响药物发现、合成生物学等领域
4. 预测与设计将形成紧密闭环，推动生物学研究范式演进

**展望：**
- 预测能力是设计的基础，设计是预测的终极目标
- 未来的挑战包括评估体系、实验验证闭环、可解释性等
- 这一转变标志着AI从"理解自然"走向"创造自然"

---

## 图表规划 | Figures and Tables

### Figure 1: 范式转变概览图
```
内容：展示从预测到设计的范式转变
形式：时间线 + 任务对比
要点：
- 预测范式：给定输入→推断输出
- 设计范式：给定目标→创造解决方案
- 技术里程碑标注
```

### Figure 2: 技术演进路线图
```
内容：AI for PPI的技术演进路径
形式：桑基图或流程图
要点：
- 经典ML → 深度学习 → Transformer → 生成式AI
- 各阶段代表性方法
- 方法间的继承关系
```

### Figure 3: 设计范式技术栈
```
内容：设计范式的技术基础
形式：层级图
要点：
- 基础层：结构预测、PLM
- 方法层：扩散模型、等变网络、序列设计
- 应用层：结合蛋白设计、抗体设计、界面优化
```

### Figure 4: 端到端设计流程
```
内容：典型的蛋白质设计流程
形式：流程图
要点：
- 靶点准备 → 骨架生成 → 序列设计 → 验证筛选 → 实验验证
- 各步骤使用的工具
- 反馈循环
```

### Figure 5: 挑战与未来方向
```
内容：当前挑战和未来研究方向
形式：雷达图或思维导图
要点：
- 评估挑战、实验验证、可设计性
- 动态相互作用、多体复合物
- 未来方向
```

### Table 1: PPI预测任务分类
```
内容：预测任务的系统分类
列：任务类型、输入、输出、代表方法、评估数据集
```

### Table 2: 设计范式核心方法
```
内容：设计任务与方法对照表
列：设计任务、代表方法、技术路线、成功率、引用
```

### Table 3: 开放问题与研究方向
```
内容：挑战与对应的研究方向
列：挑战类别、具体问题、研究现状、未来方向
```

---

## 写作时间线 | Writing Timeline

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| Week 1-2 | 完成Introduction + Prediction Paradigm | 2周 |
| Week 3-4 | 完成Design Paradigm + Core Tasks | 2周 |
| Week 5-6 | 完成Enabling Technologies + Challenges | 2周 |
| Week 7 | 完成Applications + Future Outlook + Conclusion | 1周 |
| Week 8-9 | 制作图表 | 2周 |
| Week 10-11 | 整合、修改、润色 | 2周 |
| Week 12 | 最终检查、投稿准备 | 1周 |

**总预计时间：** 12周

---

## 关键文献清单 | Key References

### 必须引用的核心文献 (按重要性排序)

#### 范式转变标志性工作
1. RFdiffusion (Watson et al., 2023, Nature)
2. AlphaProteo (Zambaldi et al., 2024)
3. AlphaFold 3 (Abramson et al., 2024, Nature)
4. ProteinMPNN (Dauparas et al., 2022, Science)

### 预测范式代表作
5. AlphaFold-Multimer (Evans et al., 2022)
6. ESM-2 (Lin et al., 2023, Science)
7. PIPR (Chen et al., 2019, Bioinformatics)
8. MaSIF (Gainza et al., 2020, Nature Methods)

### 技术基础
9. DiffDock (Corso et al., 2022, ICLR)
10. GVP (Jing et al., 2021, ICLR)
11. SaProt (Su et al., 2024, ICLR)
12. RoseTTAFold (Baek et al., 2021, Science)

### 批判性文献
13. Bernett et al. (2024, Briefings in Bioinformatics) - 基准评估问题
14. Park & Marcotte (2012, Proteins) - 简单vs困难预测

### 数据资源
15. STRING (Szklarczyk et al., 2021, NAR)
16. SKEMPI 2.0 (Jankauskaite et al., 2019, Bioinformatics)
17. BioPlex 3.0 (Huttlin et al., 2021, Cell)

---

## 备注 | Notes

1. 本文基于271篇文献的系统性调研
2. 强调"范式转变"的独特视角
3. 保持批判性思维，讨论局限性
4. 面向跨学科读者，注意术语解释
5. 图表质量对综述文章至关重要

---

*Document created: 2026-03-13*
*Last updated: 2026-03-13*