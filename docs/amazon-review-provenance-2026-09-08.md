# Amazon customer media added to the Sea Moss draft

Verified September 8, 2026. Local development theme only; no live theme push, app publication, customer contact, or review-request email.

## Implemented records

| Customer | Flavor | Original review | Source video date / length | Change |
|---|---|---|---|---|
| Liliane Avalos | Raw Original | https://www.amazon.com/gp/customer-reviews/R24YCVPKMG721G | April 2, 2026 / 17 seconds | Added original customer video, poster, captions and per-review link to existing text card. |
| Emily | Red Guava | https://www.amazon.com/gp/customer-reviews/R1JP22IG92FUXY | August 12, 2026 / 20 seconds | Added customer video card; no star rating inferred. |
| Annalise Slezak | Red Guava | https://www.amazon.com/gp/customer-reviews/R1A9MBBGYFNIF6 | August 16, 2026 / 33 seconds | Added customer video; subsequently added five-star rating, original title, full written review and Vine free-product disclosure from user-supplied screenshot. |

The public product-video metadata identifies all three as `creatorType: Customer` and connects each to its review permalink. It supplies each customer display name, video date, full HLS stream, poster and English captions. All metadata also includes `disclosureText: Earns commissions`; the cards preserve that disclosure. Emily uses a neutral editorial heading; Annalise now uses the original review title verified in the user's screenshot. No aggregate rating or verified-purchase badge has been added.

## Annalise screenshot follow-up

The user supplied `C:/Users/chhet/AppData/Local/Temp/codex-clipboard-efaa25ca-7b2d-448f-a3ca-bcad7f7dcadc.png`, showing Annalise Slezak, five stars, “Quality ingredients, pleasant taste,” August 16, 2026 and “Vine Customer Review of Free Product.” Its full written review has been transcribed into the existing card, including uncertainty about benefits and the acidic-lime caveat. This updates the same review; it does not add a duplicate. The existing source video disclosure is retained alongside the screenshot's Vine disclosure. The two additional photo thumbnails visible in the screenshot establish that photos exist, but original full-resolution photo files have not been obtained or added. The existing video poster is not represented as a standalone customer photo review.

Liliane's existing five-star rating and excerpt, and the existing Me. Anderson and Rosie G cards, predate this work. Their earlier screenshot/import validation is documented in `reviews-and-testimonials-plan.md`; the current signed-out Amazon review gate prevented fresh validation of those text bodies/ratings. They are not newly retrieved reviews. The new public video independently confirms Liliane's name, date and review identity.

## Source evidence

- Raw Original listing: https://www.amazon.com/dp/B0CFD6RMMF?th=1
- Red Guava listing: https://www.amazon.com/Healistix-Red-Guava-Sea-Moss/dp/B0H4NRG919?ref_=ast_bl_cpl_dp
- Saved public listing HTML: `staging/amazon-review-evidence-20260908/raw-original-listing.html` and `staging/amazon-review-verification/red-guava-browser.html`.
- Exact decoded source metadata: `staging/amazon-review-evidence-20260908/liliane-video-metadata.json` and `red-guava-video-metadata.json`.
- Combined metadata and local filename mapping: `staging/amazon-review-evidence-20260908/implemented-video-register.json`.

The three `assets/review-<review-id>.mp4` files were remuxed from each full public HLS URL with FFmpeg stream copy. They are not the separate short `videoPreviewAssets`. No footage or audio was generated, spliced or reworded. Source posters and caption files are saved with matching `.jpg` and `.vtt` names. The source caption files for Liliane and Emily indicate no spoken audio; Annalise has timed English speech captions. These are source captions, not independently corrected transcripts.

## Display and verification

`templates/product.seamoss.json` places the three media cards first, followed by the two existing text-only reviews. Every video uses native controls, `playsinline`, `preload="none"`, a poster and English caption track. Original-review links remain visible as a fallback. The shared section accepts customer photo assets too, but no photo review has been represented by a video poster.

The disclaimer now says the flavor is shown on each card, since Raw Original and Red Guava appear together on the same Shopify Sea Moss product. Customers changing to Banana or Blueberry do not receive false flavor attribution.

Template JSON parses successfully. Media files were generated successfully at approximately 1.4 MB, 1.7 MB and 2.4 MB. Browser playback succeeds for all three full videos (17.49, 20.92 and 33.27 seconds), and desktop/mobile checks found no horizontal overflow. QA caught compressed bytes in the initial Liliane caption download; refetching with HTTP content decoding repaired the file. A fresh browser load confirms the caption track reaches `readyState=2` and exposes the source's “No spoken audio” cue. Card source links now render dark green (`rgb(23, 75, 60)`) with underlining; this was verified from computed browser styles. Main source-button styling is unchanged.

## Still missing

Both public listings show a sign-in requirement for the full written customer reviews. The reviews portal also failed via web retrieval, and connected-browser inventory timed out. No gate was bypassed. The specific review mentioning a wife and standalone customer photo reviews could not be verified from available public content. The parent has requested the specific source link; add those once authenticated source evidence or supplied originals establish the reviewer, flavor and media association.

Appio's 20 pending records have not been published or counted as website reviews. No automatic Amazon synchronization is implied. Public accessibility establishes source identity, not ownership of customer media; the existing review plan's reuse-permission item remains unresolved for production.
