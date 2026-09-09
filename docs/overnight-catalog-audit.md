# Overnight catalog audit and flavor extension

Verified 2026-09-07T21:26:13.293866+00:00. All four products and nested catalog pages were captured completely; the full baseline is `staging/overnight-catalog-baseline.json`. No browser was used.

## Catalog findings

| Product | ID | Status | Finding |
|---|---|---|---|
| Sea Moss Gel | 8750569226378 | ACTIVE | One linked Flavor product; 10 existing variants preserved, 13 added; 23 total. |
| Raw Honduran Batana Oil | 9012963639434 | ACTIVE | Separate product preserved; variant 47919145320586, price 0.00, tracked stock 0, DENY. |
| Blueberry | 9287022674058 | DRAFT | Duplicate flavor product retained; variant 50151254950026 at 20.00, stock 0, DENY. Unique copy and four old media references preserved in baseline; exact HTML also saved separately. |
| Sea Moss Gel Pineapple | 8750568767626 | ARCHIVED | Prior consolidation complete; source/history retained and redirect already created. |

No Shilajit catalog product exists. Do not create it until its label/assets are verified. No changes were made to Batana, the Blueberry draft, or the archived Pineapple.

## Variant result

All 21 manifest flavors are represented, plus existing Rose and Orange. RAW reuses Unflavored. Exact labels include Red Guava, Guava Lemon, Elderberry Ginger, and Strawberry Pineapple. Missing flavors were added through the existing shopify--flavor definition, linked option values, and bulk variant creation. Lychee uses its exact taxonomy value; other new labels lacking an exact Flavor taxonomy choice use Other with the exact display label. No custom content architecture.

Every new variant is 24.99 USD, tracked zero stock, DENY, at Location/71094796426 (447 Broadway). No SKU/barcode was invented. All ten prior variant records (including their media, inventory levels, prices, weights, tax fields, and metafields) compare exactly equal to the baseline.

| Flavor | Variant ID | Price | Stock | Policy | Action |
|---|---|---|---|---|---|
| Banana | 47331891937418 | 24.99 | 0 | CONTINUE | Preserved |
| Blueberry | 47331891970186 | 24.99 | 1 | CONTINUE | Preserved |
| Mango | 47331892002954 | 24.99 | -2 | CONTINUE | Preserved |
| Rose | 47331892035722 | 24.99 | 0 | CONTINUE | Preserved |
| Peach | 47331892068490 | 24.99 | -1 | CONTINUE | Preserved |
| Orange | 47331892101258 | 24.99 | 0 | CONTINUE | Preserved |
| Unflavored | 47331892134026 | 24.99 | 0 | CONTINUE | Preserved |
| Strawberry | 47331892166794 | 24.99 | 0 | CONTINUE | Preserved |
| Pineapple | 50153669492874 | 24.99 | 0 | DENY | Preserved |
| Watermelon | 50153670246538 | 24.99 | 0 | DENY | Preserved |
| Red Guava | 50153740763274 | 24.99 | 0 | DENY | Created |
| Passion Fruit | 50153740796042 | 24.99 | 0 | DENY | Created |
| Lychee | 50153740828810 | 24.99 | 0 | DENY | Created |
| Guava Lemon | 50153740861578 | 24.99 | 0 | DENY | Created |
| Pineapple Mango | 50153740894346 | 24.99 | 0 | DENY | Created |
| Dragonfruit | 50153740927114 | 24.99 | 0 | DENY | Created |
| Strawberry Pineapple | 50153740959882 | 24.99 | 0 | DENY | Created |
| Grape | 50153740992650 | 24.99 | 0 | DENY | Created |
| Maca Ashwagandha | 50153741025418 | 24.99 | 0 | DENY | Created |
| Ashwagandha Mango | 50153741058186 | 24.99 | 0 | DENY | Created |
| Elderberry Ginger | 50153741090954 | 24.99 | 0 | DENY | Created |
| Honey | 50153741123722 | 24.99 | 0 | DENY | Created |
| Beet Root | 50153741156490 | 24.99 | 0 | DENY | Created |

## Ready for media import

Use `staging/overnight-catalog-variants.json` as the ID map. Await the parent’s final CDN URL manifest. Reuse existing file IDs where possible, deduplicate by existing IDs/alt/source asset name, attach media to the main product, wait for READY, then associate each flavor’s correct front with its variant. Preserve existing featured fronts until replacements are READY. Side images can join the product gallery without becoming featured. Re-query media and verify flavor mappings afterward. No media were added during this overnight variant step; no theme was published.

The Blueberry draft remains intact pending review of its unique copy. Its saved copy contains product/health claims; preservation is an audit step, not approval to reuse those claims. Archive only after the desired content is accounted for. Batana remains separate; Shilajit awaits verified assets.
