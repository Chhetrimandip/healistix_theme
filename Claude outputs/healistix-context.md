# Healistix Shopify Redesign — Full Context Transfer

Paste this entire document into your new Claude chat as the first message, then say "continue from here."

---

## Who you're helping

Monika — she runs a sea moss DTC brand called **Healistix** (healistix.com). She's comfortable with code, uses Claude to build directly in the codebase, and has a strong instinct for design (she knows exactly what she does NOT want).

---

## The project in plain English

Redesigning the Shopify storefront for **Healistix** — a wildcrafted sea moss gel brand from St. Lucia. Products are sea moss gel jars in 30+ flavors. The brand is raw, authentic, Caribbean-rooted. NOT a wellness-generic brand.

---

## Where the files live

- Local theme folder: `C:\Users\chhet\Desktop\healistix-theme` (Windows machine, device "madnip")
- Accessible via Claude's device bridge as `~/mnt/healistix-theme`
- Base theme: **Shopify Dawn** (heavily customized with existing `hx-*` custom sections)
- Current git branch: `redesign/ocean-deep` (branched off `main`, last commit: `5466f43 safety`)
- Shopify CLI is set up — she can run `shopify theme dev` for local preview and `shopify theme push --unpublished` to push as a draft

---

## Design direction

### Inspiration brands (study these properly)
- **trueseamoss.com** — bold, direct, product-forward. No fluff. The product does the talking.
- **bloomnu.com** — clean, airy, lifestyle-forward. Great whitespace. Feels premium without being cold.
- The goal is a blend: Healistix should feel **Caribbean and real** (True Sea Moss energy) but **clean and aspirational** (Bloom quality).

### CRITICAL — what NOT to do
Monika explicitly said: **the site cannot look AI-generated**. Avoid:
- Numbered section markers (01 / 02 / 03) unless content is literally a sequence
- Gradient overlays on hero images
- Identical card shadows on everything
- Mid-dot separators (·) between stats
- Everything centered with no left-alignment
- Generic warm cream + serif + terracotta (too AI-default)
- Playfair Display (too generic AI-feel)
- Big bold stats tiles everywhere
- Lorem ipsum or placeholder copy — use real Healistix content

### The "Ocean Deep" color palette
```
--od-bg:          #F2EDE3   ← cream background (NOT dark bg — kills the jolly vibe)
--od-bg-alt:      #EDE7DA   ← slightly deeper cream for alternate sections
--od-bg-deep:     #081523   ← navy, used for ONE dark band only (origin/founder section)
--od-deep-2:      #1A3D54   ← muted navy for image overlays on dark sections
--od-text:        #081523   ← main body text
--od-text-soft:   #3C4A58   ← secondary text
--od-muted:       #6B7A88   ← captions, metadata
--od-teal:        #3B9E8E   ← accent, links, decorative plate behind product
--od-teal-soft:   #D5E9E4   ← light teal fill (circular plate behind hero jar)
--od-accent:      #D4621A   ← orange CTA (primary buttons)
--od-accent-hover:#B95214
--od-line:        rgba(8,21,35,0.12)  ← dividers
```

### Typography
- **Display font: Fraunces** (Google Fonts) — variable optical-size serif with `opsz` and `SOFT` axes. Deliberately chosen over Playfair Display (too generic). Large optical size + SOFT axis gives distinctive letterforms at headline scale. Used for all headings, large italic quotes, ingredient names.
- **Body font: Plus Jakarta Sans** (Google Fonts) — clean geometric sans. Used for all body copy, nav, buttons, labels.
- Both loaded via Google Fonts in `layout/theme.liquid`

---

## Build strategy — why we're doing it this way

The existing `hx-*` sections are a tangled mess from a previous quick mockup designer. Rather than fight specificity wars patching them, we're building a **parallel `od-*` component system**:
- New CSS file: `assets/od.css`
- New JS file: `assets/od-showcase.js`
- New sections: `sections/od-*.liquid`
- The `hx-*` files stay UNTOUCHED
- `templates/index.json` gets swapped to use the new `od-*` sections

---

## Phase 1 vs Phase 2

### Phase 1 (current) — static product images
The 3-product scroll showcase uses still product photos. The CSS animation system is already built and working.

### Phase 2 (after Monika generates videos)
Monika will use **Higgsfield** (or Google Veo/Gemini) to generate 4–6 second looping videos of each jar rotating 360°. The `od-showcase.liquid` section already has a `video` field in its schema — when a video is uploaded it replaces the static image automatically. No code changes needed for phase 2, just add the videos in the Shopify theme editor.

**Prompt Monika should use for Higgsfield/Veo for each jar:**
> "Product photography video: a [color] glass jar of sea moss gel, labeled 'Healistix [flavor]', rotates slowly 360° on a clean cream (#F2EDE3) background. Studio lighting, soft shadows. No text appearing. Seamlessly loopable. 5 seconds."

---

## Files already built (FULL CONTENT BELOW — copy these into the theme folder)

### STATUS: These 5 files are DONE but haven't been copied to the theme folder yet.
Copy them into the device folder `~/mnt/healistix-theme/`.

