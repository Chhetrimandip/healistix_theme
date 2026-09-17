# Five-flavor PDP galleries

Branch: `codex/base-flavor-pdp`. Preview only; live theme not published.

Hero → serving suggestion → gel texture → ingredients → jar details.

## Image choices

| Flavor | Hero | Supporting photos/cards |
|---|---|---|
| Banana | New v9, following Blueberry composition | Existing v6 preserved |
| Blueberry | Approved studio-v3 unchanged | New v9, following Banana sequence |
| Mango | New v9 | New v9 |
| Pineapple | New v9 | New v9 |
| Watermelon | New v9 | New v9 |

Added 12 generated PNGs and eight editable SVG cards. Prior assets remain available. Package fronts guided jar identity; right-hand label artwork supplied ingredients, jar sizes and storage details. Juice is used for Blueberry, Pineapple and Watermelon; Mango uses purée. Watermelon remains 16.5 oz, the other new cards show 16 oz (454 g). No Banana nutrition values were copied to other flavors.

Headlines are editable HTML over the new photos. The approved Blueberry hero retains its existing embedded typography. Generated serving scenes are labeled serving suggestions, separate from customer photos.

Generation prompts, output sources and reference roles: [manifest](pdp-image-generation-v9.json). The Mango hero prompt is a reconstruction of the brief; other stored prompts are verbatim.

## Verification

- Selected all five flavors in the local browser: five matching gallery assets per flavor, all loaded, correct hero.
- Visually inspected generated photos, desktop hero/supporting layouts and rendered ingredient/storage cards.
- Checked 390 × 844 mobile layout, photo dots, enlarged gallery, next-image navigation and overlay text. No horizontal page overflow observed. Reset viewport after testing.
- Existing interactive-jar slot remains in the enlarged gallery (six entries when available).
- Pineapple and Watermelon retain sold-out state; catalog and purchasing settings unchanged.
- New SVG files parse successfully; `git diff --check` passes.
- Shopify Theme Check completed with repository-wide findings in existing files/backups. No findings reported for the three changed Liquid files; this is not a clean full-repository lint result.

## Publication status

Available through the local development preview at `http://127.0.0.1:9292/products/sea-moss-gel`. No live publish or Git push performed. Final client approval of the generated package appearance and artwork remains part of launch review.
