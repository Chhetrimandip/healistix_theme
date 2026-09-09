# Healistix production readiness audit

Audited September 8, 2026. **Recommendation: do not launch the current build unchanged.** The preview has a functioning purchase path, but incomplete product information, broken primary navigation, missing policies and inconsistent public content undermine confidence in ordering.

## What was checked

- 83 HTTP page requests across the local development preview and public storefront, covering all three products, homepage, collection, search, contact, cart, policies, linked navigation destinations and every quiz product destination. Public results: 12 successful routes and 29 missing routes in this deliberately expanded set. These are not 29 broken homepage links; the set also includes quiz targets and anticipated About/provenance routes.
- Browser checks of seven preview routes at 390px and 1440px; every one of the 23 Sea Moss flavor selections; label drawer samples; actual add-to-cart buttons; mobile cart quantity updates/removal; navigation into Shopify checkout.
- Current template settings, active sections, navigation snippets, product data, label transcription records, review integration notes and theme list.
- Saved evidence: `staging/launch-audit-20260908/` (page HTML, page/link results, current public catalog, browser results and screenshots). Audit scripts are in `scripts/audit-storefront*.py` and `scripts/audit-storefront*.cjs`.
- No storefront code, product data, prices, stock, policies, publication settings or live theme changed. Browser carts were isolated from the user's session. No customer/contact form submitted and no order placed.

## Which site is being launched matters

The public **Healistix** theme is `156971106442`. Local preview uses development theme `158055432330`. **3rd iter**, `158133911690`, remains a separate unpublished theme; its current contents were not pulled in this audit.

The public homepage still has the older Trinity campaign, fabricated-looking proof blocks requiring verification, $19.99 copy and broken product artwork URLs. The preview has the newer fruit campaign and flavor gallery. Live Batana retains the older long sales page; preview Batana uses the newer short page. Shilajit has the short page on both. A successful preview is not evidence that the public site is ready. Freeze the intended release files, preview that exact release, and then publish that theme deliberately.

## Launch blockers and required repairs

