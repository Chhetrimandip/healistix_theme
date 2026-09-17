/* One transport boundary. No storage, analytics, cart calls or credentials. */
export function createAdapter({ mode, endpoint, seedUrl }) {
  let fixture;
  return async function request(operation, body, signal) {
    if (mode === 'fixture') {
      fixture ||= import('./hx-builder-fixture.js').then(m => m.createFixture(seedUrl));
      return (await fixture)(operation, body, signal);
    }
    if (mode !== 'service' || !endpoint) throw new Error('configuration');
    const url = new URL(endpoint, location.origin);
    if (url.origin !== location.origin) throw new Error('configuration');
    const response = await fetch(`${url.pathname.replace(/\/$/, '')}/${operation}`, {
      method: operation === 'catalog' ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin', cache: 'no-store', signal,
      ...(operation === 'catalog' ? {} : { body: JSON.stringify(body) })
    });
    const data = await response.json();
    if (data.schema_version !== '1' || (!response.ok && !data.status)) throw new Error('unavailable');
    return data;
  };
}
