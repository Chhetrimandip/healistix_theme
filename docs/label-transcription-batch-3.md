# Label transcription batch 3

## Scope and method

Inspected every image below directly with view_image on 2026-09-08. No OCR or another flavor's label supplied transcription values. Read snippets/hx-label-banana.liquid and assets/hx-label-drawer.css for markup and CSS conventions only. New snippets reuse their content/card/storage/nutrition/extra/caption/notice classes.

Only the five new snippet files and this document were authored. Dispatch, CSS, support lists, original-image wrapper, and live deployment are outside this batch.

## Inspected sources

| Flavor | Ingredients and storage | Directions | Additional nutrition check |
| --- | --- | --- | --- |
| Unflavored | assets/hx-label-unflavored-right.webp | assets/hx-label-unflavored-left.webp | assets/hx-label-unflavored-front.webp |
| Maca Ashwagandha | assets/hx-label-maca-ashwagandha-right.webp | assets/hx-label-maca-ashwagandha-left.webp | assets/hx-label-maca-ashwagandha-front.webp |
| Ashwagandha Mango | assets/hx-label-ashwagandha-mango-right.webp | assets/hx-label-ashwagandha-mango-left.webp | assets/hx-label-ashwagandha-mango-front.webp |
| Elderberry Ginger | assets/hx-label-elderberry-ginger-right.webp | assets/hx-label-elderberry-ginger-left.webp | assets/hx-label-elderberry-ginger-front.webp |
| Honey | assets/hx-label-honey-right.webp | assets/hx-label-honey-left.webp | assets/hx-label-honey-front.webp |

## Missing nutrition source — all five flavors

None of the fifteen inspected images shows a Nutrition Facts panel. Right images show ingredients, free-from wording, marketing text and storage; left images show directions; front images show branding/flavor and net weight. Consequently a full nutrition table cannot be transcribed for any assigned flavor from these assets. Each snippet explicitly flags the missing information in its nutrition card.

Serving size, servings per container, calories, nutrient amounts, row inventory and Daily Values are all unverified. No values, zeroes, blank DVs, or Banana rows were inserted. A missing panel is not a printed blank DV. The front net weight (16 Oz / 454 g) was not converted into servings. Full nutrition remains pending flavor-specific nutrition-panel sources.

## Flavor differences and ambiguities

- Unflavored: front identifies the flavor as RAW. Ingredients contain sea moss, spring water and citric acid, with no flavor addition.
- Maca Ashwagandha: ingredients specify Maca Yellow Root Powder and Ashwagandha Powder. The left image crops the right edge of the skin instructions after visible “Apply Sea”, “avoiding eyes”, and “rinse with coo”. The snippet marks each continuation as [... cropped] rather than completing it from another label. The visible skin interval is 15–20 minutes; eating and hair instructions are complete.
- Ashwagandha Mango: the ingredient image visibly spells the ingredient “Ashwaghnda Powder & Mango Puree”; this source spelling is preserved and called out in the snippet. The front flavor spelling also differs from the requested display name; the snippet uses the assigned display name. Skin, hair and eating directions are fully visible.
- Elderberry Ginger: ingredients specify Fresh Elderberries and Ginger Root. Skin, hair and eating directions are fully visible.
- Honey: ingredients specify Wild Raw Honey. Its right image also says “No Sugars Added”; that declaration has not been promoted into structured content, and cannot establish a nutrition-table added-sugar amount or DV. Skin, hair and eating directions are fully visible.
- On each individual right image, storage reads KEEP IN FRIDGE AFTER OPENING and AFTER OPENING BEST BEFORE 30 DAYS. Sentence case and punctuation are normalized in HTML.
- Each individual left image confirms the same eating directions (1–2 tablespoons daily, smoothies/shakes/teas/toast or directly) and hair directions (after shampooing, especially ends, 3–5 minutes, cool water). This agreement was visually checked per flavor, not assumed from Banana.
- Health/benefit marketing claims and optional free-from declarations are omitted from the structured snippets. Original images remain the parent's wrapper responsibility.
- Ingredients are transcribed as wording printed, preserving the lack of a separator between sea moss origin and spring water. Line wrapping is normalized. No other ingredient values are unclear.

## Completed files

- snippets/hx-label-unflavored.liquid
- snippets/hx-label-maca-ashwagandha.liquid
- snippets/hx-label-ashwagandha-mango.liquid
- snippets/hx-label-elderberry-ginger.liquid
- snippets/hx-label-honey.liquid
- docs/label-transcription-batch-3.md

All five snippets complete the readable, source-supported ingredients, storage and directions, with explicit source-gap notices. Full nutrition transcription is not complete because the supplied images contain no nutrition panels. Parent handles dispatch and integration testing; no live push performed.
