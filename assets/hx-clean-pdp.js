(() => {
  function init(section) {
    if (section.dataset.cleanReady) return;
    section.dataset.cleanReady = 'true';
    const fruitAssets = JSON.parse(section.querySelector('[data-fruit-assets]').textContent);
    const accents = section.querySelector('.hx-flavor-accents');
    function syncFruit() {
      const src = fruitAssets[section.dataset.activeFlavor];
      accents.hidden = !src;
      accents.querySelectorAll('img').forEach(img => {
        if (src) { if (img.getAttribute('src') !== src) img.src = src; }
        else img.removeAttribute('src');
      });
    }
    new MutationObserver(syncFruit).observe(section, {attributes:true, attributeFilter:['data-active-flavor']});
    syncFruit();
    const badge = section.querySelector('[data-review-badge]')?.content.querySelector('[data-average-rating]');
    const summary = section.querySelector('[data-review-summary]');
    if (badge && summary) {
      const rating = Number(badge.dataset.averageRating), count = Number(badge.dataset.numberOfReviews);
      if (rating > 0 && rating <= 5 && count > 0) {
        summary.textContent = `★ ${rating.toFixed(2)} / 5 · ${count} customer reviews ↗`;
      }
    }
    const mobile = matchMedia('(max-width: 749px)');
    const intro = section.querySelector('.hx-product-intro');
    const buybox = section.querySelector('.hx-buybox');
    const layout = section.querySelector('.product-seamoss__layout');
    const submit = section.querySelector('[data-product-submit]');
    const price = section.querySelector('[data-product-price]');
    const variants = JSON.parse(section.querySelector('[data-product-variants]').textContent);
    const input = section.querySelector('[data-product-variant-input]');
    const grids = [...section.querySelectorAll('.product-seamoss__flavor-grid')];
    const refreshPickers = [];
    grids.forEach((grid, index) => {
      const buttons = [...grid.querySelectorAll('[data-option-value]')];
      if (buttons.length <= 5) return;
      const quick = document.createElement('div');
      quick.className = 'hx-quick-flavors';
      const trigger = document.createElement('button');
      trigger.type = 'button'; trigger.className = 'hx-flavor-open';
      trigger.textContent = `View all ${buttons.length} flavors`;
      trigger.setAttribute('aria-haspopup', 'dialog');
      const dialog = document.createElement('dialog');
      dialog.className = 'hx-flavor-dialog';
      dialog.id = `${section.id}-flavor-dialog-${index}`;
      trigger.setAttribute('aria-controls', dialog.id);
      dialog.setAttribute('aria-label', 'Choose your flavor');
      dialog.innerHTML = '<header><div><p>FIND YOUR FAVORITE</p><h2>Pick your flavor.</h2></div><button type="button" data-close aria-label="Close flavor selector">×</button></header>';
      grid.before(quick, trigger);
      dialog.append(grid); section.append(dialog);
      grid.addEventListener('keydown', event => {
        const current = buttons.indexOf(document.activeElement);
        if (current < 0) return;
        let next = current;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault(); buttons[next].focus();
      });
      let oldOverflow = '';
      trigger.addEventListener('click', () => {
        oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        (buttons.find(b => b.classList.contains('is-active')) || buttons[0]).focus();
      });
      dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => {
        document.body.style.overflow = oldOverflow; trigger.focus({preventScroll:true});
      });
      function refresh() {
        const active = buttons.find(b => b.classList.contains('is-active'));
        const shown = buttons.slice(0, 5);
        if (active && !shown.includes(active)) shown[4] = active;
        quick.replaceChildren(...shown.map(original => {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'hx-quick-flavor';
          button.innerHTML = original.innerHTML;
          button.setAttribute('aria-label', original.dataset.optionValue);
          button.setAttribute('aria-pressed', String(original === active));
          button.addEventListener('click', () => {
            original.click();
            quick.querySelector(`[aria-label="${CSS.escape(original.dataset.optionValue)}"]`)?.focus({preventScroll:true});
          });
          return button;
        }));
      }
      buttons.forEach(button => button.addEventListener('click', () => { if (dialog.open) dialog.close(); refresh(); }));
      refreshPickers.push(refresh); refresh();
    });
    const sticky = document.createElement('div');
    sticky.className = 'hx-sticky-buy';
    sticky.innerHTML = '<div><strong>Sea Moss Gel</strong><span data-sticky-choice></span></div><button type="button" data-sticky-submit></button>';
    // Escape section stacking contexts so later photo sections cannot cover the CTA.
    sticky.hidden = true;
    sticky.dataset.productSection = section.id;
    if (section.classList.contains('hx-bold-pdp')) sticky.classList.add('hx-sticky-buy--bold');
    document.body.append(sticky);
    document.addEventListener('shopify:section:unload', event => {
      if (event.target.contains(section)) { observer.disconnect(); sticky.remove(); }
    });
    const stickyButton = sticky.querySelector('button');
    const activeSubmit = () => section.dataset.purchaseMode === 'mix' ? section.querySelector('[data-mix-submit]') : submit;
    stickyButton.addEventListener('click', () => activeSubmit()?.click());
    const update = () => {
      const variant = variants.find(v => String(v.id) === input.value);
      const active = activeSubmit();
      sticky.querySelector('[data-sticky-choice]').textContent = section.dataset.purchaseMode === 'mix' ? (section.querySelector('[data-mix-summary]')?.textContent || 'Mix your flavors') : `${variant?.option1 || ''} · ${price.textContent.trim()}`;
      stickyButton.disabled = active.disabled;
      stickyButton.textContent = active.textContent.trim();
    };
    new MutationObserver(update).observe(submit, {attributes:true, childList:true, subtree:true});
    new MutationObserver(update).observe(price, {childList:true, subtree:true});
    const observer = new IntersectionObserver(entries => { const entry = entries.find(e => e.target === activeSubmit()); if (entry) sticky.hidden = entry.isIntersecting; }, {threshold:0});
    observer.observe(submit); update();
    section.addEventListener('hx:mix-change', () => { observer.disconnect(); observer.observe(activeSubmit()); update(); });
    section.addEventListener('hx:variant-change', () => requestAnimationFrame(() => { update(); refreshPickers.forEach(fn => fn()); }));
    const media = section.querySelector('.product-seamoss__media');
    const pair = section.querySelector('.hx-pair');
    const benefits = section.querySelector('.hx-after-purchase-benefits');
    const pairHome = document.createComment('Pair mobile position');
    const benefitsHome = document.createComment('Benefits mobile position');
    pair?.before(pairHome);
    benefits?.before(benefitsHome);
    const visualColumn = document.createElement('div');
    visualColumn.className = 'hx-gallery-benefits-column';
    media.before(visualColumn);
    function positionVisualColumn() {
      // A tall gallery scrolls normally until its bottom is visible, then stays
      // alongside the remaining purchase controls, within the product grid.
      if (!mobile.matches) visualColumn.style.top = `${Math.min(100, window.innerHeight - visualColumn.offsetHeight - 80)}px`;
    }
    function arrange() {
      buybox.prepend(intro);
      if (mobile.matches) {
        layout.prepend(media);
        if (pair) pairHome.after(pair);
        if (benefits) benefitsHome.after(benefits);
        visualColumn.hidden = true;
      } else {
        visualColumn.hidden = false;
        visualColumn.append(media);
        if (benefits) visualColumn.append(benefits);
        if (pair) layout.after(pair);
      }
      positionVisualColumn();
    }
    const visualResize = new ResizeObserver(positionVisualColumn);
    visualResize.observe(visualColumn);
    window.addEventListener('resize', positionVisualColumn);
    document.addEventListener('shopify:section:unload', event => {
      if (event.target.contains(section)) {
        visualResize.disconnect();
        window.removeEventListener('resize', positionVisualColumn);
        mobile.removeEventListener('change', arrange);
      }
    });
    mobile.addEventListener('change', arrange); arrange();
    const dots = document.createElement('div'); dots.className = 'hx-gallery-dots'; dots.setAttribute('aria-label','Product photos');
    const main = media.querySelector('.product-seamoss__media-main');
    const mainImage = main.querySelector('[data-product-media-main]');
    const photoStatus = document.createElement('span');
    photoStatus.className = 'hx-photo-status';
    photoStatus.setAttribute('role', 'status');
    photoStatus.hidden = true;
    main.append(photoStatus);
    function syncPhotoLoading(failed = false) {
      // Browsers can retain the previous decoded image while a new src loads.
      const pending = !failed && !mainImage.hidden && (!mainImage.complete || mainImage.currentSrc !== mainImage.src);
      main.dataset.photoPending = String(pending || failed);
      main.setAttribute('aria-busy', String(pending));
      photoStatus.hidden = !pending && !failed;
      photoStatus.textContent = failed ? 'Photo unavailable. Try another image.' : 'Loading photo…';
    }
    mainImage.addEventListener('load', () => syncPhotoLoading());
    mainImage.addEventListener('error', () => syncPhotoLoading(true));
    function syncArtCopy() {
      syncPhotoLoading();
      main.querySelector('.hx-art-copy')?.remove();
      const tile = [...media.querySelectorAll('[data-product-thumb]')].find(t => !t.hidden && t.dataset.image === mainImage.getAttribute('src'));
      const copy = tile?.querySelector('.hx-art-copy');
      if (copy) main.append(copy.cloneNode(true));
    }
    new MutationObserver(syncArtCopy).observe(mainImage, {attributes:true, attributeFilter:['src']});
    syncArtCopy();
    main.after(dots);
    function photos() { return [...media.querySelectorAll('[data-product-thumb]')].filter(b => !b.hidden); }
    function paintDots() {
      const items = photos();
      dots.replaceChildren(...items.map((thumb, i) => {
        const dot = document.createElement('button'); dot.type = 'button';
        dot.setAttribute('aria-label', `View product photo ${i + 1}`);
        dot.setAttribute('aria-current', String(thumb.classList.contains('is-active')));
        dot.addEventListener('click', () => { thumb.click(); paintDots(); });
        return dot;
      }));
    }
    let touch;
    main.addEventListener('touchstart', e => { touch = [e.touches[0].clientX,e.touches[0].clientY]; }, {passive:true});
    main.addEventListener('touchend', e => {
      if (!mobile.matches || !touch) return;
      const dx=e.changedTouches[0].clientX-touch[0], dy=e.changedTouches[0].clientY-touch[1];
      if (Math.abs(dx)<45 || Math.abs(dx)<Math.abs(dy)) return;
      const items=photos(), i=items.findIndex(b=>b.classList.contains('is-active'));
      items[(i+(dx<0?1:-1)+items.length)%items.length]?.click(); paintDots();
    }, {passive:true});
    section.addEventListener('hx:gallery-updated', paintDots); paintDots();
    // Keep the existing 3D dialog available without its always-visible canvas tile.
    const spin = document.createElement('button'); spin.type='button'; spin.textContent='360° view';
    const tileButton = section.querySelector('.hx-3d-tile__expand');
    if (tileButton) {
      media.querySelector('.hx-gallery-tools').prepend(spin);
      spin.addEventListener('click',()=>tileButton.click());
      const syncSpin = () => { spin.hidden = section.querySelector('.hx-3d-tile').hidden; };
      section.addEventListener('hx:gallery-updated', syncSpin); syncSpin();
    }
  }
  const boot = () => document.querySelectorAll('.hx-clean-pdp').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
