/* Batana page — scroll reveals, count-ups, bar fills. Loaded once, guarded. */
(function () {
  if (window.__btPageInit) return;
  window.__btPageInit = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var revealSelectors = [
      '.bt-section .bt-h2',
      '.bt-section .bt-sub',
      '.bt-eyebrow',
      '.bt-offer',
      '.bt-feature',
      '.bt-features__img',
      '.bt-quote__card',
      '.bt-concerns__tab',
      '.bt-concerns__panel.is-active',
      '.bt-stats__item',
      '.bt-ba__card',
      '.bt-banner__heading',
      '.bt-split__card',
      '.bt-source__card',
      '.bt-tested__card',
      '.bt-badges__item',
      '.bt-nutrients__card',
      '.bt-nutrients__factbox',
      '.bt-timeline__item',
      '.bt-vs__col',
      '.bt-tagline__heading',
      '.bt-faq__list details',
      '.bt-cta .bt-btn'
    ];

    var nodes = document.querySelectorAll(revealSelectors.join(','));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('bt-reveal', 'is-visible'); });
      return;
    }

    function activate(el) {
      el.classList.add('is-visible');

      // count-up for stat numbers
      if (el.classList.contains('bt-stats__item') || el.classList.contains('bt-tested__card')) {
        var numEl = el.querySelector('.bt-stats__num, .bt-tested__num');
        if (numEl && !numEl.dataset.btCounted) {
          numEl.dataset.btCounted = '1';
          countUp(numEl);
        }
      }

      // bar fill for tested cards
      if (el.classList.contains('bt-tested__card')) {
        var fill = el.querySelector('.bt-tested__fill');
        if (fill && !fill.dataset.btFilled) {
          fill.dataset.btFilled = '1';
          var target = fill.style.width;
          fill.style.transition = 'none';
          fill.style.width = '0%';
          setTimeout(function () {
            fill.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.4, 1) 0.2s';
            fill.style.width = target;
          }, 60);
        }
      }
    }

    // stagger siblings that share a parent
    var parentCounts = new Map();
    var deferred = [];
    var viewportEdge = window.innerHeight * 0.92;

    nodes.forEach(function (n) {
      n.classList.add('bt-reveal');
      var p = n.parentElement;
      var i = parentCounts.get(p) || 0;
      n.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
      parentCounts.set(p, i + 1);

      // anything in (or above) the first viewport reveals right away —
      // synchronously, so it never depends on rAF/observer timing
      if (n.getBoundingClientRect().top < viewportEdge) {
        n.style.transitionDelay = '0ms';
        activate(n);
      } else {
        deferred.push(n);
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    deferred.forEach(function (n) { io.observe(n); });

    // last-resort safety: if anything is still hidden after 8s of the user
    // scrolling past it (IO throttled, odd embeds), reveal on scroll check
    var safety = function () {
      deferred.forEach(function (n) {
        if (!n.classList.contains('is-visible') && n.getBoundingClientRect().top < window.innerHeight) {
          activate(n);
        }
      });
    };
    window.addEventListener('scroll', safety, { passive: true });

    function countUp(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([^0-9]*)([0-9][0-9,\.]*)(.*)$/);
      if (!match) return;
      var prefix = match[1];
      var suffix = match[3];
      var target = parseFloat(match[2].replace(/,/g, ''));
      if (!isFinite(target) || target <= 0) return;
      var useCommas = match[2].indexOf(',') !== -1;
      var duration = 1300;
      var start = null;

      function fmt(v) {
        var n = Math.round(v);
        return useCommas ? n.toLocaleString('en-US') : String(n);
      }

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);

      // guarantee the final value even if rAF is throttled
      setTimeout(function () {
        el.textContent = prefix + fmt(target) + suffix;
      }, duration + 600);
    }
  });
})();
