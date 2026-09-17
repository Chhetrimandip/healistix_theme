# Healistix storefront design direction

Date: 2026-09-13. Applies to the new custom ingestible sea moss builder and its integration with this theme.

## Purpose and source of truth

Make the builder feel like the Healistix site the user has already developed: warm food photography, strong editorial type, green and cream, clear choices, and a useful purchase panel. This is an extension of the existing brand.

This document consolidates the current theme and the recorded decisions from earlier conversations. It is a working implementation brief, not a claim that the user has separately approved every new layout measurement below.

Read these sources in context:
- `docs/hair-funnel-visual-v3.md`: records the user's approved local PDP, photographic quiz choices, Georgia headings, green/butter/blue palette, and personalized results.
- `docs/pdp-clean-v4.md`, `docs/pdp-bold-v5.md`: purchase hierarchy, large campaign image, white buy panel, flavor selection, live HTML headlines, mobile purchase controls.
- `docs/pdp-page-photography-v8.md`: shared lighting and material realism with product-specific colors and ingredients.
- `docs/cart-checkout-redesign.md`: cream cart, dark ink, useful product images, editable quantities, anchored totals, native Shopify checkout.
- `AGENT_DESIGN_DECISIONS.md`: historical decisions; later records and actual current code may supersede older details.
- Prior task `Map D2C product funnel flows`: regular store shopping, quiz funnel, and angle-specific direct-response product pages are distinct customer journeys.
- `assets/hx-clean-pdp.css`, `assets/hx-custom-blend.css`, `assets/hx-hair-quiz-v3.css`, and related Liquid sections: actual implemented reference styles.

The new product specification is `customization_plan/Healistix-Custom-Sea-Moss-Gel-Build-Handoff.pdf` (2026-09-12). It covers the 16-goal ingestible builder. Earlier hair-only flow, profile schema, ingredient choices, and illustrative purchase logic are visual/history references, not the new formulation specification. Do not carry Bhringaraj or other old suggestions into the 52-herb seed by assumption. Duals supplies ingredients; the customer-facing product remains Healistix.

## Visual system

| Role | Existing direction / implementation baseline |
| --- | --- |
| Primary green | `#174B3C`: headings, primary buttons, selected emphasis |
| Page cream | `#FBF8ED` quiz; `#F8F7EF` result-page family |
| Reading surface | White or warm white `#FFFEFA` / `#FFFDF6` |
| Muted text | `#52654E`; verify contrast at the actual size |
| Borders | `#DCE1D0` / `#E0E5D8` |
| Butter accent | `#FFF1C3` / `#F9F2D1`, restrained grouping and campaign warmth |
| Pale blue accent | `#E4EFF0`, photographic backgrounds and occasional supporting panels |
| Error | `#8D3829`, with explicit text and icon, never color alone |
| Headlines | Georgia, Times New Roman, serif; bold, editorial, tightly but legibly spaced |
| Body and controls | Existing Forma DJR / theme sans-serif stack with Arial fallback |

Scope styles under a new `.hx-builder` root and use `--hx-builder-*` variables. Reuse existing font loading; do not add a new font dependency. Do not globally change heading, body, button, header, drawer, or checkout styling.

New layout defaults: 4/8/12/16/24/32/48/64 px spacing scale; 12-20 px choice/panel radii and up to 24 px media corners. Use thin borders and modest shadows. Start body copy at 16 px, supporting text at 14 px, and interactive targets at 44 px minimum. Existing tiny uppercase captions are not a reason to make important new information small.

Use large serif headlines for entry/result, smaller readable question headings for quiz. Prefer one obvious primary action per step. Selected cards use a clear border, visible check and text state. Avoid decorative gradients, glowing UI, excessive pills, dashboard-style metric tiles, and clinical-looking symbolism.

## Photography and product identity

