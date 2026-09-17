# Seed and policy audit — September 13, 2026

All seed quantities, prices, approvals, flavor levels and guardrails are provisional.
The original brief, seed PDFs and CSVs are preserved. The seed-data PDF contains
physically clipped long JSON prose lines; it is not a valid complete JSON file.
Import uses complete CSV prose and the intact PDF tail for flags/routes/flavors.
All 52 embedded PDF herb objects match CSV text; their quantities were read against
Appendix B. The importer also validates unique IDs, flags, dose bounds and use links.

## Quantity conflicts

| Pairing | Herb | Pairing Standard g | Herb default g |
|---|---|---:|---:|
| Men's vitality | ashwagandha | 5 | 8 |
| Joints | ginger | 5 | 6 |
| Respiratory | ginger | 5 | 6 |
| Women's balance | hibiscus | 4 | 5 |
| Recovery | turmeric | 5 | 6 |
| Mood | holy-basil | 4 | 5 |
| Energy no-stim | maca | 10 | 8 |
| Energy no-stim | beet-root | 8 | 6 |

Fallback returns `PAIRING_CONFLICT` when an included default conflicts. It does not
silently rewrite these amounts or exempt fallback from validation. Direct edits
are evaluated against the herb library amounts under section 3.5. This permits
reviewing a valid library-dose jar, not approval of a disputed default pairing.

## Other open decisions and explicit preview handling

- `allowed` and supplier COA evidence are absent for every herb. All 52 imported
  entries are provisional with unverified COAs. Preview-only candidates are a
  demonstration exception, never a claim they are production-approved. Shilajit is
  excluded outright because of the specific COA-before-listing note.
- MEDTIMING is informational in Appendix D despite the generic intersect-all-flags
  formula. It does not exclude slippery elm or marshmallow root; selected ingredients
  receive the fixed timing notice. No customer medical answer is needed for this note.
- Under-18 routing conflicts: section 2.5 says Foundation; Appendix E references an
  adult-only regular line. Preview stops without a Foundation link. Pregnancy/nursing
  returns Foundation, with no URL until an appropriate destination is configured.
- Allergy free text is not a reliable full ingredient/allergen matcher. Recognized
  listed ingredient or seaweed/iodine matches stop the flow; unknown nonempty allergy
  text returns unavailable, including with pregnancy. Hard stops outrank incomplete
  screening. A Foundation destination must never imply universal suitability.
- Kidney checkbox only excludes KIDNEY herbs, while explicit kidney-disease text
  declines the boost. SSRI and reflux checkboxes similarly differ from text routing
  restrictions. The preview preserves these distinctions and needs policy reconciliation.
- Text routing to stress says "mild herbs only", but no mild set is provided. This
  route returns unavailable. Text digestive routing uses only its explicit gentle
  set; both mucilage herbs together exceed the 8g cap and are never returned together.
- Seizures is required in the UI checklist because Appendix D/herbs include SEIZURE,
  although section 4 omits it. Unknown or incomplete answers never mean eligible.
- "Greens or digestion" and similar routes are represented as up to two goals in
  source order. This is a preview interpretation, not a finalized clinical policy.
  The 200-character keyword matcher is intentionally finite, not a diagnostic or
  complete language-understanding system. Negation and ambiguous abbreviations can
  over-route; an approved 40-example golden set from Ryan is still needed.
- Horsetail Strong computes 4.5g but its note says not above 3g for long-term daily
  use. Strong preview excludes it rather than claiming that regimen is approved.
- "Strong-bitter" has no machine-readable definition. The preview config marks
  tongkat-ali and rhodiola using their strong/astringent descriptions. Confirm the
  full classification; it is not used to establish medical suitability.
- Flavor families are UI organization only; a concrete flavor ID is required and
  authoritative. Extra level is provisional; no purée grams or pH facts invented.
- US country screening does not establish contiguous-state shipping eligibility.
  No checkout, address, capacity or ship-by promise is available.
- Supplied on-site/approved phrases are treated as the seed copy library, not a
  new regulatory approval. The safety notices necessarily mention medications and
  iodine; the benefit-copy banned-word filter is applied to recipe prose, not labels
  used to ask screening questions or non-customer audit fields.
- Raw model output logging in section 7.3 conflicts with the privacy constraint:
  this implementation stores and logs none of it. Model output is untrusted and
  never rendered verbatim; explanations are stitched from supplied phrases.

## Recipe identity

The v1 build ID follows the brief: base32(SHA256(canonical build)) first 8 symbols,
prefixed B-. Canonical JSON sorts keys, herb IDs and use IDs, normalizes numbers,
and excludes build_id, engine_version and library_version. Eight symbols provide
only 40 bits: collisions must be detected using the full digest in trusted storage.

The brief's "same jar, same ID" conflicts with retaining `uses` in that JSON: an
identical formulation with different goals gets a different ID. The preview retains
uses for literal contract compatibility. Decide whether future identity is a
formulation-only ID and separate presentation record before persisted reorders.
Engine/library/pricing versions remain attached to the record even when excluded
from the short ID. An identifier is never an authorization token. Edits recompute
the ID. Reorders will need fresh screening and current approval/availability checks.
