# Shopify feasibility and deployment — checked September 13, 2026

## What is known about this store

This checkout is a theme repository, not an installed application. No app manifest,
installation record, Admin token, Function deployment or trusted storage was found.
`docs/flavor-asset-inventory.md` records `b5895f-96.myshopify.com` as the historical
theme store, and explicitly says theme configuration does not establish Admin access.
No Shopify connector is callable in this task. A fresh `shopify theme info` check
requested Shopify login; it was canceled. Store plan, current app distribution,
app installation, product/variant IDs and enabled checkout validations remain unknown.

Consequently `/prepare-cart` always returns purchase unavailable. There is no live
cart handoff to bypass, and this service never returns variant IDs or a buy token.

## Installation and server boundary

Create an app in the appropriate Shopify developer organization and install it with
merchant-approved scopes and authenticated installation/OAuth session handling.
For the storefront proxy use `write_app_proxy`, configure its backend destination,
and confirm the installed prefix/subpath rather than assuming the proposed
`/apps/healistix-builder`. Host this Python backend separately over HTTPS; deploying
a theme or app extension is not deployment of this HTTP service.
[App proxy configuration](https://shopify.dev/docs/apps/build/online-store/app-proxies),
[hosting](https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service).

`proxy_auth.py` implements Shopify's SHA-256 HMAC query verification with constant
time comparison, installed-shop binding, duplicate-field checks and a timestamp
window. Repeated ordinary query values use Shopify's comma-join rule. Production
can prefer the official application framework authentication helper. The optional
local `BUILDER_PROXY_REQUIRED=true` mode checks `SHOPIFY_API_SECRET` and
`SHOPIFY_SHOP`. It is tested with synthetic signatures, never a real installation.
[Authentication algorithm](https://shopify.dev/docs/apps/build/online-store/app-proxies/authenticate-app-proxies).

An app-proxy signature authenticates Shopify forwarding the query. It does not
make the anonymous shopper's POST body trustworthy, sign that body, authenticate
health assertions, or authorize purchasing. Revalidate every body, use HTTPS,
reject direct unauthenticated requests in deployment, enforce bounded requests,
and separate recommendation from the eventual purchase authorization service.

## Non-bypassable checkout dependency

Public App Store apps containing Functions can serve stores on any plan. Custom
apps containing Functions require Shopify Plus. Verify the actual plan and app
distribution before choosing a deployment path; a bespoke unpublished custom app
must not be presented as sufficient for a non-Plus store.
[Functions availability](https://shopify.dev/docs/apps/build/functions).

Cart and Checkout Validation can block payment completion, including accelerated
checkout. Its current compatibility table excludes recurring subscription orders,
Create Order API, POS and order edits. Ordinary Functions cannot make an arbitrary
HTTP call: the validation fetch target is restricted to custom apps on Enterprise
stores with separately granted network access. Do not design around general
network access or recurring billing enforcement.
[Validation reference](https://shopify.dev/docs/api/functions/latest/cart-and-checkout-validation).

Installing a Function alone is insufficient: create/enable the validation with
`write_validations`, and set `blockOnFailure=true` so runtime failures also block.
Exercise failure cases on the actual store's supported checkout surfaces before
making the custom product purchasable.
[validationCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/validationCreate).

## Proposed trusted purchase protocol — not implemented

1. POST full ephemeral screening plus final recipe to a server purchase endpoint.
   Revalidate using current approved library, available ingredients and trusted
   variant prices. Require fresh screening for reorders. No sensitive input persists.
2. Write an immutable outcome-only recipe record to trusted server storage using
   the full digest as identity/collision check, plus versions, approved amounts,
   price configuration and manufacturing state. The short B-ID is display-only.
3. Create a short-lived authorization bound to the shop, verified recipe digest,
   exact variant/price tier, flavor, strength, quantity, premium count, allowed
   purchase mode, price version and expiry. Keep health reasons out of the token.
4. The checkout validation must verify that authorization using a proven mechanism
   within its actual input/runtime limits. A candidate design is an asymmetric
   signed payload verified locally with a public key in the Function; benchmark
   cryptographic support, fuel limits, clock/expiry inputs and replay binding first.
   Alternatively use trusted app-owned Shopify data that is actually queryable by
   the Function; establish scale, access and lookup limits before promising it.
   Neither design is implemented or verified by this preview.
5. Reject missing/forged/stale authorization, mismatched recipe or variant, wrong
   strength/tier, unsupported delivery address, changed quantities and underpayment.
   A plain hash, `_build_json`, underscore-hidden property or browser flag is not
   evidence of authorization. Function input is still attacker-controlled unless
   explicitly sourced from trusted app data or cryptographically authenticated.
6. For the brief's separate premium add-on line, require exact aggregate premium
   quantity per authorized build times custom-jar quantity. Reject removed add-ons,
   reused add-ons across builds, orphan add-ons, changed quantities and other
   products posing as add-ons. A theme cart script cannot guarantee this invariant.
   Test mixed custom jars, duplicated lines, discounts and direct cart API requests.

If the store cannot install a suitable validation app, custom checkout must stay
disabled until an eligible path is chosen. An order-created webhook after payment
can verify, ticket and handle exceptions; it cannot replace pre-payment rejection.
Any future API/manual/POS paths must separately enforce the same trusted protocol.

## Scope and data minimization plan

Initial storefront integration needs the proxy scope and installed-shop metadata.
Trusted current product/variant reads need product access. Checkout validation needs
its validation scopes. Request customer/order write scopes only when implementing
the later profile, order and fulfillment features; protected customer-data access
and retention must be reviewed then. Do not request broad scopes preemptively.
Verify exact scope names against each chosen API before installation.

Use a durable database for outcome records and atomic capacity reservations, not
browser storage or a sleeping container's ephemeral disk. Store full digests and
versions, detect collisions, implement idempotency and role-limited access. The
local `recipe_record` schema is only the safe record shape, not that database.

Future capacity must reserve before displaying a committed shipping promise and
handle expiry, concurrent orders and cancellations. Book-on-order alone can race
and oversell the handoff's daily capacity. No ship-by date is fabricated here.

Production tickets, labels and CRM are later work. Approved ingredient weights,
master artwork, hold-test/sachet choice, shelf life, facility statement and address
are needed before labels can be generated. Only trusted IDs/amounts reach production;
no free text or health-screening reasons. Reorders need current screening and
subscriptions need a separate recurring-order validation strategy before activation.

## Claude provider privacy

The optional adapter uses the official Messages endpoint and version header,
server-only key, configured model, JSON parsing and deterministic post-validation.
Mocked transport tests cover the wire shape; no real API key or model was exercised.
[Messages reference](https://platform.claude.com/docs/en/api/messages/create).

Account/model retention must be checked before real goal text is sent. Current
provider documentation distinguishes feature eligibility, ZDR agreements and
models that require retention; a generic "Messages supports ZDR" assumption is
insufficient. This preview sends nothing externally unless explicitly configured.
[Provider retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention).