| ID | Finding and evidence | Required action |
|---|---|---|
| L01 | **Every Shop category fails to merchandise the actual catalog.** `/collections/sea-moss`, `/collections/batana`, `/collections/super-tonics`, `/collections/super-bitters`, `/collections/beef-tallow` return 404. `/collections/shilajit` returns 200 but contains **0 products**, although Shilajit itself is purchasable. Desktop and mobile use hardcoded links in `snippets/header-dropdown-menu.liquid` and `snippets/header-drawer.liquid`. | Link Sea Moss, Batana and Shilajit to their existing product pages or populate real collections. Remove unavailable category links until stocked. Move both navigation layouts onto the same configured menu. |
| L02 | **Shipping, refund, privacy and terms routes all return 404**, on preview and public site. Footer links to the first two; signup links to the missing privacy page. Shipping copy asks people to consult a policy that does not exist. | Merchant supplies actual terms; create Shopify policies, connect PDP summaries and retest every link. Do not solve this only by hiding the links. |
| L03 | **Quiz is disconnected from commerce.** All 12 hardcoded product targets return 404 publicly. Prices are hardcoded at $19.99/$21.99 rather than current $25 Sea Moss pricing. Its submit handler prevents submission, stores email only in a JS variable and fires an analytics event; no subscriber is saved and no results email sent. It displays `SEAMOSS20`, “valid 30 days,” free shipping, a 4.8/120+ rating and an herbalist recommendation without verification found here. `/pages/quiz` and `/pages/findmyseamoss` both render it. | For launch, replace with a simple flavor chooser using actual variant URLs and available stock, or remove the quiz from the customer journey. Rebuilding it requires real email capture, real offer terms, source-backed recommendations and no invented reviews. Updating links alone is insufficient. |
| L04 | **Public Sea Moss copy contradicts the catalog and labels.** Product heading says “Sebi Trinity”; copy claims every jar contains bladderwrack and burdock, no flavorings, and a four-ingredient formulation. Transcribed flavor labels instead list sea moss, spring water, flavor ingredients and citric acid. The public price is $25 while secondary CTA/FAQ copy says $19.99. It advertises bundles/subscriptions without corresponding purchase choices demonstrated. | Replace with the actual Sea Moss product identity and approved flavor-specific ingredients. Derive prices from Shopify. Publish only purchasing options that are implemented. Do not carry over the Trinity copy into the release. |
| L05 | **Literal placeholders are publicly exposed.** Batana includes “Add your customer review,” “Add a real customer story here” and “Replace these placeholder percentages with your own survey or trial data before publishing.” Sea Moss contains “Add spoon photo.” The public homepage has four `Liquid error (sections/hx-bestsellers line 25): invalid url input` image URLs. | Remove unfinished modules or populate with authentic material. Fix actual image sources. Never convert placeholder names, numbers or stories into polished but unsubstantiated claims. |
| L06 | **Product essentials are absent or displaced.** Sea Moss's Shopify description is empty. Batana and Shilajit descriptions merely tell users to read a label. Their custom PDP does not render `product.description` at all; it uses theme settings, so editing Shopify descriptions alone will not fix those pages. | Establish one approved product fact source and wire it into the actual rendered PDP and metadata. Expose ingredients, pack size, directions and storage beside the buying decision. |
| L07 | **Store identity is unfinished.** Footer shows “My Store”; browser checkout title is “Checkout - My Store.” Contact page is only a form. The existing contact-information policy contains `admin@acebranded.com`, while PDP copy uses `hi@healistix.com`. The pages refer to a physical store without telling customers where it is. | Confirm display/legal business names, monitored support address, store address/hours if applicable, and response target. Correct Shopify store settings and contact policy, not merely the footer text. |
| L08 | **Promotions and guarantees are inconsistent/unverified.** Preview popup advertises 30% and displays `HEALISTIX30`; quiz advertises 20% and `SEAMOSS20`. Announcement claims free shipping over $30. Public homepage promises 30 days; public Batana promises 60 days. No accessible refund/shipping policy backs these up. | Decide actual offer eligibility, exclusions, expiry, stacking, guarantee and shipping threshold. Verify the configured discounts and checkout behavior before promoting them. This audit has not proved either code valid or invalid. |
| L09 | **Mobile decoration interferes with reading.** The Batana screenshot shows blueberries overlapping its title and a strawberry behind support/details copy. Sea Moss title also overlaps fruit. `layout/theme.liquid` includes the global fruit section. This occurs even though horizontal-overflow checks pass. | Keep fruit outside reading and purchase areas, or remove it from PDP copy regions. Use product-appropriate visuals for Batana/Shilajit. Retest content overlap at small widths. |

## Important issues to finish before release

