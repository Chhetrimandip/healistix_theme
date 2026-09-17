# First milestone verification

September 13, 2026. Python 3.12, jsonschema 4.26.0, Windows local preview.

`python -m unittest -v`: **23 tests passed**, latest run 2.267 seconds.
Includes 416 semantic-condition × goal × strength subcases and 40 synthetic
natural-language keyword examples. The examples are developer regression cases;
Ryan's approved 40-example golden set remains pending.

Coverage: seed identity and copy, exact doses and decimal Strong amounts, jar and
thickener limits, exclusions before/after model selection, all routing families,
combined gate precedence, unknown allergies, duplicate/unknown/malformed requests,
prompt injection, rejected model copy, deterministic fallback latency below 1s,
edits and whole-recipe swaps, final-herb removal, non-purchasable cart endpoint,
canonical recipe IDs, outcome-only record, real HTTP endpoints, invalid JSON and
duplicate JSON keys, oversized bodies, no-store headers, synthetic proxy signatures,
and mocked Claude Messages transport. No real model call or Shopify checkout test.

Data regeneration: `python import_data.py` imported 52 herbs/16 uses, found eight
quantity conflicts and no herb text differences between CSV and seed PDF objects.
`python schema.py` and `python fixtures.py` completed successfully.

Connected browser evidence reported by sibling UI task:

- Energy/Mango recommendation: $38.99 provisional price.
- Swap beet root to moringa succeeds through HTTP validation.
- Remove moringa and ginseng: one maca, $29.99 provisional price.
- Remove final maca: backend rejects; UI preserves prior recipe. Error now reads
  "Keep at least one herb in a custom blend."

Parent independently verified connected Focus with thyroid screening and an add edit.
UI preview uses port 8788 and proxies `/api/*` to the real service on 8787.
Screenshots/layout verification belong to the sibling UI task; this task edited no
theme UI assets. Local preview is not a published theme or installed app.

Transfer only `apps/healistix-builder/` into the main checkout, excluding Python
cache files. `design.md` and `customization_plan/` here are copied source context;
do not overwrite the main checkout's existing versions. Everything in the service
resolves paths relative to its own directory. Start from that directory with
`python server.py`; see README for dependency installation and demo POST command.
