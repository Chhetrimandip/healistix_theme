(() => {
  'use strict';
  const KEY = 'hx-hair-profile-v2';
  const choices = {
    concerns: { shedding: 'More shedding', thinning: 'Less fullness', breakage: 'Breakage', 'slow-growth': 'Less length', 'finer-hair': 'Finer strands' },
    area: { hairline: 'Hairline / temples', part: 'Along the part', crown: 'At the crown', 'all-over': 'All over', unsure: 'Not sure yet' },
    onset: { recent: 'Recently', months: 'Over the past few months', 'year-plus': 'A year or longer', unsure: 'Not sure when it began' },
    frequency: { occasional: 'Occasionally', frequent: 'Frequently', consistent: 'Consistently', unsure: 'Not sure yet' },
    tried: { supplements: 'Supplements', topicals: 'Topical products', 'routine-changes': 'Routine changes', 'professional-help': 'Professional guidance', nothing: 'Nothing yet' },
    desiredOutcome: { 'less-shedding': 'Less shedding', fullness: 'A fuller look', length: 'Retaining more length', 'overall-care': 'Overall hair care' },
    priority: { 'ingredient-clarity': 'Understand every ingredient', 'simple-routine': 'Keep my routine simple', 'personal-fit': 'Find a more personal fit' }
  };
  const listIsValid = (value, options) => Array.isArray(value) && value.length > 0 && value.length <= Object.keys(options).length && new Set(value).size === value.length && value.every((v) => typeof v === 'string' && Object.hasOwn(options, v));
  function validProfile(p) {
    return p && p.version === 2 && p.goal === 'hair-care' && p.base === 'sea-moss-gel' &&
      listIsValid(p.concerns, choices.concerns) && listIsValid(p.tried, choices.tried) &&
      !(p.tried.includes('nothing') && p.tried.length !== 1) &&
      ['area', 'onset', 'frequency', 'desiredOutcome', 'priority'].every((key) => typeof p[key] === 'string' && Object.hasOwn(choices[key], p[key])) &&
      typeof p.reviewRequired === 'boolean' && typeof p.completedAt === 'string' && Number.isFinite(Date.parse(p.completedAt));
  }
  function init(root) {
    if (root.dataset.blendInitialized) return;
    root.dataset.blendInitialized = 'true';
    const get = (s) => root.querySelector(s);
    const text = (s, value) => { const el = get(s); if (el) el.textContent = value; };
    const thumbs = Array.from(root.querySelectorAll('[data-blend-thumb]'));
    const slides = Array.from(root.querySelectorAll('[data-blend-slide]'));
    function selectImage(index) {
      if (!slides.some((slide) => slide.dataset.blendSlide === String(index))) return;
      slides.forEach((slide) => { slide.hidden = slide.dataset.blendSlide !== String(index); });
      thumbs.forEach((thumb) => thumb.setAttribute('aria-pressed', String(thumb.dataset.blendThumb === String(index))));
    }
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => selectImage(thumb.dataset.blendThumb));
      thumb.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? thumbs.length - 1 :
          (index + (event.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length;
        selectImage(thumbs[next].dataset.blendThumb);
        thumbs[next].focus();
      });
    });
    const demo = new URLSearchParams(window.location.search).get('preview') === '1';
    const cartRoot = (root.dataset.cartRoot || '/').replace(/\/?$/, '/');
    let config = {}, profile = null;
    try { config = JSON.parse(get('[data-blend-config]').textContent); } catch (_) { /* Buying stays disabled. */ }
    try { profile = JSON.parse(sessionStorage.getItem(KEY) || 'null'); }
    catch (_) {
      text('[data-blend-storage]', 'We could not read this tab’s hair profile. Try the quiz again or contact us.');
      get('[data-blend-storage]').hidden = false;
    }
    if (demo && !validProfile(profile)) profile = { version: 2, goal: 'hair-care', base: 'sea-moss-gel', concerns: ['shedding', 'thinning'], area: 'all-over', onset: 'months', frequency: 'frequent', tried: ['supplements', 'routine-changes'], desiredOutcome: 'less-shedding', priority: 'ingredient-clarity', reviewRequired: false, completedAt: new Date().toISOString() };
    if (!validProfile(profile)) return;
    get('[data-blend-empty]').hidden = true;
    get('[data-blend-result]').hidden = false;
    get('[data-blend-preview]').hidden = !demo;
    get('[data-blend-demo]').hidden = !demo;
    root.querySelectorAll('[data-blend-edit]').forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set('edit', '1');
      if (demo) url.searchParams.set('preview', '1');
      link.href = url.pathname + url.search;
    });
    const concerns = profile.concerns.map((v) => choices.concerns[v]);
    const tried = profile.tried.map((v) => choices.tried[v]);
    text('[data-blend-concerns]', concerns.join(' · '));
    text('[data-blend-area]', choices.area[profile.area]);
    text('[data-blend-onset]', choices.onset[profile.onset]);
    text('[data-blend-frequency]', choices.frequency[profile.frequency]);
    text('[data-blend-tried]', tried.join(' · '));
    text('[data-blend-outcome]', choices.desiredOutcome[profile.desiredOutcome]);
    text('[data-blend-buy-focus]', choices.desiredOutcome[profile.desiredOutcome]);
    text('[data-blend-hero-focus]', {
      shedding: 'For your shedding concerns.', thinning: 'For your thinning concerns.', breakage: 'With breakage in mind.', 'slow-growth': 'With your length goals in mind.', 'finer-hair': 'For your finer-hair concerns.'
    }[profile.concerns[0]]);
    text('[data-blend-hero-copy]', 'You told us about ' + concerns.map((v) => v.toLowerCase()).join(' and ') + '. Your goal is ' + choices.desiredOutcome[profile.desiredOutcome].toLowerCase() + '. Here is your custom sea moss gel direction, with the ingredients and reasoning in view.');
    text('[data-blend-preference-copy]', 'Your focus is ' + choices.desiredOutcome[profile.desiredOutcome].toLowerCase() + '. Amla and bhringaraj are the proposed botanical direction because of their place in the Duals hair-care catalog. Your answers do not determine herbal amounts or establish a treatment.');
    text('[data-blend-context-title]', 'Your pattern: ' + choices.area[profile.area].toLowerCase());
    text('[data-blend-context-copy]', 'You noticed changes ' + ({ recent: 'recently', months: 'over the past few months', 'year-plus': 'for a year or longer', unsure: 'without a clear starting point' }[profile.onset]) + ', ' + ({ occasional: 'occasionally', frequent: 'frequently', consistent: 'consistently', unsure: 'with a frequency you are still working out' }[profile.frequency]) + '. This keeps your experience central without guessing its cause.');
    text('[data-blend-tried-copy]', profile.tried.includes('nothing') ? 'You are starting fresh. Keep the ingredient explanation and product directions together, so you can make an informed first choice.' : 'You have tried ' + tried.map((v) => v.toLowerCase()).join(' and ') + '. This is another routine option to consider; it does not replace professional advice or an existing care plan.');
    text('[data-blend-priority-title]', choices.priority[profile.priority]);
    text('[data-blend-priority-copy]', {
      'ingredient-clarity': 'You want the why behind the ingredients. Explore the sea moss base and each proposed botanical below before making a decision.',
      'simple-routine': 'You want fewer moving parts. One finished sea moss gel would bring the base and approved herbal additions into a single product.',
      'personal-fit': 'You want your experience reflected. Your concerns, history and goals stay visible alongside the blend direction, and you can edit them at any time.'
    }[profile.priority]);
    get('[data-blend-clear]').addEventListener('click', () => {
      try { sessionStorage.removeItem(KEY); } catch (_) { /* Clear visible state even if storage is unavailable. */ }
      profile = null;
      get('[data-blend-result]').hidden = true;
      get('[data-blend-empty]').hidden = false;
      get('[data-blend-preview]').hidden = true;
      get('[data-blend-empty]').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (profile.reviewRequired) {
      text('[data-blend-status]', 'LET’S REVIEW THIS FIRST');
      text('[data-blend-next-copy]', 'Your answers call for a conversation before choosing a blend. We have paused the purchase step. Check product suitability with a qualified healthcare professional.');
      text('[data-blend-purchase-note]', 'No blend has been approved for you. Editing answers does not replace a suitability review.');
      get('[data-blend-demo]').hidden = true;
    }
    get('[data-blend-demo-cart]').addEventListener('click', () => {
      const summary = get('[data-blend-demo-summary]');
      summary.hidden = !summary.hidden;
      get('[data-blend-demo-cart]').setAttribute('aria-expanded', String(!summary.hidden));
    });
    // Browser answers shape the experience, never an arbitrary manufacturing formula.
    const eligible = !demo && !profile.reviewRequired && config.approvedFormat === 'sea-moss-gel' &&
      config.enabled === true && config.productUrl && config.variantId &&
      typeof config.formulaId === 'string' && config.formulaId.trim() &&
      typeof config.formulaVersion === 'string' && config.formulaVersion.trim();
    if (!eligible) return;
    const buy = get('[data-blend-buy]');
    let verifiedVariant = null;
    async function verifyProduct() {
      const url = new URL(config.productUrl, window.location.origin);
      if (url.origin !== window.location.origin) throw new Error('Product configuration could not be verified.');
      url.pathname = url.pathname.replace(/\.js$/, '') + '.js';
      url.search = '';
      const response = await fetch(url.toString(), { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Product details could not be loaded. Please try again.');
      const product = await response.json();
      const variant = product.variants.find((v) => String(v.id) === String(config.variantId));
      if (!variant || !variant.available || !Number.isFinite(variant.price) || variant.price < 0) throw new Error('This approved blend is currently unavailable.');
      return variant;
    }
    verifyProduct().then((variant) => {
      verifiedVariant = variant;
      get('[data-blend-approved]').hidden = false;
      buy.hidden = false;
      buy.disabled = false;
      get('[data-blend-contact]').hidden = true;
      text('[data-blend-status]', 'APPROVED PRODUCT AVAILABLE');
      text('[data-blend-next-copy]', 'Your finished sea moss blend is available. Review its exact ingredients and directions below before adding it to your routine.');
      text('[data-blend-price]', new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: config.currency || 'USD' }).format(variant.price / 100));
      text('[data-blend-purchase-note]', 'One-time purchase. Shipping and any tax calculated at checkout.');
    }).catch((error) => text('[data-blend-error]', error.message));
    buy.addEventListener('click', async () => {
      if (!profile || !verifiedVariant || buy.disabled) return;
      buy.disabled = true;
      text('[data-blend-error]', '');
      try {
        const currentVariant = await verifyProduct();
        if (currentVariant.price !== verifiedVariant.price) {
          verifiedVariant = currentVariant;
          text('[data-blend-price]', new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: config.currency || 'USD' }).format(currentVariant.price / 100));
          throw new Error('The price has changed. Review the updated price and add again when ready.');
        }
        const response = await fetch(cartRoot + 'cart/add.js', {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [{ id: currentVariant.id, quantity: 1, properties: { 'Formula': config.formulaId, 'Formula version': config.formulaVersion, 'Format': 'Sea moss gel', '_hx_source': 'find-my-blend', '_hx_profile_version': '2' } }] })
        });
        if (!response.ok) throw new Error('We could not add this blend. Please check availability and try again.');
        window.location.assign(cartRoot + 'cart');
      } catch (error) { text('[data-blend-error]', error.message || 'Something went wrong. Please try again.'); buy.disabled = false; }
    });
  }
  document.querySelectorAll('[data-hx-blend]').forEach(init);
  document.addEventListener('shopify:section:load', (event) => event.target.querySelectorAll('[data-hx-blend]').forEach(init));
})();
