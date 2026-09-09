(function () {
  'use strict';

  function initCarousel(section) {
    var track = section.querySelector('.od-bs__track');
    var prev = section.querySelector('.od-bs__arrow--prev');
    var next = section.querySelector('.od-bs__arrow--next');
    if (!track) return;

    function cardWidth() {
      var card = track.querySelector('.od-bs__card');
      if (!card) return 276;
      var gap = parseInt(getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    }

    function scroll(dir) {
      track.scrollBy({ left: dir * cardWidth() * 2, behavior: 'smooth' });
    }

    function sync() {
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    }

    if (prev) prev.addEventListener('click', function () { scroll(-1); });
    if (next) next.addEventListener('click', function () { scroll(1); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  function initForms(section) {
    section.querySelectorAll('form.od-bs__form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
        var body = new FormData(form);
        if (cart && typeof cart.getSectionsToRender === 'function') {
          body.append('sections', cart.getSectionsToRender().map(function (s) { return s.id; }).join(','));
          body.append('sections_url', window.location.pathname);
        }
        var label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Adding…';
        fetch('/cart/add', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/javascript' },
          body: body
        })
          .then(function (r) { return r.json(); })
          .then(function (json) {
            if (json.status) throw new Error(json.description);
            btn.textContent = 'Added ✓';
            if (cart && typeof cart.renderContents === 'function') cart.renderContents(json);
            else window.location.href = '/cart';
          })
          .catch(function () { btn.textContent = 'Try again'; })
          .finally(function () {
            btn.disabled = false;
            setTimeout(function () { btn.textContent = label; }, 1800);
          });
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-od-bs]').forEach(function (s) {
      initCarousel(s); initForms(s);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', function (e) {
    var s = e.target && e.target.querySelector('[data-od-bs]');
    if (s) { initCarousel(s); initForms(s); }
  });
})();
