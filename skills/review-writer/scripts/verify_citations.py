#!/usr/bin/env python3
"""
引用验证脚本
功能: 检查所有\cite{}引用是否存在于references.bib中

使用方法:
  python verify_citations.py                    # 使用默认路径
  python verify_citations.py --fix              # 自动修复（添加占位符）
  python verify_citations.py --report           # 生成详细报告

作者: HOC
版本: 1.0.0
"""

import os
import re
import sys
import argparse
from pathlib import Path
from collections import defaultdict


def extract_bib_keys(bib_file):
    """提取bib文件中的所有keys"""
    try:
        with open(bib_file, 'r', encoding='utf-8') as f:
            content = f.read()
        return set(re.findall(r'@\w+\{(\w+)', content))
    except FileNotFoundError:
        return set()


def extract_citations_from_tex(tex_file):
    """提取tex文件中的所有引用及其位置"""
    try:
        with open(tex_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        return {}, set()
    
    citations_by_line = defaultdict(set)
    all_cites = set()
    
    for line_num, line in enumerate(lines, 1):
        cites = re.findall(r'\\cite\{([^}]+)\}', line)
        for cite_group in cites:
            for cite in cite_group.split(','):
                cite = cite.strip()
                all_cites.add(cite)
                citations_by_line[line_num].add(cite)
    
    return citations_by_line, all_cites


def find_missing_citations(sections_dir, bib_keys):
    """找出所有缺失的引用"""
    sections_path = Path(sections_dir)
    if not sections_path.exists():
        return {}, set()
    
    missing_by_file = {}
    all_missing = set()
    all_cites = set()
    
    for tex_file in sorted(sections_path.glob('*.tex')):
        cites_by_line, cites = extract_citations_from_tex(tex_file)
        all_cites.update(cites)
        
        file_missing = cites - bib_keys
        if file_missing:
            missing_by_file[tex_file.name] = {
                'missing': file_missing,
                'by_line': {}
            }
            # 找出每行缺失的引用
            for line_num, line_cites in cites_by_line.items():
                line_missing = line_cites - bib_keys
                if line_missing:
                    missing_by_file[tex_file.name]['by_line'][line_num] = line_missing
            all_missing.update(file_missing)
    
    return missing_by_file, all_missing, all_cites


def generate_bib_entry(cite_key):
    """生成BibTeX占位符条目"""
    return f"""@article{{{cite_key},
  title={{[需要填写标题]}},
  author={{[需要填写作者]}},
  journal={{[需要填写期刊]}},
  year={{[需要填写年份]}},
  note={{TODO: 完善此引用}}
}}
"""


def main():
    parser = argparse.ArgumentParser(description='验证综述论文引用')
    parser.add_argument('--sections', default='latex/sections',
                       help='章节目录路径 (默认: latex/sections)')
    parser.add_argument('--bib', default='latex/references.bib',
                       help='参考文献文件路径 (默认: latex/references.bib)')
    parser.add_argument('--fix', action='store_true',
                       help='自动生成缺失引用的占位符')
    parser.add_argument('--report', action='store_true',
                       help='生成详细报告')
    args = parser.parse_args()
    
    bib_file = Path(args.bib)
    sections_dir = Path(args.sections)
    
    # 获取bib keys
    bib_keys = extract_bib_keys(bib_file)
    
    if not bib_keys:
        print(f"警告: {bib_file} 中没有找到引用条目或文件不存在")
    
    # 找出缺失的引用
    missing_by_file, all_missing, all_cites = find_missing_citations(
        sections_dir, bib_keys
    )
    
    # 输出结果
    print("=" * 70)
    print("                    CITATION VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    print(f"Total unique citations needed: {len(all_cites)}")
    print(f"Total references in bib:       {len(bib_keys)}")
    print()
    
    if not all_missing:
        print("✅ All citations verified! No missing references.")
        print("=" * 70)
        return True
    
    # 有缺失的引用
    print(f"❌ Missing from references.bib: {len(all_missing)}")
    print("-" * 70)
    
    if args.report:
        # 详细报告
        for filename, data in sorted(missing_by_file.items()):
            print(f"\n{filename}:")
            for line_num, missing_cites in sorted(data['by_line'].items()):
                print(f"  Line {line_num}: {', '.join(sorted(missing_cites))}")
    else:
        # 简要列表
        for cite in sorted(all_missing):
            print(f"  - {cite}")
    
    print("-" * 70)
    
    # 自动修复
    if args.fix:
        print("\n📝 Generating placeholder entries for missing citations...")
        print("-" * 70)
        
        for cite in sorted(all_missing):
            print(generate_bib_entry(cite))
        
        print("-" * 70)
        print(f"\n生成的 {len(all_missing)} 个占位符条目已显示在上方。")
        print("请将它们添加到 references.bib 文件中并完善内容。")
    
    print("=" * 70)
    return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
