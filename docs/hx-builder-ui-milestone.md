# Custom gel UI: connected review milestone

September 13, 2026. UI worktree: `C:\Users\chhet\.codex\worktrees\1441\healistix-theme`.

The new general ingestible builder runs at **http://127.0.0.1:8788/** on this computer. It connects through `/api` to the separately running local backend on port 8787. It is not an externally shareable URL, a deployed Shopify app, a live model demonstration or a purchase-ready product. Parent task found that Shopify CLI requires renewed interactive login; no upload or live publication was attempted here.

Run backend `python server.py` from `apps/healistix-builder`, then run `python prototypes/hx-builder/serve.py` from the theme root. The preview server resolves its theme path from its own file, so it also works after copying into the main checkout. Parent supplies `scripts/start-builder-preview.ps1` for bundled-runtime startup.

The independent fixture route is **http://127.0.0.1:8788/prototypes/hx-builder/fixture.html**. Its prominent badge says fixture/no service connection. It uses backend-generated synthetic request/response snapshots, not a second browser recommendation engine. Unrecorded combinations return an explicit fixture limitation. Recorded baseline: Energy, no written goal, adult yes, pregnant/nursing no, seaweed allergy no, no conditions/allergies, screening acknowledgement, Mango/Tropical/Standard, first time yes, Standard strength. Connected mode supports the full available flow.

## Delivered behavior

- Entry campaign and neutral preparation photography; exact source Raw package on result, with explicit illustrative/reference captions.
- Six-step base quiz with 16 goals, 200-character goal input, two-chip limit, adult/pregnancy/allergy gates, full condition list including seizure screening, explicit screening acknowledgement, conditional vitality preference, flavor family/flavor/level, first-time/strength and editable review.
- Backend-validated recipe, approved descriptions, goal names, base/flavor/strength/grams, seed price breakdown, backend notes, and no invented ship date.
- Remove, server-permitted swaps, searched screened additions and revalidation. Invalid edits retain the preceding accepted recipe; changed estimates are announced. Dialog Escape returns focus to its opener.
- Loading, clarification, Foundation with configured-link support, stop, invalid response, unavailable/retry and configuration failure surfaces. Obsolete responses are discarded after navigation. Current backend returns no actual inventory/ship schedule, so live sold-out/capacity and cart-failure workflows remain future integrations.
- Purchase button permanently disabled regardless of a returned browser-visible eligibility flag. No cart request, variant, subscription, production-date promise or provider credential exists in this UI.
- Memory-only input; no sessionStorage, localStorage, health URL parameters or analytics. Static preview server serves an explicit allowlist, not the repository; request bodies are bounded and unlogged.

## Verification actually completed

- Connected browser: Energy/Mango recommendation, $38.99 seed estimate, Beet swap to Moringa, removal to one Maca/$29.99, rejected final-herb removal preserving Maca. Backend subsequently refined the rejection wording to “Keep at least one herb in a custom blend.”
- Connected browser: required acknowledgement, keyboard Enter on start, rejected third goal, Back preserves the goal, Escape/focus return, unflavored label and suppressed irrelevant flavor level.
- Parent independent connected check: Focus plus synthetic thyroid answer removes Bacopa from result/add dialog; displays provider and iodine notes. Added Ginkgo with resulting grams, changed price notice and disabled purchase.
- 11 automated UI/adapter checks (`node prototypes/hx-builder/test-ui.mjs`): accepted recipe, invalid-edit rollback, stale completion ignored after navigation, network recovery preserving answers, malformed accepted response rejected, purchase remains disabled even with `purchase.enabled=true`, safe catalog links with preview context, required gates, conditional vitality path, 422 response processing, same-origin adapter boundary.
- 8 preview-server checks (`python prototypes/hx-builder/test-preview.py` while preview runs): repository/dot/traversal/directory denial and malformed/negative/oversize request lengths.
- Browser result widths 320, 390, 768, 1440: document scroll width equals client width at each. Mobile result follows heading → jar → recipe → white purchase panel; no sticky controls cover content. Long Ginseng/Maca names stay legible. Entry 320/768/1440 and result 320/390/768/1440 screenshots saved. Mobile and desktop screenshots inspected visually; Georgia/green/cream, product-first image and white panel follow the current source design. Parent independently checked the entry against the established brand. A fresh side-by-side hosted rendering of the old PDP was not performed because Shopify preview authentication was unavailable.

Screenshot evidence: `prototypes/hx-builder/screenshots/entry-1440.png`, `entry-320.png`, `entry-768.png`, `goals-320.png`, `result-320.png`, `result-390.png`, `result-768.png`, `result-1440.png`. Earlier fixture screenshots are superseded and excluded from the final manifest.

## Provenance and additive integration

Only new `hx-builder` files were authored. Existing hair funnel, ordinary PDP and source checkout were not changed by this task. Read source `design.md`, complete handoff and seed PDF/CSVs, current clean-PDP/custom-blend/hair-quiz CSS and named visual decision docs. Copied CSS snapshots under `docs/hx-builder-reference` are review references only and not runtime dependencies.

Raw reference copied from main `assets/hx-pilot-unflavored-front.webp` to `hx-builder-raw.webp`. Actual PNG logo copied from main `assets/healistix-logo.png`. Hero/preparation images generated and supplied by parent; original provenance is `docs/custom-builder-image-assets.md`. Backend fixture files copied from sibling worktree 9409; backend remains their owner. No backend-owned source was modified here.

`prototypes/hx-builder/additive-manifest.json` lists exactly the runtime, tests, final screenshots and this report to copy. It excludes duplicated source briefs, extracted PDF text, reference CSS, unused seed JSON/SVG and temporary scripts. Do not copy `.git` or replace the whole theme checkout.

Liquid integration: `sections/hx-builder.liquid` and `templates/page.hx-builder.json`. Shopify still needs a real page record assigned to the template and an installed authenticated same-origin app proxy path in section settings. A template file does not create the page. The local fixture bundle is not a deployed Liquid mode.

## Remaining launch decisions

Backend-identified default-pairing/no-stimulant quantity conflicts remain fail-closed; source quantities need production reconciliation. Ingredient approval/COAs and inventory, prices/variants, tested shelf life and flavor level, manufacturing/capacity, actual shipping region/date, label approval, privacy/provider configuration, app installation and non-bypassable purchase enforcement are not complete. Customer profile/reorder, production tickets, subscription/pair offers and fulfillment lifecycle are outside this connected first milestone. Foundation destination is unconfigured; it is never presented as universally suitable.

Client update draft: “The first working custom sea moss builder is ready for review. Customers can choose goals, complete suitability questions, choose flavor and strength, and see an editable blend checked by the backend. Ingredient swaps and invalid edits have been tested, with purchases kept off. The preview is local while Shopify authentication and hosting are arranged. Before launch we need to reconcile the conflicting herb quantities and confirm ingredient, production, pricing and label setup.”
