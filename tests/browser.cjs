/* Optional QA: npm install --no-save playwright; npx playwright install chromium */
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const shell = `<!doctype html><html><head><meta charset="utf-8"><script>window.SiteConfiguration={name:'Old',recaptcha:{enabled:true}}</script><script src="/npomega/npomega.js"></script><link rel="stylesheet" href="/npomega/npomega.css"></head><body>
<div class="bg-neutral-900"><div><div id="logo"><a href="/">NPΩ Panel</a></div></div></div>
<div id="sub"><div><a href="/server/sample">Console</a><a href="/server/sample/files">Files</a><a href="/server/sample/backups">Backups</a></div></div>
<p id="user-name">Files</p><pre id="console">Password Console Files</pre>
<div id="auth"><h2>Login to Continue</h2><form><div><img src="/assets/svgs/pterodactyl.svg"><div><label for="username">Username or Email</label><input id="username" value="Password"><label for="password">Password</label><input id="password" type="password" value="KeepThis"><button type="submit">Login</button><a href="/auth/password">Forgot password?</a></div></div></form></div>
<script>document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();window.submitted=true})</script></body></html>`;
const server = http.createServer((req,res)=>{
  const pathname = new URL(req.url,'http://local').pathname;
  if(['/auth/login','/server/sample'].includes(pathname)){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(shell);}
  let relative = pathname.replace(/^\/npomega\//,'assets/').replace(/^\//,'');
  if(relative==='assets/svgs/pterodactyl.svg')relative='assets/logo.svg';
  const filename = path.resolve(root,relative);
  if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.statusCode=404;return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[path.extname(filename)]||'text/plain');
  res.end(fs.readFileSync(filename));
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/auth/login');
    await page.waitForFunction(()=>document.querySelector('#sub a').textContent==='Konsola');
    assert.equal(await page.locator('#user-name').textContent(),'Files');
    assert.equal(await page.locator('#console').textContent(),'Password Console Files');
    assert.equal(await page.locator('#username').inputValue(),'Password');
    assert.equal(await page.locator('#password').inputValue(),'KeepThis');
    assert.equal(await page.locator('label[for=username]').textContent(),'Nazwa użytkownika lub e-mail');
    assert.equal(await page.locator('h2').textContent(),'Zaloguj się do NPΩ');
    assert.equal(await page.evaluate(()=>window.SiteConfiguration.name),'NPΩ Panel');
    assert.equal(await page.evaluate(()=>window.SiteConfiguration.recaptcha.enabled),true);
    await page.locator('button').click();
    assert.equal(await page.evaluate(()=>window.submitted),true);
    await page.evaluate(()=>{const a=document.createElement('a');a.href='/server/sample/settings';a.textContent='Settings';document.querySelector('#sub>div').append(a);});
    await page.waitForFunction(()=>document.querySelector('#sub a:last-child').textContent==='Ustawienia');
    await page.evaluate(()=>{document.querySelector('#sub a:last-child').firstChild.data='Backups';});
    await page.waitForFunction(()=>document.querySelector('#sub a:last-child').textContent==='Kopie zapasowe');
    for(const size of [{width:1440,height:1000},{width:390,height:844}]){
      await page.setViewportSize(size);
      await page.goto(origin+'/preview/index.html');
      for(const view of ['servers','console','login']){
        await page.locator('[data-tab="'+view+'"]').click();
        assert(await page.locator('#'+view).isVisible());
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow '+view+' '+size.width);
        if(view==='servers') {
          const cards=await page.locator('.server-grid>a').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width};}));
          assert.equal(cards.length,3);
          if(size.width>1000) {
            assert.equal(cards[0].y,cards[1].y);
            assert.equal(cards[1].y,cards[2].y);
            assert(cards[0].x<cards[1].x && cards[1].x<cards[2].x);
          } else {
            assert.equal(cards[0].x,cards[1].x);
            assert(cards[0].y<cards[1].y && cards[1].y<cards[2].y);
          }
        }
        if(process.env.NPOMEGA_SCREENSHOTS){
          fs.mkdirSync(process.env.NPOMEGA_SCREENSHOTS,{recursive:true});
          await page.screenshot({path:path.join(process.env.NPOMEGA_SCREENSHOTS,view+'-'+size.width+'.png'),fullPage:true});
        }
      }
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: desktop/mobile previews, scoped translations, preserved values and submit handler, dynamic navigation.');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
