const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function shopifyCartControls(b) {
  const cartUrl=b.safeCatalogUrl(`${shopifyRoot()}cart`);
  return `<label for="hx-cart-quantity">Jars</label><input id="hx-cart-quantity" name="cart_quantity" type="number" min="1" max="20" step="1" value="${Number.isInteger(b.cartQuantity)?b.cartQuantity:1}" ${b.cartBusy||b.cartAdded?'disabled':''}><div class="hx-builder-actions">${b.button(b.cartBusy?'Adding your blend…':b.cartAdded?'Added to cart':'Add to cart →','shopify-add',false,b.cartBusy||b.cartUncertain||b.cartAdded?'disabled':'')}<a class="hx-builder-secondary" href="${esc(cartUrl)}">View Shopify cart</a></div><p role="status">${esc(b.cartMessage||'Adds real Shopify items. Checkout protection and production delivery are still being connected.')}</p>`;
}
export function shopifyRoot() {
  const path=globalThis.Shopify?.routes?.root || '/';
  if(typeof path!=='string'||!/^\/(?:[a-zA-Z0-9-]+\/)*$/.test(path))throw Error('The store cart address is unavailable.');
  return path;
}
export function checkPrepared(data, quantity) {
  const cart=data?.cart;
  if(data?.status!=='recommended'||!cart)throw Error(data?.errors?.[0]?.message||'Your blend could not be prepared for the cart.');
  if(!Array.isArray(cart.items)||cart.items.length<1||cart.items.length>2||cart.items[0].quantity!==quantity||!Number.isSafeInteger(cart.total_minor)||cart.total_minor<0||typeof cart.currency!=='string')throw Error('The cart preparation was incomplete.');
  for(const item of cart.items) {
    if(!/^[1-9]\d*$/.test(String(item.id))||!Number.isSafeInteger(item.quantity)||item.quantity<1||item.quantity>80||!item.properties?._build_id||!item.properties?._recipe_digest)throw Error('The cart preparation was incomplete.');
  }
  return cart;
}
async function readCart(fetcher,root) {
  const r=await fetcher(`${root}cart.js`,{credentials:'same-origin',cache:'no-store'});
  if(!r.ok)throw Error('Shopify cart could not be checked.');
  const cart=await r.json();if(!Array.isArray(cart.items))throw Error('Shopify cart could not be checked.');return cart;
}
export async function sendCartGroup(items,{fetcher=fetch,root=shopifyRoot(),group=crypto.randomUUID()}={}) {
  const tagged=items.map(item=>({...item,properties:{...item.properties,_hx_cart_group:group}}));
  let response,problem;
  try {
    response=await fetcher(`${root}cart/add.js`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:tagged})});
    const data=await response.json();
    if(!response.ok)problem=typeof data.description==='string'?data.description:'Shopify could not add the complete blend. Check stock and try again.';
  } catch {problem='The connection was interrupted while adding your blend.';}
  let actual;
  try {actual=await readCart(fetcher,root);} catch {return {ok:false,uncertain:true,message:'Check your Shopify cart before trying again; we could not confirm whether the blend was added.'};}
  const added=actual.items.filter(i=>i.properties?._hx_cart_group===group);
  const complete=added.length===tagged.length&&tagged.every(i=>added.some(a=>String(a.variant_id??a.id)===String(i.id)&&a.quantity===i.quantity));
  if(complete)return {ok:true,cart:actual,message:'Your blend is in Shopify’s cart. Open the cart to review it.'};
  if(added.length) {
    try {
      const rollback=await fetcher(`${root}cart/update.js`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({updates:Object.fromEntries(added.map(i=>[i.key,0]))})});
      if(!rollback.ok)throw Error();
      const clean=await readCart(fetcher,root);if(clean.items.some(i=>i.properties?._hx_cart_group===group))throw Error();
    } catch {return {ok:false,uncertain:true,message:'Only part of the blend may be in your cart. Open Shopify cart and remove that blend before retrying.'};}
  }
  return {ok:false,uncertain:false,message:problem||'Shopify did not add the complete blend. Your other cart items were kept.'};
}
export async function addBuilderToShopify(b) {
  if(b.root.dataset.shopifyCart!=='true'||b.cartBusy||b.cartUncertain||b.cartAdded||b.step!=='result')return;
  const quantity=b.cartQuantity??1;
  if(!Number.isInteger(quantity)||quantity<1||quantity>20){b.error='Choose between 1 and 20 jars.';b.render();return;}
  b.cartBusy=true;b.error='';b.cartMessage='Checking your blend and current Shopify prices…';b.render();
  const token=++b.epoch, controller=new AbortController();b.abort=controller;
  const timer=setTimeout(()=>controller.abort(),35000);
  try {
    const data=await b.api('prepare-shopify-cart',{request:{...b.q,recipe:{uses:b.result.build.uses,herbs:b.result.build.herbs}},quantity},controller.signal);
    if(token!==b.epoch)return;
    const cart=checkPrepared(data,quantity);
    const before=b.result.build,after=data.result?.build;
    if(!after)throw Error('The validated recipe was missing.');
    if(cart.currency!==b.result.pricing.currency||cart.total_minor!==b.result.pricing.total_minor*quantity||JSON.stringify(before.herbs)!==JSON.stringify(after.herbs)||before.strength!==after.strength||JSON.stringify(before.flavor)!==JSON.stringify(after.flavor)) {
      b.result=data.result;b.error='Your recipe or price changed. Review the updated blend, then add it again.';return;
    }
    clearTimeout(timer);
    const outcome=await sendCartGroup(cart.items);
    b.cartMessage=outcome.message;b.cartUncertain=outcome.uncertain||false;
    if(!outcome.ok)b.error=outcome.message;
    else {b.cartMessage=`Added ${quantity} ${quantity===1?'jar':'jars'} and the matching premium charges to Shopify’s cart.`;b.cartAdded=true;}
  } catch(error) {b.error=error.name==='AbortError'?'The recipe check timed out. Your cart was not changed.':error.message||'The cart service is unavailable.';b.cartMessage='';}
  finally {clearTimeout(timer);b.cartBusy=false;b.render();b.focus();}
}
