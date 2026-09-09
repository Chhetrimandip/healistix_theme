# Batana and Shilajit local preview

Added September 8, 2026 in response to the request to make both products visible on the local homepage.

- Homepage: sea moss campaign hero → flavors → ritual → selected customer excerpts → `hx-home-wellness` → FAQ. The hero also links directly to the collection.
- Batana: `/products/raw-honduran-batana-oil` uses `product.batana.json` and the new `hx-wellness-product` section.
- Shilajit: `/?view=shilajit` renders a dedicated PDP preview via `index.shilajit.json`, because the existing Shopify product is still DRAFT. `product.wellness.json` contains the same layout and settings for its eventual native product route.
- `/?view=batana` is also available as a fallback preview.
- The homepage automatically prefers an accessible native product URL; otherwise it uses the configured preview URL.
- Copy is placeholder content, editable through section settings. No invented benefit claims, dose, pack size, or ingredient list were added. Pending prices display as “Price coming soon.” Ordering is disabled unless the real selected variant is available and priced above zero.
- Product status, inventory and prices were not changed.
- Synced the changed files to development theme 158055432330. Verified HTTP 200 and expected rendered section content on the homepage, native Batana PDP, and Shilajit preview, with no Liquid or upload errors. Browser visual verification was blocked by repeated browser command timeouts.
- The dev watcher initially uploaded index.json before the new section and cached an upload error. Uploading section files first and retriggering index.json cleared it.
- These changes have not yet been synchronized to the separate unpublished “3rd iter” theme.

## Availability fix — September 8, 2026

- Replaced ambiguous “Contact us to order” with explicit disabled states: “Sold out online” for unavailable priced products and “Not yet available online” for missing/unpriced products. Available, positively priced variants retain the native Shopify add-to-cart form.
- Kept the Shilajit preview route while its actual product remains unpublished; native product links automatically take over when available. Removed the homepage's inaccurate claim that Shilajit is currently available online.
- Corrected link colors and added button focus styling. Zero-price products no longer display a misleading $0 offer. In-store availability is a separate inquiry, not an ordering replacement.
- Shopify admin read-only check: Shilajit is Draft, $39.99, unpublished everywhere, tracked stock 0, selling when out of stock Off. Its wellness template is missing from the live theme. Batana is Active, tracked stock 0, selling when out of stock Off. Batana admin showed $0 while the local storefront returned $25; reconcile this discrepancy before changing prices or launching checkout.
- Verification: homepage accessibility tree confirms the intended section sequence and all three selected excerpts. Local homepage, native Batana and Shilajit preview return successfully without Liquid errors; both old contact CTAs are absent. Batana renders Sold out online; Shilajit renders Not yet available online. Dedicated browser visual verification was interrupted by tab navigation changes and a subsequent timeout; not claimed complete.
- No stock, prices, publication status, backorder policy or live theme changed. Completion of purchasing requires confirmed sellable quantities, resolving Batana's price discrepancy, and deploying the Shilajit template before activating/publishing its product.

## Ordering enabled — subsequent user authorization, September 8, 2026

- User confirmed physical stock exists for both products and requested checkout enabled without knowing exact quantities. Disabled inventory tracking for these two products only; no fabricated count entered. Shopify will not automatically prevent overselling until tracking and accurate quantities are restored. Merchant must monitor availability manually in the meantime.
- Price discrepancy resolved: initial admin accessibility observations captured a loading value of $0. Fully loaded UI and storefront confirm Batana $25 and Shilajit $39.99. Prices were preserved, not changed. The earlier price-confirmation question is no longer blocking.
- Shilajit changed from Draft to Active and published to Online Store only. Installed its missing live template and dependencies: templates/product.wellness.json, sections/hx-wellness-product.liquid, assets/hx-wellness-collection.css, assets/hx-product-shilajit-front.webp. Batana's existing live template was preserved. Scoped pre-change pull is in staging/checkout-live-20260908. No whole-theme or homepage redesign push.
- Verified both storefront products available at their existing prices. A separate test HTTP session added one of each via Shopify's cart API (subtotal $64.99) and successfully reached Shopify checkout (HTTP 200 on /checkouts/cn/...). No customer data entered, payment submitted or order placed. User's browser cart was not changed by this isolated test. Payment processing and address-dependent shipping rates were not tested.
- Both native local product routes render Add to cart; the homepage now automatically links to the native Shilajit route as its product is accessible.
