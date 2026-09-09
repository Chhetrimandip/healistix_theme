if (!customElements.get('hx-goodness-fan')) {
  customElements.define('hx-goodness-fan', class extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('.hx-goodness__pause');
      this.paused = false;
      this.visible = false;
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.sync = () => {
        this.toggleAttribute('data-running', this.visible && !this.paused && !this.motion.matches && !document.hidden);
        this.button.setAttribute('aria-label', this.paused ? 'Play photo rotation' : 'Pause photo rotation');
        this.button.setAttribute('aria-pressed', String(this.paused));
        this.button.textContent = this.paused ? '▶' : 'Ⅱ';
      };
      this.toggle = () => { this.paused = !this.paused; this.sync(); };
      this.button.addEventListener('click', this.toggle);
      this.motion.addEventListener('change', this.sync);
      document.addEventListener('visibilitychange', this.sync);
      this.observer = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.sync();
      });
      this.observer.observe(this);
      this.setAttribute('data-ready', '');
      this.sync();
    }
    disconnectedCallback() {
      this.observer?.disconnect();
      this.button?.removeEventListener('click', this.toggle);
      this.motion?.removeEventListener('change', this.sync);
      document.removeEventListener('visibilitychange', this.sync);
    }
  });
}
