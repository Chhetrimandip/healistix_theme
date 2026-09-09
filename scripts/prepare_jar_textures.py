"""Unwrap approved photographed label panels without changing their printed content.

2025 fronts + legacy left/right panels, explicitly approved as equivalent by user.
Run with Banana first; omit the flavor to batch the same mapping for all five.
"""
from pathlib import Path
import math
import argparse
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FLAVORS = ['Banana', 'Blueberry', 'Mango', 'Pineapple', 'Watermelon']
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('flavor', nargs='?', choices=FLAVORS)
parser.add_argument('--role', choices=['front','right','left'])
args = parser.parse_args()
for flavor in ([args.flavor] if args.flavor else FLAVORS):
    assert flavor in FLAVORS
    for role in ([args.role] if args.role else ('front', 'right', 'left')):
        if role == 'front':
            source = next((ROOT / 'staging/flavors-2025' / flavor).glob('*.png'))
            center, radius, x0, x1, top, bottom, top_curve, bottom_curve = 1960, 1070, 1000, 2900, 1205, 3225, 0, 35
        else:
            source = next((ROOT / 'staging/flavors' / flavor).glob(f'*{role.upper()}.png'))
            center, radius, x0, x1, top, bottom, top_curve, bottom_curve = 700, 425, (457 if role == 'right' else 475), (1118 if role == 'right' else 1060), 596, 1490, 19, 45
        original = Image.open(source).convert('RGB')
        width, height = 1200, 1100
        a0, a1 = [math.asin(max(-.995, min(.995, (x-center)/radius))) for x in (x0, x1)]
        mesh = []
        def point(t):
            a = a0 + t*(a1-a0)
            edge = 1-math.cos(a)
            return center+radius*math.sin(a), top+top_curve*edge, bottom-bottom_curve*edge
        for col in range(120):
            left, right = col*10, (col+1)*10
            x, y0, y1 = point(left/width)
            xx, yy0, yy1 = point(right/width)
            mesh.append(((left, 0, right, height), (x,y0,x,y1,xx,yy1,xx,yy0)))
        panel = original.transform((width,height), Image.Transform.MESH, mesh, Image.Resampling.BICUBIC)
        target = ROOT / 'assets' / f'hx-label-{flavor.lower()}-{role}.webp'
        panel.save(target, 'WEBP', quality=94, method=6)
        print(target.name, flush=True)
