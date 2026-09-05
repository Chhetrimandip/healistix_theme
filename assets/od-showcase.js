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
