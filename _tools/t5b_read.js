const log = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));
await sleep(2500);
const st = JSON.parse(localStorage.getItem('xinjie.uni.v1'));
log.push('刷新后落地页: ' + location.hash);
log.push('存档: authed=' + st.authed + ' 钻=' + st.diamonds + ' 证书=' + st.certs.length + ' 剧单=' + st.lib.length + ' 瞬间=' + st.posts.length);
log.push('我的页统计: ' + qa('.pf .s .v').map(e => e.textContent.trim()).join('/') + ' (关注/粉丝/获赞/链上藏品)');
return log;
