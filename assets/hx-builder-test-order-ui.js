import { createTestOrder } from './hx-builder-test-order.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = (value,currency) => new Intl.NumberFormat('en-US',{style:'currency',currency}).format(value/100);
export function testOrderView(b) {
  const order=b.testOrder, complete=b.step==='test-complete', checkout=b.step==='test-checkout';
  if(!order)return '<p>No test cart. Return to your blend.</p>';
  return `<section class="hx-builder-panel hx-builder-test-order"><p class="hx-builder-eyebrow">${complete?'3 / 3 · Test request':checkout?'2 / 3 · Simulated checkout':'1 / 3 · Test cart'}</p>${b.heading(complete?'Your test request is ready.':checkout?'Try the checkout.':'Your blend is in the test cart.')}<p class="hx-builder-note">Simulation only. No payment, Shopify order or production dispatch. Refreshing clears this test session.</p>
    <div class="hx-builder-test-summary"><img src="${esc(b.root.dataset.image)}" width="160" height="160" alt="Raw sea moss gel base"><div><h2>Custom sea moss gel</h2><p>${esc(order.recipe.strength==='strong'?'Strong':'Standard')} strength · ${order.recipe.flavor.id==='none'?'Unflavored':esc(order.recipe.flavor.id)+' flavor'}</p><p>${order.recipe.herbs.map(h=>`${esc(h.name)} (${esc(h.g)} g / jar)`).join(' + ')}</p></div></div>
    ${!complete&&!checkout?`<div class="hx-builder-row"><span>Jars</span><div class="hx-builder-actions">${b.button('−','test-minus',true,'aria-label="Remove one jar"'+(order.quantity===1?' disabled':''))}<strong aria-live="polite">${order.quantity}</strong>${b.button('+','test-plus',true,'aria-label="Add one jar"'+(order.quantity===25?' disabled':''))}</div></div>`:`<p>${order.quantity} ${order.quantity===1?'jar':'jars'}</p>`}
    <div class="hx-builder-price-details">${(b.testResult.pricing.breakdown||[]).map(x=>`<div class="hx-builder-row"><span>${esc(x.label)} · per jar</span><span>${money(x.total_minor,order.currency)}</span></div>`).join('')}<div class="hx-builder-row"><span>Jar price × ${order.quantity}</span><strong>${money(order.total_minor,order.currency)}</strong></div></div><p class="hx-builder-muted">Shipping and tax are not calculated in this simulation. Stock starts at 25 test portions per herb in this browser session.</p>
    ${checkout?'<p>Test customer · Sample address · Simulated payment. No personal details or card number needed.</p>':''}
    ${complete?`<p role="status"><strong>${esc(order.id)}</strong> · ${order.tickets.length} test jar ${order.tickets.length===1?'ticket':'tickets'} created in this browser.</p><p>Download the recipe-only request to review the production format. It has not been sent to the team or added to the admin queue.</p>`:''}
    <div data-error role="alert">${b.error?`<p class="hx-builder-error">${esc(b.error)}</p>`:''}</div>
    <div class="hx-builder-actions">${complete?b.button('Download test request','test-download')+b.button('Back to my blend','test-back',true):checkout?b.button(b.testBusy?'Checking blend…':'Simulate payment & create request','test-pay',false,b.testBusy?'disabled':'')+b.button('Back to cart','test-cart',true):b.button('Continue to test checkout →','test-checkout')+b.button('Back to my blend','test-back',true)}</div></section>`;
}
export async function handleTestOrder(b,action) {
  if(b.root.dataset.testOrder!=='true'||b.testBusy)return;
  b.error='';
  try {
    if(action==='test-add') {
      b.testStock ||= {};
      b.testResult=structuredClone(b.result);
      b.testOrder=createTestOrder(b.testResult,1,b.testStockFor(b.testResult));
      b.go('test-cart');return;
    }
    if(action==='test-back'){b.go('result');return;}
    if(!b.testOrder)return;
    if(action==='test-cart'){b.go('test-cart');return;}
    if(action==='test-plus'||action==='test-minus') {
      if(b.step!=='test-cart')return;
      b.testOrder=createTestOrder(b.testResult,b.testOrder.quantity+(action==='test-plus'?1:-1),b.testStockFor(b.testResult));
    }
    if(action==='test-checkout'&&b.step==='test-cart'){b.go('test-checkout');return;}
    if(action==='test-pay'&&b.step==='test-checkout') {
      b.testBusy=true;b.render();
      const token=++b.epoch, controller=new AbortController();b.abort=controller;
      const timeout=setTimeout(()=>controller.abort(),35000);
      let fresh;
      try {fresh=await b.api('validate',{...b.q,recipe:{uses:b.testResult.build.uses,herbs:b.testResult.build.herbs}},controller.signal);} finally {clearTimeout(timeout);}
      if(token!==b.epoch)return;
      const next=createTestOrder(fresh,b.testOrder.quantity,b.testStockFor(fresh));
      if(next.unit_minor!==b.testOrder.unit_minor || next.currency!==b.testOrder.currency || JSON.stringify(next.recipe)!==JSON.stringify(b.testOrder.recipe)) {
        b.testResult=fresh;b.testOrder=next;b.step='test-cart';b.error='Your blend or price changed during validation. Review the updated cart before trying checkout again.';
      } else {
        for(const herb of next.recipe.herbs)b.testStock[herb.id]=(b.testStock[herb.id]??25)-next.quantity;
        b.testResult=fresh;b.testOrder=next;b.step='test-complete';
      }
    }
    if(action==='test-download'&&b.step==='test-complete') {
      const blob=new Blob([JSON.stringify(b.testOrder,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=`${b.testOrder.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  } catch(error) {b.error=error?.name==='AbortError'?'The blend check timed out. Try again.':error.message||'This test could not be completed. Try again.';}
  finally {b.testBusy=false;b.render();b.focus();}
}
