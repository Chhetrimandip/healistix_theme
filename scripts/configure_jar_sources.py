"""Publish only complete exported panel sets to the lazy-loaded jar viewer."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'staging/overnight-asset-manifest.json').read_text())
report=json.loads((root/'staging/overnight-export-report.json').read_text())
fronts={x['slug']:x for x in report['exports'] if x['role']=='front'}
pilots={'banana':'#e3dc9b','blueberry':'#263b72','mango':'#f2bb2e','pineapple':'#e7c52c','watermelon':'#ed663e'}
entries=[];ready=[]
for item in manifest:
    slug=item['slug']
    if slug == 'beet-root': continue  # supplied right panel names Pineapple Puree
    if not all((root/f'assets/hx-label-{slug}-{role}.webp').exists() for role in ('front','left','right')): continue
    if not item.get('left') or not item.get('right'): continue
    source=fronts.get(slug,{})
    fields=[]
    for role in ('front','right','left'):
        fields.append('"'+role+'": {{ '+repr(f'hx-label-{slug}-{role}.webp')+' | asset_url | json }}')
    fields.append('"color": '+json.dumps(source.get('gelColor',pilots.get(slug,'#d2be81'))))
    fields.append('"unwrapped": true')
    if source.get('lidType')=='black':fields.append('"lidColor": "#232323"')
    entries.append(json.dumps(item['flavor'].lower())+': {'+', '.join(fields)+'}')
    ready.append(item['flavor'])
p=root/'snippets/hx-jar-viewer.liquid'
s=p.read_text(encoding='utf-8'); s=re.sub(r'(<script type="application/json" data-jar-sources>).*?(</script>)',lambda m:m[1]+'{\n'+',\n'.join(entries)+'\n}'+m[2],s,flags=re.S)
p.write_text(s,encoding='utf-8')
# The same list gates label drawers and initial 360 controls.
p=root/'snippets/hx-flavor-support.liquid';s=p.read_text();s=re.sub(r"(if mode == 'interactive' -%}).*?({%- else)",lambda m:m[1]+','.join(ready)+m[2],s,flags=re.S);p.write_text(s)
print('Enabled',len(ready),'complete label sets:',', '.join(ready))
