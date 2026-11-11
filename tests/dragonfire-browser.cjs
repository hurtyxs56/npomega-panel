const {chromium}=require('playwright');
const fs=require('fs');
const assert=require('node:assert/strict');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
 const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 let state='running',fail=false;
 await page.route('http://panel.test/**',route=>{
  if(route.request().url().includes('/resources')) return route.fulfill({status:fail?503:200,contentType:'application/json',body:JSON.stringify({attributes:{current_state:state}})});
  return route.fulfill({contentType:'text/html',body:`<html><body><div id="app"><a href="/server/abc123"><div class="status-bar"></div><h2>Files</h2><p>My server</p></a><button id="start">Start</button><label>Password</label><input value="Files" placeholder="Password"><pre>Starting Files</pre><div class="xterm">Console</div><div id="dynamic"></div></div></body></html>`});
 });
 await page.goto('http://panel.test/');
 await page.addStyleTag({content:fs.readFileSync(path.join(__dirname,'../themes/dragonfire-live/assets/gui.css'),'utf8')});
 await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../themes/dragonfire-live/assets/gui.js'),'utf8')});
 await page.waitForFunction(()=>document.querySelector('.dragonfire-status')?.textContent==='Włączony');
 assert.equal(await page.locator('#start').textContent(),'Włącz');
 assert.equal(await page.locator('h2').textContent(),'Files');
 assert.equal(await page.locator('pre').textContent(),'Starting Files');
 assert.equal(await page.locator('input').inputValue(),'Files');
 assert.equal(await page.locator('input').getAttribute('placeholder'),'Hasło');
 for(const [value,label] of [['starting','Uruchamianie'],['stopping','Zatrzymywanie'],['offline','Wyłączony']]) {
  state=value; await page.waitForFunction(label=>document.querySelector('.dragonfire-status').textContent===label,label,{timeout:15000});
 }
 fail=true; await page.waitForFunction(()=>document.querySelector('.dragonfire-status').textContent==='Brak odczytu',null,{timeout:15000});
 fail=false; state='running';
 await page.evaluate(()=>document.querySelector('#dynamic').innerHTML='<a href="/server/new123"><div class="status-bar"></div>New server</a><button>Backups</button>');
 await page.waitForFunction(()=>document.querySelector('#dynamic .dragonfire-status')?.textContent==='Włączony');
 assert.equal(await page.locator('#dynamic button').textContent(),'Kopie zapasowe');
 await page.evaluate(()=>{window.clicked=false;document.querySelector('#start').onclick=()=>window.clicked=true;});
 await page.locator('#start').click();assert.equal(await page.evaluate(()=>window.clicked),true);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.dragonfire-flame').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 console.log('PASS: real API states, API failure, new servers, Polish labels, protected content, controls, mobile, reduced motion.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
