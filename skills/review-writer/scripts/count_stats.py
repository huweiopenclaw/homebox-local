#!/usr/bin/env python3
"""
综述论文字数统计脚本
功能: 统计各章节字数、总字数、引用数量

使用方法:
  python count_stats.py                    # 使用默认路径
  python count_stats.py --sections latex/sections  # 指定路径
  python count_stats.py --verbose          # 详细输出

作者: HOC
版本: 1.0.0
"""

import os
import re
import sys
import argparse
from pathlib import Path


def count_words_in_tex(tex_file):
    """统计tex文件的字数（去除LaTeX命令）"""
    try:
        with open(tex_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return 0, set()
    
    # 统计引用
    cites = re.findall(r'\\cite\{([^}]+)\}', content)
    unique_cites = set()
    for cite in cites:
        unique_cites.update([c.strip() for c in cite.split(',')])
    
    # 移除LaTeX命令统计字数
    # 移除\cite{...}
    text = re.sub(r'\\cite\{[^}]*\}', '', content)
    # 移除其他LaTeX命令
    text = re.sub(r'\\[a-zA-Z]+(\{[^}]*\})?', '', text)
    # 移除特殊字符
    text = re.sub(r'[{}\\~$[\]%]', ' ', text)
    # 规范化空白
    text = re.sub(r'\s+', ' ', text)
    
    return len(text.split()), unique_cites


def count_references(bib_file):
    """统计bib文件中的引用数量"""
    try:
        with open(bib_file, 'r', encoding='utf-8') as f:
            content = f.read()
        return len(re.findall(r'@\w+\{', content))
    except FileNotFoundError:
        return 0


def main():
    parser = argparse.ArgumentParser(description='统计综述论文字数和引用')
    parser.add_argument('--sections', default='latex/sections', 
                       help='章节目录路径 (默认: latex/sections)')
    parser.add_argument('--bib', default='latex/references.bib',
                       help='参考文献文件路径 (默认: latex/references.bib)')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='详细输出')
    args = parser.parse_args()
    
    sections_dir = Path(args.sections)
    bib_file = Path(args.bib)
    
    if not sections_dir.exists():
        print(f"错误: 目录 {sections_dir} 不存在")
        sys.exit(1)
    
    # 获取所有章节文件
    sections = sorted([f for f in sections_dir.glob('*.tex')])
    
    if not sections:
        print(f"警告: {sections_dir} 中没有找到.tex文件")
        sys.exit(0)
    
    # 统计
    total_words = 0
    total_cites = set()
    section_stats = []
    
    for section in sections:
        words, cites = count_words_in_tex(section)
        total_words += words
        total_cites.update(cites)
        
        section_stats.append({
            'file': section.name,
            'words': words,
            'citations': len(cites)
        })
    
    # 统计references.bib
    ref_count = count_references(bib_file)
    
    # 输出
    print("=" * 70)
    print("                    REVIEW PAPER STATISTICS")
    print("=" * 70)
    print()
    
    if args.verbose:
        print("SECTION DETAILS:")
        print("-" * 70)
        for stat in section_stats:
            print(f"  {stat['file']:<35} ~{stat['words']:>5} words  ({stat['citations']:>2} cites)")
        print("-" * 70)
        print()
    
    print("SUMMARY:")
    print("-" * 70)
    print(f"  Total words:              ~{total_words:,}")
    print(f"  Unique citations used:    {len(total_cites)}")
    print(f"  Total references in bib:  {ref_count}")
    print(f"  Sections:                 {len(sections)}")
    print("-" * 70)
    print()
    
    # 目标检查（假设目标是6,000-8,000词，150-200引用）
    target_words_min, target_words_max = 6000, 8000
    target_refs_min, target_refs_max = 150, 200
    
    print("TARGET PROGRESS:")
    print(f"  Words: {total_words:,}/{target_words_min:,}-{target_words_max:,} ", end="")
    if target_words_min <= total_words <= target_words_max:
        print("✓")
    elif total_words > target_words_max:
        print("⚠ (超出)")
    else:
        print(f"({int(total_words/target_words_max*100)}%)")
    
    print(f"  References: {ref_count}/{target_refs_min}-{target_refs_max} ", end="")
    if ref_count >= target_refs_min:
        print("✓")
    else:
        print(f"({int(ref_count/target_refs_max*100)}%)")
    
    print("=" * 70)


if __name__ == '__main__':
    main()
