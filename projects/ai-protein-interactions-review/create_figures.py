#!/usr/bin/env python3
"""Create figures for AI-driven PPI review paper"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

# Create output directory
output_dir = r'C:\Users\1990h\.openclaw\workspace\projects\ai-protein-interactions-review\latex\figures'
os.makedirs(output_dir, exist_ok=True)

print("Creating Figure 1: Paradigm Shift Diagram...")

# Create Figure 1: Paradigm Shift Diagram
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 8))
fig.suptitle('From Prediction to Design: A Paradigm Shift in AI-Driven PPI Research', 
             fontsize=16, fontweight='bold', y=0.98)

# Left Panel: Prediction Paradigm
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 12)
ax1.axis('off')
ax1.set_title('Prediction Paradigm\n(1980s-2020)', fontsize=14, fontweight='bold', color='#2C3E50')

# Boxes for prediction
boxes_pred = [
    (5, 10.5, 'Input: Known Proteins\n(Sequences/Structures)', '#ECF0F1'),
    (5, 7.5, 'Computational Analysis\n• Sequence similarity\n• Structure comparison\n• ML classification\n(SVM, GNN, Transformers)', '#BDC3C7'),
    (5, 4.5, 'Output: Binary Classification\n"Will these interact?"\nAnswer: YES / NO', '#95A5A6'),
]

for x, y, text, color in boxes_pred:
    bbox = FancyBboxPatch((x-3.5, y-1), 7, 2, boxstyle='round,pad=0.1', 
                          facecolor=color, edgecolor='#2C3E50', linewidth=2)
    ax1.add_patch(bbox)
    ax1.text(x, y, text, ha='center', va='center', fontsize=10, 
             fontweight='bold' if y==10.5 or y==4.5 else 'normal')

# Arrows
for y in [9, 6]:
    ax1.annotate('', xy=(5, y), xytext=(5, y+0.5),
                arrowprops=dict(arrowstyle='->', color='#3498DB', lw=2))

ax1.text(5, 1.5, 'Mode: Discovery & Understanding', ha='center', fontsize=11, 
         style='italic', color='#2C3E50')

# Right Panel: Design Paradigm
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 12)
ax2.axis('off')
ax2.set_title('Design Paradigm\n(2021-Present)', fontsize=14, fontweight='bold', color='#16A085')

# Boxes for design
boxes_des = [
    (5, 10.5, 'Input: Design Goal\n"What interaction do we WANT?"\n(Target + constraints)', '#E8F8F5'),
    (5, 7.5, 'Generative AI Design\n• Diffusion models\n• Inverse folding\n• Multi-objective optimization\n(RFdiffusion, AlphaProteo)', '#A9DFBF'),
    (5, 4.5, 'Output: Novel Proteins\n"Proteins that WILL bind"\n(Candidates: 100s-1000s)', '#58D68D'),
    (5, 2, 'Validation & Iteration\n• Computational screening\n• Experimental testing\n• Feedback loop', '#27AE60'),
]

for x, y, text, color in boxes_des:
    bbox = FancyBboxPatch((x-3.5, y-1), 7, 2, boxstyle='round,pad=0.1',
                          facecolor=color, edgecolor='#16A085', linewidth=2)
    ax2.add_patch(bbox)
    ax2.text(x, y, text, ha='center', va='center', fontsize=10,
             fontweight='bold' if y==10.5 or y==4.5 else 'normal')

# Arrows (including loop back)
for y in [9, 6, 3]:
    ax2.annotate('', xy=(5, y), xytext=(5, y+0.5),
                arrowprops=dict(arrowstyle='->', color='#1ABC9C', lw=2))

# Loop arrow
ax2.annotate('', xy=(1.5, 10), xytext=(1.5, 3),
            arrowprops=dict(arrowstyle='->', color='#1ABC9C', lw=2,
                          connectionstyle='arc3,rad=0.3'))

ax2.text(5, 0.5, 'Mode: Creation & Engineering', ha='center', fontsize=11,
         style='italic', color='#16A085')

# Center annotation
fig.text(0.5, 0.08, 'PARADIGM SHIFT: From Analysis to Synthesis', ha='center',
         fontsize=13, fontweight='bold', color='#E74C3C',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#FADBD8', edgecolor='#E74C3C', lw=2))

plt.tight_layout(rect=[0, 0.1, 1, 0.96])

# Save
fig1_path = os.path.join(output_dir, 'figure1_paradigm_shift.png')
plt.savefig(fig1_path, dpi=300, bbox_inches='tight', facecolor='white')
print(f'✓ Figure 1 saved: {fig1_path}')
plt.close()

print("\nCreating Figure 2: Technology Timeline...")

# Create Figure 2: Technology Evolution Timeline
fig, ax = plt.subplots(figsize=(14, 6))
ax.set_xlim(2017.5, 2025.5)
ax.set_ylim(-2, 3)
ax.axis('off')

# Main timeline
ax.axhline(y=0, color='#2C3E50', linewidth=3, zorder=1)

# Year markers
for year in range(2018, 2026):
    ax.plot(year, 0, 'o', color='#2C3E50', markersize=10, zorder=2)
    ax.text(year, -0.5, str(year), ha='center', fontsize=11, fontweight='bold')

# Milestones (alternating above and below)
milestones = [
    (2018, 'above', 'Transformer\\nArchitecture', '#3498DB'),
    (2019, 'below', 'AlphaFold1\\n(CASP13)', '#E74C3C'),
    (2020, 'above', 'ESM-1b\\n(PLM)', '#9B59B6'),
    (2021, 'below', 'AlphaFold2\\n(CASP14)', '#E74C3C'),
    (2022, 'above', 'ProteinMPNN\\nRFdiffusion', '#27AE60'),
    (2023, 'below', 'AF-Multimer\\nAF3', '#E67E22'),
    (2024, 'above', 'AlphaProteo\\nRFdiffusionAA', '#16A085'),
    (2025, 'below', 'Next Gen\\nDesign', '#8E44AD'),
]

for year, pos, label, color in milestones:
    y_text = 1.5 if pos == 'above' else -1.5
    y_line = 0.3 if pos == 'above' else -0.3
    
    # Box
    bbox = FancyBboxPatch((year-0.6, y_text-0.4), 1.2, 0.8, 
                          boxstyle='round,pad=0.1', facecolor=color, 
                          edgecolor='white', linewidth=2, alpha=0.8)
    ax.add_patch(bbox)
    ax.text(year, y_text, label, ha='center', va='center', fontsize=9,
            fontweight='bold', color='white')
    
    # Connector line
    ax.plot([year, year], [0.15, y_line], color=color, linewidth=2, alpha=0.6)

# Phase labels
ax.axvspan(2017.8, 2020.8, alpha=0.1, color='#3498DB')
ax.text(2019.3, 2.5, 'Foundation', fontsize=12, fontweight='bold', 
        color='#3498DB', ha='center')

ax.axvspan(2020.8, 2022.5, alpha=0.1, color='#E74C3C')
ax.text(2021.6, 2.5, 'Breakthrough', fontsize=12, fontweight='bold',
        color='#E74C3C', ha='center')

ax.axvspan(2022.5, 2025.2, alpha=0.1, color='#27AE60')
ax.text(2023.8, 2.5, 'Design Era', fontsize=12, fontweight='bold',
        color='#27AE60', ha='center')

# Title
ax.text(2021.5, 2.9, 'Evolution of AI-Driven Protein-Protein Interaction Tools', 
        fontsize=14, fontweight='bold', ha='center')

plt.tight_layout()

fig2_path = os.path.join(output_dir, 'figure2_timeline.png')
plt.savefig(fig2_path, dpi=300, bbox_inches='tight', facecolor='white')
print(f'✓ Figure 2 saved: {fig2_path}')
plt.close()

print("\n" + "="*60)
print("FIGURE CREATION COMPLETE")
print("="*60)
print(f"Figure 1: {fig1_path}")
print(f"Figure 2: {fig2_path}")
print("\nNext: Update LaTeX to reference these figures")
