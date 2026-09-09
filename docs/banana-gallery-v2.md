# Banana gallery: editorial revision

Replaces the rejected generated gold-gel/black-lid gallery with authored layouts using the current supplied gold-lid, pale-cream Banana artwork unchanged. Source: assets/hx-pilot-banana-front.webp. Nutrition panel is a crop of assets/hx-label-banana-right.webp, not a generated or retyped panel.

Palette: forest green #174b3c, sage #94b5a1, cream #f1f2e3. Existing Forma fonts. Five photo thumbnails: overview, nutrition facts, ingredients, serving guide, original front. Optional 360 viewer remains available. Banana's gallery frame and picker accent use the new palette.

Reproducible layout source: scripts/build_banana_editorial.cjs. Uses Sharp solely for source trimming/cropping and Playwright to render local authored HTML/CSS. No generative imagery used in v2. Output files: assets/hx-banana-editorial-{hero,facts,ingredients,ritual}-v2.png. Editable HTML previews: staging/banana-editorial-v2/.

Ingredient, serving-size and storage copy comes from the supplied Banana label. Serving scenes are suggestions represented by simple line icons. The requested #1 best tasting wording remains concept copy, not a verified ranking.

Do not use the older black-lid hx-pilot-banana-front.png as the identity reference for new gallery work. It differs from the current WebP.
