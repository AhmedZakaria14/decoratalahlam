from pathlib import Path
from urllib.parse import quote, urlparse
import re

ROOT = Path(__file__).resolve().parents[1]
REDIRECTS = ROOT / '_redirects'
BASE = 'https://decoratalahlam.com'

text = REDIRECTS.read_text(encoding='utf-8')
existing_sources = set()
for line in text.splitlines():
    if line.strip() and not line.lstrip().startswith('#'):
        parts = line.split()
        if len(parts) >= 2:
            existing_sources.add(parts[0])

new_lines = []
for page in sorted(ROOT.glob('*.html')):
    source = '/' if page.name == 'index.html' else '/' + quote(page.name, safe='-._~')
    raw = page.read_text(encoding='utf-8', errors='ignore')
    m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)', raw, flags=re.I)
    if not m:
        continue
    target = urlparse(m.group(1)).path or '/'
    if source == '/' or source in existing_sources:
        continue
    new_lines.append(f'{source} {target} 301')

if new_lines:
    text = text.rstrip() + '\n\n# One-hop permanent redirects for every legacy .html filename.\n' + '\n'.join(new_lines) + '\n'
    REDIRECTS.write_text(text, encoding='utf-8')

print(f'Added {len(new_lines)} generated redirects.')
