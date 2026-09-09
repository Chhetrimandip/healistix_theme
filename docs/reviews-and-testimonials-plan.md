# Healistix reviews, testimonials, and UGC plan

Working checklist · September 8, 2026

## September 9 migration completed

This update supersedes the historical state/checklist below. Judge.me Free now contains 44 published Sea Moss reviews: 41 complete captured reviews plus 3 explicitly labelled excerpts. Both import logs show complete with zero failed rows. Original ratings, dates and review text were preserved; source/flavor/disclosure context is visible. No 10,000-review source was located, and Duals Natural reviews were excluded because same-product equivalence was not established.

The live Healistix theme (156971106442) uses Judge.me's native widget with the existing green PDP styling, plus five separate existing customer videos with captions, source links and disclosures. The duplicate lower widget is disabled and the unsupported “460+ verified 5-star reviews” label removed. The displayed aggregate is 44 reviews, rounded 4.0. Local integration was also completed; the separate draft theme remains unchanged.

Pagination, rating sorting, photo display, review-form opening, and mobile layout were checked. No test review was submitted. The old flavor dropdown is not available in this native configuration; flavor labels remain visible. Automatic Amazon refresh and review-request campaign configuration remain unverified. Migration CSVs, source ledger, media register, live backup and deployment package are in `staging/judgeme-migration-20260909`; do not reimport overlapping files.

## Objective and working rules

Build a trustworthy, fast review experience that helps shoppers choose a flavor and buy confidently. Start with existing Amazon feedback, collect new online and physical-store reviews, then add genuine customer videos and creator content as they arrive.

The business already sells online and physically; this is a growth project, not a new-business launch. Taste is the intended positioning. The supplied Raw Original reviews alone do not establish “best-tasting sea moss ever,” especially for fruit flavors.

Do the research, preparation, and tests ourselves. Do not contact the shop owner just to announce work, ask which tools they use, or request a CSV before testing a direct importer. Ask only for a specific missing login/approval, a spending decision, product clarification, or permission we cannot establish ourselves. Never ask for passwords to be sent in chat. 

This document is a plan, not authorization to start paid plans, book creators, send campaigns, or change unrelated parts of the store. Check off an item only with evidence; an installed app is not a completed import.

## Current state: completed versus pending

| Item | Status and evidence |
|---|---|
| Judge.me installed | Completed by owner. |
| Free plan | Selected and confirmed in Judge.me dashboard; no paid trial selected. |
| Core embed | Enabled on live Healistix theme; dashboard confirmed. |
| Sea Moss review widget | Added to live theme; “Write a review” opens the rating form. No test review submitted. |
| Two Amazon excerpts | Published as selected testimonial cards, outside Judge.me: Liliane Avalos and Me. Anderson, original ratings/dates, Raw Original attribution, Amazon listing link. |
| Amazon reviews inside Judge.me | NOT completed. Widget was empty at last verification. |
| Amazon direct import into Appio | Completed test: 20 records fetched for Sea Moss Gel; all 20 Pending, Published 0. Appio reports 3.1 stars for this imported batch, not necessarily the whole Amazon listing. |
| Automatic Amazon refresh | NOT configured or tested. |
| Review request emails | App reports enabled by default. Timing, sender, POS behavior, and existing-order handling remain unverified. |
| Customer videos / creator UGC | Planned; no source videos supplied or implemented. |
| Footer | “Powered by Shopify” removed on live theme. “My Store” copyright name remains; track separately if it should change. |
| Working redesign | Local excerpts exist, but local review widget is still disabled in the template and local settings lack the Judge.me embed. Draft/live parity remains open. |

Live theme: Healistix, `156971106442`. Draft: 3rd iter, `158133911690`. Development and live themes are different: do not push the whole workspace to live to deliver review changes.

