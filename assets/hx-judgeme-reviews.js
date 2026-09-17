(() => {
  // Presentation only: Judge.me still owns content, pagination and moderation.
  // Keep import context visible outside the app's truncated review body.
  function initialize(root) {
    if (root.dataset.jmPresentationReady) return;
    root.dataset.jmPresentationReady = 'true';
    const featured = root.querySelector('.hx-jm-featured');
    const view = root.querySelector('.hx-jm-view');
    const choice = view.querySelector('select');
    root.dataset.reviewView = 'featured';
    view.hidden = false;
    featured.hidden = false;
    function setView(value) {
      root.dataset.reviewView = value;
      choice.value = value;
      featured.hidden = value !== 'featured';
      requestAnimationFrame(() => carousels.forEach(carousel => carousel.update()));
    }
    choice.addEventListener('change', () => setView(choice.value));
    root.addEventListener('click', event => {
      if (event.target.closest('[data-all-reviews]')) setView('all');
      // Rating/filter clicks always reveal the full native review collection.
      if (event.target.closest('.jm-histogram, .jm-rating-distribution, button[aria-label="Filters"]')) setView('all');
      const tile = event.target.closest('[data-media-dialog]');
      if (tile) {
        const dialog = document.getElementById(tile.dataset.mediaDialog);
        dialog.showModal();
      }
      if (event.target.closest('.hx-jm-dialog__close')) event.target.closest('dialog').close();
    });
    root.querySelectorAll('.hx-jm-dialog').forEach(dialog => {
      dialog.addEventListener('close', () => dialog.querySelector('video')?.pause());
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      });
    });
    const carousels = new Map();
    function enhanceCarousel(track, native) {
      if (carousels.has(track)) { carousels.get(track).update(); return; }
      track.classList.add('hx-jm-carousel');
      track.id ||= `${root.id}-reviews-${native ? 'all' : 'featured'}`;
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', native ? 'Customer review cards on this page' : 'Featured customer review cards');
      track.tabIndex = 0;
      const controls = document.createElement('div');
      controls.className = 'hx-jm-carousel-controls';
      if (native) controls.dataset.nativeReviews = '';
      const previous = document.createElement('button');
      const next = document.createElement('button');
      const status = document.createElement('span');
      previous.type = next.type = 'button';
      previous.textContent = '\u2190';
      next.textContent = '\u2192';
      previous.setAttribute('aria-label', 'Previous review');
      next.setAttribute('aria-label', 'Next review');
      previous.setAttribute('aria-controls', track.id);
      next.setAttribute('aria-controls', track.id);
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      controls.append(previous, status, next);
      track.after(controls);
      const cards = () => [...track.children].filter(child => child.matches('.hx-jm-featured__review, .jm-review-item, .jdgm-rev'));
      function update() {
        const items = cards();
        const overflow = track.scrollWidth - track.clientWidth;
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= overflow - 2;
        controls.hidden = !track.clientWidth || items.length < 2 || overflow < 2;
        const left = track.getBoundingClientRect().left;
        const first = items.reduce((nearest, item, index) => Math.abs(item.getBoundingClientRect().left - left) < Math.abs(items[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
        const label = items.length ? `${Math.max(0, first) + 1} / ${items.length}` : '';
        if (status.textContent !== label) status.textContent = label;
      }
      function move(direction) {
        const items = cards();
        const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
        track.scrollBy({left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      }
      previous.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));
      track.addEventListener('keydown', event => {
        if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      });
      track.addEventListener('scroll', update, {passive: true});
      const resize = new ResizeObserver(update);
      resize.observe(track);
      carousels.set(track, {update, resize, controls});
      update();
    }
    function enhance() {
      carousels.forEach((carousel, track) => {
        if (!root.contains(track)) {
          carousel.resize.disconnect();
          carousel.controls.remove();
          carousels.delete(track);
        }
      });
      root.querySelectorAll('[data-review-carousel], .jdgm-review-list').forEach(track => enhanceCarousel(track, track.matches('.jdgm-review-list')));
      const header = root.querySelector('.jm-review-widget-header');
      const media = root.querySelector('.hx-jm-media');
      if (header && media && media.parentNode !== header) header.append(media);
      const summary = root.querySelector('.jm-review-widget-header__summary-section');
      const histogram = root.querySelector('.jm-histogram');
      if (header && summary && histogram && !header.querySelector('.hx-jm-summary')) {
        const group = document.createElement('div');
        group.className = 'hx-jm-summary';
        group.append(summary, histogram);
        header.prepend(group);
      }
      const body = root.querySelector('.jm-review-widget__body');
      if (body && view.parentNode !== body) {
        body.prepend(view, featured);
      }

      root.querySelectorAll('.jm-review-item').forEach(item => {
        const note = [...item.querySelectorAll('.jdgm-review-content__body-content p')]
          .find(p => p.textContent.trim().startsWith('[Merchant-added review context]'));
        if (!note) return;
        const lines = note.textContent.split(/\n/).map(s => s.trim()).filter(Boolean);
        const signature = lines.join('\n');
        const existing = item.querySelector('.hx-jm-context');
        function hideDuplicateFields() {
          item.querySelectorAll('.jm-text-answer').forEach(answer => {
            if (['Flavor', 'Source review ID', 'Source URL', 'Disclosure'].includes(answer.firstElementChild?.textContent.trim())) {
              answer.classList.add('hx-jm-context-original');
            }
          });
        }
        if (existing?.dataset.signature === signature) { hideDuplicateFields(); return; }
        const context = document.createElement('div');
        context.className = 'hx-jm-context';
        context.dataset.signature = signature;
        function paragraph(text) {
          const p = document.createElement('p');
          p.textContent = text;
          context.append(p);
        }
        lines.filter(line => /^(Source listing flavor:|Reviewed flavor:|Selected excerpt|Text scope:|Review text:)/.test(line)).forEach(paragraph);
        const target = item.querySelector('.jm-review-item__content');
        if (!target) return;
        if (existing) existing.replaceWith(context); else target.append(context);
        note.classList.add('hx-jm-context-original');
        // These imported metadata fields duplicate the visible context above.
        // Other customer answers and the native review body are unaffected.
        hideDuplicateFields();
      });
    }
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; enhance(); });
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    enhance();
    document.addEventListener('shopify:section:unload', event => {
      if (event.target.contains(root)) {
        observer.disconnect();
        carousels.forEach(carousel => carousel.resize.disconnect());
      }
    });
  }
  document.querySelectorAll('.hx-judgeme').forEach(initialize);
  document.addEventListener('shopify:section:load', event => event.target.querySelectorAll('.hx-judgeme').forEach(initialize));
})();
