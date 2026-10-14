/* 用本机 Edge 无头模式给页面截图（开发验收用，跟成品无关）
   node _build/shot.js 输出.png  URL  [--drive 驱动脚本.js] [--w 430] [--h 932] [--wait 2600]
   驱动脚本里写函数体，可以访问页面顶层的 let/const。 */
const {spawn}=require('child_process'),fs=require('fs'),path=require('path'),os=require('os');
const EDGE='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args=process.argv.slice(2);
const out=path.resolve(args[0]||'_验证截图/shot.png');
const url=path.isAbsolute(args[1]||'')?'file:///'+String(args[1]).replace(/\\/g,'/'):args[1];
if(!url)throw new Error('要给 URL');
const opt=(k,d)=>{const i=args.indexOf(k);return i<0?d:args[i+1];};
const W=+opt('--w',430),H=+opt('--h',932),WAIT=+opt('--wait',2400);
const drive=opt('--drive','');
const PORT=+opt('--port',9333);
const prof=opt('--prof', path.join(os.tmpdir(),'xjuni-shot-profile'));
const keepProfile=prof!==path.join(os.tmpdir(),'xjuni-shot-profile');
fs.mkdirSync(path.dirname(out),{recursive:true});

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function getJson(u){const r=await fetch(u);if(!r.ok)throw new Error(r.status);return r.json();}

(async()=>{
  const edge=spawn(EDGE,['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run',
    '--remote-debugging-port='+PORT,'--user-data-dir='+prof,
    '--window-size='+W+','+H,'about:blank'],{stdio:'ignore'});
  let target=null;
  for(let i=0;i<80&&!target;i++){
    await sleep(250);
    try{const list=await getJson('http://127.0.0.1:'+PORT+'/json/list');
      target=list.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);}catch(e){}
  }
  if(!target)throw new Error('连不上 Edge 的调试端口');
  const ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
  let id=0;const pend=new Map();const events=[];
  ws.onmessage=m=>{const o=JSON.parse(m.data);
    if(o.id&&pend.has(o.id)){const p=pend.get(o.id);pend.delete(o.id);o.error?p.rej(new Error(JSON.stringify(o.error))):p.res(o.result);}
    else events.push(o);};
  const send=(method,params)=>new Promise((res,rej)=>{const n=++id;pend.set(n,{res,rej});
    ws.send(JSON.stringify({id:n,method,params:params||{}}));});
  const got=e=>events.some(x=>x.method===e);

  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:2,mobile:true});
  await send('Page.navigate',{url});
  for(let i=0;i<120&&!got('Page.loadEventFired');i++)await sleep(100);
  await sleep(WAIT);
  if(drive){
    const code=fs.readFileSync(path.resolve(drive),'utf8');
    const r=await send('Runtime.evaluate',{expression:'(async()=>{'+code+'})()',
      awaitPromise:true,returnByValue:true});
    if(r.exceptionDetails)console.log('驱动脚本报错:',r.exceptionDetails.exception&&r.exceptionDetails.exception.description||r.exceptionDetails.text);
    else console.log('驱动结果:',JSON.stringify(r.result.value));
    await sleep(500);
  }
  const shot=await send('Page.captureScreenshot',{format:'png'});
  fs.writeFileSync(out,Buffer.from(shot.data,'base64'));
  console.log('saved',out);
  ws.close();edge.kill();
  await sleep(300);
  if(!keepProfile)try{fs.rmSync(prof,{recursive:true,force:true});}catch(e){}
  process.exit(0);
})().catch(e=>{console.error('失败:',e.message);process.exit(1);});
