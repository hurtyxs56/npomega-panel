/* DRAGONFIRE 3.0.0 — safe sidebar for Pterodactyl v1.x.
 * Does not replace React components, rewrite text nodes, hijack forms,
 * or create a full-screen overlay. Native controls remain available.
 */
(function () {
  'use strict';
  if (window.__euforieV3) return;
  window.__euforieV3 = true;
  var VERSION = '1.0.0';
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
    sidebar.setAttribute('aria-label', 'DRAGONFIRE — nawigacja');
    var brand = add('a', 'euforie-brand', '🔥 DRAGONFIRE', sidebar);
    brand.href = '/';
    add('span', 'euforie-subtitle', 'SMOCZY PANEL SERWERÓW', sidebar);
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
      else { document.body.dataset.euforieNeedFallback='1'; document.body.classList.add('euforie-native-open'); }
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
    var footer = add('div', 'euforie-footer', 'DRAGONFIRE · SMOCZY OGIEŃ · v' + VERSION, sidebar);
    footer.setAttribute('aria-live', 'off');
    mobileToggle = add('button', 'euforie-mobile-toggle', '☰  Menu', document.body);
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-label', 'Pokaż lub ukryj menu DRAGONFIRE');
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
    if (!app) return null;
    // Pterodactyl 1.x: the #logo lives inside NavigationBar. It is the
    // reliable marker, not the presence of account/search actions.
    var logo=app.querySelector('#logo');
    if (!logo) return null;
    var header=logo.closest('div.bg-neutral-900');
    if (header && header.querySelector('a[href="/"]')) return header;
    var p=logo;
    for (var i=0;i<5&&p&&p!==app;i++,p=p.parentElement) {
      if (p.querySelector('a[href="/"]') && p.querySelector('a[href="/account"]')) return p;
    }
    return null;
  }
  function getLogoutButton(header) {
    if (!header) return null;
    // React's navigation <button> is a sibling of /account, not a child.
    var account=header.querySelector('a[href="/account"]');
    if (!account) return null;
    var group=account.parentElement;
    for(var depth=0;depth<3&&group&&group!==header;depth++,group=group.parentElement){
      var buttons=Array.from(group.querySelectorAll('button')).filter(function(el) {
        return !el.closest('.navigation-link');
      });
      if (buttons.length===1) return buttons[0];
    }
    return null;
  }
  function getNativeSubnav() {
    if (!app) return null;
    var id=getServerId();
    var prefix=id?'/server/'+id+'/':'/account/';
    var tails=id?['files','databases','schedules','users','backups','network','startup','settings','activity']:['api','ssh','activity'];
    var matching=Array.from(app.querySelectorAll('a[href]')).filter(function(a){
      try {
        var url=new URL(a.getAttribute('href'),location.origin).pathname;
        if(!url.startsWith(prefix)) return false;
        return tails.includes(url.slice(prefix.length));
      } catch (_) { return false; }
    });
    if(matching.length<2) return null;
    // Real Pterodactyl layout: <SubNavigation> <div> <a/> ... </div> </SubNavigation>
    // Return the OUTER styled SubNavigation wrapper, otherwise the gray bar remains.
    var inner=matching[0].parentElement;
    if (!inner || !matching.every(function(a){return inner.contains(a)})) return null;
    var outer=inner.parentElement;
    if (!outer || outer===app || outer.contains(app.querySelector('#logo'))) return null;
    if(outer.querySelectorAll('a[href]').length>22) return null;
    return outer;
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
    // If the native controls are not ready yet, leave their toolbar visible.
    // On the next React insertion MutationObserver will retry.
    if (header && canProxy) header.setAttribute('data-euforie-native-header','yes');
    else if (header) header.removeAttribute('data-euforie-native-header');

    var admin = sidebar.querySelector('.euforie-admin');
    // Never offer privileged navigation to users lacking the native admin link.
    if (admin) admin.hidden = !(header && header.querySelector('a[href="/admin"]'));

    var nativeSubnav = getNativeSubnav();
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
        // Preserve the server's original administrator edit control.
        if (nativeSubnav) {
          var editLink = nativeSubnav.querySelector('a[href^="/admin/servers/view/"]');
          if (editLink) {
            var edit = add('a','euforie-link','♜  Edytuj serwer (admin)',serverList);
            edit.href = editLink.getAttribute('href');
          }
        }
      }
    }
    // Keep the server's original navigation available unless we have working
    // links rendered in the sidebar. The "Oryginalne menu" button restores it.
    if (nativeSubnav && ((id && serverList.querySelector('a[href]')) || path.startsWith('/account'))) {
      nativeSubnav.setAttribute('data-euforie-native-subnav','yes');
    }
    // A missing native action must never leave users locked out of their panel.
    if (!canProxy) { document.body.dataset.euforieNeedFallback='1'; document.body.classList.add('euforie-native-open'); }
    else if(document.body.dataset.euforieNeedFallback==='1') {
      document.body.classList.remove('euforie-native-open');
      delete document.body.dataset.euforieNeedFallback;
    }
    document.documentElement.dataset.euforieVersion = VERSION;
    window.__euforieStatus = {
      version: VERSION,
      ready: true,
      originalTopBarDetected: !!header,
      nativeActionsReady: canProxy,
      originalServerTabsDetected: !!nativeSubnav,
      hiddenUpperMenu: canProxy && !!nativeSubnav && !document.body.classList.contains('euforie-native-open'),
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
    if (!app) {
      // Works even if JS executes before Laravel/React has mounted #app.
      var wait=new MutationObserver(function(){app=document.getElementById('app');if(app){wait.disconnect();init();}});
      wait.observe(document.documentElement,{childList:true,subtree:true});
      return;
    }
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
    console.info('[DRAGONFIRE] v' + VERSION + ' — sidebar bez warstwy blokującej kliknięcia');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
