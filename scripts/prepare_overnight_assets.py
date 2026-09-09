"""Local-only export of staged originals. Rerunnable; no downloads or catalog writes."""
import os
os.environ.setdefault('NUMBA_DISABLE_JIT', '1')
os.environ.setdefault('OMP_NUM_THREADS', '2')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '2')
from pathlib import Path
import json, math, hashlib, re
from PIL import Image, ImageChops, ImageDraw, ImageStat

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / 'staging'
ASSETS = ROOT / 'assets'
PILOTS = {'banana', 'blueberry', 'mango', 'pineapple', 'watermelon'}
PHOTO_ONLY = {'red-guava', 'lychee', 'guava-lemon'}
REPORT = STAGE / 'overnight-export-report.json'
SESSION = None

def slugify(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')

def cutout(original, force=False):
    global SESSION
    alpha = original.getchannel('A')
    hist = alpha.histogram()
    # Real transparent exterior: preserve alpha exactly. Some PNGs have an
    # alpha channel but still contain a white rectangular photograph backdrop.
    transparent = sum(hist[:16]) / (original.width * original.height)
    if transparent > .05 and not force:
        return original.copy(), 'source-alpha-preserved'
    model = Path.home() / '.u2net/u2net.onnx'
    if not model.is_file():
        raise ValueError('cached u2net missing; download prohibited')
    from rembg import new_session, remove
    if SESSION is None:
        SESSION = new_session('u2net', providers=['CPUExecutionProvider'])
    backdrop = Image.new('RGBA', original.size, 'white')
    backdrop.alpha_composite(original)
    mask = remove(backdrop.convert('RGB'), session=SESSION, only_mask=True)
    result = original.copy()
    result.putalpha(ImageChops.multiply(alpha, mask.convert('L')))
    return result, 'cached-u2net-mask-times-source-alpha'

def panel(original, geometry):
    center, radius, x0, x1, top, bottom, tc, bc = geometry
    a0, a1 = [math.asin(max(-.995, min(.995, (x-center)/radius))) for x in (x0,x1)]
    def point(t):
        a = a0 + t*(a1-a0)
        edge = 1-math.cos(a)
        return center+radius*math.sin(a), top+tc*edge, bottom-bc*edge
    mesh=[]
    for col in range(120):
        l,r=col*10,(col+1)*10
        x,y0,y1=point(l/1200)
        xx,yy0,yy1=point(r/1200)
        mesh.append(((l,0,r,1100),(x,y0,x,y1,xx,yy1,xx,yy0)))
    return original.transform((1200,1100),Image.Transform.MESH,mesh,Image.Resampling.BICUBIC)

def color(original, box):
    sample=original.crop(box).convert('RGB')
    return '#'+''.join(f'{round(v):02x}' for v in ImageStat.Stat(sample).median)

def process(entry, role, source, meta, special=False):
    slug=slugify(entry['slug'])
    raw=source.read_bytes()
    digest=hashlib.md5(raw).hexdigest()
    if meta.get('md5Checksum') and digest != meta['md5Checksum']:
        raise ValueError('source checksum mismatch / download incomplete')
    with Image.open(source) as image:
        image.load()
        original=image.convert('RGBA')
    target=ASSETS/f"hx-{'product' if special else 'pilot'}-{slug}-{role}.webp"
    previous=OLD.get((slug,role))
    force = slug == 'beet-root' and role == 'right'
    if previous and previous.get('md5')==digest and (not force or previous.get('forcedBackdropRemoval')) and all((ROOT/p).exists() for p in previous['outputs']):
        return previous
    result,alpha_method=cutout(original, force)
    bounds=result.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
    if not bounds:
        raise ValueError('empty cutout')
    jar=result.crop(bounds)
    if special:
        jar.thumbnail((1400,1400),Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(jar.width+120,jar.height+120))
        canvas.alpha_composite(jar,(60,60))
    else:
        jar.thumbnail((1150,1650),Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(1354,1836))
        canvas.alpha_composite(jar,((1354-jar.width)//2,(1836-jar.height)//2))
    canvas.save(target,'WEBP',lossless=True,method=4)
    record={'slug':slug,'role':role,'source':source.relative_to(ROOT).as_posix(),'driveId':meta.get('id'),'md5':digest,'sourceVersion':entry.get('version'),'sourceSize':list(original.size),'alphaMethod':alpha_method,'alphaExtrema':list(canvas.getchannel('A').getextrema()),'cropBounds':list(bounds),'outputs':[target.relative_to(ROOT).as_posix()],'geometry':None}
    record['forcedBackdropRemoval']=force
    if not special:
        gold=original.size==(4000,4000) and role=='front'
        if original.size not in [(4000,4000),(1354,1836)]:
            record['labelBlocked']='unrecognized source dimensions'
        elif slug not in PHOTO_ONLY:
            geometry=(1960,1070,1000,2900,1205,3225,0,35) if gold else ((700,425,315,1085,596,1490,19,45) if role=='front' else (700,425,457 if role=='right' else 475,1118 if role=='right' else 1060,596,1490,19,45))
            label=ASSETS/f'hx-label-{slug}-{role}.webp'
            panel(original,geometry).save(label,'WEBP',quality=94,method=4)
            record['geometry']=dict(zip(['center','radius','x0','x1','top','bottom','topCurve','bottomCurve'],geometry))
            record['outputs'].append(label.relative_to(ROOT).as_posix())
        record['lidColor']=color(original,(1550,240,1900,350) if gold else (520,265,850,300))
        record['gelColor']=color(original,(1630,3310,2300,3450) if gold else (560,1510,850,1580))
        record['lidType']='gold' if gold else 'black'
    else:
        record['lidType']='source-product-specific'
    print(slug,role,alpha_method,flush=True)
    return record

OLD={}
if REPORT.exists():
    OLD={(r['slug'],r['role']):r for r in json.loads(REPORT.read_text())['exports']}
manifest=json.loads((STAGE/'overnight-asset-manifest.json').read_text(encoding='utf-8-sig'))
exports=[]
missing=[]
for entry in manifest:
    if entry['slug'] in PILOTS:
        continue
    for role in ('front','left','right'):
        if role not in entry:
            continue
        meta=entry[role]
        source=STAGE/'overnight-sources'/entry['slug']/meta['name']
        try:
            exports.append(process(entry,role,source,meta))
        except (OSError,ValueError) as error:
            missing.append({'slug':entry['slug'],'role':role,'source':str(source.relative_to(ROOT)),'reason':str(error)})
    REPORT.write_text(json.dumps({'exports':exports,'missing':missing},indent=2))
for slug,name in [('batana','Batana.png'),('shilajit','Main.tif')]:
    source=STAGE/'overnight-sources'/slug/name
    try:
        exports.append(process({'slug':slug,'version':'staged-product-original'},'front',source,{},True))
    except (OSError,ValueError) as error:
        missing.append({'slug':slug,'role':'front','reason':str(error)})
REPORT.write_text(json.dumps({'exports':exports,'missing':missing,'pilotSkipped':sorted(PILOTS),'photoOnly':sorted(PHOTO_ONLY),'geometryNote':'Gold-front mapping inherited from approved pilot. Legacy-front x315..1085 at y596..1490 calibrated against viewed 1354x1836 jar. Sides use existing calibrated pilot mapping. Colors are source-region median sRGB, not physical material measurements.'},indent=2))
for kind in ('pilot','label','product'):
    files=[ROOT/p for r in exports for p in r['outputs'] if Path(p).name.startswith('hx-'+kind+'-')]
    for page in range(math.ceil(len(files)/24)):
        subset=files[page*24:(page+1)*24]
        sheet=Image.new('RGB',(1440,math.ceil(len(subset)/6)*310),'#d6dce0')
        draw=ImageDraw.Draw(sheet)
        for i,path in enumerate(subset):
            im=Image.open(path).convert('RGBA'); im.thumbnail((230,270))
            x=(i%6)*240;y=(i//6)*310
            sheet.paste(im,(x+(240-im.width)//2,y),im)
            text=path.stem.replace('hx-'+kind+'-','')
            draw.text((x+5,y+275),text,fill='black')
        sheet.save(STAGE/f'overnight-qa-{kind}-{page+1}.jpg',quality=93)
print(json.dumps({'exportedSources':len(exports),'missing':missing}),flush=True)
