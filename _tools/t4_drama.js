const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));
const click = el => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const hash = u => { location.hash = u; return sleep(1400); };
const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
const st = () => JSON.parse(localStorage.getItem('xinjie.uni.v1') || '{}') || {};
const cards = () => qa('.dm .grid .rp').length;

await hash('#/pages/drama/drama');
log.push('全部 ' + cards() + ' 部');
set(q('.dm .in input'), '星光'); await sleep(400);
log.push('搜「星光」-> ' + cards() + ' 部：' + (q('.rp .rt') ? q('.rp .rt').textContent.trim() : '-'));
set(q('.dm .in input'), ''); await sleep(300);
click(qa('.dm .chip')[3]); await sleep(400);
log.push('分类「' + q('.chip.on').textContent.trim() + '」-> ' + cards() + ' 部');
click(qa('.dm .ib')[1]); await sleep(300);
set(q('.lin input'), 'http://127.0.0.1:5199/static/demo_c.mp4'); await sleep(200);
click(q('.lbtn')); await sleep(900);
const lib = st().lib || [];
log.push('链接导入 -> 剧单 ' + lib.length + ' 部 / ' + (lib[0] ? lib[0].t + ' · ' + lib[0].eps.length + ' 集' : '-'));
click(q('.mr .mf1')); await sleep(1600);
log.push('播放导入剧: ' + location.hash + ' | ' + (q('.tt') ? q('.tt').textContent.trim() : '-'));
const v = q('uni-video video');
if (v) { v.muted = true; try { await v.play(); } catch (e) {} }
await sleep(1500);
log.push('导入视频 t=' + (v ? v.currentTime.toFixed(1) : '-') + ' 时长=' + (v ? v.duration.toFixed(1) : '-'));

await hash('#/pages/chat/chat');
const n0 = qa('.ln').length;
set(q('.ct .ip input'), '你在看哪部剧？'); await sleep(200);
click(q('.ct .snd')); await sleep(2200);
log.push('聊天 ' + n0 + ' -> ' + qa('.ln').length + ' 条，最后一条：' + (qa('.ln').pop() || {}).textContent);
return log;
