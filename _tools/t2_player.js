const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));
const click = el => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const hash = u => { location.hash = u; return sleep(1500); };
const vid = () => q('uni-video video') || q('video');
const toast = () => { const t = q('uni-toast'); return t ? t.textContent.replace(/\s+/g, ' ').trim() : '-'; };

localStorage.setItem('xinjie.uni.v1', JSON.stringify({ authed: true, quiz: true }));
await hash('#/pages/player/player?id=d2');
log.push('标题: ' + (q('.tt') ? q('.tt').textContent.trim() : '?') + ' | 选集 ' + (q('.ep') ? q('.ep').textContent.trim() : '?'));
const v = vid();
log.push('video: ' + !!v + ' src=' + (v && v.currentSrc ? v.currentSrc.split('/').pop() : '-'));
if (v) { v.muted = true; try { await v.play(); } catch (e) { log.push('play 被拦: ' + e.name); } }
await sleep(2000);
log.push('播放 t=' + (v ? v.currentTime.toFixed(1) : '-') + ' 时长=' + (v ? v.duration.toFixed(1) : '-'));
click(qa('.rail .a')[0]); await sleep(300);
click(qa('.rail .a')[2]); await sleep(300);
log.push('点赞+收藏 -> ' + toast());
click(q('.sp')); await sleep(400);
log.push('倍速 -> ' + toast() + ' 实际=' + (v ? v.playbackRate : '-'));
click(q('.ep')); await sleep(600);
const eps = qa('.drawer .di');
log.push('选集抽屉: ' + eps.length + ' 集');
if (eps.length > 4) { click(eps[4]); await sleep(1600); }
log.push('切集后: ' + (q('.tt') ? q('.tt').textContent.trim() : '?'));
const st = JSON.parse(localStorage.getItem('xinjie.uni.v1'));
log.push('存档 like=' + JSON.stringify(st.like) + ' fav=' + JSON.stringify(st.fav) + ' prog=' + JSON.stringify(st.prog));
return log;
