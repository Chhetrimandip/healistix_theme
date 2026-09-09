"""Remove mockup backdrops using the user's installed rembg; retain originals."""
from pathlib import Path
import sys
import os
# Matting is not used here; avoid its costly JIT warm-up during rembg import.
os.environ.setdefault('NUMBA_DISABLE_JIT', '1')
os.environ.setdefault('OMP_NUM_THREADS', '2')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '2')
from PIL import Image, ImageChops
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
session = new_session('u2net', providers=['CPUExecutionProvider'])
paths = sorted((ROOT / 'staging/flavors').glob('*/*'))
for path in paths:
    if path.suffix.lower() not in ('.png', '.jpg'):
        continue
    if len(sys.argv) > 1 and sys.argv[1] not in str(path):
        continue
    flavor = path.parent.name.lower()
    role = path.stem.split(' - ')[-1].lower().replace('3 in 1', 'composite')
    target = ROOT / 'staging/cutouts' / path.parent.name / f'{flavor}-{role}.webp'
    if target.exists():
        continue
    original = Image.open(path).convert('RGBA')
    # Composite onto white for segmentation; apply only the resulting alpha.
    backdrop = Image.new('RGBA', original.size, 'white')
    backdrop.alpha_composite(original)
    mask = remove(backdrop.convert('RGB'), session=session, only_mask=True)
    original.putalpha(ImageChops.multiply(original.getchannel('A'), mask.convert('L')))
    target.parent.mkdir(parents=True, exist_ok=True)
    original.save(target, 'WEBP', lossless=True, method=6)
    print(target.relative_to(ROOT), flush=True)
