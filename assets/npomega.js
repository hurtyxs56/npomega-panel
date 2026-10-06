/* NPΩ Panel · only known navigation/auth labels are translated. */
(() => {
  'use strict';
  if (window.__npomegaLoaded) return;
  window.__npomegaLoaded = true;
  // Runs after Blade's configuration and before the original React bundle.
  if (window.SiteConfiguration && typeof window.SiteConfiguration === 'object') {
    window.SiteConfiguration.name = 'NPΩ Panel';
  }
  const labels = new Map(Object.entries({
    'Console':'Konsola','Files':'Pliki','Databases':'Bazy danych',
    'Schedules':'Harmonogramy','Users':'Użytkownicy','Backups':'Kopie zapasowe',
    'Network':'Sieć','Startup':'Uruchamianie','Settings':'Ustawienia','Activity':'Aktywność',
    'Account':'Konto','API Credentials':'Klucze API','SSH Keys':'Klucze SSH',
    'Overview':'Przegląd','Application API':'API aplikacji','Locations':'Lokalizacje',
    'Nodes':'Węzły','Servers':'Serwery','Mounts':'Punkty montowania','Nests':'Gniazda',
    'BASIC ADMINISTRATION':'ADMINISTRACJA','MANAGEMENT':'ZARZĄDZANIE',
    'SERVICE MANAGEMENT':'KONFIGURACJA USŁUG',
    'Login to Continue':'Zaloguj się do NPΩ', 'Username or Email':'Nazwa użytkownika lub e-mail',
    'Password':'Hasło','Login':'Zaloguj się','Forgot password?':'Nie pamiętasz hasła?',
    'Return to Login':'Wróć do logowania','Email':'E-mail','Email Address':'Adres e-mail',
    'Reset Password':'Zresetuj hasło','Send Password Reset Email':'Wyślij link do resetowania',
    'Confirm Password':'Potwierdź hasło','Two-Factor Authentication':'Weryfikacja dwuetapowa',
    'Authentication Code':'Kod uwierzytelniający','Recovery Code':'Kod odzyskiwania'
  }));
  function translate(element) {
    // Modify text nodes only. Never replace React's children or input values.
    for (const node of element.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const trimmed = node.data.trim();
      if (labels.has(trimmed)) node.data = node.data.replace(trimmed, labels.get(trimmed));
    }
  }
  function decorate() {
    const logo = document.querySelector('#logo');
    const topbar = logo?.parentElement?.parentElement;
    if (topbar) {
      const candidate = topbar.nextElementSibling;
      if (candidate && candidate.firstElementChild?.querySelector('a[href^="/server/"],a[href^="/account"]')) {
        candidate.classList.add('np-subnav');
      }
    }
    document.querySelectorAll('.np-subnav a,.sidebar-menu a span,.sidebar-menu li.header').forEach(translate);
    document.querySelectorAll('.main-header .logo>span').forEach(e => {
      if (e.textContent !== 'NPΩ Panel') e.textContent = 'NPΩ Panel';
    });
    if (location.pathname.startsWith('/auth/')) {
      document.querySelectorAll('form').forEach(form => {
        const container = form.parentElement;
        container.classList.add('np-auth');
        container.querySelectorAll('h2,label,button,a').forEach(translate);
        container.querySelectorAll('img[src="/assets/svgs/pterodactyl.svg"]').forEach(img => {
          img.src = '/npomega/logo.svg'; img.alt = 'NPΩ Panel'; img.dataset.npBrand = 'true';
        });
      });
    }
  }
  function start() {
    decorate();
    let queued = false;
    const observer = new MutationObserver(records => {
      // Terminal/file editor updates are deliberately excluded.
      const relevant = records.some(r => !r.target.parentElement?.closest('.xterm,.ace_editor,.monaco-editor,pre,code') &&
        (r.type === 'childList' || r.target.parentElement?.closest('.np-subnav,.np-auth,.sidebar-menu')));
      if (!relevant || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; decorate(); });
    });
    observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