- Product first: recognizable Healistix jar, realistic gel, actual flavor/ingredient context.
- Preserve the exact source jar identity, label, proportions and cap for that product; different existing artwork may use different caps. Do not invent package facts.
- Use consistent directional light, tactile materials, plausible shadows, restrained props, and realistic food styling.
- Adapt palette and ingredients to the selected flavor. Banana props must not appear as the factual ingredients of every blend.
- Keep headlines and controls in live HTML. Never bake benefit claims, prices or interface text into imagery.
- Generated campaign scenes are illustrations, not customer evidence, trial outcomes or exact photographs of a manufactured custom recipe.
- Existing hair hero is a visual reference only; do not imply every goal or jar is hair-specific. Use neutral base artwork when an exact custom jar image does not exist.
- Use verified reviews only; no fabricated ratings, customer counts, before/after evidence or efficacy promises.

## Customer journey and layouts

Main custom journey: entry page -> quiz -> personalized jar with edits -> Shopify cart/checkout. Regular flavor shopping remains available independently.

### Entry

Lead with what the customer will get: a sea moss gel blend shaped by their preferences within the available ingredient options. Product campaign image, concise explanation, and one clear start action. Do not promise an unmeasured completion time. Use the familiar header here unless the existing entry template dictates otherwise.

### Quiz

Centered, focused layout, small Healistix logo, readable progress and Back control. A dedicated quiz may suppress normal site chrome only on its own template. Follow the new handoff sequence: goal text (200 characters) and up to two goals; adult/pregnancy gates; suitability/allergy answers; conditional vitality preference; flavor and level; strength; review/result. Accommodate seizure screening and other gaps discovered in the spec without silently resolving medical policy.

Use native radios/checkboxes with card styling. Show clear required-answer errors without losing previous answers. Explain the purpose of sensitive questions briefly. Do not add an email gate. Keep sensitive input in memory for this new flow; do not reuse the old hair sessionStorage contract. Refresh/restart may require answering again.

### Result and edits

Desktop: large product/ingredient imagery alongside a readable purchase panel, following the existing PDP. Mobile: compact title/context, product image, recipe and purchase controls in a natural reading order. Keep important information outside carousels.

Show the goal names, base, flavor/level, strength, selected herbs and grams, approved descriptions, total price breakdown, and real availability/ship-by when connected. Recipe edits include remove, permitted swaps and allowed-herb search. Revalidate every edit; disable stale purchase actions while validation is pending. Do not show a rejected AI response and then correct it visibly.

Use customer language such as 'Your blend', 'Change flavor', and 'Remove'. Hide engine versions, JSON, flags and other implementation detail from the ordinary shopping flow. Provider/iodine notes come from the approved response; don't improvise medical explanations.

### Required states

Loading; question clarification; valid recommendation; invalid edit; Foundation destination; full stop; engine unavailable; retry; stale response; configuration unavailable; sold-out ingredient; changed price; purchase unavailable; cart failure. Preserve choices when recovery is possible. Foundation means ordinary gel with optional flavor and no added herbs; never represent it as universally suitable.

A review preview must be visibly identified as such and unable to purchase. No invented variant IDs, production date, approval, live price, or enabled subscription. The handoff's proposed subscription and pair discounts are different from earlier retail proposals and require real configuration.

## Interaction and quality checks

- Keyboard-operable choices, dialogs and edits; visible focus; dialog focus return; meaningful labels and accessible status announcements.
- Focus the active question heading after navigation. Respect reduced motion; avoid animated delays masquerading as AI work.
- Test at 320, 390, 768 and 1440 px, including long herb names and all error/stop states. No horizontal overflow or sticky controls covering content.
- Inspect existing Healistix reference and new UI at the same viewport before claiming visual consistency. Record screenshots and what was actually tested.
- Preserve theme preview query context and localized Shopify routes. A template file alone does not create a Shopify page record.
- Existing cart integration and real variant state remain authoritative when purchasing becomes enabled.

## Backend boundary

The UI displays the backend's validated result. Server-only model credentials, validation, trusted price calculation and order integration do not belong in Liquid or browser JavaScript. Browser validation is for interaction; it is not purchase authorization.

The two implementation tasks share `customization_plan/builder-api-contract.md`. The backend owns that interface and its test fixtures; the UI consumes it through one adapter. Clearly separate local demonstration from installed app and end-to-end checkout readiness.

## Open decisions

See `customization_plan/questions-for-shamim.md`. Do not convert unconfirmed grams, shelf-life wording, screening policy, prices, or product status into production approval. Continue building the reviewable flow with explicit configuration and purchase disabled until launch dependencies are resolved.
