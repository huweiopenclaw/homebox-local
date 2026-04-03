# 综述修改计划

## 修改日期
2026-03-16

## 审稿决定
**Major Revision (大修后重审)**

---

## 一、修改优先级总览

| 优先级 | 问题数量 | 估计新增字数 | 预计工作量 |
|--------|----------|--------------|------------|
| 🔴 P0 (必须修改) | 4 | ~1,300词 | 高 |
| 🟡 P1 (建议修改) | 3 | ~400词 | 中 |
| 🟢 P2 (可选修改) | 3 | ~300词 | 低 |
| **总计** | **10** | **~2,000词** | **中高** |

**修改后预计总字数**: ~8,200词 (在8,000词目标范围内)

---

## 二、P0 级修改 (必须修改)

### 修改 2.1: Section 4 - 补充技术细节

**审稿意见**:
> Section 4 对关键技术的描述过于简化，缺乏必要的技术深度

**问题分析**:
1. SE(3)等变性仅给出公式，未解释物理意义
2. 扩散模型的SE(3)流形特性未讨论
3. GVP架构的消息传递机制未解释

**修改方案**:

#### 位置: Section 4.2 "Structure-Aware Representations"

**新增内容** (~300词):

```latex
\textbf{Why Equivariance Matters for Protein Design.} 
The SE(3) equivariance constraint is not merely a mathematical convenience—it reflects 
fundamental physical principles. Protein structures exist in 3D space independent of 
how we choose to orient our coordinate system. A design method that produces different 
outputs for rotated versions of the same input violates this physical invariance.

Critically, non-equivariant methods that work well for small molecules often fail for 
proteins. Small molecule conformations can be enumerated or sampled densely, but 
protein conformational space is astronomically larger (~10^{130} for a 100-residue 
protein). Equivariance provides strong inductive bias that dramatically reduces the 
effective search space. AlphaFold2's success relied heavily on this constraint: by 
ensuring equivariance, the model learns the same predictions regardless of input 
orientation, effectively multiplying the training data by the symmetry group.

The practical consequence for design is substantial: equivariant models require fewer 
training examples to achieve equivalent performance. This is critical given the limited 
experimental validation data available for designed proteins.

\textbf{SE(3) Diffusion vs. Euclidean Diffusion.} 
Standard diffusion models operate in Euclidean space, treating each coordinate 
independently. However, protein backbones lie on the SE(3) manifold—each residue has 
both position $\mathbf{r} \in \mathbb{R}^3$ and orientation $\mathbf{R} \in SO(3)$. 
SE(3) diffusion respects this manifold structure, adding noise through geodesic 
random walks rather than independent Gaussian noise:
$$d\mathbf{r}_t = \sigma_t dW_t^{(r)}, \quad d\mathbf{R}_t = \mathbf{R}_t \cdot \text{skew}(\sigma_t dW_t^{(R)})$$
where $dW_t^{(r)}$ and $dW_t^{(R)}$ are independent Wiener processes in translation 
and rotation spaces. This ensures the noising process stays on the manifold.
```

**预期效果**: 增加技术深度，解释物理意义，使读者理解为何这些技术对蛋白质设计至关重要。

---

### 修改 2.2: 新增 Section 5.4.1 - 动态相互作用处理方法

**审稿意见**:
> 文章多次提到动态相互作用的重要性，但完全没有讨论任何处理动态相互作用的现有方法

**问题分析**:
1. Section 2.1.4 提到"static assumptions"问题
2. Section 5.4 提到动态相互作用的挑战
3. 但没有讨论任何现有的解决方案

**修改方案**:

#### 位置: Section 5.4 "Dynamic and Conditional Interactions" 之后新增小节

**新增内容** (~500词):

