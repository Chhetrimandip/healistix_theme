# Review media popup fix

The customer media dialog inherited zero margins and opened at the top-left. Its Liquid template included media, reviewer and date, but omitted the saved rating and review excerpt.

The dialog now explicitly centers with fixed insets and automatic margins. Media and the original saved review appear in two columns on desktop, stacked on mobile. Long content can scroll inside the viewport-bounded dialog. Available disclosures and original-review links are retained; no review content or ratings were fabricated or edited.

## Browser regression check

Open “Play video by Annalise Slezak”, then evaluate the following read-only check in the browser automation session:

```js
const dialog = document.querySelector('.hx-jm-dialog[open]');
const rect = dialog.getBoundingClientRect();
({
  centered: Math.abs(rect.left + rect.width / 2 - document.documentElement.clientWidth / 2) < 2,
  reviewVisible: !!dialog.querySelector('blockquote')?.textContent.trim(),
  withinViewport: rect.top >= 0 && rect.bottom <= innerHeight
});
```

Before: left = 0, margin = 0; centered false; review excerpt absent.
After: centered true; original Annalise excerpt and five-star rating rendered.

Mobile: Liliane video dialog centered, bounded within viewport, review text visible, native controls and English caption track retained. Escape closes, pauses video and restores focus to the trigger. Lakesha photo dialog also centered with image loaded and original review text shown. Desktop and mobile screenshots visually inspected. `git diff --check` passed.

Changes are local on `codex/base-flavor-pdp`; live theme not published.
