import { reactive } from 'vue';

const KEY = 'xinjie.uni.v1';

function blank() {
  return {
    authed: false,
    phone: '',
    nick: '月亮不及你',
    uid: 'XJ-2026-0913',
    bio: '这个世界很大，希望能遇见有趣的你',
    diamonds: 2680,
    quiz: null,
    prog: {},
    fav: {},
    like: {},
    lib: [],
    posts: [],
    chats: {},
    owned: [],
    certs: [],
    follows: {},
    unread: 3
  };
}

export const S = reactive(blank());

export function boot() {
  try {
    const raw = uni.getStorageSync(KEY);
    if (raw) {
      const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
      Object.assign(S, o);
      S.prog = o.prog || {};
      S.fav = o.fav || {};
      S.like = o.like || {};
      S.chats = o.chats || {};
      S.posts = o.posts || [];
      S.owned = o.owned || [];
      S.certs = o.certs || [];
      S.lib = o.lib || [];
      S.follows = o.follows || {};
    }
  } catch (e) {}
}

let timer = null;
export function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      uni.setStorageSync(KEY, JSON.stringify(S));
    } catch (e) {
      toast('本机存储满了，本次改动只留在这一页');
    }
  }, 120);
}

export function toast(msg) {
  uni.showToast({ title: msg, icon: 'none', duration: 1800 });
}

/* ---------- 小工具 ---------- */
export function ekey(drama, ep) {
  return drama + '\u0001' + ep;
}
export function fmt(s) {
  s = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(s / 60);
  return m + ':' + String(s % 60).padStart(2, '0');
}
export function fmtLong(s) {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const x = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(x).padStart(2, '0');
  return h ? h + ':' + mm + ':' + ss : '00:' + mm + '/' + ss;
}
export function wan(n) {
  return n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, '') + 'w' : String(n);
}

/* 文件名 → 剧名 + 集数 */
const CN = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
export function cn2num(s) {
  if (/^\d+$/.test(s)) return +s;
  if (!s) return 0;
  if (s.length === 1) return CN[s] || 0;
  const m = s.match(/^(.*)?十(.*)$/);
  if (m) {
    const a = m[1] ? CN[m[1]] || 0 : 1;
    const b = m[2] ? CN[m[2]] || 0 : 0;
    return a * 10 + b;
  }
  return CN[s] || 0;
}
export function parseFile(name) {
  const base = name.replace(/\.[^.]+$/, '');
  let drama = base;
  let ep = 0;
  let m;
  if ((m = base.match(/^(.*?)[\s\-_]*S(\d{1,2})[\s\-_]*E(\d{1,3})/i))) {
    drama = m[1]; ep = +m[3];
  } else if ((m = base.match(/^(.*?)[\s\-_]*(?:EP|第|集|E)[\s\-_]*(\d{1,3}|[一二三四五六七八九十]+)[\s\-_集]*(.*)$/i))) {
    drama = m[1] || base; ep = cn2num(m[2]);
  } else if ((m = base.match(/^(.*?)[\s\-_](\d{1,3})$/))) {
    drama = m[1]; ep = +m[2];
  }
  drama = drama.replace(/[\s\-_]+$/, '').trim() || base;
  return { drama, ep };
}

/* 路由 */
export function go(url) {
  uni.navigateTo({ url });
}
export function tab(url) {
  uni.reLaunch({ url });
}
export function back() {
  const pages = getCurrentPages();
  if (pages.length > 1) uni.navigateBack();
  else uni.reLaunch({ url: '/pages/home/home' });
}
