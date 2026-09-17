/** Browser-only checkout rehearsal. Never submits payment, orders, or production work. */
const text = (value, fallback = '') => typeof value === 'string' ? value : fallback;
const money = value => Number.isSafeInteger(value) && value >= 0;
const fail = message => { throw new Error(message); };

export function createTestOrder(result, quantity, stock = 25) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 25) fail('Choose between 1 and 25 jars.');
  if (result?.status !== 'recommended' || !result.build) fail('Validate your blend before trying checkout.');
  const {build, pricing} = result;
  if (!pricing || !money(pricing.total_minor) || !/^[A-Z]{3}$/.test(pricing.currency ?? '')) fail('This blend needs a valid price.');
  if (!money(pricing.total_minor * quantity)) fail('The order amount is too large.');
  if (!Array.isArray(pricing.breakdown) || !pricing.breakdown.length) fail('This blend needs a price breakdown.');
  const breakdown = pricing.breakdown.map(line => {
    if (!line || !Number.isSafeInteger(line.quantity) || line.quantity < 0 || !money(line.unit_minor) || !money(line.total_minor) || line.quantity * line.unit_minor !== line.total_minor) fail('The price breakdown is invalid.');
    return {code:text(line.code),label:text(line.label),quantity:line.quantity,unit_minor:line.unit_minor,total_minor:line.total_minor};
  });
  if (breakdown.reduce((sum,line) => sum + line.total_minor, 0) !== pricing.total_minor) fail('The price breakdown does not match the total.');
  if (!Array.isArray(build.herbs) || build.herbs.length < 1 || build.herbs.length > 4) fail('Choose between 1 and 4 herbs.');
  const seen = new Set();
  const herbs = build.herbs.map(herb => {
    if (!herb || typeof herb.id !== 'string' || !herb.id.trim() || seen.has(herb.id) || !Number.isFinite(herb.g) || herb.g <= 0) fail('The blend contains an invalid herb.');
    seen.add(herb.id);
    const available = typeof stock === 'number' ? stock : stock && Object.hasOwn(stock,herb.id) ? stock[herb.id] : 0;
    if (!Number.isSafeInteger(available) || available < quantity) fail('There is not enough test stock for this quantity.');
    const display = Array.isArray(result.display?.herbs) ? result.display.herbs.find(item => item?.id === herb.id) : null;
    return {id:herb.id,name:text(display?.name,herb.id),g:herb.g};
  });
  if (!['standard','strong'].includes(build.strength) || typeof build.flavor?.id !== 'string' || !build.flavor.id || typeof build.flavor.level !== 'string' || !build.flavor.level) fail('The blend needs flavor and strength selections.');
  const recipe = {base:text(build.base,'gold-16oz'),strength:build.strength,flavor:{id:build.flavor.id,level:build.flavor.level},herbs};
  const token = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const id = `TEST-${token}`;
  return {id,mode:'simulation',quantity,unit_minor:pricing.total_minor,total_minor:pricing.total_minor * quantity,currency:pricing.currency,breakdown,recipe,
    tickets:Array.from({length:quantity},(_,index)=>({id:`${id}-J${index+1}`,order_id:id,jar:index+1,mode:'simulation',status:'test_request',recipe:structuredClone(recipe)}))};
}
