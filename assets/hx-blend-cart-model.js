// Cart properties identify a group; only the backend supplies its expected charges.
export const BUILDER_VARIANTS = ['50196266909834','50196266942602','50196266975370','50196267008138','50196304691338'];
export const variantId = line => String(line.variant_id ?? line.id);
export const isBlendLine = line => Boolean(line.properties?._hx_cart_group || line.properties?._recipe_digest || line.properties?._build_id || BUILDER_VARIANTS.includes(variantId(line)));
export function groupId(line) { return line.properties?._hx_cart_group || `orphan:${line.key}`; }
export function groupsIn(cart) {
  const groups = new Map();
  for (const line of cart.items.filter(isBlendLine)) {
    const id = groupId(line);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(line);
  }
  return groups;
}
const fields = ['_hx_cart_group','_recipe_digest','_build_id','_engine_version','_library_version','_pricing_version','Herbs','Flavor','Flavor level','Strength','For blend'];
export function validationInput(cart) {
  return {currency:cart.currency,items:cart.items.filter(isBlendLine).map(line => ({key:line.key,variant_id:variantId(line),quantity:line.quantity,price:line.price,properties:Object.fromEntries(fields.filter(k => line.properties?.[k] !== undefined).map(k=>[k,line.properties[k]]))}))};
}
export const fingerprint = cart => JSON.stringify({currency:cart.currency,items:cart.items.map(line=>[line.key,variantId(line),line.quantity,line.price,line.final_line_price,line.properties]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))});
export function quantityUpdates(cart, group, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 20) throw Error('Choose between 1 and 20 jars, or remove the blend.');
  const lines=groupsIn(cart).get(group.id);
  if (!lines?.length) throw Error('This blend changed in another tab. Refresh the cart.');
  if (quantity === 0) return Object.fromEntries(lines.map(line=>[line.key,0]));
  if (!group.jarVariantId || !Number.isSafeInteger(group.premiumPerJar) || group.errors.some(code=>code!=='PREMIUM_QUANTITY_MISMATCH')) throw Error('This blend needs a fresh review in the builder before its quantity can change.');
  const jars=lines.filter(line=>variantId(line)===group.jarVariantId);
  const premiums=lines.filter(line=>variantId(line)===group.premiumVariantId);
  if(jars.length!==1 || premiums.length!==(group.premiumPerJar>0?1:0) || lines.length!==jars.length+premiums.length) throw Error('The blend is incomplete. Remove it and add it again from the builder.');
  return Object.fromEntries(lines.map(line=>[line.key,variantId(line)===group.jarVariantId?quantity:quantity*group.premiumPerJar]));
}
export class BlendCart {
  constructor(transport) { this.transport=transport; this.busy=false; this.cart=null; this.report=null; this.uncertain=false; }
  async locked(work) {
    if(this.busy) throw Error('Please wait for the current cart update.');
    this.busy=true;
    try { return await work(); } finally { this.busy=false; }
  }
  async load() {
    this.cart=await this.transport.read(); this.report=null;
    if(!Array.isArray(this.cart.items)) throw Error('The cart could not be read.');
    this.report=await this.transport.validate(validationInput(this.cart));
    if(typeof this.report?.valid!=='boolean'||!Array.isArray(this.report.groups)||!Array.isArray(this.report.errors)) {this.report=null;throw Error('The blend check is unavailable. Refresh before checkout.');}
    this.uncertain=false;
    return this.cart;
  }
  refresh() { return this.locked(()=>this.load()); }
  change(id, quantity) {
    return this.locked(async()=>{
      if(this.uncertain)throw Error('Refresh the cart before another change. The previous update could not be confirmed.');
      // Do not overwrite a change from another tab using a stale quantity control.
      const before=this.cart && fingerprint(this.cart);
      const fresh=await this.transport.read();
      if(before && fingerprint(fresh)!==before){await this.load();throw Error('Your cart changed in another tab. Review it and try again.');}
      this.cart=fresh;
      let updates;
      if(id.startsWith('item:')) {
        const key=id.slice(5),line=fresh.items.find(x=>x.key===key && !isBlendLine(x));
        if(!line || !Number.isSafeInteger(quantity) || quantity<0 || quantity>99)throw Error('Choose a valid quantity.');
        updates={[key]:quantity};
      } else {
        let group={id,errors:[]};
        if(quantity!==0) {
          this.report=await this.transport.validate(validationInput(fresh));
          group=this.report.groups?.find(g=>g.id===id) || group;
          if(this.report.errors?.length && !(this.report.errors.every(code=>code==='INSUFFICIENT_INVENTORY') && quantity<group.quantity))throw Error('Current prices or availability could not be verified. Reduce an over-stock quantity, refresh, or remove the blend.');
        }
        updates=quantityUpdates(fresh,group,quantity);
      }
      this.report=null;
      let failure;
      try {await this.transport.update(updates);}catch(error){failure=error;}
      try {this.cart=await this.transport.read();}catch{this.uncertain=true;throw Error('The cart update could not be confirmed. Refresh before retrying.');}
      const complete=Object.entries(updates).every(([key,n])=>n===0?!this.cart.items.some(x=>x.key===key):this.cart.items.some(x=>x.key===key && x.quantity===n));
      this.report=await this.transport.validate(validationInput(this.cart));
      if(!complete)throw Error(failure?.message || 'Shopify could not apply the full quantity change. Review the cart before checkout.');
      // A lost write response can still be successful; never blindly replay the write.
      return this.cart;
    });
  }
  checkout() {
    return this.locked(async()=>{
      if(this.uncertain)throw Error('Refresh the cart before checkout.');
      await this.load();
      if(!this.cart.items.length)throw Error('Your cart is empty.');
      if(!this.report.valid)throw Error('Review the highlighted blends before checkout.');
      const checked=fingerprint(this.cart),fresh=await this.transport.read();
      if(fingerprint(fresh)!==checked){this.cart=fresh;this.report=null;throw Error('Your cart changed during the check. Review it and try again.');}
      return true;
    });
  }
}
export function shopifyTransport(root='/', endpoint='/apps/healistix-builder/validate-shopify-cart', fetcher=fetch) {
  if(!/^\/(?:[A-Za-z0-9-]+\/)*$/.test(root) || !/^\/(?!\/)/.test(endpoint))throw Error('Invalid cart address.');
  async function json(url,body) {
    const response=await fetcher(url,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
    const result=await response.json();
    if(!response.ok)throw Error(result.description || 'The cart service is unavailable. Try again.');
    return result;
  }
  return {read:()=>json(`${root}cart.js`),update:updates=>json(`${root}cart/update.js`,{updates}),validate:input=>json(endpoint,input)};
}