---

### FILE 1: `assets/od.css` — Full Ocean Deep design system

```css
/* ==========================================================================
   Healistix — Ocean Deep design system
   Loaded globally from layout/theme.liquid after base.css.
   Tokens, type, buttons, header + footer overrides, and all od-* sections.
   ========================================================================== */

:root {
  --od-bg: #F2EDE3;
  --od-bg-alt: #EDE7DA;
  --od-bg-deep: #081523;
  --od-deep-2: #1A3D54;
  --od-text: #081523;
  --od-text-soft: #3C4A58;
  --od-muted: #6B7A88;
  --od-teal: #3B9E8E;
  --od-teal-soft: #D5E9E4;
  --od-accent: #D4621A;
  --od-accent-hover: #B95214;
  --od-line: rgba(8, 21, 35, 0.12);

  --od-font-display: 'Fraunces', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  --od-font-body: 'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif;

  --od-max: 1200px;
  --od-gutter: clamp(20px, 4vw, 48px);
  --od-section: clamp(72px, 9vw, 128px);

  /* Make Dawn's own components follow the same faces */
  --font-heading-family: var(--od-font-display);
  --font-body-family: var(--od-font-body);
  --font-heading-weight: 500;
}

body {
  background-color: var(--od-bg);
  color: var(--od-text);
  font-family: var(--od-font-body);
  -webkit-font-smoothing: antialiased;
}

.od-wrap {
  max-width: var(--od-max);
  margin: 0 auto;
  padding-left: var(--od-gutter);
  padding-right: var(--od-gutter);
}

.od-section {
  padding-top: var(--od-section);
  padding-bottom: var(--od-section);
}

.od-section--alt { background: var(--od-bg-alt); }
.od-section--deep { background: var(--od-bg-deep); color: var(--od-bg); }

.od-display {
  font-family: var(--od-font-display);
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  line-height: 1.02;
  letter-spacing: -0.015em;
  text-wrap: balance;
  margin: 0;
}

.od-display--xl { font-size: clamp(44px, 6.4vw, 84px); }
.od-display--lg { font-size: clamp(36px, 4.6vw, 60px); }
.od-display--md { font-size: clamp(28px, 3.2vw, 42px); line-height: 1.1; }

.od-lede {
  font-size: clamp(17px, 1.35vw, 20px);
  line-height: 1.6;
  color: var(--od-text-soft);
  max-width: 34em;
  margin: 0;
}

.od-body {
  font-size: 16px;
  line-height: 1.65;
  color: var(--od-text-soft);
  max-width: 38em;
}

.od-section--deep .od-lede,
.od-section--deep .od-body { color: rgba(242, 237, 227, 0.78); }

.od-link {
  color: var(--od-teal);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1.5px solid currentColor;
  padding-bottom: 2px;
  transition: color 0.15s;
}
.od-link:hover { color: var(--od-accent); }
.od-section--deep .od-link { color: #7FCBBE; }

.od-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--od-font-body);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  padding: 18px 30px;
  border-radius: 999px;
  border: 1.5px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
}
.od-btn:focus-visible { outline: 3px solid var(--od-teal); outline-offset: 3px; }
.od-btn--primary { background: var(--od-accent); color: #fff; }
.od-btn--primary:hover { background: var(--od-accent-hover); }
.od-btn--ghost { background: transparent; color: var(--od-text); border-color: var(--od-text); }
.od-btn--ghost:hover { background: var(--od-text); color: var(--od-bg); }
.od-section--deep .od-btn--ghost { color: var(--od-bg); border-color: rgba(242,237,227,0.6); }
.od-section--deep .od-btn--ghost:hover { background: var(--od-bg); color: var(--od-text); }
.od-btn[disabled] { opacity: 0.5; cursor: not-allowed; }

.od-stars { display: inline-flex; gap: 2px; color: var(--od-accent); vertical-align: middle; }
.od-stars svg { width: 15px; height: 15px; fill: currentColor; }

.od-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: clamp(36px, 5vw, 64px);
}
.od-head > p { margin: 0; }
@media (max-width: 700px) { .od-head { flex-direction: column; align-items: flex-start; gap: 14px; } }

/* Header + announcement */
.announcement-bar-section,
.utility-bar,
.announcement-bar {
  background: var(--od-bg-deep) !important;
  color: var(--od-bg) !important;
}
.announcement-bar__message,
.announcement-bar__link {
  font-family: var(--od-font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: var(--od-bg) !important;
}
.announcement-bar__link:hover .announcement-bar__message { text-decoration: underline; }
.slideshow__controls .slider-button { color: var(--od-bg); }

.header-wrapper,
.header,
.shopify-section-header,
.shopify-section-header-sticky {
  background: var(--od-bg) !important;
  color: var(--od-text) !important;
}
.header-wrapper { border-bottom: 1px solid var(--od-line); }
.header { padding-top: 14px !important; padding-bottom: 14px !important; }

.header__menu-item,
.header__menu-item span,
.list-menu__item,
.header__icon,
.header__icon .icon,
.header__heading-link,
.menu-drawer__menu-item {
  color: var(--od-text) !important;
  font-family: var(--od-font-body);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}
.header__menu-item:hover span { text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--od-teal); }
.header__icon .icon { width: 22px; height: 22px; }
.header__heading-logo { max-width: 120px; }

.cart-count-bubble {
  background: var(--od-accent) !important;
  color: #fff !important;
  font-family: var(--od-font-body);
  font-weight: 700;
}

.menu-drawer,
.menu-drawer__inner-container,
.menu-drawer__navigation-container { background: var(--od-bg) !important; color: var(--od-text) !important; }
.menu-drawer__menu-item { font-size: 18px; }
.header__submenu,
.header__submenu.list-menu { background: var(--od-bg); border: 1px solid var(--od-line); box-shadow: none; }
.header__submenu .header__menu-item { font-size: 15px; }

/* Footer */
.footer {
  background: var(--od-bg-alt) !important;
  color: var(--od-text) !important;
  border-top: 1px solid var(--od-line);
}
.footer,
.footer .footer-block__heading,
.footer .footer-block__details-content,
.footer .footer__content-bottom,
.footer .list-menu__item,
.footer .copyright__content,
.footer .footer__copyright a { color: var(--od-text) !important; }
.footer .footer-block__heading {
  font-family: var(--od-font-display);
  font-weight: 500;
  font-size: 22px;
  text-transform: none;
  letter-spacing: 0;
}
.footer .list-menu__item { font-size: 15px; opacity: 0.8; }
.footer .list-menu__item:hover { opacity: 1; text-decoration: underline; text-decoration-color: var(--od-teal); }
.footer .field__input { background: #fff; border-color: var(--od-line); border-radius: 999px; padding-left: 20px; }
.footer .field__button { color: var(--od-accent); }
.footer__content-bottom { border-top: 1px solid var(--od-line); }
.footer .copyright__content { font-size: 13px; opacity: 0.7; }

/* od-hero */
.od-hero {
  padding-top: clamp(48px, 6vw, 96px);
  padding-bottom: clamp(48px, 6vw, 96px);
  overflow: hidden;
}
.od-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(32px, 5vw, 80px);
}
.od-hero__copy { display: flex; flex-direction: column; gap: 26px; }
.od-hero__rating {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--od-text-soft);
  margin: 0;
}
.od-hero__actions { display: flex; align-items: center; flex-wrap: wrap; gap: 16px 28px; }
.od-hero__note { font-size: 14px; color: var(--od-muted); margin: 0; }

.od-hero__media {
  position: relative;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}
.od-hero__plate {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: var(--od-teal-soft);
}
.od-hero__img {
  position: relative;
  width: 78%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 30px 40px rgba(8, 21, 35, 0.18));
}
.od-hero__caption {
  position: absolute;
  bottom: 4%;
  right: 6%;
  font-family: var(--od-font-display);
  font-style: italic;
  font-size: 18px;
  color: var(--od-teal);
  margin: 0;
}

@media (max-width: 880px) {
  .od-hero__grid { grid-template-columns: 1fr; }
  .od-hero__media { order: -1; max-width: 420px; margin: 0 auto; width: 100%; }
}

/* od-showcase — pinned 3-product scroll story */
.od-showcase { position: relative; background: var(--od-bg-alt); }
.od-showcase__intro { padding-top: var(--od-section); padding-bottom: clamp(24px, 4vw, 48px); }

.od-showcase__track { position: relative; }
.od-showcase__stage {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: grid;
  align-items: center;
  overflow: hidden;
}
.od-showcase__slides { position: relative; height: min(70vh, 640px); }

.od-slide {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 5vw, 80px);
  pointer-events: none;
  --t: 0;
  --out: 0;
}
.od-slide.is-active { pointer-events: auto; }

.od-slide__media {
  display: grid;
  place-items: center;
  height: 100%;
  transform:
    translateX(calc((1 - var(--t)) * -42%))
    rotate(calc((1 - var(--t)) * -14deg))
    scale(calc(0.9 + var(--t) * 0.1));
  opacity: calc(var(--t) * 3);
  will-change: transform, opacity;
}
.od-slide__media img,
.od-slide__media video {
  width: auto;
  max-width: 100%;
  max-height: min(64vh, 600px);
  object-fit: contain;
  filter: drop-shadow(0 30px 40px rgba(8, 21, 35, 0.18));
}

.od-slide__copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  transform: translateX(calc((1 - var(--t)) * 48px));
  opacity: calc((var(--t) - 0.25) * 2);
  transition: none;
}
.od-slide.is-leaving .od-slide__media,
.od-slide.is-leaving .od-slide__copy {
  opacity: calc(1 - var(--out) * 2);
  transform: translateY(calc(var(--out) * -24px));
}

.od-slide__index {
  font-family: var(--od-font-display);
  font-style: italic;
  font-size: 18px;
  color: var(--od-teal);
  margin: 0;
}
.od-slide__title { margin: 0; }
.od-slide__desc { margin: 0; }
.od-slide__price {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.od-slide__price s { color: var(--od-muted); font-weight: 400; margin-left: 8px; }
.od-slide__form { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; margin-top: 6px; }

.od-showcase__progress {
  position: absolute;
  right: var(--od-gutter);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.od-showcase__dot {
  width: 3px;
  height: 28px;
  border-radius: 2px;
  background: var(--od-line);
  transition: background 0.2s;
}
.od-showcase__dot.is-active { background: var(--od-accent); }

@media (max-width: 880px), (prefers-reduced-motion: reduce) {
  .od-showcase__stage { position: static; height: auto; overflow: visible; display: block; }
  .od-showcase__slides { height: auto; }
  .od-slide {
    position: relative;
    grid-template-columns: 1fr;
    gap: 20px;
    pointer-events: auto;
    padding-bottom: clamp(56px, 8vw, 96px);
    --t: 1;
  }
  .od-slide__media { transform: none; opacity: 1; height: auto; }
  .od-slide__media img, .od-slide__media video { max-height: 360px; }
  .od-slide__copy { transform: none; opacity: 1; }
  .od-slide.is-leaving .od-slide__media,
  .od-slide.is-leaving .od-slide__copy { opacity: 1; transform: none; }
  .od-showcase__progress { display: none; }
}
.no-js .od-showcase__stage { position: static; height: auto; }
.no-js .od-slide { position: relative; --t: 1; }

/* od-inside */
.od-inside__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.od-inside__media {
  position: sticky;
  top: 96px;
  aspect-ratio: 4 / 5;
  background: var(--od-teal);
  overflow: hidden;
  border-radius: 4px;
}
.od-inside__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.od-inside__media-fallback {
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 28px;
  font-family: var(--od-font-display);
  font-style: italic;
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.15;
  color: var(--od-bg);
}
.od-inside__copy { display: flex; flex-direction: column; gap: 28px; }

.od-ingredients { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--od-line); }
.od-ingredients li {
  display: grid;
  grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
  gap: 24px;
  padding: 22px 0;
  border-bottom: 1px solid var(--od-line);
}
.od-ingredients__name {
  font-family: var(--od-font-display);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
}
.od-ingredients__origin { display: block; font-family: var(--od-font-body); font-size: 13px; color: var(--od-teal); font-weight: 600; margin-top: 6px; }
.od-ingredients__desc { margin: 0; font-size: 15px; line-height: 1.6; color: var(--od-text-soft); }

@media (max-width: 880px) {
  .od-inside__grid { grid-template-columns: 1fr; }
  .od-inside__media { position: static; aspect-ratio: 4 / 3; }
  .od-ingredients li { grid-template-columns: 1fr; gap: 8px; }
}

/* od-origin */
.od-origin__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.od-origin__copy { display: flex; flex-direction: column; gap: 28px; }
.od-origin__statement {
  font-family: var(--od-font-display);
  font-weight: 400;
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 100;
  font-size: clamp(30px, 3.8vw, 52px);
  line-height: 1.12;
  letter-spacing: -0.01em;
  text-wrap: balance;
  margin: 0;
}
.od-origin__statement em { font-style: normal; color: #7FCBBE; }
.od-origin__media {
  aspect-ratio: 4 / 5;
  background: var(--od-deep-2);
  overflow: hidden;
  border-radius: 4px;
}
.od-origin__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.od-origin__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  border-top: 1px solid rgba(242, 237, 227, 0.2);
  padding-top: 24px;
  margin: 0;
}
.od-origin__facts div { display: flex; flex-direction: column; gap: 4px; }
.od-origin__facts dt { font-family: var(--od-font-display); font-size: 28px; font-weight: 500; line-height: 1; }
.od-origin__facts dd { margin: 0; font-size: 14px; color: rgba(242, 237, 227, 0.7); }

@media (max-width: 880px) {
  .od-origin__grid { grid-template-columns: 1fr; }
  .od-origin__media { aspect-ratio: 3 / 2; order: -1; }
}

/* od-reviews */
.od-reviews__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(28px, 4vw, 56px);
}
.od-review { display: flex; flex-direction: column; gap: 18px; border-top: 2px solid var(--od-text); padding-top: 22px; margin: 0; }
.od-review__text {
  font-family: var(--od-font-display);
  font-weight: 400;
  font-size: clamp(21px, 1.8vw, 26px);
  line-height: 1.3;
  margin: 0;
  text-wrap: pretty;
}
.od-review__meta { font-size: 14px; color: var(--od-muted); margin: 0; font-style: normal; }
.od-review__meta strong { color: var(--od-text); font-weight: 600; }
@media (max-width: 880px) { .od-reviews__grid { grid-template-columns: 1fr; } }

/* od-faq */
.od-faq__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.od-faq__aside { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 96px; }
.od-faq__list { border-top: 1px solid var(--od-line); }
.od-faq__item { border-bottom: 1px solid var(--od-line); }
.od-faq__item summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 22px 0;
  font-family: var(--od-font-display);
  font-size: clamp(20px, 1.7vw, 24px);
  font-weight: 500;
  line-height: 1.2;
}
.od-faq__item summary::-webkit-details-marker { display: none; }
.od-faq__item summary:focus-visible { outline: 3px solid var(--od-teal); outline-offset: 4px; border-radius: 4px; }
.od-faq__icon { flex: none; width: 22px; height: 22px; position: relative; }
.od-faq__icon::before, .od-faq__icon::after {
  content: ''; position: absolute; background: var(--od-text); left: 50%; top: 50%;
  transform: translate(-50%, -50%);
}
.od-faq__icon::before { width: 16px; height: 1.5px; }
.od-faq__icon::after { width: 1.5px; height: 16px; transition: transform 0.2s; }
.od-faq__item[open] .od-faq__icon::after { transform: translate(-50%, -50%) rotate(90deg); }
.od-faq__answer { padding: 0 0 26px; max-width: 40em; }
.od-faq__answer p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--od-text-soft); }
@media (max-width: 880px) {
  .od-faq__grid { grid-template-columns: 1fr; }
  .od-faq__aside { position: static; }
}
```

