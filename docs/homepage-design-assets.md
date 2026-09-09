# Homepage campaign — September 8, 2026

The homepage uses a split campaign hero, real variant flavor collection, lifestyle ritual section, and FAQ. Bloom's product-forward homepage was the structural reference: https://bloomnu.com/. Healistix typography, cream/green palette and product artwork remain distinct.

The previous OD sections remain disabled in `templates/index.json`, retaining their settings. New hero, flavor collection and ritual sections have native Shopify settings. Their campaign images can be replaced through image pickers. Original decorative-fruit editor controls remain intact. The homepage clips horizontal viewport overflow from rotated fruit without changing its positions.

The flavor collection matches Banana, Blueberry, Mango, Pineapple and Watermelon against actual Shopify variants. Only existing matching variants render, using current prices and availability. No variants or inventory are created by the theme. Product tiles use original supplied artwork; generated photos are campaign imagery only.

## Generated assets

Mode: built-in image_gen. Inputs: original `assets/hx-pilot-banana-front.png`, `assets/hx-pilot-blueberry-front.png`, `assets/hx-pilot-mango-front.png`. Inspect generated labels before using campaign photography outside this development preview; the catalog retains original artwork.

- `assets/hx-home-hero-v1.png`: full-resolution generated master, 1536 × 1024.
- `assets/hx-home-hero-v1.jpg`: web copy, JPEG quality 88, approximately 265 KB.
- `assets/hx-home-ritual-v1.png`: full-resolution generated master, 1254 × 1254.
- `assets/hx-home-ritual-v1.jpg`: web copy, JPEG quality 88, approximately 186 KB.

### Hero prompt

Use case: compositing. Create a premium playful ecommerce campaign photo for Healistix homepage, landscape 1536x1024. Input images are actual product reference artwork: Banana, Blueberry, Mango. Preserve their black ribbed lids, glass jar proportions, actual HEALISTIX branding, teal SEA MOSS GEL typography and named flavor labels; do not invent a new packaging design. Compose three jars in an energetic asymmetric still life, Mango upright forward center, Blueberry slightly behind left, Banana tilted subtly right, all labels front-facing and legible. Surround the bases with a few real mango slices, blueberries and banana slices. Warm pale butter-yellow seamless studio background, subtle rounded low plinth, bright natural studio lighting, realistic soft contact shadows, polished photorealistic product photography with fresh editorial food styling. Jars occupy center 75% of image with comfortable outer margins for responsive crop. No added text outside packaging, no badges, no discount stickers, no hands, no medical props, no extra products. This is the image half of a split homepage hero; no need for headline space.

### Ritual prompt

Use case: compositing. Asset type: square ecommerce lifestyle editorial photo for Healistix website. Use actual referenced Mango Healistix sea moss gel jar unchanged in branding and label proportions, black ribbed lid, teal typography. A sunlit kitchen still life on a pale pink tabletop: one closed Mango jar next to a glass of thick mango smoothie, a small ceramic bowl with mango pieces and an ordinary silver spoon, soft light cream wall behind. Contemporary tasteful food editorial, realistic product photography, crisp tactile fruit, natural shadows, warm welcoming morning atmosphere. The jar must clearly retain HEALISTIX and SEA MOSS GEL and MANGO labels without new claims. Composition product and drink center, comfortable generous margins, camera three quarter tabletop view. No people, no additional wording, no reviews or testimonials, no medical imagery, no exaggerated splashes.