Primary Shopify product: Sea Moss Gel, `8750569226378`, handle `sea-moss-gel-banana`; flavors are variants of this one product. Amazon source: [B0CFD6RMMF reviews](https://www.amazon.com/portal/customer-reviews/B0CFD6RMMF/ref=cm_cr_dp_d_show_all_top?reviewerType=all_reviews).

## What shoppers should see

| Placement | Content | Source and behavior |
|---|---|---|
| Near product title | Compact rating and review-count link | From the chosen review system, never typed manually. Link to full reviews. Hide until a valid count exists. Label source; no mixed or duplicated totals. |
| Below product explanation | “A taste of what customers think” — 2–3 selected excerpts | Genuine, faithful quotes with source, flavor, date. Clearly selected testimonials, not the entire review collection. |
| Product page lower section | Full review widget with ratings, sorting, photos, and review form | One primary full widget. If Amazon needs a separate provider, label “Amazon reviews” and “Website reviews” distinctly. |
| Homepage | Small curated testimonial section linking to the product | Launch after product-page setup passes QA; no fabricated counts or empty cards. |
| Later: customer video section | “See how customers enjoy it” | Add when at least three usable, permission-cleared clips exist. Tap to play, captions, visible flavor. |
| Later: creator content | “Ways to enjoy Healistix” or similar | Paid/gifted creator content and AI demonstrations identified appropriately; not represented as verified customer reviews. |

On flavor changes, keep Raw Original quotes labeled Raw Original. Only filter reviews by the selected flavor if the data and app support it reliably. Otherwise say “Reviews across sea moss flavors.” Do not create separate Shopify products just to accommodate reviews.

## Phase 1 — Prove the Amazon import route

Owner: implementation team. Start here; no owner message needed yet.

- [ ] R01 — Inspect Judge.me's actual Amazon import screen and record its supported flow. Its current documentation describes third-party export followed by CSV import, not a native unattended Amazon feed. [1]
- [ ] R02 — Inspect Amazon Reviews by Appio as the first direct-import candidate. Its listing advertises Amazon imports on Free, up to 10 displayed reviews/product; automatic importing is listed on VIP at US$19.95/month. These are advertised capabilities, not a successful test of our listing. [2]
- [ ] R03 — Review permissions and free-plan limits before installation. Do not begin a paid trial for the test. If installation needs owner approval, provide that exact approval step only.
- [ ] R04 — Use the existing Amazon URL to attempt a small import without manually copying reviews. Match to Sea Moss Gel and retain each review's actual flavor; do not call Raw Original “Banana.”
- [ ] R05 — Compare the fetched records to the supplied screenshots: reviewer, original text, stars, date, flavor, media and source link. Check whether the importer retrieves full reviews or just an accessible subset. Record actual fetched/displayed counts.
- [ ] R06 — Establish the available reuse permissions/terms for importing and displaying Amazon material before expanding publication. Judge.me itself flags Amazon reuse restrictions; software access is not proof of reuse permission. Record the basis rather than assuming the brand owns customer-written content. [1]
- [ ] R07 — Verify the refresh interval, whether it runs unattended, plan limits, deduplication, failed-import behavior, and whether edits/deletions at source propagate. A successful initial import does not prove ongoing sync.
- [ ] R08 — Verify whether Appio can actually transfer imported records into Judge.me and whether that transfer refreshes automatically. “Works with Judge.me” in a listing is insufficient evidence. If not, compare replacing the full widget versus keeping two clearly separated source sections.
- [ ] R09 — Choose the simplest proven setup and record total monthly cost. If the working route requires payment, present its tested result, exact price, and limits for a decision before subscribing.

**Exit condition:** Real records from B0CFD6RMMF fetched by a tool, accurate product/flavor mapping, known coverage and permissions, and demonstrated refresh behavior or an explicitly documented manual-refresh limitation.

If the direct importer fails, record the concrete reason. A team-managed batch export/import is the fallback only after explaining that it does not meet the unattended-sync requirement. Do not return to asking the owner to make a spreadsheet by default.

## Phase 2 — Finish the review sections

- [ ] R10 — Back up exact remote files/settings before changes; inspect both live and draft themes. Preserve unrelated design edits.
- [ ] R11 — Audit all review-related placeholders, including the live buy-box “460+ verified 5-star reviews” claim. Replace unsupported totals with the real widget count or omit them. Keep this audit scoped to reviews.
- [ ] R12 — Install the chosen full-review display on the Sea Moss product; remove redundant full widgets and stale empty placeholders after the replacement works.
- [ ] R13 — Add the live rating/count link near the title. Imported Amazon reviews must not acquire a “verified Shopify purchase” badge.
- [ ] R14 — Polish the two selected cards: balanced layout for two cards, readable excerpts, stars, source/flavor/date, and accessible Amazon link. Keep selected quotes separate from aggregate rating calculations.
- [ ] R15 — Add the homepage testimonial section using approved material; link to full reviews. Do not duplicate one review as several records.
- [ ] R16 — Mirror the chosen integration into the working redesign and 3rd iter draft, including embed settings and widget visibility. Verify before any later theme switch.
- [ ] R17 — Verify mobile/desktop layouts, long names/text, keyboard navigation, contrast, links, review form, flavor changes, no duplicated widget IDs, and no blank sections.
- [ ] R18 — Test with review scripts blocked/slow: product selection and add-to-cart must still work. Load lower-page media lazily.
- [ ] R19 — Check structured-data ratings against the actual review dataset and provider eligibility; do not generate ratings from selected quotes or promise Google eligibility for imported Amazon reviews.

**Exit condition:** Screenshots and live URLs show the correct reviews, accurate labels/counts, a working collection form, and no duplicate or misleading sections on desktop/mobile.

## Phase 3 — Collect reviews from online and physical customers

Judge.me Free supports text/photo/video review collection and QR collection. Verify the actual configured form, not only the plan description. [3][4]

- [ ] R20 — Inspect email request timing, sender identity, branding, reminder settings, and whether existing orders have been scheduled. Record current behavior before changing anything.
- [ ] R21 — Draft a short neutral request: “How did you enjoy your Healistix sea moss? Tell us which flavor you tried and what you thought of the taste and texture. A photo or short video is welcome.”
- [ ] R22 — Set the proposed timing from actual delivery/fulfillment behavior, allowing time to try the jar. Avoid duplicate requests across email apps. Do not send a historical customer blast as part of setup.
- [ ] R23 — Confirm photo/video upload works from an ordinary phone. Test draft form steps without publishing a fake customer review.
- [ ] R24 — Generate and test the product-specific QR code and direct link. Prepare a counter card and parcel insert only after the destination is final. Do not claim a QR scan proves purchase. [4]
- [ ] R25 — Check whether physical sales are recorded in Shopify POS. If yes, inspect its review-request workflow; otherwise use the QR route. Ask the owner only if the account cannot answer this.
- [ ] R26 — Finalize request copy, timing, and recipients before activating new outreach. Any outgoing campaign requires explicit authorization.

**Exit condition:** One clear online request flow, one tested in-store/parcel QR flow, working media submission, and documented verification behavior.

## Phase 4 — Customer videos and UGC

Keep one asset register with these fields: asset ID; customer/creator display name; content type (customer, paid creator, gifted creator, AI); source review ID/link; actual product/flavor; received date; original file; transcript; website/organic-social/paid-ad permission separately; permission evidence; expiry; incentive/disclosure; approved edits; thumbnail; captions; status; placements; performance.

Workflow: received → source/flavor checked → permission recorded → edited/captioned → approved for specific channels → published → measured → archived/removed when needed.

- [ ] R27 — Prepare the register and an organized original/edited media folder. Preserve originals; do not overwrite them with ad edits.
- [ ] R28 — Prepare a customer video prompt: “Which flavor did you try? What did it taste like? How do you enjoy it?” Suggest 15–45 seconds, vertical phone video, daylight, quiet room, jar visible, and their own honest words.
- [ ] R29 — Prepare separate website, social, and paid-ad reuse permission choices. A review submission alone is not blanket permission for every advertising use.
- [ ] R30 — For paid/gifted creators, prepare a brief, deliverables, usage duration, ad rights, raw-footage requirements, disclosures, and approval process before booking.
- [ ] R31 — Keep AI UGC as identified demonstrations or brand creative. Never invent a customer identity, purchase, testimonial, or product result for an AI actor.
- [ ] R32 — Verify each clip's product/flavor and claims. Avoid misleading cuts, scripted “best ever” reactions presented as spontaneous, or turning a customer's health anecdote into an established product promise.
- [ ] R33 — Produce captions, transcripts, cover frames, and web-friendly versions. No autoplay audio; load video only when needed. Provide pause/close controls and readable mobile text.
- [ ] R34 — Launch the customer video section once three approved clips exist. Until then use the text reviews; do not publish empty “coming soon” slots.
- [ ] R35 — Publish paid/gifted creator demonstrations in a clearly identified content section. Link each clip to the relevant flavor when accurate.
- [ ] R36 — Confirm storage/export for original customer uploads. Judge.me's spreadsheet import supports text/images, not video files; externally supplied clips need a tested separate media workflow. [5]

## Phase 5 — Maintain and improve as sales scale

- [ ] R37 — Establish a baseline: review count by source/flavor, average rating by valid dataset, request delivery, review submission rate, usable-video count, review clicks, video plays, add-to-cart and purchases.
- [ ] R38 — Add privacy-appropriate events for review-section views, full-review clicks and video engagement. Do not send reviewer identities in analytics events.
- [ ] R39 — Weekly: inspect failed refreshes, duplicate imports, low-rating feedback, spam, broken media, expired permissions, and repeat themes in taste/texture feedback.
- [ ] R40 — Use a moderation policy based on authenticity, relevance, privacy, and abuse—not hiding legitimate criticism. Keep a record of removals and reasons.
- [ ] R41 — Once traffic supports it, test one change at a time: testimonial position, flavor relevance, or video versus text. Compare conversion over a meaningful sample; no promised uplift.
- [ ] R42 — Monthly: export an available review backup, audit media permissions, reassess app fees and refresh reliability, and replace weak featured content with stronger genuine material.

## Decision log and next action

| Date | Decision / open issue |
|---|---|
| 2026-09-08 | Keep Judge.me Free for now; paid Amazon importer not selected or authorized. |
| 2026-09-08 | Prioritize a direct-import test over owner-managed CSV preparation. |
| 2026-09-08 | Amazon automatic collection and Judge.me native collection are distinct capabilities; prove any bridge between them. |
| 2026-09-08 | Start with truthful taste-related text; add customer videos once assets and channel permissions exist. |
| 2026-09-08 | Existing live cards are selected excerpts, not an import or sync. Reuse basis still needs to be recorded. |

**Next action:** Finish R05 source/flavor validation and R08 export/bridge investigation before publishing the imported dataset. Flag recurring quality/fulfillment complaints for the business to investigate before scaling advertising. Do not suppress genuine low ratings to manufacture a higher aggregate. No owner CSV is needed for the proven initial import; unattended refresh remains unproven. No paid plan or trial has been started.

### Execution log

- 2026-09-08 — Local design preview: redesigned selected Amazon excerpt cards with source/date/flavor labels and added Rosie G's genuine four-star criticism about swallowing Raw Original alone. Three cards are explicitly selected excerpts, not the full dataset or an aggregate rating. Added responsive single-column layout and a full Amazon feedback link. Local HTTP confirms new stylesheet and all three records are served; browser visual QA timed out and remains pending. No live-theme push or Appio publication performed. Files: sections/product-reviews-grid.liquid, assets/hx-review-stories.css, templates/product.seamoss.json.
- 2026-09-08 — R04 direct-import test succeeded after the user explicitly approved the separate Amazon import agreement. Appio's product row reports 20 reviews, 3.1 stars, New 20; Manage reviews confirms All 20, Pending 20, Published 0. Records are mapped to the main Sea Moss Gel product. Nothing published or deleted during this test. This proves an on-demand fetch, not unattended synchronization or a Judge.me transfer.
- 2026-09-08 — R05 partial validation: imported names, ratings and dates match screenshot examples including Cadesja Ford (5, July 16), Nene jackson (5, May 1), Liliane Avalos (5, April 2), Me. Anderson (5, December 21 2025), and Rosie G (4, December 3 2025). List view truncates long text and does not expose flavor/source permalinks; full-record validation remains open. Cadesja's image is present. Coverage is a subset, not verified as all Amazon reviews.
- 2026-09-08 — Quality findings: this batch includes watery consistency complaints (August 28 and July 30), wrong-flavor fulfillment (May 10), sour/chunky consistency (May 20), and spoilage/date-label complaints (October 23 2025), plus reports of adverse reactions. These are customer allegations, not independently verified findings. Keep originals intact; investigate product/fulfillment issues rather than presenting this batch as evidence of universal best-taste satisfaction.
- 2026-09-08 — R07 correction: despite the in-app notice saying up to 8 URL reviews, this run actually returned 20. The earlier interpretation that 8 necessarily overrides the Free 20/import setting is superseded by observed results. Do not promise either count for future runs. All records remain pending with auto-publication off; Free automatic refresh still not demonstrated.
- 2026-09-08 — R06 user authorized acceptance of Appio's Amazon import agreement; accepted in UI. This records authorization to proceed, not an independent legal finding that all downstream advertising/media reuse rights are cleared.

- 2026-09-08 — R03 installation complete by user; dashboard confirms Free, 200/200 credits, zero reviews, inactive storefront embed. No Appio widget activated and no request emails enabled by this agent.
- 2026-09-08 — R04 prepared: linked https://www.amazon.com/dp/B0CFD6RMMF to the main Sea Moss Gel row; saved auto-publish OFF. Clicking Import opened separate Amazon Review Import Terms and Policy; no reviews retrieved yet. Acceptance is pending, not a technical import failure. Terms state authorized seller/representative status, license to retrieve/process/store/display, merchant responsibility for reuse rights and Amazon policies, and Appio liability disclaimers. Browser rules require confirmation before accepting this agreement.
- 2026-09-08 — R07 partial evidence: in-app Amazon notice limits URL retrieval to up to 8 reviews currently; Free settings show nominal 20 reviews/import but the Amazon source restriction overrides that. Auto-import is disabled on Free; available interval choices shown are 14 and 28 days. Neither successful fetching nor unattended refreshing is proven.

- 2026-09-08 — R02 inspected: live Shopify App Store listing confirms Free includes Amazon imports and 10 displayed reviews per product; VIP advertises automatic imports at $19.95/month. Import quality and refresh behavior have not been tested.
- 2026-09-08 — R03 blocked at final installation approval: Shopify requests access to customer names/emails and store owner data; edit access to customers, products/collections, theme, and app-controlled page content. The final Install button has not been clicked. Browser rules require confirmation for granting this new sensitive-data access. Installation screen is open in Chrome. No charge incurred, no reviews fetched, no storefront changes during this test preparation.

## Tracking format

Use the R-number above in updates. For every completed item, append: date, action, evidence/URL or file, actual result, cost impact, and next dependency. Record “blocked” with the exact reason; do not mark it complete. This is a manual working checklist, not a background monitor.

## Sources checked September 8, 2026

1. [Judge.me Amazon import workflow and limitations](https://judge.me/help/en/articles/9813299-importing-reviews-from-amazon-with-a-chrome-extension)
2. [Amazon Reviews by Appio: features and plan pricing](https://apps.shopify.com/product-reviews-by-appio)
3. [Judge.me Free plan features](https://apps.shopify.com/judgeme)
4. [Judge.me QR code collection](https://judge.me/help/en/articles/9685536-collecting-reviews-using-a-qr-code)
5. [Judge.me spreadsheet import limitations](https://judge.me/help/en/articles/8223181-importing-reviews-with-judge-me-import-wizard)

Related: [Healistix growth plan](healistix-growth-plan.md). Its older review-status paragraphs predate the installation and screenshots; use this document for current review implementation status. Platform capabilities and pricing must be rechecked at implementation time.