---

### FILE 2: `assets/od-showcase.js`

```js
/* Healistix — pinned product showcase
   Maps scroll position inside .od-showcase__track to one of N slides and
   writes --t (entry progress) / --out (exit progress) onto each slide.
   Also handles "Add to cart" via Dawn's cart drawer without a page reload. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = window.matchMedia('(max-width: 880px)');

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function initShowcase(root) {
    var track = root.querySelector('.od-showcase__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.od-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.od-showcase__dot'));
    var n = slides.length;
    if (!track || n === 0) return;

    var ticking = false;
    var lastIndex = -1;

    function layout() {
      if (reduceMotion.matches || narrow.matches) {
        track.style.height = '';
        slides.forEach(function (s) { s.style.setProperty('--t', 1); s.style.setProperty('--out', 0); s.classList.add('is-active'); s.classList.remove('is-leaving'); });
        return false;
      }
      track.style.height = (n + 1) * 100 + 'vh';
      return true;
    }

    function update() {
      ticking = false;
      if (!layout()) return;

      var rect = track.getBoundingClientRect();
      var vh = window.innerHeight;
      var scrollable = rect.height - vh;
      var progress = clamp(-rect.top / scrollable, 0, 1);
      var pos = progress * n;
      var index = clamp(Math.floor(pos), 0, n - 1);
      var local = clamp(pos - index, 0, 1);

      slides.forEach(function (slide, i) {
        var t, out;
        if (i === index) {
          t = easeOut(clamp(local / 0.55, 0, 1));
          out = (i < n - 1) ? clamp((local - 0.8) / 0.2, 0, 1) : 0;
        } else if (i < index) {
          t = 1; out = 1;
        } else {
          t = 0; out = 0;
        }
        slide.style.setProperty('--t', t.toFixed(4));
        slide.style.setProperty('--out', out.toFixed(4));
        slide.classList.toggle('is-active', i === index);
        slide.classList.toggle('is-leaving', i === index ? out > 0 : i < index);
      });

      if (index !== lastIndex) {
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
        lastIndex = index;
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    reduceMotion.addEventListener && reduceMotion.addEventListener('change', onScroll);
    update();
  }

  function initForms(root) {
    var forms = root.querySelectorAll('form.od-slide__form');
    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var button = form.querySelector('button[type="submit"]');
        var cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
        var body = new FormData(form);

        if (cart && typeof cart.getSectionsToRender === 'function') {
          body.append('sections', cart.getSectionsToRender().map(function (s) { return s.id; }).join(','));
          body.append('sections_url', window.location.pathname);
        }

        var label = button.textContent;
        button.disabled = true;
        button.textContent = 'Adding…';

        fetch((window.routes && window.routes.cart_add_url) || '/cart/add', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/javascript' },
          body: body
        })
          .then(function (r) { return r.json(); })
          .then(function (json) {
            if (json.status) { throw new Error(json.description || 'Could not add to cart'); }
            button.textContent = 'Added';
            if (cart && typeof cart.renderContents === 'function') {
              cart.renderContents(json);
            } else {
              window.location.href = '/cart';
            }
          })
          .catch(function () {
            button.textContent = 'Try again';
          })
          .finally(function () {
            button.disabled = false;
            setTimeout(function () { button.textContent = label; }, 1800);
          });
      });
    });
  }

  function boot() {
    document.querySelectorAll('.od-showcase').forEach(function (root) {
      initShowcase(root);
      initForms(root);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector && e.target.querySelector('.od-showcase');
    if (root) { initShowcase(root); initForms(root); }
  });
})();
```

