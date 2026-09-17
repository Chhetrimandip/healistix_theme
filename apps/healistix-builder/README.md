# Healistix builder backend review milestone

This local HTTP engine imports the general 52-herb, 16-goal ingestible handoff.
It produces validated, editable preview recipes and integer-cent price estimates.
Purchasing is always disabled. There is no installed Shopify app, trusted purchase
authorization, persisted customer record, order integration or production approval.
The default engine is deterministic; it is not a live AI demonstration.

## Run

Python 3.12 or newer, with `jsonschema` (tested with 4.26.0):

```powershell
cd apps/healistix-builder
python -m pip install -r requirements.txt
python server.py
```

Local endpoints: `http://127.0.0.1:8787/health`, `/catalog`, `/recommend`, `/validate`,
`/prepare-cart`. The sibling UI preview proxies `/api/*` from port 8788 to this
service. This server intentionally binds loopback and does not provide CORS.

```powershell
Invoke-RestMethod http://127.0.0.1:8787/recommend -Method Post -ContentType application/json -Body (Get-Content fixtures/energy-request.json -Raw)
python -m unittest -v
```

`python import_data.py` regenerates the audited JSON library from the copied CSVs
and extracted seed-PDF tail. `python schema.py` regenerates portable JSON schemas.
`python fixtures.py` regenerates only synthetic fixtures. Source extraction uses
`pdftotext -layout`; the preserved source PDFs are in the project customization_plan.

## Read the interface

- `INTERFACE.md`: concrete frontend contract, fields and HTTP codes.
- `schemas/`: executable Draft 2020-12 contracts used by Python validation.
- `fixtures/`: synthetic HTTP requests/responses, public catalog and recipe record.
- `data/audit.json`: reproducible source hashes and eight conflicting amounts.
- `DECISIONS.md`: unresolved formulation and routing decisions, preview behavior.
- `SHOPIFY.md`: verified platform constraints and remaining deployment work.

The service derives exclusions from semantic condition answers, scans free text,
rechecks every selected herb, enforces exact Standard/Strong amounts and jar limits,
and renders exact supplied phrases. Manual edits never call a model. Suggested
swaps are checked as complete replacement recipes. Search candidates are screened
and goal-compatible; adding them may still exceed a combination limit, so validate.
Provider notes are fixed copy. No raw model explanation reaches the UI.

Six default pairings and the no-stimulant energy variant cannot be recommended by
fallback until their quantities are reconciled. All other pairings still undergo
validation, including fallback and Strong. Nothing interprets a recipe hash as
permission to charge a customer or manufacture a jar.

## Model adapter

`provider.py` implements the server-only Claude Messages request format with a
mockable transport. It is off by default, including when an API key happens to exist.
Tests use synthetic output and no external API calls. To intentionally enable it
after a privacy/model review, configure `BUILDER_PROVIDER=claude`,
`BUILDER_PROVIDER_PRIVACY_REVIEWED=true`, `ANTHROPIC_API_KEY`, and an explicitly
chosen `ANTHROPIC_MODEL` on the server. Never put these in theme files.

The privacy variable is an operational acknowledgment, not a retention setting.
Raw goal text can contain health information. Do not enable it for real customers
until the selected provider/model retention arrangement satisfies the project policy.
No actual provider account, current model entitlement or response quality was tested.
Each call has a six-second socket timeout; an invalid completed output gets one
retry. A production gateway needs a total wall-clock deadline and concurrency limits.

## Privacy and launch boundary

Request bodies, URLs and model errors are not logged. Responses are `no-store`.
No health answers, goal text, allergies, sex or matched terms are persisted. Only
synthetic fixtures are written by the fixture generator. `recipe_record()` defines
an outcome-only versioned record; it is not a trusted storage implementation.

This is a local development HTTP server. Before internet deployment, add a hardened
ASGI/WSGI gateway, bounded concurrency, total deadlines, authenticated installation,
rate limiting, secret management and privacy-safe operational telemetry. Production
must require actual per-herb approval and supplier COAs; every seed entry currently
has provisional/unverified status. Shilajit is excluded even in this preview.

Future work: signed/trusted cart authorization and checkout enforcement, real
inventory and prices, capacity reservations, approved production labels/tickets,
lot traceability, reorder screening, refunds, subscriptions and CRM. None is claimed
complete by this milestone.
