# Where we are — September 14, 2026

**Newer connection map — September 15:** [Open the Obsidian canvas](C:/Users/chhet/Desktop/Madnip_vault/Madnip_vault/Healistix%20Connection%20Map%20-%20September%2015%202026.canvas). [Read one connection at a time](C:/Users/chhet/Desktop/Madnip_vault/Madnip_vault/Healistix%20Connection%20Map%20-%20Start%20Here.md). This newer map reconciles actual-cart progress, updated jar stock, local-only blend-cart/admin work, and the remaining checkout/production gaps. The September 14 snapshot below is historical.

**Visual version:** [Open the Obsidian canvas](C:/Users/chhet/Desktop/Madnip_vault/Madnip_vault/Healistix%20Where%20We%20Are%20-%20September%2014%202026.canvas). It shows the same system and milestone boundaries with technical terms explained beside each part. This document retains the supporting detail.

**Learning preference:** teach real technical vocabulary with short plain-English definitions; use visuals first and one small explanation at a time.

## Product in one sentence

Customers describe their goals, choose flavor and strength, and receive an editable sea moss recipe checked against the ingredient library. The current release is a connected review preview; custom purchasing is disabled.

## Current system

1. Shopify theme (`Desktop/healistix-theme`): quiz, images, result and edit controls. Answers live in page memory.
2. Shopify app proxy: forwards the theme's requests to our hosted backend.
3. Node/TypeScript backend (`Desktop/healistix_backend`), hosted on Render: loads the current library, screens choices, asks Claude when configured, validates proposals, calculates estimates and validates edits. Rules provide fallback recommendations.
4. PostgreSQL: Shopify installation sessions, herb import drafts, versioned libraries, saved validated recipe outputs, and newly implemented draft commerce settings. Saved recipes are not paid orders or customer profiles.
5. Shopify embedded admin: ingredient management/imports, synthetic Claude lab, saved recipes and sample producer output; newer readiness and product-mapping screens support setup, not completed commerce.

The backend is Node/TypeScript in `Desktop/healistix_backend`, hosted on Render.

## Evidence and limits of this reconciliation

Read the UI/integration/database task history, original extracted handoff, current theme configuration and JavaScript, current backend documentation, proxy route and Prisma schema. Backend task's recent turns returned empty items through task retrieval; current source and its implementation records were used instead.

The theme review template points to `/apps/healistix-builder`. The backend proxy authenticates requests, loads the active database library and supplies a recipe persistence callback. The theme explicitly disables custom purchase. Backend README records successful live synthetic Claude calls. This audit did not independently repeat a Claude call or full hosted browser acceptance test. A direct health request was blocked by this session's network permissions, so current live provider state and latest deployment are not independently confirmed here.

The earlier database inspection recorded 33 recipes at 10:03 PM Nepal time; that is a historical snapshot, not the current count. Newer schema includes CommerceSettings, which was absent from that snapshot.

## Handoff progress

| Area | Current boundary |
|---|---|
| Quiz, recommendation, editable recipe | Implemented review flow with recorded tests |
| Hosted Shopify/backend connection | Implemented and previously verified |
| Claude | Adapter and live synthetic verification recorded; fallback still possible |
| Library and recipe persistence | Implemented; final recipe outputs, not raw screening answers |
| Admin tools | Implemented review tools; producer output is a sample |
| Product mapping | Draft editor/audit implemented; actual product configuration remains |
| Trusted cart and checkout | Unfinished |
| Inventory, capacity and shipping promise | Unfinished |
| Paid-order tickets, labels, lots and fulfillment | Unfinished |
| Customer profiles, Klaviyo, reorders and subscriptions | Unfinished integrations |
| Formulation, supplier, label and launch approvals | Open decisions; eight source quantity conflicts remain |

The engine follows the handoff's general design. There are explicit exceptions/open interpretations, including the approved 15-second model deadline and unresolved routing/quantity questions. This is not a complete line-by-line compliance certification.

## Tonight's sequence

1. Catch up through one customer journey: quiz → backend → validated recipe → saved output. Then one ingredient edit. Explain each boundary before more feature work.
2. Use `Desktop/healistix_backend/docs/IMPLEMENTATION-CHECKLIST.md` as the detailed master checklist.
3. Next implementation milestone: inspect actual Shopify products/access, configure mappings, then implement trusted cart preparation and supported checkout enforcement. Demonstrate a controlled test purchase tied to the exact saved recipe before calling commerce complete.
4. Next: paid-order processing, one ticket per jar, labels/lots, stock/capacity, then profiles/reorders/CRM and remaining acceptance checks.
5. Track engineering work separately from owner/production decisions. Full launch cannot be promised tonight: some approvals and physical testing are external prerequisites.

## Working agreement for subsequent changes

One reviewable milestone at a time. Before building: explain customer-visible behavior and affected parts in plain language. After building: demonstrate the path, state what was tested, update the checklist, and distinguish implemented, deployed, verified and approved. Avoid launching more parallel feature work until the user has the current map.
