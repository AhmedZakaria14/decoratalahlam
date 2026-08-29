from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://decoratalahlam.com'
errors = []

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.robots = []
        self.titles = 0
        self.h1 = 0
        self.jsonld = []
        self.in_jsonld = False
        self.buf = []
        self.hrefs = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel','').lower() == 'canonical':
            self.canonicals.append(attrs.get('href',''))
        if tag == 'meta' and attrs.get('name','').lower() == 'robots':
            self.robots.append(attrs.get('content',''))
        if tag == 'title': self.titles += 1
        if tag == 'h1': self.h1 += 1
        if tag == 'a' and attrs.get('href'): self.hrefs.append(attrs['href'])
        if tag == 'script' and attrs.get('type','').lower() == 'application/ld+json':
            self.in_jsonld = True
            self.buf = []
    def handle_endtag(self, tag):
        if tag == 'script' and self.in_jsonld:
            self.jsonld.append(''.join(self.buf))
            self.in_jsonld = False
    def handle_data(self, data):
        if self.in_jsonld: self.buf.append(data)

canonical_by_file = {}
for path in sorted(ROOT.glob('*.html')):
    p = Parser()
    p.feed(path.read_text(encoding='utf-8', errors='ignore'))
    if len(p.canonicals) != 1:
        errors.append(f'{path.name}: expected exactly one canonical, found {len(p.canonicals)}')
    else:
        canonical = p.canonicals[0]
        canonical_by_file[path.name] = canonical
        parsed = urlparse(canonical)
        if canonical != canonical.strip() or parsed.scheme != 'https' or parsed.netloc != 'decoratalahlam.com' or parsed.query or parsed.fragment or parsed.path.endswith('.html'):
            errors.append(f'{path.name}: invalid canonical {canonical}')
    if not p.robots or not any('index' in x.lower() and 'follow' in x.lower() and 'noindex' not in x.lower() for x in p.robots):
        errors.append(f'{path.name}: missing index,follow robots meta')
    if p.titles != 1: errors.append(f'{path.name}: expected one title, found {p.titles}')
    if p.h1 != 1: errors.append(f'{path.name}: expected one h1, found {p.h1}')
    for raw in p.jsonld:
        if '%D9%85%D9%86%20%D9%86%D8%AD%D9%86.html' in raw:
            errors.append(f'{path.name}: malformed encoded schema key remains')
        try: json.loads(raw)
        except json.JSONDecodeError as exc: errors.append(f'{path.name}: invalid JSON-LD: {exc}')
    for href in p.hrefs:
        if href.startswith('/') or href.startswith('./') or href.startswith('../') or href.startswith(BASE + '/'):
            if re.search(r'\.html(?:[?#]|$)', href, re.I): errors.append(f'{path.name}: internal .html link remains: {href}')

# The sitemap must contain exactly the unique canonical URLs, with no .html entries.
sitemap_urls = []
try:
    root = ET.parse(ROOT / 'sitemap.xml').getroot()
    sitemap_urls = [loc.text.strip() for node in root if node.tag.endswith('url') for loc in node if loc.tag.endswith('loc') and loc.text]
except Exception as exc:
    errors.append(f'sitemap.xml: invalid XML: {exc}')
expected_urls = sorted(set(canonical_by_file.values()))
if sorted(set(sitemap_urls)) != expected_urls:
    errors.append(f'sitemap.xml: URLs do not match canonical set (sitemap={len(set(sitemap_urls))}, canonical={len(expected_urls)})')
if any('.html' in u for u in sitemap_urls): errors.append('sitemap.xml: .html URL found')

# Every physical HTML filename (except index) must have a permanent one-hop redirect.
redirect_sources = {}
for line in (ROOT / '_redirects').read_text(encoding='utf-8').splitlines():
    if not line.strip() or line.lstrip().startswith('#'): continue
    parts = line.split()
    if len(parts) >= 3: redirect_sources[parts[0]] = (parts[1], parts[2])

canonical_paths = {urlparse(url).path or '/' for url in expected_urls}
for source, (target, status) in redirect_sources.items():
    if status in {'301', '308'} and target not in canonical_paths:
        errors.append(f'_redirects: permanent redirect {source} points to non-canonical target {target}')

for filename, canonical in canonical_by_file.items():
    if filename == 'index.html': continue
    source = '/' + filename.encode('utf-8').decode('utf-8')
    # _redirects stores percent-encoded non-ASCII filenames.
    from urllib.parse import quote
    source = '/' + quote(filename, safe='-._~')
    target = urlparse(canonical).path or '/'
    if source not in redirect_sources or redirect_sources[source] != (target, '301'):
        errors.append(f'_redirects: missing one-hop 301 for {source} -> {target}')

if errors:
    print('\n'.join('ERROR: ' + e for e in errors))
    sys.exit(1)
print(f'OK: {len(canonical_by_file)} HTML files, {len(expected_urls)} unique canonical URLs, {len(redirect_sources)} redirects.')
