# Catalog consolidation — 2026-09-08
> September 8 overnight update: this document describes the initial pilot. The current catalog has 23 Sea Moss variants, 21 prepared flavors and 17 interactive jars. See [current handoff](overnight-catalog-handoff.md) for deployment status and source-label exceptions.


## Current status

Complete. Pineapple variant **50153669492874** and Watermelon variant **50153670246538** now belong to main Product/8750569226378. Both are **24.99**, tracked inventory **0**, inventory policy **DENY**, with their existing 2025 fronts. The user explicitly approved replacing the source Pineapple placeholder price of 0.00 with 24.99.

The original `shopify.flavor` linked option is preserved. Added two entries within the existing `shopify--flavor` definition: Pineapple Metaobject/203339399306 and Watermelon Metaobject/203339432074. The taxonomy's Flavor list has neither exact flavor, so both use its valid Other value (TaxonomyValue/19292) with exact Pineapple/Watermelon labels. Added linked option values first, then created variants using both option ID and option-value ID. No custom profile architecture was introduced.

Source Pineapple Product/8750568767626 is **ARCHIVED**, not deleted. Archival occurred after independent verification of both replacements. Existing eight main-product variants' titles, prices, compare-at prices, barcodes, tax settings, inventory policies and quantities were compared before/after and are unchanged.

## Completed media work

- Reused existing Pineapple MediaImage/33663787499658 and Watermelon MediaImage/33663787532426 by fileUpdate referencesToAdd on main Product/8750569226378. No duplicate front uploads.
- Appended ten transparent left/right images from the approved theme CDN assets, after checking existing product media. All ten verified READY. Alt values are exactly `<Flavor> left` and `<Flavor> right`. No composite images uploaded; each pilot front remains featured for its variant.
- Before/after and mutation responses: staging/catalog-consolidation-*.

## Source Pineapple data

Original snapshot: Product 8750568767626; variant 47331237494922; handle `sea-moss-gel-pineappple`; previously ACTIVE, now ARCHIVED. Source price 0.00, compare-at null, barcode null, SKU null, taxable true, inventory DENY, tracked true, aggregate stock 0, requiresShipping true, weight 0 POUNDS, unit cost/origin/HS code null. No variant metafields. Source InventoryItem 48698632241290. Following the scope extension, its sole location was verified as 447 Broadway (Location/71094796426), with available/on_hand/committed/reserved/incoming all zero. Both new variants use this same location with all those quantities zero. No sellable inventory was duplicated; no SKU, barcode or stock was invented. New Pineapple InventoryItem/51539324403850, Watermelon InventoryItem/51539325157514.

Watermelon has no existing catalog entry; approved initial price is 24.99, tracked stock 0 and DENY. No invented SKU/barcode/stock.

## Existing main variant IDs

| Flavor | Variant ID |
|---|---|
| Banana | 47331891937418 |
| Blueberry | 47331891970186 |
| Mango | 47331892002954 |
| Pineapple | 50153669492874 |
| Watermelon | 50153670246538 |
| Rose | 47331892035722 |
| Peach | 47331892068490 |
| Orange | 47331892101258 |
| Unflavored | 47331892134026 |
| Strawberry | 47331892166794 |

Main product handle remains `sea-moss-gel-banana`. Parent created redirect **410486243466** from `/products/sea-moss-gel-pineappple` to `/products/sea-moss-gel-banana?variant=50153669492874`; verified response is in `staging/pineapple-redirect-result.json`. No redirect remains pending. No theme/code files changed by the catalog task and no theme published.

Final catalog verification: `staging/catalog-consolidation-final.json`. Reusable queries and exact mutation variables/responses are under `staging/catalog-consolidation-*`. Initial failed attempts made no variants; successful results contain empty userErrors and the IDs above.

References: [linked options](https://shopify.dev/docs/apps/build/product-merchandising/products-and-collections/metafield-linked), [reusing media](https://shopify.dev/docs/apps/build/product-merchandising/products-and-collections/manage-media).
