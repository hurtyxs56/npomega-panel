/* EUFORIE 2.4.0 — tryb stabilny: oryginalne kliknięcia Pterodactyla.
   Brak overlay, sidebar, obserwatora DOM i przechwytywania kliknięć. */
(() => {
  'use strict';
  const version = '2.4.0';
  const init = () => {
    if (!document.getElementById('app')) return;
    document.documentElement.setAttribute('data-euforie-version', version);
    document.title = 'EUFORIE — Panel serwerów';
    const logo = document.querySelector('#logo a');
    if (logo) logo.setAttribute('aria-label', 'EUFORIE — Panel główny');
    console.info('[EUFORIE] Stabilny motyw ' + version + ' — natywna nawigacja aktywna.');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
