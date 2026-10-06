#!/usr/bin/env python3
"""Compile the reviewed Polish TSV into the existing single JS asset."""
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
translations = {}
for line in (root / 'translations/pl.tsv').read_text().splitlines():
    if not line.strip():
        continue
    key, value = line.split('\t', 1)
    if key in translations and translations[key] != value:
        raise ValueError('Conflicting translation: ' + key)
    translations[key] = value
script = root / 'assets/npomega.js'
text, count = re.subn(r'const labels = new Map\(Object\.entries\(\{.*?\}\)\);',
                     lambda _: 'const labels = new Map(Object.entries(' + json.dumps(translations, ensure_ascii=False, indent=2) + '));',
                     script.read_text(), count=1, flags=re.S)
assert count == 1, 'Translation block not found'
script.write_text(text)
print('Compiled', len(translations), 'Polish translations.')
