const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const click = el => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
const toast = () => { const t = q('uni-toast'); return t ? t.textContent.replace(/\s+/g, ' ').trim() : '-'; };

click(q('.btn.gd')); await sleep(400);
log.push('展开手机号面板: ' + !!q('.field'));
const ins = document.querySelectorAll('uni-input input');
set(ins[0], '13800138000'); set(ins[1], '123456'); await sleep(200);
click(q('.pan .btn.gd')); await sleep(500);
log.push('未勾选协议登录 -> ' + toast() + ' | 仍在 ' + location.hash);
click(q('.cb')); await sleep(200);
click(q('.pan .btn.gd')); await sleep(1200);
log.push('勾选后 -> ' + location.hash + ' | authed=' + JSON.parse(localStorage.getItem('xinjie.uni.v1') || '{}').authed);

/* 灵魂鉴定：5 题 */
for (let i = 0; i < 5; i++) {
  const ops = document.querySelectorAll('.op');
  if (!ops.length) { log.push('第 ' + (i + 1) + ' 题没找到选项'); break; }
  click(ops[i % 4]); await sleep(250);
  click(q('.qz .btn.gd')); await sleep(450);
}
log.push('做完题 -> ' + location.hash);
const btn = document.querySelector('.qz .btn.gd');
log.push('结果页按钮: ' + (btn ? btn.textContent.trim() : '-'));
if (btn) { click(btn); await sleep(1200); }
log.push('进入首页 -> ' + location.hash);
return log;