---

### FILE 3: `sections/od-hero.liquid`

```liquid
{%- liquid
  assign product = section.settings.product
  assign image = section.settings.image
  if image == blank and product != blank
    assign image = product.featured_image
  endif
  assign cta_link = section.settings.cta_link
  if cta_link == blank and product != blank
    assign cta_link = product.url
  endif
-%}

<section class="od-hero">
  <div class="od-wrap od-hero__grid">
    <div class="od-hero__copy">
      {%- if section.settings.review_count != blank -%}
        <p class="od-hero__rating">
          <span class="od-stars" aria-hidden="true">
            {%- for i in (1..5) -%}
              <svg viewBox="0 0 20 20"><path d="M10 1.6l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.5 7.8l5.9-.8z"/></svg>
            {%- endfor -%}
          </span>
          <span>{{ section.settings.review_count }}</span>
        </p>
      {%- endif -%}

      <h1 class="od-display od-display--xl">{{ section.settings.heading }}</h1>

      {%- if section.settings.text != blank -%}
        <p class="od-lede">{{ section.settings.text }}</p>
      {%- endif -%}

      <div class="od-hero__actions">
        {%- if section.settings.cta_label != blank and cta_link != blank -%}
          <a class="od-btn od-btn--primary" href="{{ cta_link }}">{{ section.settings.cta_label }}</a>
        {%- endif -%}
        {%- if section.settings.link_label != blank and section.settings.link_url != blank -%}
          <a class="od-link" href="{{ section.settings.link_url }}">{{ section.settings.link_label }}</a>
        {%- endif -%}
      </div>

      {%- if section.settings.note != blank -%}
        <p class="od-hero__note">{{ section.settings.note }}</p>
      {%- endif -%}
    </div>

    <div class="od-hero__media">
      <div class="od-hero__plate" aria-hidden="true"></div>
      {%- if image != blank -%}
        {{ image | image_url: width: 1200 | image_tag: class: 'od-hero__img', loading: 'eager', fetchpriority: 'high', widths: '600, 900, 1200', sizes: '(max-width: 880px) 80vw, 45vw' }}
      {%- else -%}
        {{ 'product-1' | placeholder_svg_tag: 'od-hero__img' }}
      {%- endif -%}
      {%- if section.settings.caption != blank -%}
        <p class="od-hero__caption">{{ section.settings.caption }}</p>
      {%- endif -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "OD — Hero",
  "tag": "section",
  "class": "od-section-hero",
  "settings": [
    { "type": "text", "id": "review_count", "label": "Rating line", "default": "4.9 from 460+ reviews" },
    { "type": "textarea", "id": "heading", "label": "Heading", "default": "Sea moss you'll actually look forward to." },
    { "type": "textarea", "id": "text", "label": "Text", "default": "Wildcrafted off the rocks of St. Lucia and blended by hand in our family kitchen, in over 30 flavors. No sugar, no preservatives, nothing we wouldn't give our own kids." },
    { "type": "product", "id": "product", "label": "Hero product", "info": "Used for the image and button link unless overridden below." },
    { "type": "image_picker", "id": "image", "label": "Image override", "info": "A cut-out jar on a transparent background works best." },
    { "type": "text", "id": "caption", "label": "Image caption", "default": "The Trinity jar, 16 oz" },
    { "type": "text", "id": "cta_label", "label": "Button label", "default": "Shop the Trinity jar" },
    { "type": "url", "id": "cta_link", "label": "Button link override" },
    { "type": "text", "id": "link_label", "label": "Text link label", "default": "Find your flavor in 60 seconds" },
    { "type": "url", "id": "link_url", "label": "Text link URL", "default": "/pages/quiz" },
    { "type": "text", "id": "note", "label": "Small note", "default": "Free shipping over $30, and a 30-day money-back guarantee." }
  ],
  "presets": [{ "name": "OD — Hero" }]
}
{% endschema %}
```

