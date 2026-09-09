/* Authored gallery layouts. Uses only supplied product artwork, fonts and label. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const asset = name => path.join(root, 'assets', name);
const data = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`;
const font = name => data(fs.readFileSync(asset(name)), 'font/woff');
const green = '#174b3c';

async function main() {
  // Only transparent outer margins are removed. Jar color and label remain unchanged.
  const jar = data(await sharp(asset('hx-pilot-banana-front.webp')).trim().png().toBuffer(), 'image/png');
  const facts = data(await sharp(asset('hx-label-banana-right.webp')).extract({left:465, top:20, width:523, height:1080}).png().toBuffer(), 'image/png');
  const css = `
    @font-face{font-family:Forma;src:url('${font('FormaDJRDisplay-Bold.woff')}');font-weight:700}
    @font-face{font-family:Forma;src:url('${font('FormaDJRText-Regular.woff')}');font-weight:400}
    *{box-sizing:border-box}body{margin:0;background:#eee;color:${green};font-family:Forma,Arial,sans-serif}
    .slide{width:1200px;height:1200px;position:relative;overflow:hidden;background:#f1f2e3;padding:64px}
    h1,h2,p{margin:0}h1{font-size:108px;line-height:.94;letter-spacing:-2px;word-spacing:7px;font-weight:700}
    h2{font-size:44px;line-height:1.12;letter-spacing:0;word-spacing:3px}p{font-size:27px;line-height:1.4}
    .brand{font-size:27px;letter-spacing:5px;font-weight:700}.kicker{font-size:21px;letter-spacing:3px;text-transform:uppercase}
    .footer{position:absolute;bottom:38px;left:64px;right:64px;border-top:1px solid #174b3c44;padding-top:18px;display:flex;justify-content:space-between;font-size:19px}
    .pill{display:inline-block;border:1px solid currentColor;border-radius:40px;padding:14px 23px;font-size:22px;font-weight:700}
    .jar{object-fit:contain;position:absolute}.rule{border-bottom:1px solid #174b3c44}
    .hero .brand{margin-bottom:32px}.hero h1{font-size:95px}.hero .jar{width:560px;height:790px;left:40px;bottom:58px}
    .hero .side{position:absolute;top:350px;right:62px;width:452px;background:#fcfcf5;border-radius:25px;padding:35px 36px}
    .hero .side h2{font-size:41px;margin-bottom:25px}.feature{padding:24px 0;display:flex;align-items:center;gap:22px;border-top:1px solid #174b3c33;font-size:28px;line-height:1.15}
    .check{border:1.5px solid currentColor;border-radius:50%;width:38px;height:38px;flex:none;display:grid;place-items:center;font-size:23px}
    .hero .taste{position:absolute;right:65px;bottom:140px;width:440px;background:${green};color:#f8f6df;border-radius:20px;padding:25px 30px}
    .hero .taste strong{font-size:43px;display:block;letter-spacing:-1px}.hero .taste span{font-size:22px}
    .ingredients{background:#94b5a1}.ingredients .kicker{margin:26px 0 22px}.ingredients h1{max-width:970px;font-size:103px}
    .ingredients .list{position:absolute;left:64px;top:400px;width:580px;background:#fbfcf2;border-radius:25px;padding:6px 32px}
    .ingredient{padding:30px 0;border-bottom:1px solid #174b3c33;display:flex;gap:20px;align-items:center}.ingredient:last-child{border:0}.ingredient b{font-size:32px}.ingredient small{display:block;font-size:23px;margin-top:5px}.num{font-size:23px;border:1px solid #174b3c66;border-radius:50%;width:46px;height:46px;display:grid;place-items:center;flex:none}
    .ingredients .jar{right:28px;bottom:109px;width:467px;height:745px}.ingredients .note{position:absolute;left:66px;bottom:134px;width:550px;font-size:21px}
    .facts{background:${green};color:#f6f7e8}.facts .brand{margin-bottom:50px}.facts h1{font-size:98px}.facts .panel{position:absolute;right:45px;top:55px;height:1038px;width:525px;background:white;border-radius:15px;display:flex;justify-content:center;padding:15px;overflow:hidden}
    .facts .panel img{height:100%;max-width:100%;object-fit:contain}.facts .aside{width:500px}.facts .measure{margin-top:65px;padding-top:30px;border-top:1px solid #f6f7e866}.facts .measure b{font-size:76px;display:block;letter-spacing:-2px}.facts .measure p{font-size:26px}.facts .source{margin-top:60px;font-size:22px;max-width:420px;line-height:1.5}.facts .footer{border-color:#f6f7e855}
    .ritual{background:#e7ece3}.ritual .kicker{margin:26px 0 22px}.ritual h1{font-size:102px}.ritual .intro{margin-top:23px;font-size:29px}
    .ritual .rows{position:absolute;left:64px;top:421px;width:626px}.ritual .row{display:flex;align-items:center;gap:24px;padding:28px 0;border-top:1px solid #174b3c44}.ritual .row h2{font-size:39px;margin-bottom:9px}.ritual .row p{font-size:25px}.ritual .icon{width:76px;flex:none;height:76px;background:#f9faf0;border-radius:50%;display:grid;place-items:center}.ritual svg{width:42px;height:42px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
    .ritual .jar{right:17px;bottom:153px;width:439px;height:670px}.ritual .storage{position:absolute;left:64px;right:64px;bottom:111px;background:${green};color:#fbfcf0;border-radius:14px;font-size:23px;padding:21px 26px;display:flex;justify-content:space-between}
  `;
  const foot = label => `<div class="footer"><span>HEALISTIX · BANANA SEA MOSS GEL</span><span>${label}</span></div>`;
  const img = `<img class="jar" src="${jar}" alt="Original gold-lid Healistix Banana jar">`;
  const icon = body => `<div class="icon"><svg viewBox="0 0 48 48">${body}</svg></div>`;
  const slides = {
    hero: `<div class="slide hero"><div class="brand">HEALISTIX</div><h1>Sea moss.<br>Meet banana.</h1>${img}<div class="side"><h2>A little daily<br>goodness.</h2>${['Made with real banana','St. Lucia sea moss','No artificial flavors','No added sugar'].map(t=>`<div class="feature"><span class="check">✓</span><span>${t}</span></div>`).join('')}</div><div class="taste"><strong>#1 best tasting.</strong><span>Your banana sea moss ritual.</span></div>${foot('16 OZ / 454 G')}</div>`,
    ingredients: `<div class="slide ingredients"><div class="brand">HEALISTIX</div><div class="kicker">The ingredient edit</div><h1>Four ingredients.<br>Nothing to decode.</h1><div class="list">${[['Sea moss','Wildcrafted in St. Lucia'],['Spring water',''],['Banana puree',''],['Citric acid','']].map(([a,b],i)=>`<div class="ingredient"><span class="num">0${i+1}</span><div><b>${a}</b>${b?`<small>${b}</small>`:''}</div></div>`).join('')}</div>${img}<p class="note">The ingredient list for Banana.<br>Always check the label on your jar.</p>${foot('REAL BANANA. SIMPLY BLENDED.')}</div>`,
    facts: `<div class="slide facts"><div class="aside"><div class="brand">HEALISTIX</div><h1>Know your<br>spoonful.</h1><div class="measure"><b>2 tbsp</b><p>Serving size · 28 g</p></div><div class="measure"><b>16</b><p>Servings per container</p></div><p class="source">Nutrition facts from the<br>Banana jar label.</p></div><div class="panel"><img src="${facts}" alt="Actual Banana Nutrition Facts label"></div>${foot('BANANA · LABEL DETAILS')}</div>`,
    ritual: `<div class="slide ritual"><div class="brand">HEALISTIX</div><div class="kicker">Your daily ritual</div><h1>A spoonful.<br>Your kind of morning.</h1><p class="intro">Three simple ways to enjoy Banana.</p><div class="rows"><div class="row">${icon('<ellipse cx="16" cy="14" rx="8" ry="11" transform="rotate(-35 16 14)"/><path d="M22 23L40 43"/>')}<div><h2>Spoon it.</h2><p>Enjoy straight from the jar.</p></div></div><div class="row">${icon('<path d="M12 14h24l-4 29H16zM28 14l5-10h9M13 23h21"/>')}<div><h2>Blend it.</h2><p>Add to your favorite smoothie.</p></div></div><div class="row">${icon('<path d="M5 21h38c-2 15-10 20-19 20S7 36 5 21zM16 44h16M30 19l9-14"/>')}<div><h2>Stir it.</h2><p>Mix into yogurt or your breakfast bowl.</p></div></div></div>${img}<div class="storage"><span>Refrigerate after opening.</span><span>Best before 30 days once opened.</span></div>${foot('SERVING IDEAS')}</div>`
  };
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage({viewport:{width:1200,height:1200},deviceScaleFactor:1});
  fs.mkdirSync(path.join(root,'staging/banana-editorial-v2'), {recursive:true});
  for (const [name,markup] of Object.entries(slides)) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${markup}</body></html>`;
    fs.writeFileSync(path.join(root,'staging/banana-editorial-v2',`${name}.html`),html);
    await page.setContent(html); await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));
    await page.screenshot({path:asset(`hx-banana-editorial-${name}-v2.png`)});
    console.log(`Rendered ${name}`);
  }
  await browser.close();
}
main().catch(err=>{console.error(err);process.exit(1)});
