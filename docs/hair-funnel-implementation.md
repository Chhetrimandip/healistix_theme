# Hair Concern Funnel — Sea Moss Gel + Herbal Powders

## Theme routes

- `/pages/hair-routine`: `page.hair-routine` → `hx-hair-landing`.
- `/pages/blend-quiz`: `page.blend-quiz` → `hx-blend-quiz`.
- Completed quiz → `/pages/find-my-blend`, implemented by the custom blend PDP.

New theme templates do not create Shopify page records. The parent integration owns the actual unpublished Shopify preview and page assignment. This implementation does not push a theme or change the existing normal PDP, quiz, header or cart.

## Customer experience

The landing continues the hair-concern ad angle: **“Hair changes? Make your next step personal.”** The proposed product is fixed: **sea moss gel enhanced with Duals Natural herbal powders**, for adults of all genders. The hero shows the existing unflavored Healistix gel as the base beside actual Duals ingredient packaging. Both are identified as base/ingredient references.

Eight questions collect:

1. Hair concerns (multiple choices).
2. Location, using original top-of-head SVG diagrams.
3. Onset.
4. Frequency.
5. Prior attempts (multiple choices, with “nothing yet” exclusive).
6. Desired outcome.
7. What matters when choosing a blend.
8. Whether an ingredient suitability review is needed.

All eight answers appear in an editable profile before continuing. The quiz supports Back, native checkbox/radio keyboard interaction, required-answer errors, change-and-return-to-summary, session-storage failure recovery and Clear my answers. No name, email gate, gender assumptions, diagnosis or dose recommendation is introduced.

## Shared profile contract

Storage: **sessionStorage**, key **hx-hair-profile-v2**. Only the completed profile is stored. Sensitive hair-concern answers are not persisted in localStorage. No analytics event is emitted by this script. The previous v1 profile is not read or migrated.

```json
{
  "version": 2,
  "goal": "hair-care",
  "base": "sea-moss-gel",
  "concerns": ["shedding", "thinning"],
  "area": "crown",
  "onset": "months",
  "frequency": "consistent",
  "tried": ["topicals"],
  "desiredOutcome": "fullness",
  "priority": "ingredient-clarity",
  "reviewRequired": false,
  "completedAt": "2026-09-11T00:00:00.000Z"
}
```

Allowed values:

| Field | Values |
|---|---|
| concerns | shedding, thinning, breakage, slow-growth, finer-hair |
| area | hairline, part, crown, all-over, unsure |
| onset | recent, months, year-plus, unsure |
| frequency | occasional, frequent, consistent, unsure |
| tried | supplements, topicals, routine-changes, professional-help, nothing |
| desiredOutcome | less-shedding, fullness, length, overall-care |
| priority | ingredient-clarity, simple-routine, personal-fit |

Arrays must be nonempty, unique and contain only allowed values. `nothing` cannot coexist with other `tried` answers. All single-value enums are validated before completion. Only a boolean is saved for suitability; the quiz does not ask which medical situation applies. Existing valid choices are prefilled in the same browser session. Saving must succeed before navigating to the PDP; otherwise the UI offers retry and an ingredient-exploration link.

`?preview=1` is preserved on the result URL when present. No quiz code adds a product to the cart. The custom blend PDP owns product availability, review gating and any cart behavior.

## Ingredient context

- [Amla](https://dualsnatural.com/products/amla-powder-org): fruit powder with catalog hair-care positioning.
- [Bhringaraj](https://dualsnatural.com/products/bhringaraj-powder): traditional hair-care context.
- [Hibiscus](https://dualsnatural.com/products/hibiscus-powder-org): flower powder with culinary/infusion context.

The ingredient pages do not establish that a custom blend treats hair loss. Their reported uses are not copied as efficacy guarantees. The FAQ explains this once; primary copy stays focused on the hair profile and product. Final ingredient quantities, suitability, serving directions and availability must be confirmed before a finished custom blend is offered.

## Validation

- `node --check assets/hx-blend-quiz.js` passed.
- DOM harness passed: all eight steps, empty-choice guard, concern multiselect, four generated scalp SVGs, mutually exclusive “nothing,” eight-field editable summary, exact v2 schema and sea-moss-gel base, both suitability branches, blocked-storage recovery, session clearing and preview URL preservation.
- Parent integration owns actual Shopify preview rendering and browser QA. The DOM harness is not a browser test.
