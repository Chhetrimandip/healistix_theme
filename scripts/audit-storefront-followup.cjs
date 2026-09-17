const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:900}});
 const page=await context.newPage(); page.setDefaultTimeout(15000);
 const results=[],errors=[]; page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:9292/products/sea-moss-gel',{waitUntil:'domcontentloaded'});
  for(const flavor of ['Banana','Orange','Beet Root']) {
   await page.locator(`[data-option-value="${flavor}"]`).click();
   await page.locator('[data-hx-nutrition-toggle]').click();
   results.push({flavor,drawer:await page.locator(`[data-flavor-label="${flavor}"]`).innerText()});
   await page.keyboard.press('Escape');
  }
  await context.request.post('http://127.0.0.1:9292/cart/add.js',{data:{items:[{id:47331891937418,quantity:1}]}});
  await page.goto('http://127.0.0.1:9292/cart',{waitUntil:'domcontentloaded'});
  await page.locator('#Quantity-1').fill('3'); await page.locator('#Quantity-1').press('Tab');
  await page.waitForTimeout(1800);
  results.push({action:'cart-quantity-three',count:await context.request.get('http://127.0.0.1:9292/cart.js').then(r=>r.json()).then(c=>c.item_count)});
  await page.locator('cart-remove-button a').first().click(); await page.waitForTimeout(1500);
  results.push({action:'cart-remove',count:await context.request.get('http://127.0.0.1:9292/cart.js').then(r=>r.json()).then(c=>c.item_count)});
  await page.goto('http://127.0.0.1:9292/products/raw-honduran-batana-oil',{waitUntil:'domcontentloaded'});
  await page.locator('footer').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  results.push({action:'footer-visible',text:await page.locator('footer').innerText()});
  await page.evaluate(()=>scrollTo(0,600)); await page.waitForTimeout(300);
  await page.screenshot({path:'staging/launch-audit-20260908/mobile-batana-reading.png'});
 }catch(e){results.push({error:e.stack});}
 finally{fs.writeFileSync('staging/launch-audit-20260908/followup-results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));await browser.close();}
})();
