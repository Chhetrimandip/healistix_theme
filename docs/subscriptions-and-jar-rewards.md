# Proposed subscription and jar rewards

Research checked September 10, 2026. These are recommendations, not configured discounts, merchandise commitments or an installed subscription service.

## App shortlist

| App | Published pricing in USD | Fit |
| --- | --- | --- |
| Shopify Subscriptions | Free | Simple recurring product orders and frequency/discount plans |
| Seal | Free up to 50 subscriptions; $5.95/month up to 100; 0% app transaction fee | Low-cost subscription launch with swaps, tiered discounts and customer portal |
| Appstle | Free up to $500 monthly subscription revenue; Starter $10/month up to $5,000; Business $30/month up to $15,000; 0% app transaction fee | Best shortlist candidate for this custom mix-your-flavors experience; Business explicitly includes Build-a-Box/bundling |
| Recharge | $25/month for first 50 subscribers, no transaction fee; Starter $99/month plus 1.49% + $0.19/transaction | More extensive retention platform; confirm bundle tier and costs before selecting |

App fees do not replace normal payment processing fees. Plan eligibility and feature scope must be checked at installation.

Sources:
- https://www.shopify.com/subscriptions
- https://help.shopify.com/en/manual/products/purchase-options/subscriptions/shopify-subscriptions
- https://apps.shopify.com/seal-subscriptions
- https://apps.shopify.com/subscriptions-by-appstle
- https://apps.shopify.com/subscription-payments

## Launch offer to test

Subscribe and save 10% on each delivery. For a $25 variant this is $22.50 per jar; a two-jar delivery is $45 before taxes and applicable shipping. Keep existing shipping policy initially instead of stacking uncosted benefits. Offer a monthly default with other intervals based on actual consumption and storage guidance; support skip, pause, cancel and flavor swaps through the chosen app.

Banana label lists 16 servings per jar; one serving daily would use roughly two jars per month. This is a replenishment illustration, not a dosage recommendation. Confirm unopened shelf life and shipping/storage constraints before marketing three or five jars as a single-person supply. Do not invent three-month storage claims from the 30-days-after-opening label.

Lead with a modest recurring discount rather than a steep first-order promotion. Once retention data is available, consider a one-time loyalty gift after the third successful delivery. Test 15% only if contribution margin supports it.

## Merchandise proposal

- Three eligible sea moss jars: one branded reusable spoon.
- Five eligible sea moss jars: one branded tote plus that spoon.
- Count jars across eligible flavors, not individual line count or unrelated products.
- Gifts capped at one of each per qualifying order. For subscriptions, initial qualifying delivery only unless an explicit renewal reward is configured.
- Tote offers visible branding outside the kitchen without apparel size complexity. Spoon reinforces the daily ritual.
- Keep tiers useful at full jar price; do not add a second percentage bundle discount on top of subscription savings by default.

Proposed PDP progression: “Add 1 more jar for your Healistix spoon” at two selected jars; “Your spoon is included. Add 2 more jars for the tote” at three; “Your spoon + tote are included” at five. Only display this after actual checkout eligibility and gift fulfillment work.

Before activation: select merchandise, obtain landed cost and stocked SKU variants, decide qualifying markets and inventory fallback. Maximum affordable gift cost = order revenue after discounts minus product cost, shipping subsidy, packaging, payment/app fees and required contribution. No cost or profit figures are assumed here.

## Implementation requirements

Current custom mixed-cart request sends variant ID and quantity only. Adding an app widget alone will not turn it into a subscription. Integrate the app's supported bundle flow or valid selling-plan selection for each eligible line, render actual plan allocation prices, and test one-time/mixed/subscription cart and checkout paths. References: https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/add-subscriptions-to-your-theme and https://help.shopify.com/en/manual/products/purchase-options/subscriptions/setup .

Merchandise must be real inventory-backed cart lines with checkout-enforced eligibility/discount rules, not a visual badge or JavaScript-only price. Handle quantity reductions, duplicate prevention, mixed flavors, sold-out gifts, renewal exclusions, cart edits and direct checkout. Select the gift mechanism after the subscription app so their discount and renewal behavior can be tested together.

Nothing in this proposal installs an app, buys merchandise, changes billing or publishes an offer.

## Installation and placeholder update

Appstle is now accessible in the Healistix Shopify admin at https://admin.shopify.com/store/b5895f-96/apps/subscription-by-rhem/dashboard . Selected the $0 Free plan; the app opened its setup-readiness dashboard. No paid plan approved, no selling plan created, and live app embed was not enabled. Its setup guide still requires storefront activation, first subscription plan and customer portal setup.

Added a local gift-offer concept below the purchase area: three jars previews a branded spoon; five previews a tote plus spoon. Simple illustrative icons and an explicit concept-only notice. Progress responds to current PDP single-flavor quantity or mixed-flavor counts; existing cart quantities are not counted. It adds no gift lines or discounts. Verified three-jar single selection and three/five-jar mixed states. JavaScript syntax and scoped whitespace checks passed. No theme push.

## Real purchase selector — September 10, 2026

Replaced the local coming-soon teaser with a Shopify selling-plan selector. The selector appears only when plans are assigned; the preview currently returns 23 variants and zero allocations. Uses actual allocation prices, submits selling_plan on single and mixed cart lines, blocks ineligible selections, and omits the plan on one-time mixed orders. Existing cart templates already display the selling-plan name. The custom selector replaces purchase app blocks here to avoid duplicate plan inputs; keep Appstle's injected product widget disabled for this custom PDP.

User admin steps: open Appstle, create a recurring pay-per-delivery plan for the eligible Sea Moss Gel variants, set 10% off every delivery and the chosen interval (monthly proposed), retain one-time purchase, and configure the customer portal/cancellation rules. Confirm supported payment processing and subscription checkout. Theme updates remain local; no production publication or real checkout test performed.

Validation: rendered local preview has valid subscription JSON and no old teaser. JavaScript syntax, section schema JSON and scoped whitespace checks pass. Playwright with simulated plan data and intercepted cart requests passes price/quantity updates, native form plan submission, mixed-cart plan payload, one-time plan omission, ineligible selection blocking and 390px overflow check. A Shopify CDN cart-sync module failed to load in the browser test; live checkout still needs verification after the real plan exists. Test: scripts/test-subscription-purchase.cjs. Theme Check CLI did not return during this session.
