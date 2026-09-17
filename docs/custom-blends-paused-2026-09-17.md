# Custom blends paused — September 17, 2026

Regular sea moss is the current storefront focus. No builder code or saved recipes were deleted.

## Local theme

- Theme settings → Custom sea moss → Show custom blends is off by default and explicitly off in the active Default preset.
- Custom entry card, homepage entry and review navigation render only when enabled.
- Builder, fixture review, hair landing, quiz and custom-result sections render the shared coming-soon snippet while disabled. Their scripts are not loaded.
- Known legacy custom page handles also render the notice, including `/pages/findmyseamoss` without a view parameter.
- Desktop dropdown and mobile Sea Moss links lead directly to `/products/sea-moss-gel`.
- The regular product form, flavor selection and existing cart validation remain intact.

## Backend source

Sibling `healistix_backend/app/services/custom-blends.server.ts` adds a default-off purchase gate at the authenticated app-proxy route, before library access or checkout side effects. It blocks `prepare-cart`, `prepare-shopify-cart` and `draft-review` with HTTP 403 and `CUSTOM_BLENDS_PAUSED`. Catalog, recipe editing and existing cart validation remain available. Two focused tests cover blocked operations, explicit opt-in and unaffected operations.

Restore storefront visibility using the theme setting. Restore server purchase routes separately with `CUSTOM_BLENDS_PURCHASE_ENABLED=true` only when custom commerce is ready. Showing the builder alone does not enable purchases.

## Release boundary

Theme changes synchronize to the local Shopify development preview. No live theme publication or hosted backend deployment was performed. The server gate takes effect after backend deployment (with the environment flag unset or false). Previously issued Shopify draft invoice links are not revoked by this change and must be handled separately before launch. This is not a Shopify checkout-level enforcement mechanism for items already in carts.

## Verification

Local HTTP checks: home, PDP, builder review, hair landing, quiz, results and connected builder returned without Liquid errors. Disabled custom pages show the notice and do not render the builder. Browser verified the notice and its Shop Sea Moss button returning to the regular PDP with flavor choices and Add to cart available. No order or payment was created.

Backend validation: both purchase-pause tests passed. TypeScript check passed after regenerating Prisma Client to match the existing draft-review models; no database migration was run.
