# Builder local interface v1

Run `python server.py` from this directory; base URL `http://127.0.0.1:8787`.
All amounts are provisional. Every response has purchase.enabled=false.
POST JSON to `/recommend`; POST the same request plus `recipe` to `/validate`
or `/prepare-cart`. Recipe is `{uses:[id], herbs:[{id,g}]}`; flavor and strength
come from the request, never from a stale returned build.

```json
{
  "goal_text": "daily energy",
  "use_chips": ["energy"],
  "customer": {
    "adult": true, "pregnant_nursing": false,
    "seaweed_iodine_allergy": false, "screening_complete": true,
    "first_time": true, "sex": null, "stim_sensitive": false,
    "conditions": [], "allergies": "", "country": "US"
  },
  "flavor_pref": {"id": "mango", "family": "tropical", "level": "standard"},
  "strength_pref": "standard",
  "clarification_attempted": false
}
```

All fields above are required, except `recipe` which is required only for edits.
`screening_complete` acknowledges the full condition checklist (including seizures).
Conditions are semantic answer IDs returned in GET `/catalog`; flags are derived
on the server. Unknown fields, duplicate choices and missing answers are invalid.
`sex` is null, `men`, or `women` and is only a vitality preference, never persisted.
Flavors use the literal seed IDs, including spaces (`passion fruit`).

Response follows the shared envelope. `display` contains `summary`, `explanation`,
`uses:[{id,name}]`, `herbs:[{id,name,g,approved_phrase}]`, `editable_herbs` and
`swaps` (object keyed by existing herb ID, up to three valid replacement IDs).
Catalog has `schema_version`, `request_id`, `uses`, `herbs`, `flavors`, `conditions`,
`capabilities`, and `purchase`. Public herbs omit safety flags and supplier notes.
Only response.editable herbs are screened; catalog is an unscreened preview library.

POST envelopes return HTTP 200 for recommended/clarification/foundation/stopped;
422 for invalid; 503 for unavailable; malformed JSON 400; oversize 413.
No health data in URLs, storage, analytics or logs. `/prepare-cart` always fails
closed even for a valid recipe. No Shopify variants are returned.

Executable JSON schemas and synthetic fixtures live in `schemas/` and `fixtures/`.
The shared draft remains unchanged; this file defines the concrete backend adapter.
