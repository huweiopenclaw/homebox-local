#!/usr/bin/env python3
"""
清理 references.bib 中的重复条目
保留每个键的第一次出现
"""
import re
from pathlib import Path

def fix_bib_duplicates():
    bib_file = Path('references.bib')
    output_file = Path('references_fixed.bib')

    print("=" * 70)
    print("清理 BibTeX 重复条目")
    print("=" * 70)
    print()

    # 读取文件
    content = bib_file.read_text(encoding='utf-8')

    # 分割成条目
    entries = []
    current_entry = []
    in_entry = False

    for line in content.split('\n'):
        # 检测条目开始
        if re.match(r'^@\w+\{', line):
            in_entry = True
            current_entry = [line]
        elif in_entry:
            current_entry.append(line)
            # 检测条目结束
            if line.strip() == '}':
                entries.append('\n'.join(current_entry))
                current_entry = []
                in_entry = False

    print(f"总条目数: {len(entries)}")

    # 提取键并去重
    seen_keys = set()
    unique_entries = []
    duplicates = []

    for entry in entries:
        match = re.match(r'^@\w+\{([^,]+),', entry)
        if match:
            key = match.group(1)
            if key not in seen_keys:
                seen_keys.add(key)
                unique_entries.append(entry)
            else:
                duplicates.append(key)

    print(f"唯一条目: {len(unique_entries)}")
    print(f"重复条目: {len(duplicates)}")
    print()

    if duplicates:
        print("重复的键:")
        for dup in duplicates:
            print(f"  - {dup}")
        print()

    # 写入新文件
    output_file.write_text('\n\n'.join(unique_entries), encoding='utf-8')

    print("=" * 70)
    print(f"[完成] 已保存到: {output_file}")
    print(f"[备份] 原文件: {bib_file}.backup")
    print("=" * 70)

    # 备份原文件
    backup_file = Path(f"{bib_file}.backup")
    if not backup_file.exists():
        bib_file.rename(backup_file)
        print(f"[备份] {bib_file} -> {backup_file}")

        # 重命名修复后的文件
        output_file.rename(bib_file)
        print(f"[应用] {output_file} -> {bib_file}")
    else:
        print(f"[提示] 备份文件已存在，手动替换:")
        print(f"  1. 删除或重命名 {bib_file}")
        print(f"  2. 重命名 {output_file} 为 {bib_file}")

if __name__ == '__main__':
    fix_bib_duplicates()