| ID | Finding | Action |
|---|---|---|
| F01 | Preview secondary **ADD TO CART** after the five step cards is an anchor to `#`; it does not add anything. Confirmed at both browser widths. | Make it a genuine add-to-cart action respecting flavor and quantity, or name it “Choose your flavor” and target the real selector. `sections/product-steps.liquid` and `templates/product.seamoss.json`. |
| F02 | Only **8/23 Sea Moss variants** are purchasable: Banana, Blueberry, Mango, Rose, Peach, Orange, Unflavored, Strawberry. The other 15 are sold out. Homepage prominently features sold-out Pineapple and Watermelon; picker cards do not identify sold-out flavors before selection. | Confirm real inventory. Prioritize in-stock flavors and show availability directly on cards. Do not enable stock or backorders just to make the storefront appear complete. |
| F03 | **Rose and Orange are purchasable but have no gallery photos or verified label details.** Beet Root, Red Guava, Guava Lemon and Lychee also have no verified label panel in the drawer. The drawer opens for all variants but six contain an unavailable-information notice. | Finish assets/information for the actual launch range. A visible label button is not evidence that the label is present. |
| F04 | **17 flavors have transcribed ingredients/directions/storage**, but full nutrition tables are available only for Banana and Mango. Other supplied panels lack nutrition information. Strawberry front says 17 oz while legacy sides say 16 oz; Watermelon front says 16.5 oz. Beet Root's withheld right panel says Pineapple Puree. Some skin instructions are cropped. Honey label includes honey alongside a no-added-sugar declaration. | Obtain current approved labels for unresolved flavors. Do not generalize nutrition, net contents, vegan or sugar claims across flavors. Keep skin claims/directions out of summaries until approved. |
| F05 | `/pages/my-health`, `/pages/faq`, `/pages/about`, `/pages/about-us`, `/pages/provenance` return 404. My Health and FAQ are directly linked. The local About template contains a detailed family timeline and lab-report claims, but a template alone does not create a Shopify page. | Repair linked routes. Publish an actual, verified About page if it belongs in launch. Replace provenance promises with linked reports only when reports exist. |
| F06 | Large proof claims remain in older/public content: 460+ five-star reviews, press logos, Batana's 200,000+ customers/8,000+ oils sold and survey percentages. The preview's three Amazon excerpts are explicitly selected Raw Original reviews; they are not an aggregate for every flavor. | Maintain a claim/source register. Remove unsupported numbers and endorsements. Existing review notes say Appio's import remained pending; this audit did not recheck the app dashboard or prove automatic sync. |
| F07 | Preview homepage and Sea Moss PDP have no meta description. Batana/Shilajit metadata repeats the label-placeholder text. None of the three custom preview PDPs emits Product JSON-LD in the checked rendered DOM. | Write accurate summaries and add Shopify-derived Product structured data, including real offers/availability. Check canonical URLs and preview the final release in search/social sharing tools. No invented rating markup. |
| F08 | Homepage wellness cards omit prices; repeated “Explore,” “Meet,” and “ritual” phrases add little product information. | Show actual starting/current price, category, concise product purpose, pack size when confirmed and an unmistakable shopping CTA. |

## Why it feels like a portfolio

The pages devote a disproportionate amount of space to interacting with the design. The Sea Moss page teaches users to choose a jar, inspect photos, rotate it and open its label, then repeats those instructions in the flavor section and FAQ. Those sections demonstrate the interface instead of helping someone decide whether to buy.

The preview removes many dubious claims, which is progress, but replaces them with vague copy rather than factual product education. “A ritual, all your own” and “a little care, a little quiet” could describe almost anything. A buyer still cannot quickly determine what they receive, how it tastes/feels, how long it lasts, or what happens if it arrives in poor condition.

Keep the visual personality. Reallocate the lower page to product facts, preparation, flavor comparisons, delivery and customer support. Extra length alone will not fix the problem.

## Concrete product content brief

| Placement | Sea Moss | Batana | Shilajit |
|---|---|---|---|
| Beside price | Selected flavor, confirmed jar size, factual one-sentence description, stock state | Exact oil format, net contents, intended cosmetic use, stock | Exact product format, net contents, approved intended use, stock |
| What is inside | Ingredients for selected flavor; allergen information; current nutrition | Complete ingredient/INCI list, fragrance/additives if applicable | Full ingredient list and relevant current label information |
| How it fits a routine | Label directions, preparation examples, honest taste/texture notes | Approved amount, application, frequency, rinse/leave-in instructions | Approved serving/dose, preparation, frequency and label cautions |
| Storage and duration | Before/after opening storage; shelf life; date labels; actual cold-shipping instructions | Storage, shelf life, expected texture changes if confirmed | Storage, shelf life and handling instructions |
| Proof | Traceable source, actual tests, authentic flavor-attributed reviews | Actual origin/process and genuine customer evidence | Actual origin/process and batch/quality evidence |
| Order reassurance | Shipping summary, policy links, damaged/spoiled-arrival process | Shipping, returns, support | Shipping, returns, support |

Suggested page sequence: product + purchasing facts → what is inside → how to use/store → compare flavors or explain product characteristics → authentic reviews → shipping/returns FAQ → relevant other products.

