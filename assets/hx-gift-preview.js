(() => {
  const init = section => {
    const preview = section.querySelector('[data-gift-preview]');
    if (!preview || preview.dataset.ready) return;
    preview.dataset.ready = 'true';
    const dialog = section.querySelector('[data-gift-dialog]');
    const shown = new Set();
    let previousCount = null, selectedCount = 0, opener, oldOverflow;
    const showGift = tier => {
      opener = document.activeElement;
      const image = dialog.querySelector('[data-gift-image]');
      image.src = tier === 5 ? dialog.dataset.bowl : dialog.dataset.spoon;
      image.alt = tier === 5 ? 'Healistix cream bowl and gold spoon merchandise concept' : 'Healistix gold spoon merchandise concept';
      dialog.querySelector('[data-gift-title]').textContent = selectedCount >= tier
        ? (tier === 5 ? 'Congratulations! Your duo is unlocked.' : 'Congratulations! Your spoon is unlocked.')
        : 'A little gift to look forward to.';
      dialog.querySelector('[data-gift-description]').textContent = tier === 5
        ? 'Five jars, a little more joy. Preview your Healistix bowl + spoon.'
        : 'Three jars deserve a little extra. Preview your Healistix reusable spoon.';
      if (!dialog.open) {
        oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
      }
    };
    dialog.querySelectorAll('[data-close-gift]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = oldOverflow;
      if (opener?.isConnected) opener.focus({preventScroll:true});
    });
    preview.querySelector('[data-view-gift]').addEventListener('click', () => showGift(selectedCount >= 5 ? 5 : 3));
    const update = () => {
      const count = section.dataset.purchaseMode === 'mix'
        ? [...section.querySelectorAll('.hx-mix-stepper input')].reduce((sum, input) => sum + (Number(input.value) || 0), 0)
        : Number(section.querySelector('[data-quantity-display]')?.value) || 0;
      preview.querySelector('progress').value = Math.min(count, 5);
      preview.querySelectorAll('[data-gift-tier]').forEach(tier => {
        const reached = count >= Number(tier.dataset.giftTier);
        tier.classList.toggle('is-reached', reached);
        tier.querySelector('[data-gift-state]').textContent = reached ? 'Preview unlocked' : `${tier.dataset.giftTier} jars`;
      });
      preview.querySelector('[data-gift-message]').textContent = count >= 5
        ? 'Preview unlocked: your bowl + spoon.'
        : count >= 3 ? `Spoon preview unlocked. Add ${5-count} more ${5-count === 1 ? 'jar' : 'jars'} for the bowl.`
        : `Add ${3-count} more ${3-count === 1 ? 'jar' : 'jars'} to preview the spoon reward.`;
      selectedCount = count;
      const tier = count >= 5 ? 5 : count >= 3 ? 3 : 0;
      if (previousCount !== null && tier && count > previousCount && !shown.has(tier)) {
        shown.add(tier);
        if (tier === 5) shown.add(3);
        showGift(tier);
      }
      previousCount = count;
    };
    section.addEventListener('hx:mix-change', update);
    section.addEventListener('click', () => requestAnimationFrame(update));
    section.addEventListener('change', () => requestAnimationFrame(update));
    update();
  };
  const boot = () => document.querySelectorAll('.hx-clean-pdp').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', boot);
})();
