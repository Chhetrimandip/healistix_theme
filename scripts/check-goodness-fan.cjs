const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 fs.mkdirSync('staging/goodness-fan',{recursive:true});
 try {
  const page=await browser.newPage();
  await page.addInitScript(()=>localStorage.setItem('hx_popup_ts',String(Date.now())));
  for (const width of [1440,390]) {
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:9292/',{waitUntil:'domcontentloaded',timeout:45000});
   const fan=page.locator('hx-goodness-fan');
   await fan.waitFor();
   await fan.scrollIntoViewIfNeeded();
   await page.evaluate(()=>document.fonts.ready);
   await fan.locator('img').first().waitFor();
   await page.waitForFunction(()=>document.querySelector('hx-goodness-fan').hasAttribute('data-running'));
   const transform=()=>fan.locator('.hx-goodness__wheel').evaluate(e=>getComputedStyle(e).transform);
   const before=await transform();
   await page.waitForTimeout(600);
   const moving=before!==await transform();
   await fan.locator('button').click();
   const paused=await transform();
   await page.waitForTimeout(300);
   const stopped=paused===await transform();
   const images=await fan.locator('img').evaluateAll(images=>images.filter(i=>i.getBoundingClientRect().bottom>0&&i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().right>0&&i.getBoundingClientRect().left<innerWidth).every(i=>i.complete&&i.naturalWidth>0));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   await fan.screenshot({path:`staging/goodness-fan/${width}.png`});
   await fan.locator('button').click();
   const resumed=await fan.evaluate(e=>e.hasAttribute('data-running'));
   await page.emulateMedia({reducedMotion:'reduce'});
   const reduced=await fan.locator('.hx-goodness__wheel').evaluate(e=>getComputedStyle(e).animationName==='none');
   await page.emulateMedia({reducedMotion:'no-preference'});
   results.push({width,moving,stopped,resumed,reduced,images,overflow});
  }
  fs.writeFileSync('staging/goodness-fan/results.json',JSON.stringify(results,null,2));
  console.log(results);
  if(results.some(r=>!r.moving||!r.stopped||!r.resumed||!r.reduced||!r.images||r.overflow)) process.exitCode=1;
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
