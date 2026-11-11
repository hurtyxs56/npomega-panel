const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const script=fs.readFileSync(require('node:path').join(__dirname,'../themes/dragonfire-live/assets/gui.js'),'utf8');
const code=script.slice(script.indexOf('  const statusLabels'),script.indexOf('  function fireBackground'));
const badges=[];
function card(id){ const badge={textContent:'',dataset:{},setAttribute(){}};badges.push(badge);return {href:'http://panel.test/server/'+id,querySelector:sel=>sel==='.status-bar'?{}:badge}; }
let cards=[card('a')],state='running',failure=false,calls=0;
const context=vm.createContext({URL,AbortController,Date,Map,Set,Object,encodeURIComponent,console,
 location:{origin:'http://panel.test'},document:{hidden:false,querySelectorAll:()=>cards},isClient:()=>true,getServerId:()=>null,sidebar:null,
 setTimeout,clearTimeout,fetch:async()=>{calls++;return {ok:!failure,status:503,json:async()=>({attributes:{current_state:state}})};}
});
vm.runInContext(code+'\n globalThis.qa={updateStatuses,readings,inFlight};',context);
(async()=>{
 for(const [value,label] of [['running','Włączony'],['starting','Uruchamianie'],['stopping','Zatrzymywanie'],['offline','Wyłączony'],['invalid','Brak odczytu']]) {
  state=value;context.qa.readings.clear(); context.qa.updateStatuses();await new Promise(setImmediate);
  assert.equal(badges[0].textContent,label);assert.equal(context.qa.inFlight.size,0);
 }
 failure=true;context.qa.readings.clear();context.qa.updateStatuses();await new Promise(setImmediate);assert.equal(badges[0].textContent,'Brak odczytu');
 failure=false;state='running';cards.push(card('new'));context.qa.updateStatuses();await new Promise(setImmediate);assert.equal(badges[1].textContent,'Włączony');
 const before=calls;context.document.hidden=true;context.qa.readings.clear();context.qa.updateStatuses();assert.equal(calls,before);
 console.log('PASS: four power states, unknown state, HTTP failure, newly added server, hidden-tab polling pause.');
})().catch(e=>{console.error(e);process.exitCode=1;});
