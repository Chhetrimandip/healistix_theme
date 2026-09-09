# Catalog batch — September 8, 2026

## Saved in Shopify

- Main Sea Moss Gel product: `8750569226378`, handle `sea-moss-gel-banana`.
- 23 variants: 21 flavors with Drive artwork, plus retained Rose and Orange.
- Created 13 missing flavor variants through the existing linked Shopify Flavor option. New variants are $24.99, tracked stock zero, inventory policy DENY. The original ten variants' prices and inventory settings were preserved.
- Imported 41 additional Sea Moss photos, all READY, and linked 16 new featured fronts. Combined with the pilot import, all 21 Drive flavors have their own featured front.
- Batana remains a separate product `9012963639434`. Its actual branded front is READY, featured and first in the gallery. Existing $0 price and sold-out stock were preserved; merchant price is still needed. The original `batana` template suffix is retained.
- Created separate Himalayan Shilajit product `9287507869834`, variant `50153916858506`, handle `himalayan-shilajit`. It is DRAFT, $0 pending actual price, tracked stock zero, DENY, with the real branded image READY. Template suffix `wellness`.
- Blueberry duplicate remains draft; old Pineapple remains archived with its redirect. No products or source files were permanently deleted.

## Theme and deployment

The original five-flavor version was successfully pushed to **3rd iter**, theme `158133911690`, after backing up the remote theme in `staging/backup-3rd-iter-20260908`.

The expanded catalog version is saved locally and synchronizes to the running Shopify development preview at `http://127.0.0.1:9292/products/sea-moss-gel-banana`. Its theme assets were verified on `https://healistix.com/cdn/shop/t/5/assets/` and used for the successful catalog import.

**The final expanded update has not been pushed to 3rd iter.** Theme CLI authentication expired. The store account is `mandipchhetri@miracleflow.agency`, which requires its password or passkey. The Google account used for Drive does not have this store's theme access. Catalog `shopify store execute` authentication remains independently functional. No new access scopes or credentials were created, and no live theme was published.

After renewing the existing store account login, run:

```powershell
shopify theme push --store b5895f-96.myshopify.com --theme 158133911690 --nodelete --json
```

The complete theme package is `staging/healistix-3rd-iter-catalog-20260908.zip`: 559 files, 48,233,014 bytes. It excludes superseded pilot PNGs; their originals remain on disk. Prefer the CLI command above to update the existing theme, because uploading a ZIP through Shopify creates another theme.

Gallery optimization completed for 57 transparent WebPs: 45.30 MB became 11.36 MB, with the longest edge capped at 1800 pixels. Full-resolution exports remain in `staging/gallery-lossless-exports`; imported Shopify product media was not reduced. The final mobile jar stage measured 344 × 498.8 pixels at a 390-pixel viewport, with one rendered canvas and no horizontal overflow.

## Asset and label decisions

- Latest 2025 fronts used wherever present. Red Guava, Guava Lemon and Lychee use their current gold-lid exports.
- Maca Ashwagandha, Ashwagandha Mango, Elderberry Ginger, Honey and Beet Root have only legacy exports in the supplied folders. Their artwork was not relabeled as 2025.
- 17 interactive jars enabled. Three missing-side flavors (Red Guava, Guava Lemon, Lychee) are photo-only.
- **Beet Root RIGHT says “Pineapple Puree.”** Its right photo was withheld from Shopify import and its 360/label drawer disabled. The source was preserved and the white background technically corrected, but the printed content needs a corrected source.
- **Strawberry's 2025 front says 17 oz; legacy sides say 16 oz.** The supplied current front and approved legacy-side assumption were retained without modifying printed artwork. Confirm package weight before publishing final flavor copy.
- Rose and Orange have no mockup folders in this supplied set. They retain their variants, with a “photos coming soon” state instead of showing another flavor's jar.
- “RAW” is mapped to existing Unflavored. Drive typo “GUAVA LMEON” maps to Guava Lemon; “ELDBERRY GINGER” maps to Elderberry Ginger; the current Strawberry Pineapple label takes precedence over the legacy folder's reversed words.
- Background removal used existing local rembg where necessary. Real alpha was preserved. Theme gallery copies were optimized as WebP; original lossless exports remain in `staging/gallery-lossless-exports`. Shopify may store imported WebPs as PNGs; those uploaded images retain transparency.

## Editing content

One Sea Moss product owns shared copy. Variants own price, stock, SKU and featured images. Theme Flavor blocks now exist for all 21 prepared flavors. Fruit Background positioning controls remain unchanged.

Teammates can edit shared headings/accordions and individual Flavor blocks in the theme editor. Add extra photos to the product Media area with exact flavor names in alt text. Main prepared fronts and 3D textures are theme assets; changing a variant image alone does not regenerate those wraps. Independent long-form flavor profiles and ingredient metafield rendering are still not implemented. Do not paste flavor-specific ingredients into shared copy.

Batana's local `product.batana.json` and the new `product.wellness.json` share the new bubbly native-product layout. Their actual product descriptions, media, price and stock come from Shopify Products.

## Verification and audit files

- `staging/overnight-asset-manifest.json`: exact Drive source mapping.
- `staging/overnight-export-report.json`, `overnight-asset-readiness.json`: 44 source exports, provenance, geometry and content flags.
- `staging/overnight-catalog-variants.json`: all variant IDs and preserved commerce fields.
- `staging/overnight-catalog-media-run-20260908-035627/verified-map.json`: all 41 imported photos READY and 16 featured fronts verified. Existing commerce fields unchanged.
- `staging/overnight-verify-wellness-final.json`: separate product verification.
- `staging/overnight-validation.json`: 114 section schemas and 25 templates parsed; section references valid. Full Shopify Theme Check stalled and was cancelled, so this is not a claim of a full clean lint run.
- JavaScript syntax checked for jar component and scene. Asset contact sheets visually reviewed. New flavor galleries, photo-only states and missing-photo states checked through the actual local PDP. Gold and black lid 3D scenes rendered, rotation worked, mobile controls measured 40px high and no horizontal overflow. Batana preview rendered its actual branded image, separate title and sold-out state with no browser errors.

## Usage

Usage was checked between batches. It was 9% near the start and 10% before the normal weekly window reset; the new window later read 2%. No usage-reset credits were redeemed. The agreed 45% precautionary stopping threshold was not approached. Final deployment is blocked on store-account login, not the usage budget.
