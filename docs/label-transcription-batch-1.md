# Label transcription batch 1

Inspected on 2026-09-08. Read snippets/hx-label-banana.liquid and assets/hx-label-drawer.css as markup/style guides. Every source below was opened and visually inspected with view_image, without OCR. Only the six new snippets and this document were written.

## Inspected sources and differences

| Flavor | Required sources inspected | Additional source inspected | Fruit ingredient as printed | Nutrition status |
| --- | --- | --- | --- | --- |
| Blueberry | assets/hx-label-blueberry-right.webp; assets/hx-label-blueberry-left.webp | assets/hx-label-blueberry-front.webp | Blueberry Juice | No Nutrition Facts panel visible in any inspected image; explicit unavailable notice in snippet |
| Mango | assets/hx-label-mango-right.webp; assets/hx-label-mango-left.webp | None | Mango Puree | Complete panel on right image; all 31 nutrient rows transcribed |
| Pineapple | assets/hx-label-pineapple-right.webp; assets/hx-label-pineapple-left.webp | assets/hx-label-pineapple-front.webp | Pineapple Juice | No Nutrition Facts panel visible in any inspected image; explicit unavailable notice in snippet |
| Watermelon | assets/hx-label-watermelon-right.webp; assets/hx-label-watermelon-left.webp | assets/hx-label-watermelon-front.webp | Watermelon Juice | No Nutrition Facts panel visible in any inspected image; explicit unavailable notice in snippet |
| Strawberry | assets/hx-label-strawberry-right.webp; assets/hx-label-strawberry-left.webp | assets/hx-label-strawberry-front.webp | Strawberry Juice | No Nutrition Facts panel visible in any inspected image; explicit unavailable notice in snippet |
| Peach | assets/hx-label-peach-right.webp; assets/hx-label-peach-left.webp | assets/hx-label-peach-front.webp | Peach Juice | No Nutrition Facts panel visible in any inspected image; explicit unavailable notice in snippet |

Each right image was checked independently for ingredients, declarations and storage, and each left image for eating, skin and hair directions. Shared wording was confirmed visually for each flavor, not inferred from Banana.

- Mango uses Mango Puree. The other five use their named fruit Juice, unlike Banana Puree.
- All six print the remaining ingredient wording: “100% Pure Wildcrafted Ocean Sea Moss (St Lucia) Spring Water” and “Citric Acid (100% Natural, Helps Keep It Fresh)”. The missing separator after “(St Lucia)” is retained rather than editorially adding an ingredient boundary.
- Each right image prints “KEEP IN FRIDGE AFTER OPENING” and “AFTER OPENING BEST BEFORE 30 DAYS”.
- Each right image prints No Artificial Flavors, No Artificial Preservatives, No Sugars Added, No Lactose, No Gluten and No Soy. These appear only as attributed label declarations.
- Each left image independently confirms 1–2 tablespoons daily, smoothies/shakes/teas/toast or direct consumption, skin application avoiding eyes for 15–20 minutes followed by cool-water rinsing and patting dry, and hair application after shampooing (especially ends) for 3–5 minutes followed by cool-water rinsing.
- Promotional and health claims from the artwork were omitted from structured content. Original images remain the parent's wrapper responsibility.

## Mango nutrition verification

The right image prints 16 servings per container; serving size 2 Tablespoon (28g); Calories 5. All 31 rows, in source order:

| Nutrient and printed amount | Printed % Daily Value |
| --- | --- |
| Total Fat 0g | 0% |
| Saturated Fat 0g | 0% |
| Trans Fat 0g | (blank) |
| Polyunsaturated Fat 0g | (blank) |
| Monounsaturated Fat 0g | (blank) |
| Cholesterol 0mg | 0% |
| Sodium 20mg | 1% |
| Total Carbohydrate 2g | 1% |
| Dietary Fiber 0g | 0% |
| Total Sugars 2g | (blank) |
| Includes 0g Added Sugars | 0% |
| Protein 0g | 0% |
| Vitamin D 0mcg | 0% |
| Calcium 0mg | 0% |
| Iron 2.52mg | 15% |
| Potassium 47mg | 0% |
| Vitamin A | 10% |
| Vitamin C | 0% |
| Vitamin E | 2% |
| Vitamin K | 2% |
| Thiamin | 0% |
| Riboflavin | 10% |
| Niacin | 0% |
| Vitamin B6 | 10% |
| Folate | 15% |
| Vitamin B12 | 0% |
| Phosphorus | 4% |
| Magnesium | 4% |
| Zinc | 4% |
| Copper | 2% |
| Manganese | 4% |

The four blank DVs (Trans Fat, Polyunsaturated Fat, Monounsaturated Fat and Total Sugars) are actual empty HTML cells, not zeroes. Vitamin A through Manganese have DVs but no printed amounts; no amounts were added. The nutrition footnote is retained. Mango's values happen to match the Banana guide, but were verified directly from Mango's own image.

## Missing information and ambiguities

No illegible text remains in the transcribed ingredients, storage, declarations or directions. Mango's nutrition text is readable.

Blueberry, Pineapple, Watermelon, Strawberry and Peach have no visible nutrition panel in their right, left or additionally inspected front assets. Their complete nutrition tables cannot be supplied from these sources: serving size, servings per container, calories, nutrient amounts and DVs are unavailable. Each snippet explicitly flags this absence instead of fabricating a table or borrowing data. A readable flavor-specific Nutrition Facts source is needed to complete those tables.

The front images do not resolve this gap: Blueberry, Pineapple and Peach say Net 16 Oz (454 g), Watermelon says Net 16.5 Oz, and Strawberry says Net 17 Oz. Net contents were not converted into servings or nutrition values.

## Completed files and handoff

- snippets/hx-label-blueberry.liquid — all available label content; nutrition-source gap flagged.
- snippets/hx-label-mango.liquid — full structured label including complete nutrition table.
- snippets/hx-label-pineapple.liquid — all available label content; nutrition-source gap flagged.
- snippets/hx-label-watermelon.liquid — all available label content; nutrition-source gap flagged.
- snippets/hx-label-strawberry.liquid — all available label content; nutrition-source gap flagged.
- snippets/hx-label-peach.liquid — all available label content; nutrition-source gap flagged.
- docs/label-transcription-batch-1.md — this source and transcription record.

Existing Banana CSS classes and accessible table headings are reused. Mango uses static table rows so blank DV cells stay empty. No dispatch, support list, CSS or other shared-file edits; no live push. Parent handles dispatch and rendering/integration tests.