---

### FILE 4: `sections/od-showcase.liquid`

```liquid
{{ 'od-showcase.js' | asset_url | script_tag }}

{%- liquid
  assign picked = section.blocks | where: 'type', 'slide'
  assign fallback = section.settings.collection.products | default: collections.all.products
  assign fallback_index = 0
-%}

<section class="od-showcase" data-od-showcase>
  <div class="od-wrap od-showcase__intro">
    <div class="od-head">
      <h2 class="od-display od-display--lg">{{ section.settings.heading }}</h2>
      {%- if section.settings.link_label != blank -%}
        <p><a class="od-link" href="{{ section.settings.link_url | default: '/collections/all' }}">{{ section.settings.link_label }}</a></p>
      {%- endif -%}
    </div>
  </div>

  <div class="od-showcase__track">
    <div class="od-showcase__stage">
      <div class="od-wrap" style="width:100%">
        <div class="od-showcase__slides">
          {%- for block in picked limit: 3 -%}
            {%- liquid
              assign product = block.settings.product
              if product == blank
                for p in fallback offset: fallback_index limit: 1
                  assign product = p
                endfor
                assign fallback_index = fallback_index | plus: 1
              endif
              assign variant = product.selected_or_first_available_variant
              assign media_image = block.settings.image | default: product.featured_image
              assign title = block.settings.title | default: product.title
              assign desc = block.settings.description
              if desc == blank
                assign desc = product.description | strip_html | truncatewords: 32
              endif
            -%}
            <article class="od-slide" {{ block.shopify_attributes }} aria-label="{{ title | escape }}">
              <div class="od-slide__media">
                {%- if block.settings.video != blank -%}
                  {{ block.settings.video | video_tag: autoplay: true, loop: true, muted: true, playsinline: true, controls: false, image_size: '1000x' }}
                {%- elsif media_image != blank -%}
                  {{ media_image | image_url: width: 1200 | image_tag: loading: 'lazy', widths: '600, 900, 1200', sizes: '(max-width: 880px) 80vw, 40vw' }}
                {%- else -%}
                  {{ 'product-2' | placeholder_svg_tag }}
                {%- endif -%}
              </div>

              <div class="od-slide__copy">
                <p class="od-slide__index">{{ forloop.index }} of {{ picked.size | at_most: 3 }}</p>
                <h3 class="od-display od-display--md od-slide__title">{{ title }}</h3>
                {%- if desc != blank -%}
                  <p class="od-body od-slide__desc">{{ desc }}</p>
                {%- endif -%}

                {%- if product != blank -%}
                  <p class="od-slide__price">
                    {{ variant.price | money }}
                    {%- if variant.compare_at_price > variant.price -%}
                      <s>{{ variant.compare_at_price | money }}</s>
                    {%- endif -%}
                  </p>
                  <form class="od-slide__form" method="post" action="{{ routes.cart_add_url }}" accept-charset="UTF-8" enctype="multipart/form-data">
                    <input type="hidden" name="form_type" value="product">
                    <input type="hidden" name="utf8" value="✓">
                    <input type="hidden" name="id" value="{{ variant.id }}">
                    <input type="hidden" name="quantity" value="1">
                    <button type="submit" class="od-btn od-btn--primary" {% unless variant.available %}disabled{% endunless %}>
                      {%- if variant.available -%}Add to cart{%- else -%}Sold out{%- endif -%}
                    </button>
                    <a class="od-link" href="{{ product.url }}">See the details</a>
                  </form>
                {%- endif -%}
              </div>
            </article>
          {%- endfor -%}
        </div>
      </div>

      <div class="od-showcase__progress" aria-hidden="true">
        {%- for block in picked limit: 3 -%}
          <span class="od-showcase__dot{% if forloop.first %} is-active{% endif %}"></span>
        {%- endfor -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "OD — Flavor showcase",
  "tag": "section",
  "class": "od-section-showcase",
  "max_blocks": 3,
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Three jars to start with." },
    { "type": "text", "id": "link_label", "label": "Link label", "default": "See all 30+ flavors" },
    { "type": "url", "id": "link_url", "label": "Link URL", "default": "/collections/all" },
    { "type": "collection", "id": "collection", "label": "Fallback collection", "info": "Used for any slide without a product picked." }
  ],
  "blocks": [
    {
      "type": "slide",
      "name": "Product slide",
      "settings": [
        { "type": "product", "id": "product", "label": "Product" },
        { "type": "text", "id": "title", "label": "Title override" },
        { "type": "textarea", "id": "description", "label": "Short description", "info": "One or two sentences. Falls back to the product description." },
        { "type": "image_picker", "id": "image", "label": "Image override" },
        { "type": "video", "id": "video", "label": "Rotation video (phase 2)", "info": "A 4–6 s muted loop of the jar rotating. Replaces the image when set." }
      ]
    }
  ],
  "presets": [
    {
      "name": "OD — Flavor showcase",
      "blocks": [{ "type": "slide" }, { "type": "slide" }, { "type": "slide" }]
    }
  ]
}
{% endschema %}
```

