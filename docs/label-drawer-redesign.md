# Structured jar-label drawer

September 8, 2026 — local/development preview only; not pushed live.

- Replaced Banana's default full-image display with semantic HTML ingredients, storage, nutrition table and directions.
- Source checked visually: assets/hx-label-banana-right.webp and assets/hx-label-banana-left.webp. Nutrition values and ingredient wording transcribed from these images, not inferred from other flavors or independently certified.
- Blue ocean-inspired background is CSS, with solid cards behind readable text. Original images remain in an expandable source section.
- Preserved flavor switching via existing data-flavor-label attributes. Other supported flavors still show their own original labels within the new shell; their full text conversion is pending source-by-source verification.
- Did not promote the printed thyroid/immune/sexual-health claims as website headings. Original source remains accessible.
- Verified local response has new stylesheet, nutrition text, source-image links and no Liquid error. Browser confirmed expanded drawer and visually checked the top cards. Full mobile QA and all-flavor text transcription remain pending.

## Remaining checklist

- [ ] Check each remaining flavor's ingredients, nutrient quantities, daily values, storage and directions against its own source images.
- [ ] Add flavor-specific structured content; never silently substitute Banana values.
- [ ] Review printed nutrition data with the merchant before live publication; this transcription is not validation of nutritional claims.
- [ ] Complete mobile, full-table, source-link and keyboard QA before live rollout.

Files: snippets/hx-flavor-labels.liquid, snippets/hx-label-banana.liquid, assets/hx-label-drawer.css.

## Multi-flavor rollout — September 8, 2026

Implemented with three bounded transcription subagents and integrated by the main agent. This rollout covers the Sea Moss Gel product's 23 flavor selections; Batana/Shilajit pages are not changed by this label-drawer task.

- 17 flavors now have code-rendered ingredient/storage/direction cards, with original images collapsed for reference. Each uses its own checked sources.
- 2 complete source-backed Nutrition Facts tables: Banana and Mango. The other 15 inspected flavor image sets do not contain nutrition panels, so their nutrition cards explicitly note missing information rather than borrow values.
- 6 clear missing-label states: Beet Root, Guava Lemon, Lychee, Red Guava, Rose, Orange. Beet Root's right image actually lists Mango & Pineapple Puree; it remains excluded. Other five lack usable side-label assets here. No unverified image is shown in these states.
- Three cropped skin-instruction sources (Passion Fruit, Pineapple Mango, Maca Ashwagandha) now get a concise notice to consult the full jar directions; the parent replaced the agents' literal cropped-text fragments to avoid presenting incomplete instructions.
- Added keyboard focus loop to existing modal Escape/return-focus behavior.
- Automated regression: `./scripts/test-label-drawers.ps1` passes: 17 structured labels, 2 nutrition tables, 15 nutrition-source gaps, 6 missing-source panels, 23 total and no Liquid errors. Checks source-image accordions default closed and rejects old image-only heading.
- Browser checked Blueberry-specific ingredients, switch to Mango's full table, Beet Root's missing-source state, and Shift+Tab/Tab looping within the drawer. Escape works. Blueberry layout visually checked in Chrome. In-app existing-tab inspection timed out; use fresh preview link, do not claim existing in-app tabs refreshed.
- No live theme push. Full nutrition completeness, missing-source flavors and exhaustive mobile visual QA remain pending. Source notes: label-transcription-batch-1.md, -2.md, -3.md.

### Inputs needed for complete label coverage

Provide flavor-specific Nutrition Facts images for the 15 flavors lacking panels; correct Beet Root label; side labels for Guava Lemon, Lychee, Red Guava, Rose and Orange; uncropped skin directions for the three listed flavors. Merchant should review label wording and nutritional claims before live publication.

### Final verification interruption

After the successful 23-panel automated test and Chrome UI checks, the final regression rerun failed twice at the initial local product JSON request: Shopify returned “The access token provided is expired, revoked, malformed, or invalid for other reasons.” This is a preview authentication failure, not a passing final rerun. Refresh the Shopify CLI/store preview authentication before further local QA. No source changes were rolled back; the earlier passing test and browser observations remain recorded separately.
