# Custom builder: implementation overview

September 13, 2026. Status: connected local backend/UI demo implemented and verified; new campaign images integrated; files copied into the main project. See `output/custom-builder/preview-report.md` for current preview links, screenshots, tests and the updated client message. No live deployment or real AI call has been verified. The draft below preserves the initial kickoff update; use the newer report when describing completed work.

## What runs where

1. **Shopify theme:** the branded quiz, flavor choices, recipe display and edit controls. It keeps the Healistix storefront appearance.
2. **Our hosted app:** reads the approved library, applies exclusions, asks the model for a recommendation, validates it, handles edits and produces a trusted recipe record. Model credentials stay here.
3. **Shopify commerce:** actual variant pricing, cart, payment and orders. An app proxy can connect the theme to our server through a storefront URL. The backend task must verify the store's supported checkout enforcement before enabling purchases.
4. **Production integration:** verified orders become tickets, label data, capacity bookings and recorded ingredient lots. Reorders and permitted customer-profile data follow after the first connected flow.

## Delivery sequence

| Milestone | Reviewable outcome |
| --- | --- |
| Shared foundation | `design.md`, API brief, seed audit and open decision list |
| Local engine | Tested restrictions, quantities, copy and fallback logic with a runnable HTTP service |
| Branded interface | Quiz/result/edit flow matching the current theme, including failures and mobile behavior |
| Connected demo | Real local UI-to-service recommendation and edit validation; purchase disabled |
| Shopify integration | Installed app, hosted endpoint, actual product mappings, authenticated integration and supported checkout enforcement |
| Operational readiness | Tickets, labels, lot traceability, capacity, reorder policy and end-to-end order tests |
| Launch | Formula and production approvals resolved; tested purchasing enabled deliberately |

The first milestone to show Shamim is a working review demo, not a promise that production or checkout is ready. Development can proceed using explicit provisional configuration while approval-dependent features remain unavailable.

## Pending inputs

- Resolve quantity conflicts: for example ashwagandha 8 g library default vs 5 g men's vitality pairing.
- Confirm the handoff's prices, supplier approvals/COAs, formulas, label inputs, shelf-life/hold-test or sachet choice and production capacity.
- Verify Shopify plan and app access, supported purchase enforcement, product/variant mappings, hosting and model provider configuration.
- Specify fresh suitability checks on reorders and reconcile other gate/routing differences found in the seed audit.

## Draft message for Shamim

I'm working through the handoff and have split implementation into two parts: the recommendation engine and the customer-facing builder. I've documented the existing Healistix design direction so the new quiz and results page match the site, and prepared a shared interface so the two parts connect cleanly.

The first target is a working demo where a customer completes the quiz, gets a validated blend and can edit it within the rules. After that we'll connect the Shopify purchase and production flow.

One detail I need your clarification on: ashwagandha is 8 g in the herb library but 5 g in the men's vitality pairing, while the validation rule requires the library amount. Should amounts always be fixed per herb, or can approved pairings override them?

This is a draft for the user to send. No message has been sent to Shamim.
