const { chromium } = require('playwright');
const luminance = rgb => rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => {
  v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
}).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let failed = false;
  try {
    const page = await browser.newPage();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(process.env.CONTRAST_URL || 'http://127.0.0.1:9292/products/sea-moss-gel-banana?variant=47331891970186', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      const link = process.env.CONTRAST_TEXT ? page.getByRole('link', { name: process.env.CONTRAST_TEXT, exact: true }) : page.locator('a.hx-review-source').filter({ hasText: 'Read more customer reviews' });
      await link.scrollIntoViewIfNeeded();
      for (const state of ['normal', 'hover', 'focus']) {
        if (state === 'hover') await link.hover();
        if (state === 'focus') { await page.mouse.move(0, 0); await link.focus(); }
        await page.waitForTimeout(350); // Let the theme's color transition finish.
        const colors = await link.evaluate(el => {
          let background = 'rgb(255, 255, 255)';
          for (let node = el; node; node = node.parentElement) {
            const value = getComputedStyle(node).backgroundColor;
            if (value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') { background = value; break; }
          }
          return { color: getComputedStyle(el).color, background };
        });
        const values = [luminance(colors.color), luminance(colors.background)].sort((a, b) => a - b);
        const contrast = (values[1] + .05) / (values[0] + .05);
        console.log(JSON.stringify({ width, state, ...colors, contrast, pass: contrast >= 4.5 }));
        failed ||= contrast < 4.5;
      }
      if (process.env.REVIEW_SCREENSHOT && width === 390) await link.screenshot({ path: process.env.REVIEW_SCREENSHOT });
    }
  } finally { await browser.close(); }
  process.exitCode = failed ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
