# Banana jar study — local prototype

Run from the theme root:

```sh
node prototypes/jar/serve.mjs
```

Open http://127.0.0.1:4173/prototypes/jar/.

This standalone review surface does not edit or publish a Shopify product. It uses Three.js 0.180.0 (MIT license in vendor/LICENSE), served locally, with a procedural jar, horizontal rotation, keyboard controls, zoom, five gallery views and a native-dialog original-label reader. Rendering stops when the camera/jar settles or a photo is selected. The prototype opens on 360° deliberately; production should open with a product photo and load 3D on demand.

## What this checks

- Whether a physically modelled jar and projected mockup artwork are a useful direction for the PDP.
- Whether the lid/body proportions, horizontal rotation, controls and larger label reader feel right on desktop and mobile.

## Known limits before production

- Three non-overlapping artwork windows are inverse-projected from existing front/right/left PNGs. Repeated front badges/fruit are excluded from the side windows; joins and baked-in source lighting are still approximate. This is not a verified continuous label texture or a photogrammetry reconstruction.
- Banana LEFT says Banana Juice and the Brooklyn address; RIGHT says Banana Puree and a Broadway address and includes Nutrition Facts. Confirm one approved label version before reconstructing final artwork or populating product facts.
- No new label text or factual claims have been generated. Existing source assets remain unchanged.
- The full-size front image was downloaded from the user's selected Drive account; the other images are the existing theme assets. PSB files were not opened.
- No GLB export, AR, flavor switching, commerce, live metafield definitions or signup implementation in this geometry proof of concept.

## Next review

Confirm the jar direction, reconcile the source label, then produce one verified wraparound texture. Apply the same viewer to the five-flavor pilot (Banana, Blueberry, Mango, Pineapple, Watermelon). Strawberry uses AMZ artwork when added later. The signup design uses provisional 30% off, with free shipping undecided.

## Verification — 2026-09-08

JavaScript syntax checks passed. In-app browser verified WebGL rendering, drag rotation (0 to 98 degrees), preset label rotation, zoom, photo/3D switching, original-label tabs, Escape dismissal and focus return, and keyboard rotation. A 390px viewport showed the stacked gallery without page-level horizontal overflow. Browser error/warning log was empty during these checks. Real-device touch performance and production label accuracy remain unverified.

## Shopify integration — 2026-09-08

The theme now includes a Banana-only 360 thumbnail in sections/product-seamoss.liquid, with a lazy-loaded custom element, local Three.js modules, and hx-jar-scene.js. It runs in the existing Shopify development preview on port 9292; it has not been published live. Disable the pilot through the section's Enable Banana 360 viewer setting. Flavor changes close the viewer and preserve the existing variant purchase form. The playful CSS layer is scoped to the PDP. Intro copy is neutral; lower-page Trinity copy and product facts still need the planned content migration.

