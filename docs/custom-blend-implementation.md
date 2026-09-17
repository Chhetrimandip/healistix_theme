# Custom hair-care sea moss gel PDP

Route: `/pages/find-my-blend`, template `page.find-my-blend`. The optional `quiz_url` section setting supports an existing Shopify page with `?view=blend-quiz`; edit links preserve that query. Existing regular flavor PDP is untouched.

## Correct product and experience

The product concept is **sea moss gel customized with Duals herbal powders**, for adults of all genders. It is not a dry powder product or topical mask. A new illustrated custom gel jar, editable six-part hair summary, concern-specific hero, goal-specific direction, ingredient explanation and personalized history/routine copy distinguish this page from the regular flavor PDP.

The sea moss base is separate from proposed Amla and Bhringaraj additions. Hibiscus appears only as an optional tart taste direction. All three use real source-linked Duals catalog photos, clearly distinguished from the finished Healistix jar. Customer answers personalize the focus and explanation; they do not diagnose the cause, establish efficacy or generate amounts. Final recipe, preparation and label need approval.

## Hair quiz contract and privacy

Only `sessionStorage` key `hx-hair-profile-v2` is read. No persistent localStorage profile, analytics event or medical cart attributes are used.

- `version: 2`, `goal: 'hair-care'`, `base: 'sea-moss-gel'`.
- `concerns`: nonempty unique array from shedding, thinning, breakage, slow-growth, finer-hair.
- `area`: hairline, part, crown, all-over, unsure.
- `onset`: recent, months, year-plus, unsure.
- `frequency`: occasional, frequent, consistent, unsure.
- `tried`: nonempty unique array from supplements, topicals, routine-changes, professional-help, nothing. Nothing must be the sole value if present.
- `desiredOutcome`: less-shedding, fullness, length, overall-care.
- `priority`: ingredient-clarity, simple-routine, personal-fit.
- `reviewRequired`: boolean; `completedAt`: date string.

Unknown enums, stale v1 profiles, wrong product base, malformed data or unavailable storage yield the start-quiz state. Review-required profiles disable real purchase and the illustrative cart step. Clear profile removes the session key and hides the result. Browser answers are not a secure eligibility or clinical approval mechanism.

`?preview=1` uses a clearly marked illustrative v2 profile when no valid session profile exists, never writes a profile and never enables real purchasing. It follows a valid completed quiz profile when present. The optional cart illustration states that it does not create an order.

## Catalog grounding

Sources checked September 11, 2026:

- [Amla](https://dualsnatural.com/products/amla-powder-org): milled Phyllanthus emblica fruit, sour/astringent, catalog hair-care positioning.
- [Bhringaraj](https://dualsnatural.com/products/bhringaraj-powder): Eclipta alba, traditional hair-care context. Retailer regrowth claims are not treated as demonstrated Healistix effects.
- [Hibiscus](https://dualsnatural.com/products/hibiscus-powder-org): tart flower powder, culinary/infusion context; no hair efficacy asserted.

Source pregnancy/nursing restrictions are explained in the FAQ. No dose, vitamin amount, cure, testimonial or performance statistic is invented.

## Approved product purchase

Default `enable_purchase` is false. No fabricated price, SKU or variant is used. Configure an approved finished sea moss gel product, formula ID/version, correct product label summary and `approved_format: sea-moss-gel`, then explicitly enable purchase after product and suitability controls are ready.

The same-origin product `.js` endpoint verifies the exact configured variant, availability and live price. These are checked again before cart add. A changed price is shown and requires a fresh click. A successful add uses the existing localized Shopify cart and checkout.

Cart properties include only fixed approved formula ID/version, sea moss gel format and non-sensitive source/schema version. No concerns, location, history, tried products, desired outcome or suitability answer are passed. This is one configured approved finished SKU, not arbitrary personalized manufacture. Real made-to-order fulfillment still needs a reviewed recipe mapping, server-side validation and traceability.

## Validation

JavaScript syntax, section schema and template JSON checked. State harness covers v2 schema validity, session-storage failure, stale schema rejection, personalized output, preserved preview/edit query, review-required state, variant availability, price changes, purchase error recovery, successful cart handoff without private answers and clear-profile behavior. Root provides browser QA and unpublished Shopify preview integration.