**Usable material already present:** the Banana transcription names sea moss, spring water, Banana Puree and citric acid; its printed food directions specify 1–2 tablespoons daily and smoothies, shakes, teas or toast; its storage wording says refrigerate after opening and best before 30 days after opening. These can become concise, flavor-specific buying details with attribution. They do not establish unopened shelf life, shipping temperature, every flavor's directions, or independent nutritional efficacy. Do not invent those missing facts.

**Example structural rewrite:** replace the five “get to know your jar” cards with “What's in your selected flavor,” “How to enjoy it,” and “Keeping your jar fresh,” populated by that flavor's verified data. Replace “Select Blueberry to explore its jar images” with approved Blueberry ingredients and a real taste/texture note. For Batana and Shilajit, wait for the actual specification before writing persuasive product promises.

## Information needed from the merchant

1. **Current product specifications:** complete approved labels/specs for all launch flavors, Batana and Shilajit; exact pack sizes, usage, storage, shelf life, ingredient/allergen details and any label cautions. Existing local assets cover much of Sea Moss but not the gaps above.
2. **Shipping/returns:** regions served, processing/delivery estimates, threshold/costs, transit packaging and handling of warm, damaged or spoiled Sea Moss; return eligibility and actual guarantee length. Confirm whether the label's storage wording reflects present shipping practice.
3. **Claims and identity:** factual founding story, family history, origin/manufacturing, batch size, downloadable test reports, press mentions, review evidence, business/store name, support contacts and physical location.
4. **Launch assortment:** confirm the eight currently purchasable flavors versus all 23 listed, and whether Rose/Orange should be in the release before assets are supplied. Existing documentation says Batana/Shilajit inventory tracking was disabled under earlier authorization; public availability does not establish quantities.
5. **Offers:** choose 30% welcome vs 20% quiz or define both accurately; provide eligibility and guarantee terms. Confirm Shopify discounts are configured and tested.

Three questions covering the first three groups were sent during the audit. No answers had arrived when this report was written.

## What passed, and what has not been proved

- All three native product routes load in the preview. Every flavor click updated the selected label, variant ID, price and sold-out state in the browser. Rose/Orange correctly show a missing-photo state rather than another flavor's jar.
- Banana label drawer opens with real content; Orange and Beet Root open explicit missing-label notices. Escape closes the drawer.
- Actual UI buttons added **2 Banana jars + 1 Batana + 1 Shilajit**, producing **4 items / $114.99**. Checkout navigation succeeded. Mobile cart quantity changed to three, then item removal produced an empty cart.
- The seven sampled routes had no horizontal overflow at 390px/1440px and no completed, broken visible main-content images detected at sampling time. This is not a full lazy-image, performance or accessibility certification. Mobile content overlap remains a separate confirmed issue.
- The follow-up browser run reported no JS page errors. The first run's storage errors came from the audit's popup-suppression init script executing inside sandboxed frames; they are not reported as storefront defects. That harness now catches restricted storage access.
- Payment authorization, taxes, destination-dependent shipping, discount redemption, confirmation/fulfillment emails, contact delivery, newsletter delivery/double opt-in, account login, real-device Safari and complete accessibility/performance testing remain unverified. No “production-ready” claim is made for them.
- Full-page screenshots can show unrevealed footer animation areas before scrolling. Footer was subsequently scrolled into view and its real content verified; no blank-footer bug is inferred from that artifact.

## Release order

1. Fix navigation and remove/rebuild the broken quiz; remove literal placeholders, wrong product identities, broken images and unsupported proof from the intended release.
2. Fill the approved product facts and publish policies/contact information. Repair mobile reading overlap and secondary purchase action.
3. Confirm assortment, stock, discounts and support operations; add metadata/structured data and complete genuine review attribution.
4. Run the exact release through mobile/desktop cart and checkout, destination/rate/discount cases, customer communications and an authorized test order/refund process. Then publish the chosen theme and repeat a public-store smoke check.

Do not use a whole-theme push as a substitute for resolving the missing business facts or testing the release.
