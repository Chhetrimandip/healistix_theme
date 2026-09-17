# Batana and Shilajit paused — September 17, 2026

Local theme change on `codex/base-flavor-pdp`. All product code, artwork and Shopify records are retained.

Theme settings → Product availability → Show Batana and Shilajit is off. It gates desktop/mobile navigation, the homepage discovery link and wellness section, and the sea moss Pair it with panel. Product cards are suppressed in the collection, search, predictive product search and recommendation paths. Known product/collection handles and the Batana/Shilajit index preview templates show a pause message linking to regular sea moss.

Restore with the same theme setting. This controls theme presentation only: Shopify product publication, external catalogs, search counts/facets, direct cart APIs and existing cart/order contents are unchanged. To stop actual sales across channels, product publication must be changed separately. No live theme was published.

Verification: homepage, sea moss PDP, both product pages, both index preview URLs, all-products collection and Batana product search returned HTTP 200 without Liquid errors. Home, sea moss PDP, collection and search contained no Batana/Shilajit shopping links; direct product/preview pages displayed the pause message. Browser inspection confirmed the homepage retains its sea moss sections and omits the wellness promotion. Theme settings JSON parsed successfully and `git diff --check` passed.
