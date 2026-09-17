# Mix flavors and preparation comparison

Implemented locally; not pushed to 4th iter or live.

Optional one-time mixed-jar mode supports per-variant quantities, five visible popular flavors, expansion to all flavors, sold-out disabling, real variant prices, quantity normalization (0–99 per flavor), previewing each jar and a single Shopify multi-item cart request. One-flavor purchasing remains the default. Switching modes retains the in-page mix. Sticky buying controls follow the active mode. Shopify validates current stock on submission; failures show a cart-review link rather than retrying automatically. No bundle discount or selling plan is added.

The comparison contrasts ready-made gel with making gel from dried sea moss: preparation, flavor choice, ingredient control and storage planning. It does not assert superior nutrition or invent competitor product specifications.

## Validation

- Actual mixed submission: Banana one + Blueberry one arrived as two separate cart lines, $50 total.
- Cart started empty; removed both test lines and confirmed it was empty afterward. No checkout performed.
- Sold-out Watermelon increment disabled. Empty selection disables mixed add button.
- One-flavor mode restored native purchase controls after switching back.
- Mobile width check passed; visually inspected per-flavor controls and the full comparison table.
- JavaScript syntax and scoped whitespace checks passed.

Reference inspected: https://fruggies.com/products/kit-decouverte and its 30-pack selection. Their pack increases flavor quantities in groups of five; Healistix counts individual jars without a required pack size.
