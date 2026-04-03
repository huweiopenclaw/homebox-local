#!/usr/bin/env python3
"""Create Figure 1: Paradigm Shift Diagram"""
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import os

# Create figure with two panels
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 10))
fig.suptitle('', fontsize=16, fontweight='bold')

# Color schemes
pred_colors = {
    'box': '#E3F2FD',      # Light blue
    'border': '#1976D2',    # Dark blue
    'arrow': '#2196F3',     # Medium blue
    'text': '#0D47A1'       # Very dark blue
}

design_colors = {
    'box': '#E8F5E9',       # Light green
    'border': '#388E3C',    # Dark green
    'arrow': '#4CAF50',     # Medium green
    'text': '#1B5E20'       # Very dark green
}

# ===== LEFT PANEL: Prediction Paradigm =====
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 12)
ax1.axis('off')
ax1.set_title('Prediction Paradigm', fontsize=14, fontweight='bold', 
              color=pred_colors['text'], pad=20)

# Box 1: Input
box1 = FancyBboxPatch((1, 9.5), 8, 1.8, boxstyle='round,pad=0.1', 
                       facecolor=pred_colors['box'], edgecolor=pred_colors['border'], linewidth=2)
ax1.add_patch(box1)
ax1.text(5, 10.4, 'Input: Known Proteins', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=pred_colors['text'])
ax1.text(5, 10.0, '(Sequences / Structures)', ha='center', va='center', 
         fontsize=9, color=pred_colors['text'])

# Arrow 1
ax1.annotate('', xy=(5, 9.3), xytext=(5, 9.5),
            arrowprops=dict(arrowstyle='->', color=pred_colors['arrow'], lw=2))

# Box 2: Analysis
box2 = FancyBboxPatch((1, 6.0), 8, 3.0, boxstyle='round,pad=0.1',
                       facecolor=pred_colors['box'], edgecolor=pred_colors['border'], linewidth=2)
ax1.add_patch(box2)
ax1.text(5, 8.5, 'Computational Analysis', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=pred_colors['text'])
ax1.text(5, 8.0, '• Sequence similarity', ha='center', va='center', 
         fontsize=9, color=pred_colors['text'])
ax1.text(5, 7.5, '• Structure comparison', ha='center', va='center', 
         fontsize=9, color=pred_colors['text'])
ax1.text(5, 7.0, '• Machine learning classification', ha='center', va='center', 
         fontsize=9, color=pred_colors['text'])
ax1.text(5, 6.4, '(SVM, GNN, Transformers)', ha='center', va='center', 
         fontsize=8, style='italic', color=pred_colors['text'])

# Arrow 2
ax1.annotate('', xy=(5, 5.8), xytext=(5, 6.0),
            arrowprops=dict(arrowstyle='->', color=pred_colors['arrow'], lw=2))

# Box 3: Output
box3 = FancyBboxPatch((1, 3.0), 8, 2.5, boxstyle='round,pad=0.1',
                       facecolor=pred_colors['box'], edgecolor=pred_colors['border'], linewidth=2)
ax1.add_patch(box3)
ax1.text(5, 5.0, 'Output: Binary Classification', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=pred_colors['text'])
ax1.text(5, 4.5, '"Will these proteins interact?"', ha='center', va='center', 
         fontsize=9, color=pred_colors['text'])
ax1.text(5, 4.0, 'Answer: YES / NO', ha='center', va='center', 
         fontsize=9, fontweight='bold', color=pred_colors['text'])
ax1.text(5, 3.4, '(Optional: Where? How strongly?)', ha='center', va='center', 
         fontsize=8, style='italic', color=pred_colors['text'])

# Time indicator
ax1.text(5, 1.5, '1980s - 2020', ha='center', va='center', fontsize=10, 
         fontweight='bold', color=pred_colors['text'],
         bbox=dict(boxstyle='round', facecolor='white', edgecolor=pred_colors['border']))

# Label
ax1.text(5, 0.5, 'Understanding Mode', ha='center', va='center', fontsize=9, 
         style='italic', color='gray')

# ===== RIGHT PANEL: Design Paradigm =====
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 12)
ax2.axis('off')
ax2.set_title('Design Paradigm', fontsize=14, fontweight='bold', 
              color=design_colors['text'], pad=20)

# Box 1: Design Goal
box1_d = FancyBboxPatch((1, 9.5), 8, 1.8, boxstyle='round,pad=0.1',
                        facecolor=design_colors['box'], edgecolor=design_colors['border'], linewidth=2)
