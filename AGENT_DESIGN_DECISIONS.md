# Agent Design Decisions — Healistix Theme

Living log for developers/agents. Append dated entries; do not rewrite history.

---

## 2026-09-07 — Sea Moss Grüns-style PDP (v1)

### Product model
- **One Shopify product** for Sea Moss gel; flavors are **variants** under option `Flavor`.
- Do **not** create a separate product per flavor.
- Price, inventory, SKU, and optional variant image live on each **variant** in Admin (not metafields).
- Marketing blurbs (tagline, badge, tastes-like) use **theme flavor blocks** first; optional variant metafields (`seamoss.flavor_tagline`, `seamoss.flavor_badge`, `seamoss.tastes_like`) as fallback later.

### Purchase model (v1)
- **One-time only.** Subscription / Autoship UI is hidden and deferred.
- Selling-plan schema settings remain in the section for a future pass; do not surface them on the storefront in v1.
- Simple quantity stepper (jar bundles / configurator modal deferred).

### Layout / IA (Grüns-inspired, Healistix brand)
Buy box order:
1. Review / social proof line (stars + editable review text)
2. Product title (section heading override or product title)
3. Short supporting sentence (`review_subtext`)
4. Benefit checklist (`support_points`, pipe-separated)
5. Select Flavor cards from product variants + optional per-flavor tagline/badge from flavor blocks
6. Price for selected variant (+ compare-at / savings)
7. Quantity stepper
8. Add to Cart
9. Trust line(s) + assurance chips
10. Accordion stack (`info_tab` blocks) — Why / Ingredients / How to take / Shipping

Below-fold (existing sections on `product.seamoss` template):
- `product-steps`
- `product-reviews-grid`
- `product-benefits-list`
- `product-faq`
- `product-reviews-widget`
- `related-products`

### Editable fields (theme)
Section settings: `eyebrow_text`, `heading`, `review_text`, `review_subtext`, `support_points`, `flavor_heading`, `flavor_subheading`, `quantity_heading`, `button_label`, `trust_line`, `guarantee_note` (plus legacy subscription/configurator settings kept unused).

Blocks: `flavor` (`label`, `option_value`, `tagline`, `badge`, `image`), `info_tab`, `assurance`, `promo` (optional under gallery).

### Template
- Sea Moss products use theme template **`product.seamoss`**.
- Primary section: [`sections/product-seamoss.liquid`](sections/product-seamoss.liquid).

### Out of scope this pass
- Pixel-perfect Grüns branding clone (Healistix tokens)
- Creating live Admin products/variants
- Batana / default Dawn PDP redesign

### Admin checklist (do this when ready to create the product)

1. **Products → Add product**
   - Title e.g. `Sebi Trinity Sea Moss Gel`
   - Description (can be short; buy-box copy lives in the theme)
2. **Variants**
   - Add option name: `Flavor` (exact spelling is fine; cards read option values)
   - Add one variant per flavor, e.g. `Trinity`, `Blueberry`, `Apple`
   - Set **price per variant** (editable anytime)
   - Optional: compare-at price, SKU, barcode, inventory, variant image per flavor
3. **Theme template**
   - In the product editor, open **Theme template** (right sidebar) → choose **`product.seamoss`**
4. **Match flavor blocks**
   - Online Store → Themes → Customize → open a Sea Moss product
   - In **Product Sea Moss** section, ensure each Flavor block’s **Matching variant option value** equals the Admin variant name **exactly** (case-sensitive)
5. **Optional metafields** (later)
   - Settings → Custom data → Variants → add `seamoss.flavor_tagline`, `seamoss.flavor_badge`, `seamoss.tastes_like` (single line text)
6. **Do not** create a separate product per flavor for this PDP
7. **Subscription** — skip for v1 (revisit when Autoship is approved)

---

## September 8 overnight catalog expansion

One Sea Moss product now holds 23 flavor variants; actual Drive artwork supports 21, with 17 interactive jars. Batana and Himalayan Shilajit are separate products. Prepared galleries and wraps remain theme assets; independent long-form flavor profiles are not implemented. Preserve the Beet Root incorrect-label exclusion and Strawberry weight mismatch flag. See docs/overnight-catalog-handoff.md for exact IDs, source provenance, verification and the expired-login blocker on the final 3rd iter push.