---

### FILE 5: `sections/od-inside.liquid`

```liquid
<section class="od-section od-inside">
  <div class="od-wrap od-inside__grid">
    <div class="od-inside__media">
      {%- if section.settings.image != blank -%}
        {{ section.settings.image | image_url: width: 1200 | image_tag: loading: 'lazy', widths: '600, 900, 1200', sizes: '(max-width: 880px) 100vw, 45vw' }}
      {%- else -%}
        <p class="od-inside__media-fallback">{{ section.settings.image_fallback_text }}</p>
      {%- endif -%}
    </div>

    <div class="od-inside__copy">
      <h2 class="od-display od-display--lg">{{ section.settings.heading }}</h2>
      {%- if section.settings.text != blank -%}
        <p class="od-lede">{{ section.settings.text }}</p>
      {%- endif -%}

      <ul class="od-ingredients">
        {%- for block in section.blocks -%}
          <li {{ block.shopify_attributes }}>
            <h3 class="od-ingredients__name">
              {{ block.settings.name }}
              {%- if block.settings.origin != blank -%}
                <span class="od-ingredients__origin">{{ block.settings.origin }}</span>
              {%- endif -%}
            </h3>
            <p class="od-ingredients__desc">{{ block.settings.text }}</p>
          </li>
        {%- endfor -%}
      </ul>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "OD — What's inside",
  "tag": "section",
  "class": "od-section-inside",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Six ingredients. Nothing else." },
    { "type": "textarea", "id": "text", "label": "Text", "default": "Every jar starts with the same honest base. The flavored blends add whole fruit, never concentrate, sugar or flavoring." },
    { "type": "image_picker", "id": "image", "label": "Image", "info": "Overhead shot of the raw ingredients works well here." },
    { "type": "text", "id": "image_fallback_text", "label": "Text shown until an image is added", "default": "Sea moss, bladderwrack and burdock root, soaked in alkaline spring water." }
  ],
  "blocks": [
    {
      "type": "ingredient",
      "name": "Ingredient",
      "settings": [
        { "type": "text", "id": "name", "label": "Name", "default": "Wildcrafted sea moss" },
        { "type": "text", "id": "origin", "label": "Origin", "default": "St. Lucia, Atlantic Ocean" },
        { "type": "textarea", "id": "text", "label": "Description", "default": "Hand-harvested from the rocks. Carries 92 of the 102 minerals your body uses, including iodine, iron, zinc and magnesium." }
      ]
    }
  ],
  "presets": [
    {
      "name": "OD — What's inside",
      "blocks": [
        { "type": "ingredient", "settings": { "name": "Wildcrafted sea moss", "origin": "St. Lucia, Atlantic Ocean", "text": "Hand-harvested from the rocks. Carries 92 of the 102 minerals your body uses, including iodine, iron, zinc and magnesium." } },
        { "type": "ingredient", "settings": { "name": "Irish bladderwrack", "origin": "North Atlantic coast", "text": "The oceanic companion to sea moss. Naturally rich in iodine and fucoidans, which support thyroid, metabolism and joints." } },
        { "type": "ingredient", "settings": { "name": "Burdock root", "origin": "Organic, grown in the USA", "text": "The third pillar of the Trinity blend. A traditional blood purifier tied to clearer skin and liver support." } },
        { "type": "ingredient", "settings": { "name": "Alkaline spring water", "origin": "Soaking and blending base", "text": "We soak and blend with pH-balanced spring water, never tap or distilled, so the minerals and enzymes stay intact." } },
        { "type": "ingredient", "settings": { "name": "Fresh key lime", "origin": "Cold-pressed, Florida", "text": "The Caribbean way to keep a jar fresh. Balances pH and brightens the flavor without a single synthetic preservative." } },
        { "type": "ingredient", "settings": { "name": "Whole fruit purée", "origin": "Flavored blends only", "text": "Mango, strawberry, pineapple, blueberry, soursop and more, blended in small batches from ripe fruit." } }
      ]
    }
  ]
}
{% endschema %}
```

