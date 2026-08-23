from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MALFORMED_SCHEMA = '"%D9%85%D9%86%20%D9%86%D8%AD%D9%86.html": {'
FIXED_SCHEMA = '"publisher": {'

for path in sorted(ROOT.glob('*.html')):
    text = path.read_text(encoding='utf-8')
    original = text

    # Repair the accidental URL-encoded property name in every JSON-LD WebPage node.
    text = text.replace(MALFORMED_SCHEMA, FIXED_SCHEMA)

    # Internal HTML links must point directly to the canonical extensionless URL.
    def clean_href(match: re.Match[str]) -> str:
        prefix, url, suffix = match.group(1), match.group(2), match.group(3)
        if url.startswith('/') or url.startswith('./') or url.startswith('../') or url.startswith('https://decoratalahlam.com/'):
            url = re.sub(r'\.html(?=($|[?#]))', '', url)
        return prefix + url + suffix

    text = re.sub(r'(\bhref\s*=\s*["\'])([^"\']+)(["\'])', clean_href, text, flags=re.IGNORECASE)

    # Make indexability explicit for pages that do not declare robots directives.
    if not re.search(r'<meta\s+[^>]*name=["\']robots["\']', text, flags=re.IGNORECASE):
        marker = '<meta name="description"'
        pos = text.lower().find(marker.lower())
        if pos >= 0:
            line_end = text.find('>', pos)
            if line_end >= 0:
                text = text[:line_end + 1] + '\n    <meta name="robots" content="index,follow">' + text[line_end + 1:]
        else:
            head_end = text.lower().find('</head>')
            if head_end >= 0:
                text = text[:head_end] + '    <meta name="robots" content="index,follow">\n' + text[head_end:]

    if text != original:
        path.write_text(text, encoding='utf-8')
        print(path.name)
