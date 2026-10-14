const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));
const click = el => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const hash = u => { location.hash = u; return sleep(1500); };
const st = () => JSON.parse(localStorage.getItem('xinjie.uni.v1'));

localStorage.setItem('xinjie.uni.v1', JSON.stringify({ authed: true, quiz: true, diamonds: 2680 }));

await hash('#/pages/live/live');
click(qa('.side .s')[1]); await sleep(500);
log.push('直播间送花 -> 钻 ' + st().diamonds);

await hash('#/pages/shop/shop');
click(qa('.grid .g')[1]); await sleep(1200);
log.push('进头像详情: ' + location.hash + ' | ' + (q('.t') ? q('.t').textContent.trim() : '?') + ' | ' + (q('.pv') ? q('.pv').textContent.trim() : '?') + '钻');
click(qa('.avp .btn.gd')[0]); await sleep(1600);
log.push('购买后: ' + location.hash + ' | 钻 ' + st().diamonds + ' | 证书 ' + st().certs.length + ' 张 | TokenID ' + (st().certs[0] || {}).token);
const rows = qa('.cc .in .rw').map(r => r.textContent.replace(/\s+/g, ' ').trim());
log.push('证书行: ' + rows.join(' / '));

await hash('#/pages/wallet/wallet');
click(qa('.grid .o')[2]); await sleep(300);
click(q('.bar .btn.gd')); await sleep(600);
log.push('充值 50 元后 钻 ' + st().diamonds);

await hash('#/pages/social/social');
const before = st().posts.length;
click(q('.fab')); await sleep(600);
const ta = q('textarea');
if (ta) { ta.value = '刚看完《雨夜来电》，反转太狠了。'; ta.dispatchEvent(new Event('input', { bubbles: true })); }
await sleep(200);
click(q('.sheet .btn.gd')); await sleep(1200);
log.push('发瞬间: ' + before + ' -> ' + st().posts.length + ' | ' + location.hash);
return log;