---

## What still needs to be done (in order)

### Step 1: Copy the 5 files into the theme folder
Write the 5 files above into:
- `~/mnt/healistix-theme/assets/od.css`
- `~/mnt/healistix-theme/assets/od-showcase.js`
- `~/mnt/healistix-theme/sections/od-hero.liquid`
- `~/mnt/healistix-theme/sections/od-showcase.liquid`
- `~/mnt/healistix-theme/sections/od-inside.liquid`

### Step 2: Write 3 remaining sections
- `sections/od-origin.liquid` — the ONE dark `#081523` band. Large italic Fraunces quote left, founder portrait image right. 3 stat facts below (e.g. "92 minerals", "30+ flavors", "Hand-harvested"). Schema: heading, statement text, em-highlighted word, 3×(stat number + label), image picker, CTA.
- `sections/od-reviews.liquid` — 3-column review grid. Each review: big Fraunces quote text, reviewer name + verified badge. Schema: section heading, up to 6 `review` blocks with quote, name, location, star count.
- `sections/od-faq.liquid` — Left sticky heading + right accordion. Uses `<details>`/`<summary>` natively (no JS needed). Schema: heading, body text, CTA button, up to 10 `faq` blocks with question + answer.

### Step 3: Edit `layout/theme.liquid`
Add immediately before `</head>`:
```liquid
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
{{ 'od.css' | asset_url | stylesheet_tag }}
```

