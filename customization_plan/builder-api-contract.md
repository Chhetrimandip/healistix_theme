# Custom builder integration contract — draft v0.1

Date: 2026-09-13. Initial interface for two parallel implementation tasks. Backend owns the final executable schemas and fixtures and must communicate changes to the UI task. This document is an implementation proposal, not part of the client's original PDF.

## Integration shape

Theme UI -> configurable same-origin Shopify app proxy -> separately hosted application -> recommendation provider and deterministic validator. The backend implementation should be runnable locally without Shopify credentials or a model key using explicit test adapters. The UI should consume the same JSON interface in fixture and service modes.

Suggested proxy base: `/apps/healistix-builder`; confirm the installed path rather than assuming it. Recommended operations:

- `GET /catalog`: public display library, goal/flavor choices and capability/configuration status; no secrets or customer data.
- `POST /recommend`: quiz request -> response below.
- `POST /validate`: edited recipe plus current ephemeral screening context -> the same validated response, without another model call.
- `POST /prepare-cart`: revalidate, check current configuration/prices and return a trusted purchase handoff only when purchase enforcement exists. Until then, return purchase unavailable.

Backend publishes exact request schemas and examples before completing endpoint implementation. Use handoff field names where possible: `goal_text`, `use_chips`, `customer`, `flavor_pref`, `strength_pref`. Include explicit gate answers and allergy input. Client-supplied flags and amounts are untrusted inputs; server derives/checks restrictions and quantities. Do not treat an unknown or absent answer as eligibility.

## Response envelope

All responses include `schema_version: "1"`, a non-sensitive `request_id`, and `status` from:

`recommended | clarification | foundation | stopped | invalid | unavailable`

Expected fields:

- `build`: validated canonical handoff object, or null. Never include invalid model output.
- `display`: backend-approved summary, explanation and herb descriptions, or null.
- `notes`: array of safe display notices `{code, text}`; no raw health answers.
- `errors`: array `{code, field, message}`; no echoed raw request.
- `clarification`: one question and allowed goal options, or null.
- `foundation_url`: configured regular catalog URL, or null; don't fabricate a route.
- `pricing`: `{currency, total_minor, breakdown, confirmed}` or null. All currency math uses integer minor units. A seeded estimate is not a confirmed Shopify price.
- `availability`: `{ship_by, confirmed}` or null. No fabricated capacity promises.
- `purchase`: `{enabled, reason_code}`; default false. A recommended recipe is not proof of launch readiness.

Backend may refine these fields with explicit fixtures and notify UI. Non-applicable fields use null/empty arrays consistently. API errors must not silently fall through into a purchasable local recommendation. UI ignores obsolete responses after edits/navigation, renders text safely, and keeps recovery usable.

## Privacy and trust

Use POST bodies for sensitive input; no health/free-text URL parameters, analytics, persistent browser storage or request-body logging. In-memory transient processing is permitted by the handoff; handle model-provider logging/retention explicitly. Do not send genuine customer health input to an unconfigured provider during development. Preserve only permitted recipe outcomes; define fresh screening for reorders before enabling them.

Recipe IDs are identifiers, not authorization secrets. `_build_json` and other cart properties are editable by a shopper and must not authorize manufacturing or payment by themselves. Backend must investigate non-bypassable checkout enforcement for the actual store plan and app distribution. No assumption that a Shopify Function can make an ordinary HTTP call. Premium add-ons must not be removable in a way that permits underpayment. Production must consume a trusted verified build, not free text or unchecked line properties.

Official references checked September 13, 2026:
- https://shopify.dev/docs/apps/build/online-store/app-proxies/authenticate-app-proxies
- https://shopify.dev/docs/api/functions/latest/cart-and-checkout-validation

## File ownership and first milestone

- Backend task: new `apps/healistix-builder/` (or explain an equivalent isolated directory), engine, data import/audit, tests, local HTTP service, executable schemas/fixtures, Shopify feasibility and deployment notes.
- UI task: new scoped `assets/hx-builder-*`, `sections/hx-builder-*`, dedicated page template(s), UI tests and review preview. Preserve existing hair funnel and ordinary PDP.
- Parent task: shared `design.md`, this initial brief, client questions and coordination.

First milestone: a demonstrable local quiz -> backend -> validated editable result with purchase disabled, plus tested rejection/fallback paths and a clear remaining-integration list. Building the full production ticket/label, capacity, profile/reorder, subscription and fulfillment lifecycle comes after the recommendation/UI connection and requires the handoff's unresolved inputs. Do not report scaffolding, mocks, or fixture mode as completed live integration.
