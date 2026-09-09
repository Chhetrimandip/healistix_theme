from pathlib import Path
import json,re,zipfile,hashlib
root=Path(__file__).resolve().parents[1]
folders=('assets','blocks','config','layout','locales','sections','snippets','templates')
errors=[];schemas=0;templates=0
for folder in ('sections','blocks'):
    for p in (root/folder).glob('*.liquid'):
        match=re.search(r'{%\s*schema\s*%}(.*?){%\s*endschema\s*%}',p.read_text(encoding='utf-8-sig'),re.S)
        if match:
            try: json.loads(match[1]);schemas+=1
            except ValueError as e: errors.append({'file':str(p.relative_to(root)),'error':str(e)})
for p in (root/'templates').glob('**/*.json'):
    try:
        s=re.sub(r'/\*.*?\*/','',p.read_text(encoding='utf-8-sig'),flags=re.S)
        data=json.loads(s);templates+=1
        for section in data.get('sections',{}).values():
            if not (root/'sections'/f"{section['type']}.liquid").exists():errors.append({'file':str(p.relative_to(root)),'error':'Missing section '+section['type']})
    except ValueError as e: errors.append({'file':str(p.relative_to(root)),'error':str(e)})
report={'schemasParsed':schemas,'templatesParsed':templates,'errors':errors,'note':'Bounded schema/template reference checks, not a complete Shopify Theme Check run.'}
(root/'staging/overnight-validation.json').write_text(json.dumps(report,indent=2))
if errors: raise SystemExit(json.dumps(report))
output=root/'staging/healistix-3rd-iter-catalog-20260908.zip'
files=[]
with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for folder in folders:
        for p in sorted((root/folder).rglob('*')):
            if p.is_file():
                # Superseded gallery PNGs are retained locally, but no theme
                # code references them after the WebP migration.
                if folder == 'assets' and p.suffix.lower()=='.png' and p.name.startswith('hx-pilot-'):continue
                name=p.relative_to(root).as_posix(); z.write(p,name);files.append({'path':name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'staging/overnight-theme-package-manifest.json').write_text(json.dumps(files,indent=2))
if output.stat().st_size > 50_000_000:
    raise SystemExit('Theme package exceeds the 50 MB upload limit: '+str(output.stat().st_size))
print(json.dumps({**report,'package':str(output),'files':len(files),'bytes':output.stat().st_size}))
