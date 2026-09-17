// Isolated browser audit: no customer data, signup submission, or order placement.
const { chromium } = require('playwright');
const fs = require('fs');
const out = 'staging/launch-audit-20260908';
(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  const context = await browser.newContext();
  await context.addInitScript(() => { try { localStorage.setItem('hx_popup_ts', String(Date.now())); } catch (_) {} });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const results = [], errors = [];
  page.on('pageerror', e => errors.push({url:page.url(),message:e.message}));
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({width,height:900});
      for (const path of ['/', '/products/sea-moss-gel','/products/raw-honduran-batana-oil','/products/himalayan-shilajit','/collections/all','/pages/contact','/cart']) {
        try {
          await page.goto('http://127.0.0.1:9292'+path, {waitUntil:'domcontentloaded',timeout:35000});
          await page.waitForTimeout(1200);
          const state = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            brokenImages:[...document.querySelectorAll('main img')].filter(i => i.getBoundingClientRect().width && i.complete && !i.naturalWidth).map(i=>({alt:i.alt,src:i.currentSrc})),
            deadAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a => a.getBoundingClientRect().width && (a.hash.length < 2 || !document.getElementById(decodeURIComponent(a.hash.slice(1))))).map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')})),
            productSchema:[...document.querySelectorAll('script[type="application/ld+json"]')].some(s => /"@type"\s*:\s*"Product"/.test(s.textContent))
          }));
          results.push({width,path,...state});
          if (width===390 && (path==='/' || path.startsWith('/products/'))) await page.screenshot({path:`${out}/mobile-${path.split('/').pop() || 'home'}.png`,fullPage:true});
          console.log(JSON.stringify(results.at(-1)));
        } catch(e) { results.push({width,path,error:e.message}); }
      }
    }
    await page.goto('http://127.0.0.1:9292/products/sea-moss-gel',{waitUntil:'domcontentloaded'});
    const flavors = await page.locator('[data-option-value]').evaluateAll(nodes => nodes.map(n=>n.dataset.optionValue));
    for (const flavor of flavors) {
      await page.locator('[data-option-value]').filter({hasText:flavor}).first().click();
      results.push({flavor, state:await page.evaluate(()=>({
        selected:document.querySelector('[data-flavor-current-name]')?.textContent,
        id:document.querySelector('[data-product-variant-input]')?.value,
        disabled:document.querySelector('[data-product-submit]')?.disabled,
        price:document.querySelector('[data-product-price]')?.textContent,
        labelAvailable:!document.querySelector('[data-hx-nutrition-toggle]')?.hidden,
        emptyPhoto:document.querySelector('[data-gallery-empty]')?.hidden===false
      }))});
    }
    await page.locator('[data-option-value="Banana"]').click();
    await page.locator('[data-quantity-plus]').click();
    await page.locator('[data-product-submit]').click();
    await page.waitForTimeout(1800);
    results.push({action:'sea-moss-UI-add-two',cart:await context.request.get('http://127.0.0.1:9292/cart.js').then(r=>r.json()).then(c=>({count:c.item_count,items:c.items.map(i=>({id:i.id,quantity:i.quantity,title:i.title}))}))});
    for (const handle of ['raw-honduran-batana-oil','himalayan-shilajit']) {
      await page.goto('http://127.0.0.1:9292/products/'+handle,{waitUntil:'domcontentloaded'});
      await page.getByRole('button',{name:'Add to cart',exact:true}).click();
      await page.waitForTimeout(1200);
      results.push({action:handle+'-UI-add',url:page.url()});
    }
    await page.goto('http://127.0.0.1:9292/cart',{waitUntil:'domcontentloaded'});
    results.push({action:'final-cart',cart:await context.request.get('http://127.0.0.1:9292/cart.js').then(r=>r.json()).then(c=>({count:c.item_count,total:c.total_price,items:c.items.map(i=>({id:i.id,quantity:i.quantity,title:i.title}))}))});
    await page.locator('#checkout').click();
    await page.waitForTimeout(2500);
    results.push({action:'checkout-navigation',url:page.url(),title:await page.title()});
  } catch(e) { results.push({error:e.stack}); }
  finally {
    fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify({results,errors},null,2));
    console.log(JSON.stringify({results:results.filter(r=>!r.width),errors}));
    await browser.close();
  }
})();
