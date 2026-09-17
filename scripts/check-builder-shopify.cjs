const {chromium}=require('C:/Users/chhet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
  await page.goto('https://b5895f-96.myshopify.com/?preview_theme_id=158342054026&view=builder-review',{waitUntil:'domcontentloaded',timeout:90000});
  console.log('URL:',page.url());
  console.log((await page.locator('body').innerText()).slice(0,7000));
  const root=page.locator('.hx-builder');
  await root.getByRole('button',{name:'Build your blend →',exact:true}).click();
  await root.locator('[name=use_chips][value=energy]').check();
  await root.locator('[data-action=next]').click();
  for(const [name,value] of [['adult','true'],['pregnant_nursing','false'],['seaweed_iodine_allergy','false']]) await root.locator(`[name=${name}][value=${value}]`).check();
  await root.locator('[data-action=next]').click();
  await root.locator('[name=screening_complete]').check();
  await root.locator('[data-action=next]').click();
  await root.locator('[name=family][value=tropical]').check();
  await root.locator('[name=flavor][value=mango]').check();
  await root.locator('[data-action=next]').click();
  await root.locator('[data-action=next]').click();
  await root.locator('[data-action=next]').click();
  await root.getByRole('heading',{name:'Your blend, your way.'}).waitFor({timeout:15000});
  console.log('RESULT:',await root.innerText());
  await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  console.log('IMAGES:',await root.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.src,complete:i.complete,width:i.naturalWidth}))));
  await page.screenshot({path:'output/custom-builder/screenshots/shopify-review.png',fullPage:true});
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

