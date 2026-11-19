/* Only transitions and progressive enhancement live here.
   Story, choices, paragraphs and game mechanics are never altered. */
(() => {
  const veil = document.createElement('div');
  veil.id = 'scene-transition';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        anchor.hasAttribute('download') || anchor.target === '_blank') return;

    const destination = new URL(anchor.href, location.href);
    if (destination.origin !== location.origin ||
        destination.pathname !== location.pathname ||
        destination.search === location.search) return;

    event.preventDefault();
    document.documentElement.classList.add('opening-book');
    window.setTimeout(() => { window.location.href = anchor.href; }, 380);
  });
})();
