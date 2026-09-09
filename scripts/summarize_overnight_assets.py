"""Summarize local export readiness; does not change theme or catalog records."""
from pathlib import Path
import json
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
report=json.loads((ROOT/'staging/overnight-export-report.json').read_text())
entries=json.loads((ROOT/'staging/overnight-asset-manifest.json').read_text(encoding='utf-8-sig'))
ready=[]
for entry in entries:
    slug=entry['slug']
    rows=[r for r in report['exports'] if r['slug']==slug]
    front=next((r for r in rows if r['role']=='front'),{})
    photos=[r for r in ('front','left','right') if (ROOT/f'assets/hx-pilot-{slug}-{r}.webp').exists()]
    labels=[r for r in ('front','left','right') if (ROOT/f'assets/hx-label-{slug}-{r}.webp').exists()]
    ready.append({'slug':slug,'flavor':entry['flavor'],'photoRoles':photos,'labelRoles':labels,'source':{'lidColor':front.get('lidColor'),'gelColor':front.get('gelColor'),'lidType':front.get('lidType'),'version':entry['version']},'technicalPanelSetComplete':len(labels)==3,'priorPilot':slug in report['pilotSkipped'],'contentReviewHold':slug=='strawberry','notes':('Gold front visibly states Net 17 Oz; supplied legacy side filenames specify 16 OZ. Retain originals and review mixed label version before enabling scene.' if slug=='strawberry' else 'Photo-only: exported side panels not supplied.' if slug in report['photoOnly'] else 'Previously completed pilot; not regenerated or re-QAd by this pipeline.' if slug in report['pilotSkipped'] else 'Latest supplied gold front plus legacy sides.' if entry['version']!='legacy-only' else 'Actual legacy black-lid source; configure black scene lid.')})
for item in ready:
    if item['slug']=='beet-root':
        item['contentReviewHold']=True
        item['notes']='RIGHT printed ingredients visibly say Pineapple Puree. Source artwork retained. White backdrop removed; verify printed facts before using combined label scene.'
for r in report['exports']:
    for output in r['outputs']:
        with Image.open(ROOT/output) as im:
            im.load()
            if '/hx-pilot-' in output or '/hx-product-' in output:
                assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255),output
result={'flavors':ready,'specialProducts':[r for r in report['exports'] if r['slug'] in ('batana','shilajit')],'missing':report['missing'],'qaContactSheets':[p.relative_to(ROOT).as_posix() for p in sorted((ROOT/'staging').glob('overnight-qa-*.jpg'))],'notes':['Colors are median sRGB samples from source lid and uncovered gel regions, not measured physical material colors. Use front colors for the scene; role-level records preserve legacy side differences.','No originals edited, downloaded, fabricated or repainted. No theme/catalog changes.','Panel transform coordinates and source Drive IDs/checksums are in overnight-export-report.json.','Strawberry source weight discrepancy is flagged; visual QA is not factual approval of printed claims.']}
(ROOT/'staging/overnight-asset-readiness.json').write_text(json.dumps(result,indent=2))
print(json.dumps({'newSourceExports':len(report['exports']),'outputFiles':sum(len(r['outputs']) for r in report['exports']),'missing':report['missing'],'completePhotoFronts':len([x for x in ready if 'front' in x['photoRoles']]),'completePanelSets':len([x for x in ready if x['technicalPanelSetComplete']])}))
