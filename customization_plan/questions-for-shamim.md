# Custom sea moss builder: questions for Shamim

Recorded: September 13, 2026, during the handoff walkthrough.

## 1. Conflicting Standard herb quantities

Status: Open — ask Shamim.

Sources: `Healistix-Custom-Sea-Moss-Gel-Build-Handoff.pdf`, section 3.5 (page 5), Appendix A (page 9), and Appendix B1 (page 10); accompanying `herbs_seed.csv` and `uses_seed.csv`.

- Section 3.5 requires each Standard herb quantity to equal that herb's `default_g`.
- The herb library sets ashwagandha's `default_g` to **8 g per 16 oz jar**.
- The men's vitality default pairing specifies ashwagandha at **5 g per jar**.
- Consequently, that default pairing conflicts with the stated validation rule, even though it comes from the handoff itself.

Question for Shamim: **Should Standard quantities always use the herb library's `default_g`, or can approved goal-specific pairings override it? For men's vitality, should ashwagandha be 8 g or 5 g per jar?**

After the decision, reconcile the pairing tables, herb data, and validation specification. If recipe-specific quantities are allowed, define their explicit representation and how Strong is calculated from them. Do not bypass validation for fallback pairings. Quantities still need reconciliation with the production sheet before launch, as required by the handoff.

No quantity decision or implementation change has been made.

### Expanded audit from backend implementation

The same issue appears in these source rows; amounts below are grams per jar, not per serving:

| Goal / pairing | Herb | Pairing amount | Library default |
| --- | --- | ---: | ---: |
| Men's vitality | Ashwagandha | 5 | 8 |
| Joints | Ginger | 5 | 6 |
| Respiratory | Ginger | 5 | 6 |
| Women's balance | Hibiscus | 4 | 5 |
| Recovery | Turmeric | 5 | 6 |
| Mood | Holy basil | 4 | 5 |
| Energy, no-stimulant alternative | Maca | 10 | 8 |
| Energy, no-stimulant alternative | Beet root | 8 | 6 |

The backend audit found 52 herbs, 16 goals, and no herb-field differences between the supplied PDF seed and CSV. The conflicts are between pairing rules and herb defaults. Neither source alone resolves them.

## 2. Reorder screening

Status: Open — clarify before enabling reorders.

The handoff saves the recipe but discards screening answers and promises a one-tap reorder. Should customers repeat suitability screening before each reorder, including subscription renewals, and how should changes be handled? A saved recipe does not establish current suitability.

## 3. Launch inputs to collect

Confirm the handoff's formula amounts, supplier approval/COA records, production and label inputs, shelf-life test or sachet decision, prices and capacity. The provided seed package does not contain supplier approval evidence; this does not establish that the business lacks it.

## 4. Guest quiz and account-linked blend retrieval

Status: Open — customer experience clarification; storage destination is already specified.

Sections 2.10, 5.3 and 7 specify storing the blend on the Shopify customer record and mirroring permitted outcome fields to Klaviyo. They do not specify when login is required, how a guest's blend becomes linked to their customer record, or how cross-device retrieval is authenticated.

Question: I see the handoff specifies saving blends to the Shopify customer record and mirroring them to Klaviyo. Should people complete the quiz as guests and link their blend at checkout, or sign in before saving it? Should accessing a saved blend on another device require login?

Implementation note: a build ID identifies a recipe; possession of that ID must not authorize access to another customer's profile. The current demo has transient in-memory answers and no account persistence.
