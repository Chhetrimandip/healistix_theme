/* The desktop collage stays in place while a separate dialog browses its images. */
(() => {
  function initialize(section) {
    if (section.dataset.collageReady) return;
    section.dataset.collageReady = 'true';
    const media = section.querySelector('.product-seamoss__media');
    const hero = section.querySelector('[data-product-media-main]');
    const opener = section.querySelector('[data-gallery-open]');
    const desktop = window.matchMedia('(min-width: 750px)');
    const jar = section.querySelector('hx-jar-viewer');
    const jarTile = document.createElement('div');
    jarTile.className = 'hx-3d-tile';
    jarTile.dataset.gallery3d = '';
    jarTile.innerHTML = '<span class="hx-3d-tile__label">A closer look, from every angle.</span><button type="button" class="hx-3d-tile__expand" aria-label="Enlarge interactive 3D jar">360° ↗</button>';
    if (jar) {
      jar.setAttribute('data-embedded', '');
      jarTile.append(jar);
      media.querySelector('.product-seamoss__media-thumbs').prepend(jarTile);
      section.querySelector('[data-jar-trigger]')?.remove();
      section.querySelector('[data-gallery-return]')?.remove();
    }
    const dialog = document.createElement('dialog');
    dialog.className = 'hx-gallery-dialog';
    dialog.setAttribute('aria-label', 'Product image gallery');
    dialog.innerHTML = `<div class="hx-gallery-dialog__stage">
      <button type="button" class="hx-gallery-dialog__close" aria-label="Close image gallery">×</button>
      <button type="button" class="hx-gallery-dialog__prev" aria-label="Previous image">‹</button>
      <figure><div class="hx-gallery-dialog__frame"><img alt="" width="1200" height="1200"></div>
        <figcaption><span data-gallery-description></span><span data-gallery-count aria-live="polite"></span></figcaption>
      </figure>
      <button type="button" class="hx-gallery-dialog__next" aria-label="Next image">›</button>
      <p class="hx-gallery-dialog__hint">Use ← → to browse · Esc to close</p>
    </div>`;
    section.append(dialog);
    const picture = dialog.querySelector('img');
    const frame = dialog.querySelector('.hx-gallery-dialog__frame');
    const previous = dialog.querySelector('.hx-gallery-dialog__prev');
    const next = dialog.querySelector('.hx-gallery-dialog__next');
    let modalJar;
    let items = [], index = 0, returnFocus, oldOverflow;
    function available() {
      const photos = [...media.querySelectorAll('[data-product-thumb]')].filter(button => !button.hidden && button.dataset.image);
      if (jar?.available) photos.splice(1, 0, jarTile);
      return photos;
    }
    function refresh() {
      const photos = available();
      jarTile.hidden = !jar?.available;
      const cover = photos.find(button => button.hasAttribute('data-gallery-cover')) || photos[0];
      if (cover && jar && cover.nextElementSibling !== jarTile) cover.after(jarTile);
      media.querySelectorAll('[data-product-thumb]').forEach(button => button.classList.toggle('is-collage-cover', button === cover));
      opener.hidden = !photos.length || hero.hidden;
      opener.setAttribute('aria-label', `Enlarge ${section.dataset.activeFlavor || ''} product image`);
      if (desktop.matches && cover && !section.classList.contains('is-jar-open')) {
        hero.src = cover.dataset.image;
        hero.alt = cover.querySelector('img').alt;
        media.querySelectorAll('[data-product-thumb]').forEach(button => button.classList.toggle('is-active', button === cover));
      }
    }
    function show(position) {
      index = (position + items.length) % items.length;
      const item = items[index];
      const is3d = item === jarTile;
      frame.querySelector('.hx-art-copy')?.remove();
      const artCopy = item.querySelector('.hx-art-copy');
      if (artCopy) frame.append(artCopy.cloneNode(true));
      picture.hidden = is3d;
      frame.classList.toggle('is-3d', is3d);
      modalJar?.close();
      if (is3d) {
        if (!modalJar) {
          modalJar = jar.cloneNode(true);
          modalJar.querySelectorAll('canvas').forEach(canvas => canvas.remove());
          frame.append(modalJar);
        }
        modalJar.open(false);
      } else {
        picture.src = item.dataset.image;
        picture.alt = item.querySelector('img').alt;
      }
      frame.classList.toggle('is-package', item.hasAttribute('data-gallery-cover') && !item.hasAttribute('data-gallery-story'));
      dialog.querySelector('[data-gallery-description]').textContent = is3d ? 'Drag to explore your jar in 360°' : picture.alt;
      dialog.querySelector('[data-gallery-count]').textContent = `${index + 1} / ${items.length}`;
      previous.hidden = next.hidden = items.length < 2;
    }
    function open(button, trigger) {
      items = available();
      if (!items.length) return;
      returnFocus = trigger;
      show(Math.max(0, items.indexOf(button)));
      oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      dialog.querySelector('.hx-gallery-dialog__close').focus();
    }
    opener.addEventListener('click', () => {
      const photos = available();
      open(photos.find(button => button.dataset.image === hero.getAttribute('src')) || photos[0], opener);
    });
    jarTile.querySelector('button').addEventListener('click', event => open(jarTile, event.currentTarget));
    section.querySelector('[data-gallery-return]')?.addEventListener('click', () => {
      section.querySelector('hx-jar-viewer')?.close();
      refresh();
      opener.focus({ preventScroll: true });
    });
    media.addEventListener('click', event => {
      const tile = event.target.closest('[data-product-thumb]');
      if (!tile || !desktop.matches) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open(tile, tile);
    }, true);
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    dialog.querySelector('.hx-gallery-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.classList.contains('hx-gallery-dialog__stage')) dialog.close();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('close', () => {
      modalJar?.close();
      document.body.style.overflow = oldOverflow;
      returnFocus?.focus({ preventScroll: true });
    });
    let touchX;
    frame.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', event => {
      const distance = event.changedTouches[0].clientX - touchX;
      if (Math.abs(distance) > 50) show(index + (distance < 0 ? 1 : -1));
    }, { passive: true });
    section.addEventListener('hx:gallery-updated', () => { if (dialog.open) dialog.close(); modalJar?.close(); refresh(); });
    desktop.addEventListener('change', refresh);
    refresh();
  }
  const boot = () => document.querySelectorAll('.hx-bloom-pdp').forEach(initialize);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', boot);
})();
