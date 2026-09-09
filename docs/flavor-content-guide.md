# Sea Moss flavor content guide

Status: 2026-09-08 overnight expansion. The main Sea Moss product now has 23 variants, with actual Drive artwork for 21 and interactive jars for 17. Rose and Orange await artwork. The 13 newly added variants are $24.99, tracked stock zero and sold out. Pineapple and Watermelon also remain $24.99 and sold out. The old Pineapple product is archived and redirected. See [overnight handoff](overnight-catalog-handoff.md) for the current inventory, verification and deployment status. The expanded theme is in the local development preview; its push to the unpublished 3rd iter theme requires renewed Shopify login. No live theme was published.

## Current product structure

Keep one Sea Moss product with a Flavor option. The original pilot flavors are **Banana, Blueberry, Mango, Pineapple and Watermelon**; the same structure now covers all 23 choices. Each Shopify variant owns its price, availability, SKU and commerce identity; a flavor is not a separate product in this structure. Batana and Shilajit are separate products.

Most editorial copy still lives in shared theme section settings. The PDP template now uses shared flavor-selection, printed-label and usage guidance instead of the old Trinity ingredient list, benefit claims and batch-size story. Shared copy must be true across the available flavors. The five-card layouts remain intact; they do not imply five separate products.

The theme can read Flavor blocks and variant metafields `seamoss.flavor_tagline`, `seamoss.flavor_badge` and `seamoss.tastes_like`. These reads do not establish that definitions or values exist in Shopify. Taglines are currently hidden by the playful CSS. There is no connected flavor-profile editor for independent ingredients, nutrition and long-form copy yet. The existing Flavor option remains linked to Shopify’s `shopify.flavor` category records; those standard flavor names are distinct from the proposed editorial profiles. Twenty-one matching Flavor blocks are configured in the theme editor.

## Current images and interactive jar

- The prepared gallery uses theme assets named `hx-pilot-{flavor}-front.webp`, `hx-pilot-{flavor}-left.webp` and `hx-pilot-{flavor}-right.webp`. The flavor segment uses a lowercase, hyphenated name, such as strawberry-pineapple. These assets are separate from Shopify product media.
- Seventeen flavors are configured in the interactive jar source map. Red Guava, Guava Lemon and Lychee have no supplied sides; Beet Root has incorrect printed content on its right panel, so these four are photo-only. The PDP template keeps `enable_jar_viewer: true`. Select a supported flavor, then use the 360° thumbnail to rotate its jar. All five jars were visually checked. The final cross-flavor check confirmed the correct front, three photo thumbnails, 360 entry and printed-label selection for each flavor.
- The **View Jar Label** button opens the flavor-specific **Jar label & ingredients** drawer, which renders printed label images: `hx-label-{flavor}-right.webp` and `hx-label-{flavor}-left.webp`. The interactive viewer also references `hx-label-{flavor}-front.webp`.
- Artwork QA: only Banana and Mango right panels contain Nutrition Facts tables. Blueberry, Pineapple and Watermelon right panels contain ingredients and printed benefit text, with no Nutrition Facts table. Do not describe every label as a nutrition panel, infer missing numbers or copy another flavor’s table. Printed benefit text is not automatically approved for reuse as shared PDP claims.
- The merchant explicitly approved treating the 2025 front artwork and older left/right artwork as equivalent for this pilot. That is the working asset-version assumption, not an independent verification of every printed detail. Preserve the source artwork; do not silently reconcile wording differences or derive a new shared ingredient list from them.
- Adding photos to product media does not generate or replace a 3D wrap. Updating theme-backed pilot images, label crops or interactive textures remains a theme-asset task.
- Fruit Background remains a theme-editor section. Its Fruit blocks control image, horizontal/vertical position, size, rotation and mobile visibility.

## Adding photos with the current implementation

1. Open the existing Sea Moss product in Shopify Products. Add flavor photos to its Media area.
2. Use descriptive filenames and alt text containing the exact flavor name, such as `Blueberry sea moss gel — front of jar` or `Blueberry sea moss gel — printed label`.
3. Assign the flavor's hero image as that variant's featured image. The theme groups other media using variant attachments and flavor names in filenames or alt text; unrecognized media can appear as shared images.
4. Check the selected flavor in preview after any upload. The 21 supported flavors currently use theme-backed hero images and thumbnails, so catalog uploads alone do not replace those pilot assets. Name-based grouping is an interim convention, not a dedicated gallery field.
5. Keep ingredient lists, nutrition details, serving directions and storage instructions out of shared accordions unless they are verified as common to every flavor. The current shared accordions direct customers to their selected label and the jar they receive.

A variant featured image and a product's media gallery serve different purposes. Multiple photos can belong to the same product; the theme assembles the selected flavor's view.

## What a teammate can prepare now

Prepare a separate content record for each flavor, with the flavor name, approved artwork version, image roles, alt text and proposed flavor-specific copy. Transcribe any ingredients, nutrition, serving and storage information from the approved label for that flavor, with a source reference for review. Do not fill gaps with the former Trinity copy or infer benefits from ingredients.

Shared headings and instructions can be edited in the theme editor. Independent flavor copy should remain in the preparation records until a dedicated content model and rendering are connected. Do not create duplicate products just to hold copy, and do not paste five different ingredient lists into one shared Ingredients accordion.

Reviews remain separate from product facts. The PDP links to the supplied Amazon review page and has no invented review cards. The separate review widget remains disabled; add only sourced customer content through the review workflow.

## Future editorial model — not implemented

A possible next step is one `seamoss_flavor` metaobject per flavor, referenced by variant metafield `seamoss.flavor_profile`. This is a proposal, not an available editor workflow.

A future profile could hold ordered gallery images, a short description, tasting notes, approved ingredient copy, printed label images, serving ideas and approved wrap artwork. Price and stock would remain on Shopify variants. Definitions, imports and theme rendering must all be connected before asking a teammate to populate that editor.

## Import and verification responsibilities

The catalog import is managed separately from this copy cleanup. Use an explicit Drive-file-to-flavor-and-image-role mapping and record returned Shopify IDs so reruns can reuse uploaded assets. Preserve teammate-written copy and existing flavors. Do not infer missing commerce values from another variant.

Shopify CLI theme synchronization uploads theme code and theme assets; it does not by itself populate Shopify product media, variant fields or future flavor profiles. Preview each changed flavor after catalog and texture work is integrated: variant identity, price, gallery, label drawer, interactive jar and cart selection must correspond. Also check that retained non-pilot flavors still work.
