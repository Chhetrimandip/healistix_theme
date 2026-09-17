(() => {
  function init(section) {
    if (section.dataset.mixReady) return;
    const pickerValues = new Set([...section.querySelectorAll('[data-option-value]')].map(button => button.dataset.optionValue));
    const variants = JSON.parse(section.querySelector('[data-product-variants]').textContent).filter(variant => pickerValues.has(variant.option1));
    const popular = ['Banana','Blueberry','Mango','Pineapple','Watermelon'];
    const rank = v => popular.includes(v.option1) ? popular.indexOf(v.option1) : popular.length;
    variants.sort((a,b) => rank(a)-rank(b));
    // A row must identify an actual, unambiguous jar variant.
    if (Number(section.dataset.optionCount) !== 1 || variants.length < 2) return;
    section.dataset.mixReady = 'true';
    const native = section.querySelector('[data-product-submit]');
    const form = native.closest('form');
    const flavorBlock = form.querySelector('.product-seamoss__flavor-block');
    const money = cents => new Intl.NumberFormat(document.documentElement.lang || 'en', {style:'currency',currency:section.dataset.currency}).format(cents / 100);
    const mode = document.createElement('div'); mode.className = 'hx-buy-mode'; mode.setAttribute('aria-label','Choose how to shop');
    mode.innerHTML = '<button type="button" aria-pressed="true">One flavor</button><button type="button" aria-pressed="false">Mix your flavors</button>';
    const panel = document.createElement('div'); panel.className = 'hx-mix'; panel.hidden = true;
    panel.innerHTML = '<p class="hx-mix-intro">Pick your favorites. Add them together.</p><div class="hx-mix-rows"></div><button type="button" class="hx-mix-more">View all flavors</button><p data-mix-summary aria-live="polite"></p><button type="button" data-mix-submit></button><p class="hx-mix-note">One-time purchase · Jars priced individually</p><p data-mix-error role="alert" hidden></p>';
    flavorBlock.before(mode,panel);
    const purchaseFor = v => section.hxPurchase ? section.hxPurchase(v) : {valid: true, price: v.price, plan: ''};
    const quantities = new Map(variants.map(v => [v.id,0]));
    const rows = panel.querySelector('.hx-mix-rows');
    const more = panel.querySelector('.hx-mix-more');
    const add = panel.querySelector('[data-mix-submit]');
    const error = panel.querySelector('[data-mix-error]');
    let expanded = false, initialized = false, busy = false;
    window.addEventListener('pageshow', event => { if (event.persisted) { busy=false; render(); } });
    const controls = [];
    function render() {
      let total = 0, count = 0, invalid = false;
      controls.forEach(({v,row,input,minus,plus,price},i) => {
        const qty = quantities.get(v.id), purchase = purchaseFor(v);
        count += qty; total += qty * (purchase.price || 0);
        if (qty && !purchase.valid) invalid = true;
        price.textContent = !v.available ? 'Sold out' : purchase.valid ? money(purchase.price) : 'Unavailable for this plan';
        input.value = qty; input.disabled = busy || !v.available;
        minus.disabled = busy || qty === 0; plus.disabled = busy || !v.available || qty >= 99;
        row.hidden = !expanded && i >= 5 && qty === 0;
      });
      more.hidden = variants.length <= 5;
      more.textContent = expanded ? 'Show fewer flavors' : `View all ${variants.length} flavors`;
      more.setAttribute('aria-expanded',String(expanded));
      panel.querySelector('[data-mix-summary]').textContent = `${count} ${count === 1 ? 'jar' : 'jars'} selected · ${money(total)}`;
      add.disabled = busy || count === 0 || invalid;
      panel.querySelector('.hx-mix-note').textContent = invalid ? 'Some selected flavors are unavailable for this purchase option. Change the option or remove those jars.' : section.querySelector('[data-hx-plan]')?.value ? 'Subscription · Renews on the selected schedule' : 'One-time purchase · Jars priced individually';
      const selector = section.querySelector('[data-hx-plan]'); if (selector) selector.disabled = busy;
      add.textContent = invalid ? 'Review selected flavors' : busy ? 'Adding your jars…' : count ? `Add ${count} ${count === 1 ? 'jar' : 'jars'} · ${money(total)}` : 'Choose at least one jar';
      mode.querySelectorAll('button').forEach(b => b.disabled = busy);
      if (section.dataset.purchaseMode === 'mix') section.hxRenderOffer?.(variants.filter(v => quantities.get(v.id) > 0).map(variant => ({variant, quantity: quantities.get(variant.id)})));
      section.dispatchEvent(new CustomEvent('hx:mix-change'));
    }
    variants.forEach(v => {
      const row = document.createElement('div'); row.className = 'hx-mix-row';
      const original = [...section.querySelectorAll('[data-option-value]')].find(b => b.dataset.optionValue === v.option1);
      const preview = document.createElement('button'); preview.type = 'button'; preview.className = 'hx-mix-preview'; preview.setAttribute('aria-label',`Preview ${v.option1}`);
      const photo = original?.querySelector('img'); if (photo) { const img = photo.cloneNode(); img.alt = ''; preview.append(img); }
      preview.addEventListener('click',() => original?.click());
      const name = document.createElement('div'); const title = document.createElement('strong'); title.textContent = v.option1;
      const price = document.createElement('small'); price.textContent = v.available ? money(v.price) : 'Sold out'; name.append(title,price);
      const benefit = original?.querySelector('.hx-flavor-benefit');
      if (benefit) name.append(benefit.cloneNode(true));
      const stepper = document.createElement('div'); stepper.className='hx-mix-stepper';
      const minus=document.createElement('button'), plus=document.createElement('button'), input=document.createElement('input');
      minus.type=plus.type='button'; minus.textContent='−'; plus.textContent='+';
      minus.setAttribute('aria-label',`Remove one ${v.option1} jar`); plus.setAttribute('aria-label',`Add one ${v.option1} jar`);
      input.type='number'; input.min='0'; input.max='99'; input.step='1'; input.inputMode='numeric'; input.setAttribute('aria-label',`${v.option1} jars`);
      const set = n => { quantities.set(v.id,v.available ? Math.max(0,Math.min(99,Math.floor(Number(n)||0))) : 0); error.hidden=true; render(); };
      minus.addEventListener('click',() => set(quantities.get(v.id)-1)); plus.addEventListener('click',() => set(quantities.get(v.id)+1)); input.addEventListener('change',() => set(input.value));
      stepper.append(minus,input,plus); row.append(preview,name,stepper); rows.append(row); controls.push({v,row,input,minus,plus,price});
    });
    mode.querySelectorAll('button').forEach((button,i) => button.addEventListener('click',() => {
      section.dataset.purchaseMode = i ? 'mix' : 'single'; panel.hidden = !i;
      const options = section.querySelector('[data-hx-subscriptions]');
      if (options) { if (i) panel.querySelector('[data-mix-summary]').before(options); else form.querySelector('.product-seamoss__purchase').before(options); }
      mode.querySelectorAll('button').forEach((b,j) => b.setAttribute('aria-pressed',String(i===j)));
      if (i && !initialized) {
        const selected = variants.find(v => String(v.id) === section.querySelector('[data-product-variant-input]').value);
        if (selected?.available) quantities.set(selected.id,1);
        initialized = true;
      }
      if (!i) section.querySelector('[data-hx-plan]')?.dispatchEvent(new Event('change'));
      render();
    }));
    section.addEventListener('hx:purchase-change', render);
    more.addEventListener('click',() => { expanded=!expanded; render(); });
    form.addEventListener('submit',e => { if (section.dataset.purchaseMode === 'mix') { e.preventDefault(); e.stopImmediatePropagation(); if (!add.disabled) add.click(); } },true);
    add.addEventListener('click',async () => {
      if (busy || add.disabled) return;
      const items = variants.filter(v=>quantities.get(v.id)>0).map(v=>({id:v.id,quantity:quantities.get(v.id),...(purchaseFor(v).plan ? {selling_plan: purchaseFor(v).plan} : {})}));
      busy=true; error.hidden=true; render();
      const root = section.dataset.cartRoot;
      const drawer = document.querySelector('cart-drawer');
      if (drawer) drawer.setActiveElement(add);
      try {
        const response = await fetch(`${root}cart/add.js`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({items, ...(drawer ? {sections: drawer.getSectionsToRender().map(s => s.id), sections_url: window.location.pathname} : {})})});
        const result = await response.json();
        if (!response.ok) throw new Error(result.description || result.message || 'These quantities could not be added.');
        if (drawer && result.sections && Object.values(result.sections).every(Boolean)) {
          drawer.classList.remove('is-empty');
          drawer.renderContents(result);
          busy=false; render();
        } else {
          window.location.assign(`${root}cart`);
        }
      } catch (err) {
        error.textContent = `${err.message} Please review your cart before trying again.`; error.hidden=false;
        const link=document.createElement('a');link.href=`${root}cart`;link.textContent=' View cart';error.append(link);
        busy=false; render();
      }
    });
    render();
  }
  const boot=()=>document.querySelectorAll('.hx-clean-pdp').forEach(init);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);else boot();
})();
