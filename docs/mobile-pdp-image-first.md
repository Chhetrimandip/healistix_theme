# Mobile PDP image first — September 10, 2026

The mobile arrange() function prepended the entire product introduction above the gallery. At 390 × 844, the image started at 598.7px and extended underneath the fixed cart bar. Changed the mobile DOM order to gallery, introduction, then purchase details. Desktop still places the introduction inside the buy box.

Regression: scripts/check-mobile-landing.cjs failed before the change and passed afterward at 320×568, 375×667, 390×844, 430×932 and 1280×900. Mobile photo starts at 152px; the full photo fits above the sticky CTA at all four mobile sizes. No horizontal overflow. Screenshot reviewed at 390px. JavaScript syntax check passed.
