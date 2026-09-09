(() => {
  function initialize(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const list = root.querySelector('[data-review-list]');
    const rows = [...list.querySelectorAll('[data-review-row]')];
    const flavor = root.querySelector('[data-review-flavor]');
    const sort = root.querySelector('[data-review-sort]');
    const media = root.querySelector('[data-review-media]');
    const more = root.querySelector('[data-review-more]');
    let limit = 5;
    [...new Set(rows.map(row => row.dataset.flavor))].sort().forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      flavor.append(option);
    });
    function update() {
      const filtered = rows.filter(row => (!flavor.value || row.dataset.flavor === flavor.value) && (!media.checked || row.dataset.media === 'true'));
      filtered.sort((a, b) => {
        if (sort.value === 'recent') return (Date.parse(b.dataset.date) || 0) - (Date.parse(a.dataset.date) || 0);
        if (sort.value === 'high') return Number(b.dataset.rating) - Number(a.dataset.rating);
        if (sort.value === 'low') return (Number(a.dataset.rating) || 6) - (Number(b.dataset.rating) || 6);
        return Number(a.dataset.order) - Number(b.dataset.order);
      });
      rows.forEach(row => { row.hidden = true; row.querySelectorAll('video').forEach(video => video.pause()); });
      filtered.forEach((row, index) => { list.append(row); row.hidden = index >= limit; });
      more.hidden = filtered.length <= limit;
      root.querySelector('[data-review-empty]').hidden = filtered.length > 0;
      root.querySelector('[data-review-count]').textContent = `${Math.min(limit, filtered.length)} of ${filtered.length} selected reviews`;
    }
    [flavor, sort, media].forEach(control => control.addEventListener('change', () => { limit = 5; update(); }));
    more.addEventListener('click', () => { const previous = limit; limit += 5; update(); const visible = [...list.querySelectorAll('[data-review-row]:not([hidden])')]; visible[previous]?.focus({ preventScroll: true }); });
    root.querySelectorAll('[data-review-jump]').forEach(link => link.addEventListener('click', () => {
      flavor.value = ''; media.checked = false; limit = rows.length; update();
    }));
    update();
  }
  document.querySelectorAll('[data-pdp-reviews]').forEach(initialize);
  document.addEventListener('shopify:section:load', event => event.target.querySelectorAll('[data-pdp-reviews]').forEach(initialize));
})();
