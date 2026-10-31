/* EUFORIE Purple PL: GUI działa na oryginalnym panelu React, bez dodatkowego API */
(()=>{'use strict';if(window.__euforiePurple)return;window.__euforiePurple=true;
const tr={'Dashboard':'Panel główny','Console':'Konsola','Files':'Pliki','Databases':'Bazy danych','Schedules':'Harmonogram zadań','Users':'Użytkownicy','Backups':'Kopie zapasowe','Network':'Sieć','Startup':'Uruchamianie','Settings':'Ustawienia','Activity':'Aktywność','Start':'Uruchom','Stop':'Zatrzymaj','Kill':'Wymuś stop','Restart':'Restart','Offline':'Wyłączony','Running':'Włączony','Starting':'Uruchamianie','Stopping':'Zatrzymywanie','My Servers':'Moje serwery','All Servers':'Wszystkie serwery','Account':'Konto','Account Settings':'Ustawienia konta','API Credentials':'Klucze API','SSH Keys':'Klucze SSH','Sign Out':'Wyloguj','Admin':'Administracja','Upload':'Prześlij','Create Directory':'Utwórz katalog','New File':'Nowy plik','Create Backup':'Utwórz kopię zapasową','Restore':'Przywróć','Delete':'Usuń','Download':'Pobierz','Rename':'Zmień nazwę','Save':'Zapisz','Cancel':'Anuluj','Confirm':'Potwierdź','Continue':'Kontynuuj','Create':'Utwórz','Close':'Zamknij','Update':'Aktualizuj','Search':'Szukaj','Name':'Nazwa','Size':'Rozmiar','Username':'Użytkownik','Password':'Hasło','Hostname':'Host','Port':'Port','Address':'Adres','Memory':'Pamięć RAM','Disk':'Dysk','CPU Usage':'Użycie CPU','Memory Usage':'Użycie RAM','Disk Usage':'Użycie dysku','Server Status':'Stan serwera','Server Details':'Szczegóły serwera','Server Information':'Informacje o serwerze','Type a command...':'Wpisz komendę...','Search for a server...':'Szukaj serwera...'};
const icons={home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',terminal:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m7 9 4 3-4 3m6 4h4"/>',folder:'<path d="M3 7V5h7l2 3h9v12H3z"/>',database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5m-16 7c0 4 16 4 16 0"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l5 3"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 21a6 6 0 0 1 12 0m2-13a3 3 0 0 1 0 6"/>',cloud:'<path d="M7 18H5a4 4 0 0 1-1-8 7 7 0 0 1 13 0 4 4 0 0 1 1 8H7z"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-6 6-6 12 0 18m0-18c6 6 6 12 0 18"/>',zap:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3M19 5l-3 3M8 16l-3 3"/>',chart:'<path d="M3 3v18h18M6 16l4-5 4 3 6-8"/>'};
const svg=n=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[n]+'</svg>';
const sections=[['GŁÓWNE',[['Panel główny','/','home']]],['ZARZĄDZANIE',[['Konsola','','terminal'],['Pliki','/files','folder'],['Bazy danych','/databases','database'],['Harmonogram zadań','/schedules','clock'],['Użytkownicy','/users','users'],['Kopie zapasowe','/backups','cloud'],['Sieć','/network','globe'],['Uruchamianie','/startup','zap'],['Ustawienia','/settings','settings'],['Aktywność','/activity','chart']]]];
let aside=null,scheduled=false;
const current=()=>{let m=location.pathname.match(/^\/server\/([^/]+)/);return m?m[1]:null};
function close(){document.body.classList.remove('dp-menu-open')}
function make(){if(document.querySelector('.dp-sidebar'))return;aside=document.createElement('aside');aside.className='dp-sidebar';aside.setAttribute('aria-label','Menu panelu');
const brand=document.createElement('a');brand.className='dp-brand';brand.href='/';brand.innerHTML='<img alt="" src="/purple-ptero/logo.svg"><div>EUFORIE<small>Panel serwerów</small></div>';aside.append(brand);
for(const [title,links] of sections){const group=document.createElement('div');group.className='dp-group';const h=document.createElement('span');h.className='dp-label';h.textContent=title;group.append(h);for(const [label,suffix,icon] of links){const a=document.createElement('a');a.className='dp-nav-link';a.dataset.suffix=suffix;a.innerHTML=svg(icon)+'<span></span>';a.lastElementChild.textContent=label;a.addEventListener('click',close);group.append(a)}aside.append(group)}
const utility=document.createElement('div');utility.className='dp-group dp-utility';utility.innerHTML='<span class="dp-label">KONTO I NARZĘDZIA</span><button type="button" class="dp-utility-action dp-search-trigger">⌕ <span>Wyszukaj serwer</span></button><a class="dp-utility-action" href="/account">⚙ <span>Moje konto</span></a><a class="dp-utility-action dp-admin-link" href="/admin" hidden>♜ <span>Administracja</span></a><button type="button" class="dp-utility-action dp-logout-trigger">↪ <span>Wyloguj</span></button>';aside.append(utility);
utility.querySelector('.dp-search-trigger').addEventListener('click',()=>{document.body.classList.toggle('dp-search-open');const input=document.querySelector('[data-dp-native-header] input');if(document.body.classList.contains('dp-search-open')&&input)input.focus()});
utility.querySelector('.dp-logout-trigger').addEventListener('click',()=>{const buttons=document.querySelectorAll('[data-dp-native-header] button');const original=buttons[buttons.length-1];if(original)original.click();else window.alert('Nie znaleziono przycisku wylogowania.')});
const footer=document.createElement('div');footer.className='dp-sidebar-bottom';footer.innerHTML='<span>EUFORIE • PURPLE 2.2</span>Pterodactyl · Polski GUI';aside.append(footer);document.body.prepend(aside);
const toggle=document.createElement('button');toggle.className='dp-mobile-toggle';toggle.setAttribute('aria-label','Otwórz menu');toggle.textContent='☰';toggle.onclick=()=>document.body.classList.toggle('dp-menu-open');document.body.append(toggle);const overlay=document.createElement('div');overlay.className='dp-overlay';overlay.onclick=close;document.body.append(overlay)}
function nav(){if(location.pathname.startsWith('/admin')||location.pathname.startsWith('/auth')){document.body.classList.remove('dp-enabled','dp-chrome-ready','dp-search-open');return}document.body.classList.add('dp-enabled');if(!aside)make();const id=current();for(const a of aside.querySelectorAll('.dp-nav-link')){const suffix=a.dataset.suffix,isHome=suffix==='/';a.href=isHome?'/':id?'/server/'+encodeURIComponent(id)+suffix:'/';a.classList.toggle('active',isHome?!id:(!!id&&location.pathname==='/server/'+id+suffix));a.style.opacity=(!id&&!isHome)?'.4':'';}}
function translate(){const app=document.getElementById('app');if(!app)return;const w=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let node,count=0;while((node=w.nextNode())&&count++<1700){const el=node.parentElement;if(!el||el.closest('pre,code,kbd,samp,textarea,input,[contenteditable],.xterm,.monaco-editor,[role=log]'))continue;const value=node.nodeValue.trim();if(tr[value])node.nodeValue=node.nodeValue.replace(value,tr[value])}
for(const el of app.querySelectorAll('input[placeholder],textarea[placeholder]')){const value=el.getAttribute('placeholder');if(tr[value])el.setAttribute('placeholder',tr[value])}}
function chrome(){
 const app=document.getElementById('app');if(!app||!aside)return;
 const client=/^\/(?!admin(?:\/|$)|auth(?:\/|$))/.test(location.pathname);
 const logo=app.querySelector('#logo');
 let header=logo&&logo.closest('div[class*="bg-neutral-900"]');
 if(!header&&logo){let p=logo;for(let i=0;i<5&&p;i++,p=p.parentElement){
   if(p.querySelector('a[href="/account"]')&&p.querySelector('a[href="/"]')){header=p;break}
 }}
 if(header)header.setAttribute('data-dp-native-header','1');
 // The Pterodactyl 1.x server submenu is a styled-component and does not
 // have a reliable Tailwind class. Identify it by actual server-route links.
 let subnav=null;const id=current();
 if(id){
  const serverPrefix='/server/'+id+'/';
  const candidates=Array.from(app.querySelectorAll('a[href]')).filter(a=>{
   let p;try{p=new URL(a.getAttribute('href'),location.origin).pathname}catch{return false}
   return p.startsWith(serverPrefix)&&['files','databases','schedules','users','backups','network','startup','settings','activity'].includes(p.slice(serverPrefix.length).split('/')[0])
  });
  if(candidates.length>=3){
   let p=candidates[0].parentElement;
   for(let i=0;i<4&&p;i++,p=p.parentElement){
    if(p===app||p.contains(logo))break;
    if(candidates.filter(a=>p.contains(a)).length>=3){
      const anchorCount=p.querySelectorAll('a[href]').length;
      if(anchorCount<=25){subnav=p;break}
    }
   }
   // The link holder itself contains the links. Hide the parent wrapper.
   if(subnav&&subnav.parentElement!==app&&subnav.parentElement&&
      subnav.parentElement.querySelectorAll('a[href]').length===subnav.querySelectorAll('a[href]').length)
      subnav=subnav.parentElement;
  }
 }
 // Some routes (e.g. files) may render after the first animation frame.
 // In that case the original navigation stays visible until a safe replacement exists.
 const found=!!(client&&header&&aside.isConnected);
 if(header)header.classList.toggle('dp-native-hidden',found&&!document.body.classList.contains('dp-search-open'));
 if(subnav)subnav.classList.toggle('dp-native-hidden',found);
 for(const n of app.querySelectorAll('[data-dp-native-subnav="1"]')){if(n!==subnav)n.classList.remove('dp-native-hidden')}
 if(subnav)subnav.dataset.dpNativeSubnav='1';
 const admin=aside.querySelector('.dp-admin-link');
 if(admin)admin.hidden=!Boolean(header&&header.querySelector('a[href="/admin"]'));
 document.body.classList.toggle('dp-chrome-ready',found);
 document.body.dataset.euforieVersion='2.2.0';
 if(found)document.title='EUFORIE — Panel serwerów';
 window.__euforieStatus={version:'2.2.0',active:found,headerFound:!!header,subnavFound:!!subnav,path:location.pathname};
}
function sync(){scheduled=false;nav();chrome();translate()}function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(sync)}}
function init(){if(!document.getElementById('app'))return;make();schedule();new MutationObserver(schedule).observe(document.getElementById('app'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['href','placeholder']});window.addEventListener('popstate',schedule);window.addEventListener('pageshow',schedule);document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('dp-search-open')})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();