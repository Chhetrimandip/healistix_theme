"""Export reviewed theme content to Judge.me's historical-import format.

No requests to Judge.me, no invented emails/ratings, and no automatic publication.
"""
import csv
import json
import re
from datetime import datetime
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'staging/amazon-review-evidence-20260908'
OUT = ROOT / 'staging/judgeme-migration-20260908'
OUT.mkdir(exist_ok=True)
template_path = ROOT / 'templates/product.seamoss.json'
raw = template_path.read_text(encoding='utf-8-sig')
template = json.loads(raw[raw.index('{'):])
grid = template['sections']['reviews_grid']
guava = json.loads((EVIDENCE / 'verified-guava-review-records.json').read_text(encoding='utf-8-sig'))
sources = {r['id']: r for r in json.loads((EVIDENCE / 'store-review-records.json').read_text(encoding='utf-8-sig')) + guava}
selected = {
    'R27GQGJSSA5HVQ': ('A fruity spoonful', 'I have never had guava before, but it tastes like a bold, delicious strawberry applesauce.'),
    'R1JZO5PXCIMB21': ('Straight from the jar', 'It has that smooth, applesauce-like texture that makes it so easy to eat by the spoonful.'),
    'RT97MYLTP17EL': ('In smoothies and overnight oats', "I've been blending it into morning smoothies and overnight oats, and it adds a perfect, subtle tropical vibe."),
    'RPZMZJ892Z3UM': ('An honest take on texture', "I still wouldn't say I particularly like the flavor. It's quite sweet, and the texture isn't my favorite either."),
}
for rid, (title, excerpt) in selected.items():
    source = sources[rid]
    assert excerpt in source['text'] and len(excerpt.split()) <= 25
    image_name = f'review-{rid.lower()}.jpg'
    image_path = ROOT / 'assets' / image_name
    if not image_path.exists():
        with urlopen(source['photos'][0], timeout=25) as response:
            image_path.write_bytes(response.read())
    key = f'review_{rid.lower()}'
    grid['blocks'][key] = {'type': 'review', 'settings': {
        'badge': source['name'], 'title': title, 'rating': '★★★★★ · 5 out of 5',
        'text': excerpt, 'footer': 'Red Guava · ' + source['date'].split(' on ')[-1],
        'source_url': f'https://www.amazon.com/gp/customer-reviews/{rid}',
        'disclosure': 'Received a free product through Vine.',
        'image_asset': image_name,
        'media_alt': f"Customer photo shared by {source['name']} with their Red Guava review",
    }}
    if key not in grid['block_order']:
        grid['block_order'].append(key)
# Replace only the reviews section, preserving every unrelated byte of the template.
start = raw.index('{', raw.index('"reviews_grid":'))
_, length = json.JSONDecoder().raw_decode(raw[start:])
replacement = json.dumps(grid, ensure_ascii=False, indent=2).replace('\n', '\n    ')
template_path.write_text(raw[:start] + replacement + raw[start + length:], encoding='utf-8')

headers = ['title', 'body', 'rating', 'review_date', 'reviewer_name', 'reviewer_email', 'product_handle', 'picture_urls', 'curated']
rows, register, pending = [], [], []
for key in grid['block_order']:
    s = grid['blocks'][key]['settings']
    match = re.search(r'customer-reviews/([A-Z0-9]+)', s.get('source_url', ''))
    rid = match.group(1) if match else key
    rating = re.search(r'(\d) out of 5', s.get('rating', ''))
    record = {'key': key, 'name': s['badge'], 'source_url': s.get('source_url', ''),
              'flavor': s['footer'].split(' · ')[0], 'video_path': str(ROOT / 'assets' / s['video_asset']) if s.get('video_asset') else None,
              'text_provenance': 'User supplied on 2026-09-08; original written review/rating not independently retrieved' if s['badge'] == 'Emily' else 'Existing source-checked review excerpt or user screenshot',
              'body': s.get('text', ''), 'disclosure': s.get('disclosure', '')}
    if not rating or not s.get('text'):
        record['missing'] = [field for field, valid in [('original rating', rating), ('original review text', s.get('text'))] if not valid]
        pending.append(record)
        continue
    date = s['footer'].split(' · ')[-1]
    parsed_date = datetime.strptime(date, '%B %d, %Y').strftime('%d/%m/%Y')
    photos = [p['src'] if isinstance(p, dict) else p for p in sources.get(rid, {}).get('photos', [])[:5]]
    # Preserve original photos, never pass a video poster off as an attached photo.
    body = s['text']
    if s['badge'] == 'Rosie G':
        body = 'In its Raw natural form I couldn’t swallow it. It’s not a nasty taste but definitely an acquired taste.'
    notes = '[Editorial context: ' + record['flavor'] + '. Selected review excerpt.'
    if record['disclosure']:
        notes += ' ' + record['disclosure']
    notes += ']'
    rows.append(dict(zip(headers, [s.get('title', ''), body + '\n\n' + notes, int(rating.group(1)), parsed_date,
                                   s['badge'], '', 'sea-moss-gel', ','.join(photos), 'not-yet'])))
    record.update({'picture_urls': photos, 'import_row': len(rows) + 1, 'rating': int(rating.group(1))})
    register.append(record)
with (OUT / 'judgeme-import.csv').open('w', newline='', encoding='utf-8-sig') as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)
(OUT / 'media-and-source-register.json').write_text(json.dumps(register, ensure_ascii=False, indent=2), encoding='utf-8')
(OUT / 'pending-review-details.json').write_text(json.dumps(pending, ensure_ascii=False, indent=2), encoding='utf-8')
with (OUT / 'judgeme-import.csv').open(encoding='utf-8-sig', newline='') as file:
    exported = list(csv.DictReader(file))
assert len(exported) == len(rows) == 11
assert exported[0]['reviewer_name'] == 'Annalise Slezak'
assert all(r['reviewer_email'] == '' and r['curated'] == 'not-yet' and r['body'] for r in exported)
assert all(len(r['picture_urls'].split(',')) <= 5 for r in exported)
assert len(pending) == 3
print(json.dumps({'importable_reviews': len(rows), 'pending_details': [r['name'] for r in pending],
                  'new_photo_reviews': len(selected), 'theme_reviews': len(grid['block_order'])}))
