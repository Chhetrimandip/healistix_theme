"""Preserve every overlapping jar in white-background composite exports.

The foreground spans one continuous silhouette on each scanline in these
five supplied compositions. rembg sometimes drops the smaller rear jars.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parents[1]
for p in sorted((root / 'staging/flavors').glob('*/*3 In 1.jpg')):
    im = Image.open(p).convert('RGBA')
    rgb = np.asarray(im)[:, :, :3].astype(int)
    foreground = np.max(255 - rgb, axis=2) > 24
    mask = np.zeros(foreground.shape, dtype=np.uint8)
    for y, row in enumerate(foreground):
        xs = np.flatnonzero(row)
        if len(xs) > 5:
            mask[y, xs[0]:xs[-1]+1] = 255
    im.putalpha(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(.45)))
    target = root / 'staging/cutouts' / p.parent.name / f'{p.parent.name.lower()}-composite.webp'
    im.save(target, 'WEBP', lossless=True, method=6)
    print(target.name, flush=True)
