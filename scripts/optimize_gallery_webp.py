"""Keep high-resolution exports in staging; serve smaller transparent gallery copies."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
backup=root/'staging/gallery-lossless-exports';backup.mkdir(exist_ok=True)
rows=[]
for p in sorted((root/'assets').glob('hx-pilot-*.webp')):
    if not (p.stem.endswith('-front') or p.stem.endswith('-left') or p.stem.endswith('-right')):continue
    original=backup/p.name
    if not original.exists():original.write_bytes(p.read_bytes())
    im=Image.open(original).convert('RGBA')
    im.thumbnail((1800,1800),Image.Resampling.LANCZOS)
    temporary=backup/(p.name+'.optimized')
    im.save(temporary,'WEBP',quality=92,method=4,exact=True)
    temporary.replace(p)
    rows.append({'asset':p.name,'before':original.stat().st_size,'after':p.stat().st_size,'alpha':list(im.getchannel('A').getextrema())})
(root/'staging/overnight-gallery-optimization.json').write_text(json.dumps(rows,indent=2))
print(json.dumps({'images':len(rows),'beforeMB':sum(x['before'] for x in rows)/1e6,'afterMB':sum(x['after'] for x in rows)/1e6}))
