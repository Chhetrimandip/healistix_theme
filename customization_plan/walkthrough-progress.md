# Handoff walkthrough progress

September 14 communication update: user explicitly requests visual-first reports and flowcharts, minimal prose and one small explanation at a time. Teach real technical vocabulary, with a short everyday-language definition beside each new term and its role in the app. Do not hide technical terms or use them unexplained. No walls of text. See root `AGENTS.md` for the saved project-wide preference. Earlier implementation status below is historical; see `where-we-are-2026-09-14.md` for the newer system map.

September 13, 2026. User wants a patient guided reading over at least half an hour, with short explanations and checks, rather than a large summary.

Covered and correctly explained back by the user:
- Production needs a structured recipe record; the engine interprets the request.
- Foundation is base gel plus optional flavor, with no added herbs (handoff page 2).
- Schema structure and rule validation are distinct.
- Validation rejects invalid amounts before display/production.
- Excluded herbs stay excluded during manual edits.
- Fallback recipes must still pass validation.
- Shopify price variant versus attached recipe record: user identified the recipe record.

Explained, but do not assume independently mastered:
- Build ID identifies recipe; ingredient lots identify the batches used.
- Saved recipe outcomes versus discarded screening answers.
- Reorder screening is underspecified.

Current work: two implementation tasks build a local backend and branded UI while the user continues studying. Parent created design.md, interface draft, images and implementation overview. User requested continued work while asleep and preview/report delivery.

Resume teaching with a concrete production/lot example, then cover capacity, order lifecycle, labels, privacy, launch approvals and handoff conflicts in short steps. Avoid repetitive easy quizzes once a point is understood. Track unresolved decisions in questions-for-shamim.md.
