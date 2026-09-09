(() => {
  if (customElements.get('hx-lucky-signup')) return;
  customElements.define('hx-lucky-signup', class extends HTMLElement {
    connectedCallback() {
      this.abort = new AbortController();
      this.timers = [];
      this.dialog = this.querySelector('dialog');
      this.step = '1';
      const listen = (element, event, callback) => element.addEventListener(event, callback, { signal: this.abort.signal });
      const later = (callback, delay) => this.timers.push(setTimeout(callback, delay));
      listen(this.querySelector('[data-open]'), 'click', () => this.open());
      this.querySelectorAll('[data-close]').forEach(button => listen(button, 'click', () => this.dialog.close()));
      listen(this.dialog, 'close', () => {
        document.body.style.overflow = this.oldOverflow;
        this.remember();
        this.previousFocus?.focus();
      });
      let revealed = 0;
      this.querySelectorAll('[data-card]').forEach(card => listen(card, 'click', () => {
        if (card.getAttribute('aria-pressed') === 'true') return;
        card.setAttribute('aria-pressed', 'true');
        card.setAttribute('aria-label', `Revealed: ${card.querySelector('.hx-signup-card-front').textContent.trim()}`);
        revealed += 1;
        this.querySelector('[data-progress]').textContent = revealed === 3 ? 'Your welcome offer is ready!' : `${revealed} of 3 revealed. Keep going!`;
        if (revealed === 3) later(() => this.showStep('2'), 700);
      }));
      this.querySelectorAll('[data-choice], [data-next]').forEach(button => listen(button, 'click', () => this.showStep('3')));
      listen(this.querySelector('[data-back]'), 'click', () => this.showStep('2'));
      // Let Shopify's customer form handle validation, spam challenges and confirmation.
      const result = this.querySelector('[data-result]').dataset.result;
      if (result) {
        this.showStep(result === 'success' ? '4' : '3');
        if (result === 'success') this.remember();
        this.open();
      } else {
        let seen = false;
        try { seen = Date.now() - Number(localStorage.getItem('hx_popup_ts') || 0) < 7 * 86400000; } catch (_) { /* Storage may be unavailable. */ }
        if (new URLSearchParams(location.search).get('hx_signup') === '1') this.open();
        else if (!seen && this.dataset.editor !== 'true') later(() => this.open(), Number(this.dataset.delay) || 0);
      }
    }
    open() {
      if (this.dialog.open) return;
      this.previousFocus = document.activeElement;
      this.oldOverflow = document.body.style.overflow;
      this.dialog.showModal();
      document.body.style.overflow = 'hidden';
      this.querySelector(`[data-step="${this.step}"] h2`).focus();
    }
    showStep(step) {
      this.step = step;
      this.querySelectorAll('[data-step]').forEach(panel => { panel.hidden = panel.dataset.step !== step; });
      this.dialog.scrollTop = 0;
      if (this.dialog.open) this.querySelector(`[data-step="${step}"] h2`).focus();
    }
    remember() {
      try { localStorage.setItem('hx_popup_ts', String(Date.now())); } catch (_) { /* Signup works without local storage. */ }
    }
    disconnectedCallback() {
      this.timers.forEach(clearTimeout);
      if (this.dialog.open) document.body.style.overflow = this.oldOverflow;
      this.abort.abort();
    }
  });
})();
