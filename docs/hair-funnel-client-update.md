# Healistix custom powder funnel — client update

The first connected custom-blend experience is ready for review: a hair-care campaign landing page, a four-question quiz with editable answers, and a new Find My Blend page that looks and works differently from the standard product page. It follows the existing Healistix typography, cream/green palette and styling.

The ingredient story draws on Duals Natural's actual powder catalog, with Amla, Bhringaraj and Hibiscus photos and product context. A separate research note records seven powders, their listed uses, and which claims cannot be carried over to a Healistix blend without evidence.

## What to show

Open `index.html` from the client preview folder. Follow Find my blend, answer the four questions, review your answers, and open the blend page. Your routine, format and taste preference carry across. For a dry-powder example that does not request a suitability review, the client-only cart button continues to illustrative cart, checkout and confirmation pages. These screens collect no payment or contact information.

The standalone preview renders the new Liquid sections and their actual CSS/JavaScript, with a simplified preview header. It embeds images/fonts and can be shared as a ZIP. It is not a screenshot of a deployed Shopify page. The live theme has not been published or changed remotely.

## What is complete

- Three new theme sections/templates for the landing page, quiz and personalized blend page.
- Quiz state, required answers, back navigation, edit/review and storage error handling.
- Powder catalog context, actual source product imagery and a clearly labeled proposed Healistix pouch design.
- Separate missing-profile, review-needed and format-confirmation experiences.
- A conditional integration for one approved finished Shopify product: verified variant and price, availability checks, price-change handling, formula ID/version attached to cart, then the existing Shopify cart.
- A client walkthrough of the proposed buying journey through confirmation.

## What remains before live orders

1. Agree on the actual product format, intended use, allowed ingredients/formulas, labels, preparation, suitability process, claims, prices and lead time.
2. Configure approved product(s) and map reviewed formula versions to production. The current integration selects one configured approved SKU; it does not formulate a bespoke recipe from quiz answers.
3. For true made-to-order blends, implement server-side recipe validation, reliable formula/order persistence and fulfillment/reorder traceability. Browser preferences and cart properties are not an authorization or manufacturing system.
4. Create the Shopify pages and assign `page.hair-routine`, `page.blend-quiz`, and `page.find-my-blend`. Review navigation and launch copy, then test the approved product through real Shopify checkout and order fulfillment in an appropriate test flow.

The accurate milestone is **an implemented funnel experience and end-to-end client demonstration**. A production-ready custom-blend buying process has not yet been completed.

## Suggested message to Shamim

“I've built the first connected custom-blend experience in the Healistix style: hair-care landing page → quiz → a new personalized blend page. The product page uses your existing Duals powder range as ingredient context, and I’ve included a walkthrough through cart and checkout so we can review the full customer journey. The next decision is the actual blend offering—format, approved formulas, pricing and production process—before we enable live ordering.”

## Verification

New section Liquid rendered; section schema and template JSON parsed; JavaScript syntax checked. Agents checked quiz and product states with DOM/fetch harnesses, including blocked storage, required answers, review flags, unavailable products and price changes. Browser verification followed landing → all quiz questions → personalized result → simulated cart → checkout → confirmation. Landing, quiz and result inspected at mobile width 390px; no horizontal overflow or broken result/landing images. This is not a completed live Shopify checkout test or a full theme lint audit.
