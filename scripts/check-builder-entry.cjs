const {chromium}=require('C:/Users/chhet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('https://b5895f-96.myshopify.com/?preview_theme_id=158342054026',{waitUntil:'domcontentloaded'});
  const entry=page.locator('.hx-builder-entry');await entry.waitFor();
  await entry.scrollIntoViewIfNeeded();
  await entry.locator('img').evaluate(i=>i.decode());
  await entry.screenshot({path:`output/custom-builder/screenshots/home-builder-entry-${width}.png`});
  if(width===390){await page.locator('#Details-menu-drawer-container > summary').click();await page.locator('#menu-drawer [data-builder-review-link]').click();}
  else {await page.locator('.header__inline-menu [data-builder-review-link]').click();}
  await page.locator('.hx-builder').getByRole('button',{name:'Build your blend →',exact:true}).waitFor();
  console.log(`PASS ${width}: homepage entry and navigation to builder`);
  await page.close();
 }
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
