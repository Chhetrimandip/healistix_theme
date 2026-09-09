# Agent TODO / Reconsider Later — Healistix Theme

Backlog for developers/agents. Move items to `AGENT_DESIGN_DECISIONS.md` when locked.

---

## Sea Moss PDP — deferred

- [ ] **Subscription / Autoship** — re-enable selling-plan UI (Subscribe & Save + one-time); decide default selected plan (Grüns defaults to Autoship).
- [ ] **Subscription app choice** — Shopify Subscriptions vs Recharge vs Skio vs Appstle.
- [ ] **Jar bundles (1 / 3 / 6)** — quantity offer cards or revive configurator modal; pricing rules for multi-jar.
- [ ] **Per-flavor media sync** — auto-swap gallery when flavor changes beyond featured variant image.
- [ ] **Variant metafields in Admin** — create `seamoss.flavor_tagline`, `seamoss.flavor_badge`, `seamoss.tastes_like` definitions; wire Liquid fallbacks if not fully used yet.
- [ ] **Reviews, testimonials and UGC** — Judge.me Free and the full widget are active on the live Sea Moss page; Amazon automatic import, buy-box rating, draft parity, collection settings and video workflow remain open. Track exact status and R01–R42 in [the review implementation plan](docs/reviews-and-testimonials-plan.md).
- [ ] **SEO** — product metafields for title/description; flavor-specific SEO if ever split URLs (not recommended).
- [ ] **Mobile polish** — flavor card scroll affordance without emoji-heavy swipe hint; sticky ATC bar.

## Cross-product

- [ ] Apply Grüns-style buy-box IA to Batana or a shared `hx-main-product` section.
- [ ] Default Dawn `product.json` template parity or redirect to custom templates.
- [ ] Shared design tokens for DTC PDPs (reduce duplicated CSS across `product-seamoss` / `bt-*`).

## Process

- [ ] After first live Sea Moss product is created in Admin, verify variant `option_value` strings match flavor blocks exactly (case-sensitive). See Admin checklist in `AGENT_DESIGN_DECISIONS.md`.
- [ ] Capture real flavor list + prices in design decisions once merchandising confirms.
- [ ] Replace placeholder flavor blocks (Trinity / Blueberry / Apple) with the final merchandising set.
