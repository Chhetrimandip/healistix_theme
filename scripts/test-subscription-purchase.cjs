const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/products/sea-moss-gel',async route=>{
  const response=await route.fetch();let html=await response.text();
  html=html.replace(/(<script type="application\/json" data-hx-subscription-data>)([\s\S]*?)(<\/script>)/,(_,a,b,c)=>{
   const data=JSON.parse(b);for(const v of Object.values(data.variants))v.plans=[{id:'123456',price:2250}];
   return a+JSON.stringify(data)+c+'<fieldset class="hx-subscription-options" data-hx-subscriptions><legend>Your ritual, on repeat.</legend><label for="test-plan">Purchase option</label><select id="test-plan" name="selling_plan" data-hx-plan><option value="">One-time purchase</option><option value="123456">Deliver every month · Save 10%</option></select><p data-hx-plan-note></p></fieldset>';
  });await route.fulfill({response,body:html});
 });
 await page.goto('http://127.0.0.1:9292/products/sea-moss-gel',{waitUntil:'domcontentloaded'});
 await page.locator('[data-hx-plan]').selectOption('123456');
 assert.match(await page.locator('[data-product-submit]').innerText(),/Subscribe.*22.50/);
 await page.locator('[data-quantity-plus]').click();
 assert.match(await page.locator('[data-product-submit]').innerText(),/45.00/);
 assert.equal(await page.locator('[data-product-form]').evaluate(f=>new FormData(f).get('selling_plan')),'123456');
 await page.getByRole('button',{name:'Mix your flavors',exact:true}).click();
 assert.equal(await page.locator('[data-hx-plan]').isVisible(),true);
 assert.match(await page.locator('[data-mix-summary]').innerText(),/22.50/);
 let payload;
 await page.route('**/cart/add.js',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({description:'Test intercepted; no cart modification'})});});
 await page.locator('[data-mix-submit]').click();await page.locator('[data-mix-error]').waitFor({state:'visible'});
 assert.equal(payload.items[0].selling_plan,'123456');
 await page.locator('[data-hx-plan]').selectOption('');
 await page.locator('[data-mix-submit]').click();await page.waitForTimeout(200);
 assert.equal('selling_plan' in payload.items[0],false);
 await page.locator('[data-hx-plan]').selectOption('123456');
 await page.evaluate(()=>{const s=document.querySelector('.hx-clean-pdp');const old=s.hxPurchase;s.hxPurchase=v=>({...old(v),valid:false});s.dispatchEvent(new CustomEvent('hx:purchase-change'));});
 assert.equal(await page.locator('[data-mix-submit]').isDisabled(),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 console.log('PASS: subscription price, quantity, native form plan, mixed cart plan, one-time omission, ineligible flavor blocking, mobile overflow. Browser errors:',JSON.stringify(errors));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

