const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initDraftReview(b){
  if(b.root.dataset.draftReview!=='true')return;
  const fragment=new URLSearchParams(location.hash.slice(1)),token=fragment.get('draft_review');
  if(/^[a-f0-9]{64}$/.test(token||''))b.draftReviewToken=token;
  fragment.delete('draft_review');history.replaceState(null,'',location.pathname+location.search+(fragment.size?'#'+fragment.toString():''));
}
const selectionFor=b=>({request:{...b.q,recipe:{uses:b.result.build.uses,herbs:b.result.build.herbs}},quantity:b.cartQuantity??1,expectedTotalMinor:b.result.pricing.total_minor*(b.cartQuantity??1)});
export function draftReviewControls(b){
  if(b.draftFingerprint && b.draftFingerprint!==JSON.stringify(selectionFor(b))){b.draftCheckout=null;if(!b.draftUncertain)b.draftMessage='Your blend changed. Create a checkout for this updated selection.';}
  const admin='https://admin.shopify.com/store/b5895f-96/apps/composio-623/app/draft-review';
  if(!b.draftReviewToken)return `<div class="hx-draft-review"><strong>Draft checkout test access required</strong><p>Start a review session in the Shopify app, then open its preview link.</p><a href="${admin}" target="_blank" rel="noreferrer">Open Draft checkout review ↗</a></div>`;
  return `<div class="hx-draft-review"><strong>Unpaid Shopify checkout test · do not pay</strong><p>Premium herbs are included in each jar’s price. ERP stock is not reserved.</p><label for="hx-cart-quantity">Jars</label><input id="hx-cart-quantity" name="cart_quantity" type="number" min="1" max="20" value="${b.cartQuantity??1}" ${b.draftBusy?'disabled':''}><div class="hx-builder-actions">${b.button(b.draftBusy?'Preparing checkout…':b.draftCheckout?'Check existing draft':'Create unpaid test checkout','draft-review',false,b.draftBusy||b.draftUncertain?'disabled':'')}</div><p role="status">${esc(b.draftMessage||'Creates a tagged test draft with the real Shopify jar. No email is sent.')}</p>${b.draftCheckout?`<a data-draft-checkout href="${esc(b.draftCheckout)}" target="_blank" rel="noreferrer">Open Shopify checkout — do not pay ↗</a>`:''}${b.draftUncertain?`<a href="${admin}" target="_blank" rel="noreferrer">Review this attempt in Shopify ↗</a>`:''}</div>`;
}
export function safeDraftUrl(value){
  const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||!['healistix.com','b5895f-96.myshopify.com'].includes(u.hostname)||!/^\/\d+\/invoices\/[a-zA-Z0-9]+$/.test(u.pathname))throw Error('Unexpected checkout address.');return u.href;
}
export async function openDraftReview(b){
  if(b.root.dataset.draftReview!=='true'||!b.draftReviewToken||b.draftBusy||b.draftUncertain||b.step!=='result')return;
  const quantity=b.cartQuantity??1;
  if(!Number.isInteger(quantity)||quantity<1||quantity>20){b.draftMessage='Choose between 1 and 20 jars.';b.render();return;}
  const selection=selectionFor(b);
  const fingerprint=JSON.stringify(selection);
  if(b.draftFingerprint!==fingerprint){b.draftFingerprint=fingerprint;b.draftRequestKey=crypto.randomUUID();b.draftCheckout=null;}
  b.draftBusy=true;b.draftMessage='Checking recipe, Shopify price and jar stock…';b.render();
  b.root.querySelectorAll('button,input').forEach(el=>el.disabled=true);
  try{
    const endpoint=new URL(b.root.dataset.endpoint,location.origin);if(endpoint.origin!==location.origin)throw Error('Invalid service address.');
    const response=await fetch(endpoint.pathname.replace(/\/$/,'')+'/draft-review',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:b.draftReviewToken,key:b.draftRequestKey,...selection}),signal:AbortSignal.timeout(45000)});
    const result=await response.json();
    if(!response.ok||result.error){if([409,503].includes(response.status))b.draftUncertain=true;throw Error(result.error||'Draft service unavailable.');}
    b.draftCheckout=safeDraftUrl(result.invoiceUrl);b.draftMessage=`${result.reused?'Reopened the existing':'Created an unpaid'} draft. Premium costs are included. Open checkout to inspect it; do not pay.`;
  }catch(error){if(error.name==='TimeoutError'||error.name==='TypeError'||error.name==='SyntaxError')b.draftUncertain=true;b.draftMessage=b.draftUncertain?'Result needs review. Open Draft checkout review in the Shopify app before creating another draft.':error.message||'Draft unavailable.';}
  finally{b.draftBusy=false;b.render();}
}
