import {BlendCart,groupsIn,isBlendLine,variantId,shopifyTransport} from './hx-blend-cart-model.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const messages={PREMIUM_QUANTITY_MISMATCH:'The premium charges do not match the jar quantity. Update the jar quantity to repair the charges.',RECIPE_NOT_FOUND:'This recipe could not be verified. Please rebuild it.',STALE_LIBRARY:'The ingredient library changed. Please review this blend again.',STALE_PRICING:'Prices changed. Please review this blend again.',INGREDIENT_UNAVAILABLE:'An ingredient is unavailable. Please choose another blend.',SHOPIFY_PRODUCTS_UNAVAILABLE:'The products or prices need another check.'};
const explain=code=>messages[code] || 'This blend needs another review in the builder before checkout.';
Object.assign(messages,{INVENTORY_UNAVAILABLE:'Stock could not be checked. Refresh before checkout.',INSUFFICIENT_INVENTORY:'There is not enough stock for this cart. Reduce jar quantities or remove a blend.'});
Object.assign(messages,{UNKNOWN_RECIPE:'This saved recipe could not be verified. Remove it and rebuild your blend.',STALE_RECIPE:'The recipe settings changed. Please review this blend again.',STALE_PRICE:'The recipe price changed. Please review this blend again.',PRICE_MISMATCH:'The cart price does not match the current blend price. Remove it and add a freshly reviewed blend.',RECIPE_PROPERTIES_MISMATCH:'The cart details no longer match the saved recipe. Please rebuild this blend.',UNGROUPED_BLEND_LINE:'A custom item is missing its blend reference. Remove it and add it through the builder.',INSUFFICIENT_STOCK:'There is not enough stock for this quantity. Reduce the quantity or remove the blend.'});
export function mountBlendCart(root,transport,{checkout=()=>location.assign(`${globalThis.Shopify?.routes?.root||'/'}checkout`)}={}) {
  const model=new BlendCart(transport);
  let notice='',pending=false;
  const builder=root.dataset.builderUrl || '/?view=builder-review';
  const image=root.dataset.image || '';
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:model.cart?.currency||'USD'}).format(n/100);
  function photo(line){const src=image || line?.image;return src && (/^https:\/\//.test(src)||/^\/(?!\/)/.test(src))?`<img src="${esc(src)}" alt="Raw sea moss jar with illustrative herb powders" width="128" height="128">`:'';}
  function controls(id,n,disabled=false,max=20){return `<div class="hx-cart-controls"><label>Quantity <input aria-label="Jar quantity" type="number" min="1" max="${max}" step="1" value="${n}" data-quantity="${esc(id)}" ${pending||disabled?'disabled':''}></label><button data-update="${esc(id)}" ${pending||disabled?'disabled':''}>Update</button><button class="hx-cart-remove" data-remove="${esc(id)}" ${pending?'disabled':''}>Remove</button></div>`;}
  function render(){
    const cart=model.cart;
    const groups=cart?groupsIn(cart):new Map();
    let cards='';
    for(const [id,lines] of groups){
      const canonical=model.report?.groups.find(g=>g.id===id),jar=lines.find(l=>variantId(l)===canonical?.jarVariantId)||lines.find(l=>!l.properties?.['For blend'])||lines[0];
      const errors=canonical?.errors || (model.report?['UNVERIFIED']:[]);
      const missingPremium=canonical?.premiumPerJar>0&&!lines.some(l=>variantId(l)===canonical.premiumVariantId);
      const total=lines.reduce((n,l)=>n+(l.final_line_price??l.price*l.quantity),0);
      cards+=`<article class="hx-cart-card" data-blend="${esc(id)}">${photo(jar)}<div class="hx-cart-copy"><span class="hx-cart-eyebrow">YOUR CUSTOM BLEND</span><h2>Custom Sea Moss Gel</h2><p>${esc(jar.properties?.Herbs || 'Recipe details need review')}</p><p class="hx-cart-muted">${esc(jar.properties?.Flavor || 'Unflavored')} · ${esc(jar.properties?.Strength || 'Standard')} strength</p>${canonical?.premiumPerJar?`<p class="hx-cart-premium">${canonical.premiumPerJar} premium ${canonical.premiumPerJar===1?'herb':'herbs'} per jar${errors.length?'':' · charges included'}</p>`:''}${controls(id,canonical?.quantity||jar.quantity,missingPremium || !canonical?.jarVariantId || errors.some(e=>e!=='PREMIUM_QUANTITY_MISMATCH'))}${errors.map(code=>`<p class="hx-cart-error">${esc(missingPremium && code==='PREMIUM_QUANTITY_MISMATCH'?'The premium charge is missing. Remove this blend and add it again from the builder.':explain(code))}</p>`).join('')}${errors.length?`<a href="${esc(builder)}">Review in builder</a>`:''}</div><strong class="hx-cart-line-price">${money(total)}</strong></article>`;
    }
    for(const line of cart?.items.filter(l=>!isBlendLine(l))||[])cards+=`<article class="hx-cart-card hx-cart-ordinary"><div class="hx-cart-copy"><span class="hx-cart-eyebrow">ALSO IN YOUR CART</span><h2>${esc(line.product_title||line.title||'Store item')}</h2><p>${esc(line.variant_title||'')}</p>${controls(`item:${line.key}`,line.quantity,false,99)}</div><strong class="hx-cart-line-price">${money(line.final_line_price??line.price*line.quantity)}</strong></article>`;
    root.innerHTML=`<div class="hx-cart-shell"><header><span class="hx-cart-eyebrow">HEALISTIX · YOUR BLENDS</span><h1>Your cart, made for you.</h1><p>Each blend keeps its jars and premium herbs together.</p></header><div class="hx-cart-layout"><div>${cards || `<div class="hx-cart-empty">${cart?'Your cart is empty.':'Checking your cart…'}</div>`}<a class="hx-cart-back" href="${esc(builder)}">+ Build another blend</a></div><aside class="hx-cart-summary"><h2>Order summary</h2><div class="hx-cart-total"><span>Estimated total</span><strong>${cart?money(cart.total_price):'—'}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button class="hx-cart-checkout" data-checkout ${pending||!cart?.items.length||!model.report?.valid||model.uncertain?'disabled':''}>${pending?'Checking…':'Continue to checkout →'}</button><button class="hx-cart-refresh" data-refresh ${pending?'disabled':''}>Refresh & recheck</button><p role="status" aria-live="polite" class="${notice?'hx-cart-error':'hx-cart-muted'}">${esc(notice || (model.report?.valid?'Recipe and current price checks passed.':cart?.items.length?'Review your blends before checkout.':''))}</p>${(model.report?.errors||[]).map(code=>`<p class="hx-cart-error">${esc(explain(code))}</p>`).join('')}<p class="hx-cart-small">${root.dataset.local==='true'?'Local preview · mock stock and cart · no payment.':'Ingredients and prices are checked again when you continue.'}</p></aside></div></div>`;
  }
  async function run(action){if(pending)return;pending=true;notice='';render();try{await action();}catch(error){notice=error.message;}finally{pending=false;render();}}
  root.addEventListener('click',event=>{
    const button=event.target.closest('button'); if(!button || !root.contains(button))return;
    if(button.hasAttribute('data-remove'))run(()=>model.change(button.dataset.remove,0));
    else if(button.hasAttribute('data-update')){const id=button.dataset.update;const input=[...root.querySelectorAll('[data-quantity]')].find(n=>n.dataset.quantity===id);const quantity=Number(input.value);run(()=>model.change(id,quantity));}
    else if(button.hasAttribute('data-refresh'))run(()=>model.refresh());
    else if(button.hasAttribute('data-checkout'))run(async()=>{await model.checkout();checkout();});
  });
  render();run(()=>model.refresh());
  return {model,refresh:()=>run(()=>model.refresh())};
}
const nativeRoot=typeof document!=='undefined'&&document.querySelector('[data-hx-blend-cart]');
if(nativeRoot && nativeRoot.dataset.local!=='true') {
  const root=globalThis.Shopify?.routes?.root||'/';
  mountBlendCart(nativeRoot,shopifyTransport(root,`${root}apps/healistix-builder/validate-shopify-cart`));
}
