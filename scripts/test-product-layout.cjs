// Run with Playwright on NODE_PATH and the Shopify preview running locally.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let failures = 0;
  try {
    const page = await browser.newPage();
    for (const width of [320, 390, 749, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const handle of ['raw-honduran-batana-oil', 'himalayan-shilajit', 'sea-moss-gel-banana']) {
        await page.goto(`http://127.0.0.1:9292/products/${handle}`, { waitUntil: 'networkidle' });
        const result = await page.evaluate(() => {
          const bg = document.querySelector('#hx-fruit-bg');
          const bounds = bg?.getBoundingClientRect();
          return {
            viewport: innerWidth,
            scroll: document.documentElement.scrollWidth,
            bodyScroll: document.body.scrollWidth,
            fruitHeight: bounds?.height ?? 0,
            loadedFruits: [...document.querySelectorAll('.hx-fruit img')].filter(img => img.complete && img.naturalWidth > 0 && getComputedStyle(img.parentElement).display !== 'none').length,
            product: !!document.querySelector('.hx-wellness-page, .product-seamoss, .product'),
            overflow: [...document.querySelectorAll('body *')].filter(el => {
              const r = el.getBoundingClientRect();
              return r.width && r.right > innerWidth + 1;
            }).slice(0, 8).map(el => ({ class: String(el.className), right: Math.round(el.getBoundingClientRect().right) }))
          };
        });
        const pass = result.product && result.scroll <= width && result.bodyScroll <= width && result.fruitHeight > 950 && result.loadedFruits > 0;
        console.log(JSON.stringify({ handle, width, pass, ...result }));
        if (!pass) failures++;
        if (process.env.LAYOUT_SCREENSHOT && width === 390 && handle === 'sea-moss-gel-banana') {
          await page.screenshot({ path: process.env.LAYOUT_SCREENSHOT, fullPage: true });
        }
      }
    }
  } finally { await browser.close(); }
  process.exitCode = failures ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
