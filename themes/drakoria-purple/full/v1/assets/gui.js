/* EUFORIE 3.0.0 — safe sidebar for Pterodactyl v1.x.
 * Does not replace React components, rewrite text nodes, hijack forms,
 * or create a full-screen overlay. Native controls remain available.
 */
(function () {
  'use strict';
  if (window.__euforieV3) return;
  window.__euforieV3 = true;
  var VERSION = '3.1.0';
  var app = null;

  var links = [
    ['Konsola', '', '⌘'],
    ['Pliki', '/files', '▤'],
    ['Bazy danych', '/databases', '◫'],
    ['Harmonogram', '/schedules', '◷'],
    ['Użytkownicy', '/users', '♙'],
    ['Kopie zapasowe', '/backups', '▣'],
    ['Sieć', '/network', '◎'],
    ['Uruchamianie', '/startup', 'ϟ'],
    ['Ustawienia', '/settings', '⚙'],
    ['Aktywność', '/activity', '▥']
  ];
  var sidebar = null;
  var serverList = null;
  var mobileToggle = null;
  var refreshPending = false;
  var lastPath = '';

  function add(tag, cls, text, parent) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }
  function getServerId() {
    var match = window.location.pathname.match(/^\/server\/([^/]+)/);
    return match ? match[1] : null;
  }
  function isClient() {
    return !/^\/(?:auth|admin)(?:\/|$)/.test(window.location.pathname);
  }
  function closeMobile() {
    document.body.classList.remove('euforie-menu-open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }
  function build() {
    if (sidebar) return;
    sidebar = add('aside', 'euforie-sidebar', '', document.body);
    sidebar.setAttribute('aria-label', 'EUFORIE — nawigacja');
    var brand = add('a', 'euforie-brand', '◆ EUFORIE', sidebar);
    brand.href = '/';
    add('span', 'euforie-subtitle', 'PANEL SERWERÓW', sidebar);
    add('div', 'euforie-section-label', 'GŁÓWNE', sidebar);
    var home = add('a', 'euforie-link euforie-home', '⌂  Panel główny', sidebar);
    home.href = '/';
    add('div', 'euforie-section-label', 'SERWER', sidebar);
    serverList = add('nav', 'euforie-links', '', sidebar);
    serverList.setAttribute('aria-label', 'Opcje wybranego serwera');
    add('div', 'euforie-section-label', 'KONTO', sidebar);
    var account = add('a', 'euforie-link', '⚙  Moje konto', sidebar);
    account.href = '/account';
    var admin = add('a', 'euforie-link euforie-admin', '♜  Administracja', sidebar);
    admin.href = '/admin';
    admin.hidden = true;
    var api = add('a', 'euforie-link', '◈  Klucze API', sidebar);
    api.href = '/account/api';
    var ssh = add('a', 'euforie-link', '⌁  Klucze SSH', sidebar);
    ssh.href = '/account/ssh';
    var activity = add('a', 'euforie-link', '◷  Aktywność konta', sidebar);
    activity.href = '/account/activity';
    var search = add('button', 'euforie-link euforie-action euforie-search', '⌕  Wyszukaj serwer', sidebar);
    search.type = 'button';
    search.addEventListener('click', function () {
      var header = getHeader();
      var original = header && header.querySelector('.navigation-link');
      if (original) original.click();
      else document.body.classList.add('euforie-native-open');
      closeMobile();
    });
    var logout = add('button', 'euforie-link euforie-action euforie-logout', '↪  Wyloguj', sidebar);
    logout.type = 'button';
    logout.addEventListener('click', function () {
      var original = getLogoutButton(getHeader());
      if (original) original.click();
      else document.body.classList.add('euforie-native-open');
      closeMobile();
    });
    var reveal = add('button', 'euforie-link euforie-action euforie-emergency', '☷  Przywróć pasek awaryjnie', sidebar);
    reveal.type = 'button';
    reveal.addEventListener('click', function () {
      document.body.classList.toggle('euforie-native-open');
      reveal.setAttribute('aria-expanded', String(document.body.classList.contains('euforie-native-open')));
      closeMobile();
    });
    var footer = add('div', 'euforie-footer', 'EUFORIE PURPLE · v' + VERSION, sidebar);
    footer.setAttribute('aria-live', 'off');
    mobileToggle = add('button', 'euforie-mobile-toggle', '☰  Menu', document.body);
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-label', 'Pokaż lub ukryj menu EUFORIE');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('euforie-menu-open');
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
    sidebar.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMobile();
    });
  }
  function getHeader() {
    var logo = app.querySelector('#logo');
    if (!logo) return null;
    var candidate = logo;
    for (var i = 0; i < 5 && candidate && candidate !== app; i++, candidate = candidate.parentElement) {
      if (candidate.querySelector('a[href="/account"]') &&
          candidate.querySelector('a[href="/"]')) return candidate;
    }
    // The logo may exist before the account action is mounted; do not hide.
    return null;
  }
  function getLogoutButton(header) {
    if (!header) return null;
    var accountLink = header.querySelector('a[href="/account"]');
    var nav = accountLink && accountLink.parentElement;
    if (!nav) return null;
    return Array.prototype.find.call(nav.children, function (el) {
      return el.tagName === 'BUTTON';
    }) || null;
  }
  function getAccountNav() {
    if (!location.pathname.startsWith('/account')) return null;
    var links = Array.prototype.slice.call(app.querySelectorAll('a[href]')).filter(function (el) {
      return ['/account/api','/account/ssh','/account/activity'].includes(el.getAttribute('href'));
    });
    if (links.length < 2) return null;
    var parent=links[0].parentElement;
    if (parent && links.every(function (el) {return parent.contains(el)})) return parent;
    return null;
  }
  function getServerNav(id) {
    if (!id) return null;
    var candidates = Array.prototype.slice.call(app.querySelectorAll('a[href]')).filter(function (a) {
      try {
        var pathname = new URL(a.getAttribute('href'), location.origin).pathname;
        return pathname.indexOf('/server/' + id + '/') === 0 &&
          /\/(files|databases|schedules|users|backups|network|startup|settings|activity)$/.test(pathname);
      } catch (_) { return false; }
    });
    if (candidates.length < 2) return null;
    var first = candidates[0];
    var holder = first.parentElement;
    for (var i = 0; i < 4 && holder && holder !== app; i++, holder = holder.parentElement) {
      if (candidates.every(function (a) { return holder.contains(a); }) &&
          holder.querySelectorAll('a[href]').length <= 20) {
        return holder;
      }
    }
    return null;
  }
  function refresh() {
    refreshPending = false;
    if (!sidebar || !isClient()) {
      document.body.classList.remove('euforie-ready','euforie-native-open','euforie-menu-open');
      return;
    }
    document.body.classList.add('euforie-ready');
    var id = getServerId();
    var path = window.location.pathname;
    var home = sidebar.querySelector('.euforie-home');
    if (home) home.classList.toggle('active', path === '/');
    sidebar.querySelectorAll('a.euforie-link[href^="/account"]').forEach(function (link) {
      link.classList.toggle('active',path === link.getAttribute('href'));
    });
    var header = getHeader();
    var oldHeader = app.querySelector('[data-euforie-native-header]');
    if (oldHeader && oldHeader !== header) oldHeader.removeAttribute('data-euforie-native-header');
    var canProxy = !!(header && header.querySelector('.navigation-link') && getLogoutButton(header));
    if (header && canProxy) header.setAttribute('data-euforie-native-header','yes');
    else if (header) header.removeAttribute('data-euforie-native-header');

    var admin = sidebar.querySelector('.euforie-admin');
    // Never offer privileged navigation to users lacking the native admin link.
    if (admin) admin.hidden = !(header && header.querySelector('a[href="/admin"]'));

    var nativeSubnav = id ? getServerNav(id) : getAccountNav();
    var prevNav = app.querySelector('[data-euforie-native-subnav]');
    if (prevNav && prevNav !== nativeSubnav) prevNav.removeAttribute('data-euforie-native-subnav');

    // Rebuild our links from actual native routes. These remain ordinary
    // browser links and never intercept server start/stop buttons.
    var listKey = String(id) + ':' + (nativeSubnav ? nativeSubnav.textContent : '') + ':' + path;
    if (listKey !== lastPath) {
      lastPath = listKey;
      serverList.replaceChildren();
      if (!id) {
        add('span','euforie-hint','Wybierz serwer z listy.',serverList);
      } else {
        var available = new Set();
        if (nativeSubnav) {
          nativeSubnav.querySelectorAll('a[href]').forEach(function (a) {
            try { available.add(new URL(a.href,location.origin).pathname); } catch (_) {}
          });
        }
        links.forEach(function (item) {
          var target = '/server/' + id + item[1];
          // If native submenu exists, honour its actual permission-filtered links.
          if (nativeSubnav && item[1] && !available.has(target)) return;
          var a = add('a','euforie-link', item[2] + '  ' + item[0],serverList);
          a.href = target;
          a.classList.toggle('active',path === target || (item[1] && path.indexOf(target + '/') === 0));
        });
      }
    }
    // Keep the server's original navigation available unless we have working
    // links rendered in the sidebar. The "Oryginalne menu" button restores it.
    if (nativeSubnav && ((id && serverList.querySelector('a[href]')) || path.startsWith('/account'))) {
      nativeSubnav.setAttribute('data-euforie-native-subnav','yes');
    }
    // A missing native action must never leave users locked out of their panel.
    if (!canProxy) document.body.classList.add('euforie-native-open');
    document.documentElement.dataset.euforieVersion = VERSION;
    window.__euforieStatus = {
      version: VERSION,
      ready: true,
      originalTopBarDetected: !!header,
      nativeActionsReady: canProxy,
      originalServerTabsDetected: !!nativeSubnav,
      path: path
    };
  }
  function schedule() {
    if (refreshPending) return;
    refreshPending = true;
    requestAnimationFrame(refresh);
  }
  function init() {
    app = document.getElementById('app');
    if (!app) return;
    build();
    schedule();
    // Observe only React child insertions/removals. Theme changes outside
    // #app and data attributes are not observed: no infinite loops.
    new MutationObserver(schedule).observe(app,{subtree:true,childList:true});
    window.addEventListener('popstate',schedule);
    window.addEventListener('pageshow',schedule);
    document.addEventListener('keydown',function(e) {
      if (e.key === 'Escape') {
        closeMobile();
        document.body.classList.remove('euforie-native-open');
      }
    });
    console.info('[EUFORIE] v' + VERSION + ' — sidebar bez warstwy blokującej kliknięcia');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
