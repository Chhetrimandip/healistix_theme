"""Export approved 2025 fronts, preserving the supplied artwork and alpha."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
manifest = []
for source in sorted((ROOT / 'staging/flavors-2025').glob('*/*.png')):
    flavor = source.parent.name
    original = Image.open(source).convert('RGBA')
    # Trim empty canvas; use identical portrait framing for every flavor.
    bounds = original.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    jar = original.crop(bounds)
    jar.thumbnail((1150, 1650), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (1354, 1836))
    canvas.alpha_composite(jar, ((1354-jar.width)//2, (1836-jar.height)//2))
    output = ROOT / 'staging/cutouts' / flavor / f'{flavor.lower()}-front.webp'
    canvas.save(output, 'WEBP', lossless=True, method=6)
    asset = ROOT / 'assets' / f'hx-pilot-{flavor.lower()}-front.webp'
    asset.write_bytes(output.read_bytes())
    manifest.append({'flavor': flavor, 'source': str(source.relative_to(ROOT)), 'asset': str(asset.relative_to(ROOT)), 'source_version': '2025', 'alpha': list(canvas.getchannel('A').getextrema())})
    print(flavor, '2025 front exported', flush=True)
(ROOT / 'staging/flavors-2025/exports.json').write_text(json.dumps(manifest, indent=2))