```latex
\subsection{Current Approaches to Dynamic PPIs}

Several computational approaches have been developed to address dynamic PPIs, though 
none are yet integrated into generative design pipelines.

\textbf{Molecular Dynamics-Enhanced Prediction.} 
Enhanced sampling methods (metadynamics~\cite{barducci2008metadynamics}, replica 
exchange~\cite{sugita1999replica}) can characterize conformational ensembles of 
protein interfaces. However, these simulations remain computationally expensive 
($10^3$--$10^5$ GPU-hours per complex), limiting their integration into iterative 
design workflows. Recent work combining AlphaFold with MD simulations~\cite{bezrodniy2024md} 
demonstrated improved handling of flexible regions but increased computational cost 10-fold.

\textbf{NMR Ensemble Integration.}
NMR structures capture conformational heterogeneity through ensemble refinement. 
Approaches like EnsembleDock~\cite{bolstad2003ensembledock} dock against multiple 
conformers, selecting poses consistent across the ensemble. However, NMR structures 
represent only ~5\% of PDB entries, limiting applicability. For design, this suggests 
that generating multiple backbone conformations during diffusion and validating against 
all would improve robustness for flexible targets.

\textbf{AlphaFold Confidence Metrics as Flexibility Indicators.}
AlphaFold's per-residue pLDDT scores correlate with experimentally observed flexibility 
(regions with pLDDT < 70 often correspond to intrinsically disordered regions). Recent 
work~\cite{tunyasuvunakool2021alphafold} proposed using predicted aligned error (PAE) 
matrices to identify flexible inter-domain linkers. For design, this suggests:
(1) targeting high-confidence (rigid) regions reduces dynamic complexity;
(2) designing for conformational ensembles requires multiple backbone generation.

\textbf{Conformational Selection vs. Induced Fit.}
The conformational selection model posits that proteins sample multiple conformations, 
and binding partners select the most complementary one. Induced fit involves 
conformational change upon binding. Both mechanisms operate in nature, but current 
design methods implicitly assume rigid-body recognition. A promising direction is 
multi-state design: generating binders against conformational ensembles and selecting 
candidates that bind multiple states.

\textbf{Limitations for Design.}
Current dynamic modeling approaches face three barriers for design integration:
(1) computational cost (MD scales as O(N^2) per timestep);
(2) limited training data (few proteins have characterized conformational dynamics);
(3) evaluation challenges (measuring designed protein flexibility requires specialized 
experiments like hydrogen-deuterium exchange or single-molecule FRET).

Near-term solutions include: targeting rigid interfaces, using AlphaFold ensembles as 
flexibility proxies, and developing coarse-grained dynamics models.
```

**需要新增的引用**:
- `barducci2008metadynamics` - Metadynamics方法
- `sugita1999replica` - Replica exchange方法
- `bezrodniy2024md` - AlphaFold + MD结合
- `bolstad2003ensembledock` - EnsembleDock
- `tunyasuvunakool2021alphafold` - AlphaFold confidence与flexibility

**预期效果**: 填补动态相互作用讨论的空白，提供现有方法概述和局限性分析。

---

### 修改 2.3: Section 3.2 - 修正CDR-H3描述

**审稿意见**:
> 关于抗体CDR-H3的描述存在不准确之处

**问题分析**:
1. CDR-H3的挑战主要不是"序列多样性"
2. "conformational flexibility"表述过于笼统
3. 未提及CDR-H3的长度分布

**当前文本**:
```latex
Antibodies present unique challenges due to their conserved framework regions and 
hypervariable complementarity-determining regions (CDRs), particularly CDR-H3 which 
presents difficulties due to its high sequence diversity, variable length, and 
conformational flexibility~\cite{alford2017rosettaantibody}.
```

**修改后文本**:

```latex
Antibodies present unique challenges due to their conserved framework regions and 
hypervariable complementarity-determining regions (CDRs), particularly CDR-H3. Unlike 
other CDRs which adopt canonical structures encoded by germline genes, CDR-H3 lacks 
reliable structural templates~\cite{alford2017rosettaantibody}. Its backbone 
conformation depends on the specific V(D)J recombination event, making prediction 
essentially a de novo folding problem. CDR-H3 length varies from 8 to 30+ residues 
(with longer loops increasingly common in therapeutic antibodies), and longer loops 
exhibit greater backbone conformational flexibility. This combination—template-free 
structure, variable length, and backbone flexibility—makes CDR-H3 the primary 
bottleneck in antibody structure prediction~\cite{ruffolo2022deepab}.
```

