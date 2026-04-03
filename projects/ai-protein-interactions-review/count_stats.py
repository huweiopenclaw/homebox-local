#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Count words and citations in LaTeX files."""

import os
import re

sections_dir = r'C:\Users\1990h\.openclaw\workspace\projects\ai-protein-interactions-review\latex\sections'
sections = sorted([f for f in os.listdir(sections_dir) if f.endswith('.tex')])

total_words = 0
all_cites = set()

for sec in sections:
    path = os.path.join(sections_dir, sec)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count words (rough estimate)
    text = re.sub(r'\\[a-zA-Z]+', '', content)
    text = re.sub(r'[{}\\~$[\]%]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    words = len(text.split())
    
    # Count citations (\cite{} and \citep{})
    cites = re.findall(r'\\cite[p]?\{([^}]+)\}', content)
    sec_cites = set()
    for c in cites:
        sec_cites.update([x.strip() for x in c.split(',')])
        all_cites.update([x.strip() for x in c.split(',')])
    
    total_words += words
    print(f'{sec}: ~{words} words, {len(sec_cites)} unique citations')

print()
print('=' * 70)
print(f'Total words: {total_words}')
print(f'Unique citations used: {len(all_cites)}')

# Count references in bib
with open(r'C:\Users\1990h\.openclaw\workspace\projects\ai-protein-interactions-review\latex\references.bib', 'r', encoding='utf-8') as f:
    bib_content = f.read()

bib_keys = set(re.findall(r'@\w+\{(\w+)', bib_content))
print(f'Total references in bib: {len(bib_keys)}')

# Check for missing citations
missing = all_cites - bib_keys
if missing:
    print(f'\nMissing citations: {missing}')
