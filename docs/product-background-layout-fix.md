# Product background layout fix

Local preview change, 2026-09-08. No live theme push.

## Reproduced

At 320px, Batana and Shilajit had document/body scroll widths of 337px;
at 390px, both measured 407px. Rotated fruit escaped the uncontained
decorative layer. Sea moss had no horizontal overflow but its fruit layer
measured 0px high and clipped the fruit entirely.

## Change

The shared fruit layer now uses absolute `inset: 0` with automatic height,
anchored to the positioned body rather than an empty section wrapper.
Its own overflow is clipped so rotated decorations cannot widen the page.
Removed the sea-moss-only percentage-height override. No blanket content
overflow suppression or changes to product galleries, drawers, or grids.

## Regression check

`scripts/test-product-layout.cjs` uses Playwright against the local Shopify
preview. Run with Playwright available on NODE_PATH. Checks all three product
routes at 320, 390, 749 and 1280px. Assertions cover rendered product content,
document/body width, fruit-layer height and loaded visible fruit images.
Set LAYOUT_SCREENSHOT to an output PNG path for a mobile sea moss capture.

The initial width/height suite failed before the fix and passed all 12 cases
afterward. Keep this test when changing the wallpaper positioning or product
CSS so the two page-specific treatments cannot diverge again.
