# Label transcription — batch 2

## Scope and method

Read `snippets/hx-label-banana.liquid` and `assets/hx-label-drawer.css` for structure and existing classes only. Inspected every source below visually with `view_image`; no OCR or cross-flavor inference was used. Checked each front image as an additional search for a nutrition panel. Only the five new snippets and this document were edited. Dispatch, CSS, support list, original-image wrapper and integration testing belong to the parent. No live push.

## Inspected sources and flavor differences

All paths below are relative to `assets/`.

| Flavor | Right source | Left source | Additional front source | Fruit wording in ingredients |
| --- | --- | --- | --- | --- |
| Passion Fruit | hx-label-passion-fruit-right.webp | hx-label-passion-fruit-left.webp | hx-label-passion-fruit-front.webp | Passion Fruit Juice |
| Pineapple Mango | hx-label-pineapple-mango-right.webp | hx-label-pineapple-mango-left.webp | hx-label-pineapple-mango-front.webp | Pineapple & Mango Puree |
| Dragonfruit | hx-label-dragonfruit-right.webp | hx-label-dragonfruit-left.webp | hx-label-dragonfruit-front.webp | Dragonfruit Juice |
| Strawberry Pineapple | hx-label-strawberry-pineapple-right.webp | hx-label-strawberry-pineapple-left.webp | hx-label-strawberry-pineapple-front.webp | Fresh Pineapples, Strawberry |
| Grape | hx-label-grape-right.webp | hx-label-grape-left.webp | hx-label-grape-front.webp | Grape Puree |

Each right image independently shows the base wording “100% Pure Wildcrafted Ocean Sea Moss (St Lucia) Spring Water,” followed by the flavor-specific fruit wording above and “Citric Acid (100% Natural, Helps Keep It Fresh)”. The missing separator after “(St Lucia)” is retained as printed. Pineapple Mango's front says “MANGO PINEAPPLE”; its requested handle and display name remain Pineapple Mango.

Each right image independently shows “KEEP IN FRIDGE AFTER OPENING” and “AFTER OPENING BEST BEFORE 30 DAYS”, along with these six declarations: No Artificial Flavors; No Artificial Preservatives; No Sugars Added; No Lactose; No Gluten; No Soy. Declarations are explicitly presented as label wording. Promotional and health claims were omitted.

Food directions were independently readable on all five left images: incorporate 1–2 tablespoons daily; add to smoothies, shakes, teas, or spread on toast; consume directly if desired. Hair directions were independently readable on all five: after shampooing, apply to hair, especially ends; leave for 3–5 minutes; rinse with cool water. Typographic range dashes and capitalization were normalized.

## Missing information and ambiguities

- **All five: nutrition panel absent from the inspected sources.** Right images show ingredients/storage/declarations; left images show directions; front images show product identity and net weight. No serving size, serving count, calories, nutrient amounts, DVs or blank-DV rows are visible. A full nutrition table cannot be transcribed truthfully. Each snippet includes a visible nutrition-source notice instead of invented rows or Banana values. Net weight and tablespoon directions were not used to calculate nutrition servings. Full nutrition transcription remains pending a flavor-specific source.
- **Passion Fruit: skin directions cropped at the right image edge.** Visible fragments end at “Apply Sea”, “avoiding eyes”, and “rinse with coo”. Missing text/punctuation is marked inline with `[image cropped]`; no completion was borrowed from another flavor.
- **Pineapple Mango: skin directions cropped at the right image edge.** Visible fragments end at “Apply”, “avoiding e”, and “rinse with c”. Missing text is marked inline with `[image cropped]`; no completion was borrowed from another flavor.
- **Dragonfruit, Strawberry Pineapple, Grape:** complete skin directions independently visible: cleanse face with a mild cleanser; apply Sea Moss Gel avoiding eyes; leave 15–20 minutes; rinse with cool water and pat dry.
- No unclear ingredient or storage values were found. No assertion is made that the actual jar lacks a nutrition panel; the limitation applies to these source images.

## Completed files

- `snippets/hx-label-passion-fruit.liquid` — Passion Fruit: structured ingredients, storage, label declarations, readable directions and explicit missing-source notices completed.
- `snippets/hx-label-pineapple-mango.liquid` — Pineapple Mango: structured ingredients, storage, label declarations, readable directions and explicit missing-source notices completed.
- `snippets/hx-label-dragonfruit.liquid` — Dragonfruit: structured ingredients, storage, label declarations, readable directions and explicit missing-source notices completed.
- `snippets/hx-label-strawberry-pineapple.liquid` — Strawberry Pineapple: structured ingredients, storage, label declarations, readable directions and explicit missing-source notices completed.
- `snippets/hx-label-grape.liquid` — Grape: structured ingredients, storage, label declarations, readable directions and explicit missing-source notices completed.
- `docs/label-transcription-batch-2.md` — source inventory, differences and ambiguities.

All five snippets reuse Banana's existing card, storage, nutrition, extra-details, caption and notice classes. Full nutrition tables remain source-blocked for all five; skin transcription remains incomplete for Passion Fruit and Pineapple Mango as flagged above.
