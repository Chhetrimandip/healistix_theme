"""Package only the review change against a fresh live-template backup."""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'staging/judgeme-migration-20260909'
OUT = BASE / 'live-package'

def read_theme(path):
    raw = path.read_text(encoding='utf-8-sig')
    return raw, json.loads(raw[raw.index('{'):])

raw, before = read_theme(BASE / 'live-before/templates/product.seamoss.json')
_, local = read_theme(ROOT / 'templates/product.seamoss.json')
review_section = local['sections']['reviews_grid']
assert review_section['settings']['review_source'] == 'judgeme'
changes = {'reviews_grid': review_section,
           'reviews_widget': {**before['sections']['reviews_widget'], 'disabled': True},
           'main': {**before['sections']['main'], 'settings': {
               **before['sections']['main']['settings'], 'review_text': ''}}}
for key, value in changes.items():
    start = raw.index('{', raw.index(f'"{key}":'))
    _, size = json.JSONDecoder().raw_decode(raw[start:])
    replacement = json.dumps(value, ensure_ascii=False, indent=2).replace('\n', '\n    ')
    raw = raw[:start] + replacement + raw[start + size:]
after = json.loads(raw[raw.index('{'):])
assert before['order'] == after['order']
for key, value in before['sections'].items():
    if key not in changes:
        assert after['sections'][key] == value, key

template = OUT / 'templates/product.seamoss.json'
template.parent.mkdir(parents=True, exist_ok=True)
template.write_text(raw, encoding='utf-8')
paths = [
    'sections/hx-pdp-reviews.liquid', 'snippets/hx-judgeme-reviews.liquid',
    'assets/hx-pdp-reviews.css', 'assets/hx-pdp-reviews.js',
    'assets/hx-judgeme-reviews.css', 'assets/hx-judgeme-reviews.js',
]
for block in review_section['blocks'].values():
    settings = block['settings']
    if settings.get('video_asset') or settings.get('image_asset'):
        for field in ['video_asset', 'image_asset', 'captions_asset']:
            if settings.get(field):
                paths.append(f"assets/{settings[field]}")
for path in sorted(set(paths)):
    destination = OUT / path
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / path, destination)
print(json.dumps({'files': len(set(paths)) + 1, 'changed_sections': list(changes),
                  'other_sections_unchanged': True, 'output': str(OUT)}))
