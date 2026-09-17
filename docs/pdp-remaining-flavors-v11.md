# Remaining flavor galleries — v11

Gallery sequence: **flavor campaign hero → shared serving suggestion → original package details**.

The original five campaigns (Banana, Blueberry, Mango, Pineapple, Watermelon) remain unchanged. The next sixteen flavors receive individual package-led campaign heroes using their actual front artwork. The shared breakfast photo is explicitly labeled as a serving suggestion; it is not presented as any particular flavor's finished recipe.

| Gallery group | Flavors | Package detail source |
|---|---|---|
| Hero, shared serving, original left/right artwork | Ashwagandha Mango, Beet Root, Dragonfruit, Elderberry Ginger, Grape, Honey, Maca Ashwagandha, Passion Fruit, Peach, Pineapple Mango, Strawberry, Strawberry Pineapple, Unflavored | Existing `hx-pilot-{flavor}-left.webp` and `right.webp` |
| Hero, shared serving, original front artwork | Guava Lemon, Lychee, Red Guava | Only front artwork is available locally; no invented side panels |

All sixteen names were verified against the local Shopify product JSON on September 17, 2026. Stock, prices, variant IDs and purchase behavior are unchanged. Peach, Strawberry and Unflavored were available during the check; the other thirteen were sold out.

Package distinctions preserved include black lids on the botanical/Honey/Beet examples, the 17 oz Strawberry front, the `MANGO PINEAPPLE` package wording for the Pineapple Mango variant, and `RAW` on the Unflavored package. These are campaign images, not sources for nutrition or ingredient claims. Original package art remains available to enlarge and inspect.

Built-in image generation was used with the Healistix campaign-images and imagegen skills. Each hero used its matching real front as the identity reference and Blueberry studio-v3 only as the composition/lighting reference. Final prompts and file mappings are in `pdp-image-generation-v11.json`.

## Remaining editorial work

These are not sixteen fully bespoke five-image sequences. Flavor-specific lifestyle/texture photographs and designed ingredient/detail cards can follow once each label is verified. Guava Lemon, Lychee and Red Guava still need authoritative side labels for detailed ingredient and storage cards. Existing label claims were not independently substantiated in this design pass.

Local development preview only; no theme publication or Shopify product data edits.

## Root integration verification

Desktop Ashwagandha Mango shows correct black-lid hero and four loaded gallery tiles. Lychee shows its hero/shared serving/original front (three tiles). Mobile Unflavored shows Raw Original hero with no horizontal overflow; Blueberry retains studio-v3 without a duplicate headline. Shared campaign grid handles the additional flavors and keeps original labels uncropped. The main photo now hides old decoded pixels while the selected asset loads. JavaScript syntax and diff whitespace checks pass. Consolidated Theme Check has no errors in changed Liquid files, but existing unrelated theme findings remain.
