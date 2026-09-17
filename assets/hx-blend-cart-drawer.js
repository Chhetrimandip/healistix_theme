// Review theme: edit the full cart, where jars and premium charges stay grouped.
// This is a navigation guard, not a checkout Function or purchase authorization.
const cartPath=()=>globalThis.Shopify?.routes?.root ? `${globalThis.Shopify.routes.root}cart` : '/cart';
document.addEventListener('click',event=>{
  const drawer=event.target.closest('cart-drawer');
  if(!drawer)return;
  const action=event.target.closest('cart-remove-button,.quantity__button,[name="checkout"],a[href*="/checkout"]');
  if(action){event.preventDefault();event.stopImmediatePropagation();location.assign(cartPath());}
},true);
document.addEventListener('change',event=>{
  if(event.target.closest('cart-drawer') && event.target.matches('input[name="updates[]"]')){event.stopImmediatePropagation();location.assign(cartPath());}
},true);
const style=document.createElement('style');
style.textContent='cart-drawer .cart__dynamic-checkout-buttons,cart-drawer .additional-checkout-buttons{display:none!important}';
document.head.append(style);
