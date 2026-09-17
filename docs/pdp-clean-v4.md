# Purchase-first Sea Moss PDP

September 9, 2026. Local working changes, previewed using the Shopify development server. No push to the 4th iter draft or live theme.

The buy panel uses five quick flavor choices and an accessible native dialog for the complete selection. A selected flavor outside the first five replaces the fifth quick choice. Mobile places the review summary and title above a single image with dot navigation and swipe support. The normal product form remains responsible for checkout/cart submission; the sticky purchase control forwards to that form's button and mirrors its disabled state and price. The label and 360-degree dialogs remain accessible.

Review summary reads the real Judge.me product badge data. At verification the feed returned 3.95/5 from 44 reviews. No hard-coded aggregate rating or count is used. A genuine attributed Raw Original customer excerpt is the Liquid fallback if the badge is unavailable.

## Artwork

Built-in image generation was used for two art-directed photographic assets. They are generated commercial illustrations, not photographs of an actual customer or evidence of a product trial. Product reference: assets/hx-pilot-banana-front.webp. Original files are retained in the Codex generated_images directory; project copies are assets/hx-banana-still-life-v4.png and assets/hx-morning-ritual-v4.png.

Direction informed by Adobe's compositing guidance: https://www.adobe.com/learn/photoshop/web/photography-effects — consistent light, shadow, perspective and scale. Keep headlines in HTML rather than baking typography into images.

### Still-life prompt

Create a premium art-directed commercial food photograph for Healistix sea moss gel PDP. Reference image is the real product packaging: preserve its jar proportions, gold cap and label exactly; no invented text or altered logo. Square photographic composition intended as a supporting campaign image. One banana Healistix jar on a pale butter yellow matte paper tabletop, a stainless steel teaspoon carrying a modest dollop of pale cream sea moss gel in foreground, half a peeled banana with naturally imperfect skin and two irregular slices to the side. Warm cream seamless paper backdrop, direct large softbox from upper left, realistic contact shadows to lower right, crisp but not oversharpened, subtle film grain, restrained saturation. A professional Photoshop product composite / real studio still life, not glossy CGI. Camera at jar label height, 70mm lens, physical scale coherent. Product occupies middle 55% with generous breathing room. No pedestal, no floating fruit, no splashes, no leaves, no glowing edges, no decorative text or typography, no extra badges, no humans, no invented health claims. Image must feel tactile and quietly appetizing rather than AI fantasy.

### Breakfast prompt

Create a premium commercial editorial food photograph for a sea moss gel website. A real-photography / carefully Photoshopped magazine campaign aesthetic, not an illustration or CGI. Landscape 3:2. At right center, a simple clear glass of pale banana smoothie on a butter-yellow matte tabletop. A natural adult hand enters frame from upper right, holding a brushed stainless teaspoon with one small dollop of translucent pale-cream sea moss gel above the glass. Just two banana slices and a naturally freckled peeled banana beside glass, folded oatmeal linen at far right. Left third mostly calm empty pale cream wall/table for optional live webpage type, no baked-in typography. Coherent soft directional window light from upper left, real contact shadows, realistic glass refraction and faint fingerprint imperfections, tactile fruit flesh, subtle film grain, restrained saturation. 70mm commercial food lens, focus on spoon and glass, gentle depth of field. No product packaging, logos, text, leaves, splash, floating fruit, excessive props, oversaturated yellow, glowing edges or health claims. A quiet believable breakfast moment, not fantasy. Show a normal anatomically correct hand with five fingers only, most fingers naturally curled around spoon handle.

## Content

The Banana ingredient panel is based on snippets/hx-label-banana.liquid and hides for other flavors. The breakfast image is captioned as a serving suggestion. The existing reviews, FAQ and flavor-specific jar label remain available. The legacy cross-sell is omitted from the main purchase column to prioritize this purchase.

## Verification

- Checked desktop at 1440 × 900: main Add to Cart occupies y=641–695, within the first viewport. Thumbnail row corrected to horizontal.
- Checked mobile at 390 × 844 and 320 × 740: document width does not exceed viewport. Visual story verified at 390px.
- Real review badge: 3.95/5, 44 reviews. Flavor drawer selected Peach, reflected it in the five quick choices, returned focus and closed. Banana ingredient panel hid for other flavors.
- Watermelon disabled both purchase buttons. Banana re-enabled them. Quantity two updates CTA to $50.00.
- Added two Blueberry jars using the actual product form. Cart confirmed Blueberry, quantity two, $50 total. Removed test line and verified the cart returned to its original empty state.
- Gallery dot changed the image; label drawer opened with Banana content; 360-degree gallery dialog opened.
- JavaScript syntax and changed-file whitespace checks passed. Theme Check found no offenses in the edited product section, product template, gallery snippet or new story section. Its whole-workspace run also scanned staging backups and reported unrelated existing findings; it was not a clean repository-wide pass.
