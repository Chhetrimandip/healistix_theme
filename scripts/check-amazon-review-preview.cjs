// Verify rendered review cards on homepage/PDP after source-backed edits.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  fs.mkdirSync('staging/amazon-review-verification', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => { try { localStorage.setItem('hx_popup_ts', String(Date.now())); } catch (_) {} });
    const page = await context.newPage();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/', '/products/sea-moss-gel-banana?variant=47331891970186']) {
        await page.goto('http://127.0.0.1:9292' + path, { waitUntil: 'domcontentloaded', timeout: 35000 });
        const section = page.locator('.hx-review-stories');
        await section.scrollIntoViewIfNeeded();
        await page.evaluate(() => document.fonts.ready);
        const more = section.locator('.hx-review-stories__more');
        if (await more.count()) {
          await more.locator('summary').click();
          await more.locator('article').last().scrollIntoViewIfNeeded();
        }
        const data = await section.evaluate(el => ({
          count: el.querySelectorAll('article').length,
          text: el.innerText,
          links: [...el.querySelectorAll('a')].map(a => ({ text: a.innerText, href: a.href })),
          videos: [...el.querySelectorAll('video')].map(v => ({ source: v.currentSrc || v.querySelector('source')?.src || v.src, poster: v.poster, controls: v.controls, autoplay: v.autoplay, tracks: [...v.querySelectorAll('track')].map(t => t.src) })),
          overflow: document.documentElement.scrollWidth > innerWidth,
          emptyReviews: [...el.querySelectorAll('blockquote')].filter(b => !b.innerText.replace(/[“”\s]/g, '')).length
        }));
        results.push({ width, path, ...data });
        if (width === 1280 && path !== '/') {
          for (const video of await section.locator('video').all()) {
            const playback = await video.evaluate(async v => {
              v.muted = true;
              try {
                await Promise.race([v.play(), new Promise((_, reject) => setTimeout(() => reject(new Error('Playback timed out')), 15000))]);
                const result = { duration: v.duration, readyState: v.readyState, width: v.videoWidth, height: v.videoHeight, error: v.error?.message || null };
                v.pause();
                return result;
              } catch (e) { return { error: e.message }; }
            });
            results.push({ playback });
            if (playback.error) process.exitCode = 1;
          }
        }
        await section.screenshot({ path: `staging/amazon-review-verification/${path === '/' ? 'home' : 'product'}-${width}.png`, style: 'sticky-header { visibility: hidden !important; }' });
      }
    }
    fs.writeFileSync('staging/amazon-review-verification/results.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
    if (results.some(r => r.path && (r.overflow || r.emptyReviews || !r.count))) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