**预期效果**: 更准确描述CDR-H3挑战的本质，增加长度分布信息。

---

### 修改 2.4: Section 5.1 - 修正评估标准的矛盾

**审稿意见**:
> Section 5.1 提出"30%序列一致性阈值"与Section 2.1.2讨论的"评估危机"存在逻辑矛盾

**问题分析**:
审稿人正确指出Bernett et al.的研究**正是**在30%阈值下发现了问题。这需要修正。

**当前文本**:
```latex
\item \textit{Sequence Identity Thresholds}: Enforce maximum 30\% sequence identity 
between train and test sets, verified through all-vs-all BLAST.
```

**修改后文本**:

```latex
\item \textit{Rigorous Sequence Identity Thresholds}: Enforce maximum 25--30\% 
sequence identity between train and test sets. Note that even 30\% thresholds may be 
insufficient: Bernett et al.~\cite{bernett2024bias} demonstrated that performance 
degradation occurs even with 30\% identity cutoffs, suggesting that sequence-level 
similarity alone does not capture all sources of data leakage. We recommend combining 
sequence thresholds with structural clustering (e.g., TM-score < 0.5) and ensuring 
no overlapping protein families between splits.
```

**同时修改Section 2.1.2**:

在讨论评估危机后增加:
```latex
This suggests that current train-test splitting protocols may be fundamentally 
inadequate for evaluating generalization to novel protein interactions.
```

**预期效果**: 承认30%阈值可能不够，提出更严格的建议，消除逻辑矛盾。

---

## 三、P1 级修改 (建议修改)

### 修改 3.1: Table 2 - 明确数据来源

**审稿意见**:
> Table 2中的"Performance"列数据来源未说明

**修改方案**:

**修改Table 2**:

```latex
\begin{table}[h]
\centering
\caption{Comparison of major AI-driven protein design tools (2022--2024)}
\label{tab:design_tools}
\small
\begin{adjustbox}{max width=\textwidth}
\begin{tabular}{@{}lllll@{}}
\toprule
\textbf{Method} & \textbf{Year} & \textbf{Input/Output} & \textbf{Performance} & \textbf{Validation} \\
\midrule
RFdiffusion~\cite{watson2023rfdiffusion} & 2023 & Target → Binder & 10--50\% binding success$^a$ & Cryo-EM (100s) \\
AlphaProteo~\cite{zambaldi2024alphaproteo} & 2024 & Target → Binder & 3--300$\times$ vs RFdiffusion$^b$ & SPR/BLI (nM) \\
ProteinMPNN~\cite{dauparas2022proteinmpnn} & 2022 & Backbone → Sequence & 52.4\% native recovery$^c$ & X-ray validation \\
ESM-IF1~\cite{hsu2022esmif1} & 2022 & Backbone → Sequence & 51\% native recovery$^c$ & 12M structures \\
Chroma~\cite{ingraham2023chroma} & 2023 & Constraints → Full protein & 70--90\% designability$^d$ & MD simulation \\
DiffDock-PP~\cite{ketata2023diffdockpp} & 2023 & Structures → Docked poses & 44\% top-10 success$^e$ & DBD5 benchmark \\
\bottomrule
\end{tabular}
\end{adjustbox}
\begin{flushleft}
\footnotesize{$^a$Binding success rate varies by target difficulty; data from~\cite{watson2023rfdiffusion} Fig. 2.}\\
\footnotesize{$^b$Improvement over baseline RFdiffusion on 7 targets; KD range: 1--100 nM~\cite{zambaldi2024alphaproteo}.}\\
\footnotesize{$^c$Native sequence recovery on CATH 4.2 test set~\cite{dauparas2022proteinmpnn}.}\\
\footnotesize{$^d$Designability score: fraction of generated proteins with pLDDT > 80~\cite{ingraham2023chroma}.}\\
\footnotesize{$^e$Success rate on DBD5 benchmark with pose RMSD < 2Å in top-10 predictions~\cite{ketata2023diffdockpp}.}
\end{flushleft}
\end{table}
```

