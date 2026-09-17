"""Reproducible seed import. CSV text is authoritative; PDF JSON is visibly clipped."""
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).parent

def generate():
    data = ROOT / 'data'
    herbs = list(csv.DictReader((data / 'herbs_seed.csv').open(encoding='utf-8-sig', newline='')))
    uses = list(csv.DictReader((data / 'uses_seed.csv').open(encoding='utf-8-sig', newline='')))
    assert len(herbs) == 52 and len(uses) == 16
    assert len({h['id'] for h in herbs}) == 52 and len({u['id'] for u in uses}) == 16
    text = (data / 'seed-notes.txt').read_text(encoding='utf-8').replace('\f', '')
    # The beginning has physically clipped long JSON lines, but the tail is intact.
    tail = json.loads('{"do_not_list"' + text.split('"do_not_list"', 1)[1])
    for h in herbs:
        for key in ('default_g', 'max_g'):
            h[key] = float(h[key])
        assert 0 < h['default_g'] <= h['max_g']
        for key in ('flags', 'uses'):
            h[key] = list(filter(None, h[key].split(',')))
        for key in ('premium', 'thickens'):
            assert h[key] in ('Y', 'N')
            h[key] = h[key] == 'Y'
        h['approval_status'] = 'provisional'
        h['coa_status'] = 'unverified'
        assert set(h['uses']) <= {u['id'] for u in uses}
        assert set(h['flags']) <= {f['code'] for f in tail['flags']}
    by_id = {h['id']: h for h in herbs}
    conflicts = []
    for u in uses:
        u['sea_moss_lead'] = u['sea_moss_lead'] == 'Y'
        u['default_pairing'] = [dict(id=p.split(':')[0], g=float(p.split(':')[1])) for p in u['default_pairing'].split(',')]
        for p in u['default_pairing']:
            assert p['id'] in by_id and u['id'] in by_id[p['id']]['uses']
            if p['g'] != by_id[p['id']]['default_g']:
                conflicts.append(dict(use=u['id'], herb=p['id'], pairing_g=p['g'], library_g=by_id[p['id']]['default_g']))
    for herb, g in [('maca', 10), ('beet-root', 8)]:
        conflicts.append(dict(use='energy:no-stim', herb=herb, pairing_g=g, library_g=by_id[herb]['default_g']))
    # Read all herb objects embedded in seed PDF and compare to CSV, without repairing clipped prose.
    herb_fragment = text.split('"herbs":', 1)[1].split('"do_not_list"', 1)[0].strip().rstrip(',')
    pdf_herbs = json.loads(herb_fragment)
    differences = []
    for original, pdf in zip(list(csv.DictReader((data / 'herbs_seed.csv').open(encoding='utf-8-sig'))), pdf_herbs):
        for key, value in original.items():
            if str(value) != str(pdf[key]) and key not in ('default_g', 'max_g'):
                differences.append(dict(herb=original['id'], field=key))
    assert len(pdf_herbs) == 52
    library = dict(library_version='2026-09-12-provisional', herbs=herbs, uses=uses, **tail)
    (data / 'library.json').write_text(json.dumps(library, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    audit = dict(herb_count=len(herbs), use_count=len(uses), pairing_conflicts=conflicts,
                 pdf_csv_differences=differences, approvals='All 52 provisional; no COA evidence supplied',
                 source_hashes={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in data.glob('*_seed.csv')})
    (data / 'audit.json').write_text(json.dumps(audit, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(audit, indent=2))

if __name__ == '__main__':
    generate()
