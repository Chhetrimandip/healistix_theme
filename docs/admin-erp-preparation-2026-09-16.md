# Admin redesign and ERP preparation — September 16, 2026

## Deployed September 16, 2026

- Shared Healistix sidebar and app shell across authenticated admin routes.
- Overview with ingredient count, recent saved previews, ERP status, next steps and shortcuts.
- Existing ingredient/import/lab/recipe/ticket tools retained. Original server authentication and actions retained.
- Raw recipe data, imports and model traces collapsed by default; readable recipe ingredient summaries added.
- Authenticated /app/erp page and ERP-neutral stock interface: aggregates grams across jars and mapped materials; rejects shortages, missing mappings, malformed/stale data, blocked materials, failures and timeouts.
- Nine focused ERP stock tests.

## Boundaries

The admin redesign and ERP preparation screen are deployed on Render (commit 46fb351) and verified inside Shopify. The installed external name remains Composio; in-app branding is Healistix. The standalone localhost preview remains available.

The design preview renders the same shell, home and ERP components with the seed library and no live credentials/database. Its ERP form calls the actual server stock checker using explicit sample responses. Existing commerce/readiness routes remain in the authenticated app and are not reproduced in the standalone review.

No live ERP transport, storefront stock-check wiring, reservations, real job dispatch or checkout enforcement was added. The client's API format, IDs, units and test credentials are needed next. The proposed 60-second freshness limit and 0.001 g precision must be checked against his API.

## Verification

- Typecheck including route generation passed; production client/server build passed.
- Full backend suite: 81 tests, 78 passed, 3 optional database tests skipped, 0 failed.
- Browser: dashboard navigation; ingredient search (ginger gives one match); two jars require 5 g ginger + 2 g turmeric; 4 g ginger blocks two jars; reducing to one jar passes; offline returns a clear failure.
- Desktop screenshots inspected. Mobile dashboard and ERP form checked with a 390px override (browser scale reported about 355 CSS pixels); document width stayed within viewport. Override restored.
- Initial local review made no live inventory/customer/order writes.

## Preview

[Dashboard](http://127.0.0.1:8798/app) · [ERP preparation](http://127.0.0.1:8798/app/erp)

Restart in C:/Users/chhet/Desktop/healistix_backend with: node --import tsx scripts/admin-review/server.ts

Loopback only; no environment file or database is loaded by this preview.

## Source

Backend app/components: operations-shell.tsx, operations-overview.tsx, admin-home.tsx, erp-connection-view.tsx.

Backend routes: app.tsx, app._index.tsx, app.erp.tsx. Styles: app/styles/operations.css. Stock logic: app/services/erp-stock.server.ts. Tests: tests/erp-stock.test.ts. Preview: scripts/admin-review/.

## Accurate client update

“I've prepared the inventory-checking foundation on our side and tested ingredient quantities, low stock and API failure handling using sample ERP responses. I've also redesigned the admin app into a clearer dashboard with ingredient, recipe and ERP sections. This is deployed in the Shopify app and ready to review. Once your API documentation and test access are available, I'll map your materials, connect the live stock endpoint and test it with you. Reservations and paid-order production handoff come next.”

## Deployment verification

Render deployment dep-dal3blh5efls73fnj9ig succeeded for commit 46fb351adb0349a2e6d72ecda298174f89c0d2d9. Release isolated on top of the existing live cart release. Exact release: 59 tests passed, 2 optional database tests skipped; typecheck/build passed. No pending database migrations. Health and ERP asset returned HTTP 200. Installed Shopify dashboard and ERP form verified; sample available-stock and shortage actions returned correct results. Live ERP transport is still pending.