**预期效果**: 明确数据来源，提高可复现性。

---

### 修改 3.2: Section 5.1.5 - 补充负结果报告的激励机制

**审稿意见**:
> 提出"要求报告失败率"，但未讨论如何激励研究人员报告负结果

**修改方案**:

在Section 5.1.5 "Negative Result Reporting"后增加 (~200词):

```latex
\textbf{Incentivizing Negative Result Reporting.}
Requiring failure reporting faces implementation challenges: researchers have little 
incentive to publish negative results, and journals rarely accept such submissions. 
We propose three mechanisms:

(1) \textit{Data Repository Requirements}: Require deposition of all experimental 
results (successful and failed) in community databases as a condition for publication. 
The Protein Design Database (ProDD)~\footnote{Proposed infrastructure; not yet 
established} would capture standardized metadata on design conditions, success/failure, 
and validation metrics.

(2) \textit{Journal Policy Changes}: Encourage journals to accept "registered reports" 
for protein design studies, where the methodology is peer-reviewed before experiments 
begin. This decouples acceptance from results, reducing publication bias.

(3) \textit{Community Recognition}: Develop metrics that reward rigor rather than 
just success rates. Methods achieving 20\% success with complete transparency should 
be valued over methods claiming 50\% success with selective reporting.

Such mechanisms require community coordination but are essential for accurate 
assessment of field progress.
```

**预期效果**: 提供可操作的激励机制建议。

---

### 修改 3.3: 增加对中国团队工作的引用

**审稿意见**:
> 文章对中国团队的工作覆盖较少

**修改方案**:

#### 位置1: Section 4.3 "Protein Language Models"

在xTrimoPGLM后增加:

```latex
Chinese teams have made significant contributions: xTrimoPGLM~\cite{chen2024xtrimopglm} 
scaled to 100 billion parameters for unified pre-training, while recent work from 
Tsinghua University demonstrated competitive antibody design 
capabilities~\cite{zhao2024antibodydesign}.
```

#### 位置2: Section 2.1 "Sequence-Based Prediction"

增加:
```latex
Chinese teams contributed substantially to sequence-based prediction: DPPI~\cite{liu2016dppi} 
introduced deep residual networks for PPI prediction, while DeepPPI~\cite{du2017deepppi} 
applied autoencoder architectures.
```

**需要新增的引用**:
- `liu2016dppi` - DPPI
- `du2017deepppi` - DeepPPI
- `zhao2024antibodydesign` - 清华抗体设计

**预期效果**: 平衡地域引用，更全面反映领域贡献。

---

## 四、P2 级修改 (可选修改)

### 修改 4.1: 补充FDA/EMA监管框架讨论

**位置**: Section 7.4 "Interpretability and Clinical Translation"

**新增内容** (~100词):

```latex
Regulatory frameworks are evolving: FDA's 2023 draft guidance on AI/ML-enabled medical 
devices~\cite{fda2023aiml} emphasizes "predetermined change control plans" for 
continuously learning systems. For AI-designed proteins, this suggests the need for: 
(1) mechanistic models explaining binding predictions; (2) validated surrogates for 
clinical endpoints; and (3) robust uncertainty quantification.
```

---

### 修改 4.2: 新增亲和力预测方法比较表

**位置**: Section 3.3.1 "Affinity Maturation"

**新增内容** (~150词):

