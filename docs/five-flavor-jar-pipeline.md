# Five-flavor jar pipeline
> September 8 overnight update: this document describes the initial pilot. The current catalog has 23 Sea Moss variants, 21 prepared flavors and 17 interactive jars. See [current handoff](overnight-catalog-handoff.md) for deployment status and source-label exceptions.


The merchant approved the 2025 fronts with the existing left/right label artwork on 2026-09-08. These are photographic reconstructions, not original continuous print-ready wraps.

## Repeatable preparation

1. Preserve originals in `staging/flavors-2025/{Flavor}` (front PNG) and `staging/flavors/{Flavor}` (legacy LEFT/RIGHT PNG).
2. `python scripts/prepare_2025_fronts.py` exports transparent, consistently framed gallery fronts.
3. `python scripts/prepare_jar_textures.py Banana` prepares one pilot first. Check the gold-lid jar, rotation, source joins, photos and label drawer in the actual PDP.
4. `python scripts/prepare_jar_textures.py` applies the same mapping to Banana, Blueberry, Mango, Pineapple and Watermelon. Use `--role left` (or right/front) to regenerate only one panel role.

The 15 `assets/hx-label-{flavor}-{front|left|right}.webp` panels are mapped to three disjoint sectors of one circumference. No overlaid label surfaces are used. A flavor map in `snippets/hx-jar-viewer.liquid` selects the three textures and gel color. Gold lid geometry is shared. The component disposes the prior scene on flavor changes and rejects stale asynchronous loads.

Each pilot gets a 360 entry plus front, left and right gallery photos. The label reader uses the selected flavor's printed right and left panels; only Banana and Mango have Nutrition Facts tables in the supplied artwork. No missing numbers are inferred. Old composites are omitted because their central front is obsolete.

The five matching Flavor blocks in the theme editor can hold picker images, labels and optional taglines/badges. Gallery photos tagged with a flavor name can be appended through product Media; only the prepared duplicates and obsolete Banana source shots are suppressed. Long-form independent flavor editing remains a separate schema task described in `flavor-content-guide.md`.

## Verification

Banana was inspected before batching. Blueberry and Mango were checked with their own textures and gel colors. Mango completed a full 360-degree turn back to 0 degrees; only one canvas remained. Its label reader loaded the correct two images. Mobile rendering was checked at 390px without horizontal document overflow, with enlarged two-row controls. All 15 texture files decode and both viewer JavaScript files pass syntax checks.

Catalog consolidation and final Pineapple/Watermelon verification are recorded separately in `catalog-consolidation.md`. No theme publishing is implied by development preview synchronization.

Final verification: all five show their own 2025 front, exactly three photo thumbnails and an available 360 entry. All label selections match. Pineapple and Watermelon models were visually inspected with correct colors and labels; both are $24.99 and sold out. The old Pineapple URL redirects to variant 50153669492874; Watermelon is variant 50153670246538. Browser error log was empty.