### Step 4: Edit `templates/index.json`
The current homepage order is: hx_hero, hx_marquee, hx_press, hx_proof, hx_bestsellers, hx_how_it_works, hx_ingredients, hx_benefits, hx_lineup, hx_quiz_cta, hx_results, hx_why, hx_founder, hx_ugc, hx_reviews, hx_faq, hx_quiz_nudge, hx_capture, hx_guarantee, hx_insta

Replace with new order: od-hero → od-showcase → od-inside → od-origin → od-reviews → od-faq (keep hx_marquee/hx_press/hx_capture/hx_guarantee if they look okay, or gut them too — Monika's call after preview)

### Step 5: Preview
`shopify theme dev` — check it locally.

### Step 6 (Phase 2, later): Videos
Once Monika has Higgsfield rotation videos, add them via the Shopify theme editor on the od-showcase section — each slide has a "Rotation video (phase 2)" field. No code changes needed.

---

## Known gotchas
- `git checkout -- .` fails on Windows with "unable to unlink old [file]: Operation not permitted" — workaround: `for f in $(git diff --name-only); do git show HEAD:"$f" > "$f"; done`
- `config/settings_data.json` has a `/* auto-generated */` comment block at the top making it invalid JSON — don't try to parse it with Python
- DO NOT touch any existing `hx-*` files — they're the old designer's work and we're leaving them alone
- The previous attempt by another AI chat was "ew" — it made literally no visual changes to the bg color and told her "you need not add any assets" — that's been fully reverted, we're on a clean branch
