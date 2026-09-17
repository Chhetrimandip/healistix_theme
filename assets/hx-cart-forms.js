// Custom storefront forms use the same Shopify section rendering as Dawn's product-form.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.closest('product-form')) return;
  if (!new URL(form.action, location.href).pathname.endsWith('/cart/add')) return;
  const drawer = document.querySelector('cart-drawer');
  if (!drawer || event.defaultPrevented) return;
  event.preventDefault();
  if (form.dataset.cartBusy) return;
  form.dataset.cartBusy = 'true';
  const button = event.submitter || form.querySelector('[type="submit"]');
  const label = button?.innerHTML;
  const data = new FormData(form);
  data.append('sections', drawer.getSectionsToRender().map(section => section.id).join(','));
  data.append('sections_url', location.pathname);
  drawer.setActiveElement(button || document.activeElement);
  if (button) { button.disabled = true; button.textContent = 'Adding…'; }
  let error = form.querySelector('[data-hx-cart-error]');
  if (!error) {
    error = document.createElement('p');
    error.dataset.hxCartError = '';
    error.setAttribute('role', 'alert');
    form.append(error);
  }
  error.hidden = true;
  try {
    const response = await fetch(window.routes.cart_add_url, {method: 'POST', headers: {Accept: 'application/json'}, body: data});
    const result = await response.json();
    if (!response.ok || result.status) throw new Error(result.description || 'Unable to add this item. Please try again.');
    if (!result.sections || !Object.values(result.sections).every(Boolean)) {
      location.assign(window.routes.cart_url);
      return;
    }
    drawer.classList.remove('is-empty');
    drawer.renderContents(result);
  } catch (failure) {
    error.textContent = failure.message;
    error.hidden = false;
  } finally {
    delete form.dataset.cartBusy;
    if (button) { button.disabled = false; button.innerHTML = label; }
  }
});