ax2.add_patch(box1_d)
ax2.text(5, 10.4, 'Input: Design Goal / Target', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=design_colors['text'])
ax2.text(5, 10.0, '"What interaction do we WANT?"', ha='center', va='center', 
         fontsize=9, style='italic', color=design_colors['text'])

# Arrow 1
ax2.annotate('', xy=(5, 9.3), xytext=(5, 9.5),
            arrowprops=dict(arrowstyle='->', color=design_colors['arrow'], lw=2))

# Box 2: Generative AI
box2_d = FancyBboxPatch((1, 6.0), 8, 3.0, boxstyle='round,pad=0.1',
                        facecolor=design_colors['box'], edgecolor=design_colors['border'], linewidth=2)
ax2.add_patch(box2_d)
ax2.text(5, 8.5, 'Generative AI Design', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=design_colors['text'])
ax2.text(5, 8.0, '• Diffusion models (backbone)', ha='center', va='center', 
         fontsize=9, color=design_colors['text'])
ax2.text(5, 7.5, '• Inverse folding (sequence)', ha='center', va='center', 
         fontsize=9, color=design_colors['text'])
ax2.text(5, 7.0, '• Multi-objective optimization', ha='center', va='center', 
         fontsize=9, color=design_colors['text'])
ax2.text(5, 6.4, '(RFdiffusion, AlphaProteo)', ha='center', va='center', 
         fontsize=8, style='italic', color=design_colors['text'])

# Arrow 2
ax2.annotate('', xy=(5, 5.8), xytext=(5, 6.0),
            arrowprops=dict(arrowstyle='->', color=design_colors['arrow'], lw=2))

# Box 3: Novel Proteins
box3_d = FancyBboxPatch((1, 3.0), 8, 2.5, boxstyle='round,pad=0.1',
                        facecolor=design_colors['box'], edgecolor=design_colors['border'], linewidth=2)
ax2.add_patch(box3_d)
ax2.text(5, 5.0, 'Output: Novel Protein Sequences', ha='center', va='center', 
         fontsize=11, fontweight='bold', color=design_colors['text'])
ax2.text(5, 4.5, '"Here are proteins that WILL bind"', ha='center', va='center', 
         fontsize=9, style='italic', color=design_colors['text'])
ax2.text(5, 4.0, 'Candidates: 100s - 1,000s', ha='center', va='center', 
         fontsize=9, fontweight='bold', color=design_colors['text'])
ax2.text(5, 3.4, '(Novel sequences never seen in nature)', ha='center', va='center', 
         fontsize=8, color=design_colors['text'])

# Arrow 3
ax2.annotate('', xy=(5, 2.8), xytext=(5, 3.0),
            arrowprops=dict(arrowstyle='->', color=design_colors['arrow'], lw=2))

# Box 4: Validation
box4_d = FancyBboxPatch((1, 0.3), 8, 2.2, boxstyle='round,pad=0.1',
                        facecolor='#FFF3E0', edgecolor='#F57C00', linewidth=2)
ax2.add_patch(box4_d)
ax2.text(5, 2.0, 'Validation & Iteration', ha='center', va='center', 
         fontsize=10, fontweight='bold', color='#E65100')
ax2.text(5, 1.5, '• Computational screening', ha='center', va='center', 
         fontsize=8, color='#E65100')
ax2.text(5, 1.0, '• Experimental testing', ha='center', va='center', 
         fontsize=8, color='#E65100')
ax2.text(5, 0.5, '• Feedback to improve design', ha='center', va='center', 
         fontsize=8, color='#E65100')

# Circular feedback arrow (simplified)
ax2.annotate('', xy=(0.5, 10.4), xytext=(0.5, 0.8),
            arrowprops=dict(arrowstyle='->', color='#FF9800', lw=1.5, 
                          connectionstyle='arc3,rad=0.3'))
ax2.text(0.2, 5.5, 'Iterate', ha='center', va='center', fontsize=8, 
         fontweight='bold', color='#FF9800', rotation=90)

# Time indicator
ax2.text(5, -0.5, '2021 - Present', ha='center', va='center', fontsize=10, 
         fontweight='bold', color=design_colors['text'],
         bbox=dict(boxstyle='round', facecolor='white', edgecolor=design_colors['border']))

# Label
ax2.text(5, -1.3, 'Creative Mode', ha='center', va='center', fontsize=9, 
         style='italic', color='gray')

# Adjust layout
plt.tight_layout()

# Save figure
output_dir = r'C:\Users\1990h\.openclaw\workspace\projects\ai-protein-interactions-review\latex\figures'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'figure1_paradigm_shift.pdf')
plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
print(f'Figure 1 saved to: {output_path}')
plt.close()