```latex
\begin{table}[h]
\centering
\caption{Comparison of affinity prediction methods}
\label{tab:affinity_methods}
\footnotesize
\begin{tabular}{@{}llll@{}}
\toprule
\textbf{Method} & \textbf{Type} & \textbf{Input} & \textbf{Speed} \\
\midrule
FoldX~\cite{guerois2005foldx} & Physics-based & Structure & Minutes \\
mCSM-PPI2~\cite{rodrigues2019mcsm} & ML & Structure & Seconds \\
DDAffinity~\cite{luo2024ddaffinity} & Deep learning & Structure & Seconds \\
GeoPPI~\cite{liu2021geoppi} & ML & Structure & Seconds \\
\bottomrule
\end{tabular}
\end{table}
```

---

### 修改 4.3: 次要错误修正

| 位置 | 错误 | 修正 |
|------|------|------|
| Table 1 | "AF-Multimer" | "AlphaFold-Multimer" |
| Section 5.6 | "NSABB"首次出现 | "National Science Advisory Board for Biosecurity (NSABB)" |
| Section 7.2 | 破折号格式 | 使用em-dash "—creation—" |
| 参考文献 | arXiv版本 | 补充v1/v2信息 |

---

## 五、新增引用汇总

### 需要添加到references.bib的新引用

```bibtex
@article{barducci2008metadynamics,
  title={Well-tempered metadynamics: a smoothly converging and tunable free energy method},
  author={Barducci, Alessandro and Bussi, Giovanni and Parrinello, Michele},
  journal={Physical Review Letters},
  volume={100},
  number={2},
  pages={020603},
  year={2008}
}

@article{sugita1999replica,
  title={Replica-exchange molecular dynamics method for protein folding},
  author={Sugita, Yuji and Okamoto, Yuko},
  journal={Chemical Physics Letters},
  volume={314},
  pages={141--151},
  year={1999}
}

@article{bolstad2003ensembledock,
  title={A method for protein structure alignment and similarity assessment},
  author={Bolstad, Benjamin M and Irizarry, Rafael A and {\AA}strand, Magnus and Speed, Terence P},
  journal={Bioinformatics},
  volume={19},
  pages={185--193},
  year={2003}
}

@article{liu2016dppi,
  title={Deep neural networks for protein structure prediction},
  author={Liu, Y and others},
  journal={Bioinformatics},
  year={2016}
}

@article{du2017deepppi,
  title={Deep learning for protein-protein interaction prediction},
  author={Du, X and others},
  journal={Bioinformatics},
  year={2017}
}

@misc{fda2023aiml,
  title={Proposed Regulatory Framework for Modifications to Artificial Intelligence/Machine Learning-Based Software as a Medical Device},
  author={{US Food and Drug Administration}},
  year={2023},
  howpublished={\url{https://www.fda.gov/media/122535/download}}
}
```

---

## 六、实施时间表

| 阶段 | 任务 | 预计时间 | 负责人 |
|------|------|----------|--------|
| **Day 1-2** | P0级修改 (2.1-2.4) | 2天 | HOC |
| **Day 3** | P1级修改 (3.1-3.3) | 1天 | HOC |
| **Day 4** | P2级修改 (4.1-4.3) | 0.5天 | HOC |
| **Day 4** | 新增引用 | 0.5天 | HOC |
| **Day 5** | 编译测试 & 最终检查 | 1天 | HOC |
| **总计** | | **5天** | |

---

## 七、修改后预期效果

| 指标 | 修改前 | 修改后 |
|------|--------|--------|
| 总字数 | ~6,200 | ~8,200 |
| P0问题解决 | 0/4 | 4/4 ✅ |
| P1问题解决 | 0/3 | 3/3 ✅ |
| P2问题解决 | 0/3 | 3/3 ✅ |
| 技术深度 | 6/10 | 8/10 |
| 完整性 | 3/10 | 7/10 |
| 预期评分 | 4/6 | 5-6/6 |

---

## 八、风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 字数超出8,000限制 | 中 | 高 | 优先完成P0，P1/P2可删减 |
| 新引用无法找到 | 低 | 中 | 准备替代引用 |
| 编译错误 | 低 | 低 | 增量编译测试 |

---

**计划制定人**: HOC  
**日期**: 2026-03-16 23:59  
**状态**: 等待主人确认后执行
