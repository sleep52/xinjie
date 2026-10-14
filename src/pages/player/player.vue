<template>
  <view class="xj pl">
    <video
      id="pv"
      ref="pv"
      class="vid"
      :src="src"
      :poster="poster"
      object-fit="cover"
      :controls="false"
      :show-center-play-btn="false"
      :show-fullscreen-btn="false"
      :enable-progress-gesture="false"
      :autoplay="true"
      :loop="false"
      @timeupdate="onTime"
      @ended="onEnd"
    />
    <view class="shade" />
    <view class="gest" @touchstart="ts" @touchmove="tm" @touchend="te" @click="tapCtl" />

    <!-- 顶栏 -->
    <view class="top" :class="{ hide: !ctl }">
      <xj-bar>
        <template #right><view /></template>
      </xj-bar>
      <view class="tr">
        <view class="bk" @click="back"><view class="ic ic-back s20" /></view>
        <view class="tt ell">第{{ ep + 1 }}集 · {{ title }}</view>
        <view class="ep" @click="sheet = true">选集 {{ ep + 1 }}/{{ eps.length }} ▾</view>
      </view>
    </view>

    <!-- 右侧操作栏 -->
    <view class="rail">
      <view class="a" @click="act('like')">
        <view class="ic s28" :class="[on.like ? 'ic-heart-f' : 'ic-heart']" />
        <text>{{ wan(likeN) }}</text>
      </view>
      <view class="a" @click="act('cmt')">
        <view class="ic s28 ic-cmt" />
        <text>2.3k</text>
      </view>
      <view class="a" @click="act('fav')">
        <view class="ic s28" :class="[on.fav ? 'ic-star-f' : 'ic-star']" />
        <text>{{ wan(favN) }}</text>
      </view>
      <view class="a" @click="act('share')">
        <view class="ic s28 ic-share" />
        <text>分享</text>
      </view>
    </view>

    <!-- 主播浮标 -->
    <view class="host" @click="go('/pages/live/live')">
      <image class="ha" src="/static/p-d.jpg" mode="aspectFill" />
      <view class="f1">
        <view class="hn ell">主播正在直播中</view>
        <view class="hp">去看她</view>
      </view>
    </view>

    <!-- 底部控制 -->
    <view class="bot" :class="{ hide: !ctl }">
      <view class="pg" @touchstart.stop="ps" @touchmove.stop="pm" @touchend.stop="pe" @click.stop>
        <view class="tr2"><view class="fi" :style="{ width: pct + '%' }"><view class="kn" /></view></view>
      </view>
      <view class="row" style="justify-content:space-between;padding:0 4px">
        <text class="tm">{{ fmt(cur) }} / {{ fmt(dur) }}</text>
        <text class="sp" @click="cycle">{{ rate }}x</text>
      </view>
      <view class="ctl">
        <view class="c" @click="jump(-15)"><view class="ic ic-replay s26" /></view>
        <view class="c" @click="jump(10)"><view class="ic ic-fwd s26" /></view>
        <view class="c big" @click="toggle"><view class="ic s26" :class="[playing ? 'ic-pause' : 'ic-play']" /></view>
        <view class="c" @click="next()"><view class="ic ic-right s26" /></view>
      </view>
    </view>

    <!-- 选集抽屉 -->
    <view v-if="sheet" class="mask" @click="sheet = false" />
    <view class="drawer" :class="{ on: sheet }">
      <view class="dh">选集 · 共 {{ eps.length }} 集</view>
      <scroll-view class="db" scroll-y>
        <view class="dg">
          <view v-for="(e, n) in eps" :key="n" class="di" :class="{ on: n === ep }" @click="pick(n)">
            {{ n + 1 }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view v-if="osd" class="osd">{{ osd }}</view>
  </view>
</template>

<script>
import { DRAMAS } from '@/common/data.js';
import { S, save, go, back, toast, fmt, wan, ekey } from '@/common/store.js';

export default {
  data() {
    return {
      title: '重生之我在娱乐圈',
      poster: '/static/p-b.jpg',
      src: '/static/demo_a.mp4',
      eps: [],
      ep: 0,
      cur: 0,
      dur: 0,
      playing: true,
      ctl: true,
      sheet: false,
      rate: 1,
      on: { like: false, fav: false },
      likeN: 128000,
      favN: 11000,
      osd: '',
      t0: 0,
      x0: 0,
      y0: 0,
      moved: false,
      dragging: false
    };
  },
  computed: {
    pct() {
      return this.dur ? Math.min(100, (this.cur / this.dur) * 100) : 0;
    }
  },
  onLoad(q) {
    if (q.loc !== undefined) {
      const l = S.lib[+q.loc];
      if (l) {
        this.title = l.t;
        this.poster = l.img || '/static/p-b.jpg';
        this.eps = l.eps;
        this.likeN = 128000;
        this.favN = 11000;
        this.ep = Math.min(l.eps.length - 1, +q.ep || 0);
        this.load();
        this.hideTimer();
        return;
      }
    }
    const d = DRAMAS.find((x) => x.id === q.id) || DRAMAS[0];
    this.title = d.t;
    this.poster = d.img;
    this.likeN = Math.round(d.plays * 1.6);
    this.favN = Math.round(d.plays * 0.15);
    const n = Math.min(d.eps, 30);
    const eps = [];
    for (let i = 0; i < n; i++) eps.push({ t: '第' + (i + 1) + '集', u: d.vid });
    this.eps = eps;
    const seen = Object.keys(S.prog).filter((k) => k.indexOf(d.title + '\u0001') === 0).length;
    this.ep = Math.min(eps.length - 1, Math.max(2, seen));
    this.load();
    this.hideTimer();
  },
  onReady() {
    uni.createSelectorQuery()
      .in(this)
      .select('.pg')
      .boundingClientRect((r) => {
        if (r) this.pgRect = r;
      })
      .exec();
  },
  onUnload() {
    clearTimeout(this._ct);
    clearTimeout(this._ot);
  },
  methods: {
    fmt,
    wan,
    go,
    back,
    load() {
      const e = this.eps[this.ep];
      this.src = e.u;
      const p = S.prog[ekey(this.title, this.ep)];
      this.cur = p ? p.t : 0;
      this.on = { like: !!S.like[ekey(this.title, this.ep + 'L')], fav: !!S.fav[ekey(this.title, this.ep + 'F')] };
      this.$nextTick(() => {
        const v = this.raw();
        if (v && this.cur > 1) v.currentTime = this.cur;
      });
    },
    raw() {
      // #ifdef H5
      const el = this.$refs.pv && (this.$refs.pv.$el || this.$refs.pv);
      if (el && el.querySelector) return el.querySelector('video');
      // #endif
      return null;
    },
    ctx() {
      return uni.createVideoContext('pv', this);
    },
    onTime(e) {
      if (this.dragging) return;
      this.cur = e.detail.currentTime;
      this.dur = e.detail.duration || this.dur;
    },
    toggle() {
      this.playing = !this.playing;
      const c = this.ctx();
      this.playing ? c.play() : c.pause();
      this.hideTimer();
    },
    tapCtl() {
      this.ctl = !this.ctl;
      if (this.ctl) this.hideTimer();
    },
    hideTimer() {
      clearTimeout(this._ct);
      this._ct = setTimeout(() => (this.ctl = false), 3600);
    },
    seek(r) {
      const t = Math.max(0, Math.min(this.dur - 0.3, this.dur * r));
      this.ctx().seek(t);
      this.cur = t;
    },
    ps(e) {
      this.dragging = true;
      this.pmove(e);
    },
    pm(e) {
      if (this.dragging) this.pmove(e);
    },
    pmove(e) {
      const r = this.pgRect || { left: 0, width: uni.getSystemInfoSync().windowWidth };
      const x = Math.min(r.width, Math.max(0, e.touches[0].pageX - r.left));
      this.dragPct = (x / r.width) * 100;
      this.cur = (this.dur * x) / r.width;
    },
    pe() {
      if (!this.dragging) return;
      this.dragging = false;
      this.seek(Math.min(1, Math.max(0, this.dragPct / 100)));
    },
    jump(n) {
      this.seek((this.cur + n) / (this.dur || 1));
      this.flash((n > 0 ? '+' : '') + n + 's');
    },
    cycle() {
      const l = [1, 1.25, 1.5, 2, 0.75];
      this.rate = l[(l.indexOf(this.rate) + 1) % l.length];
      const v = this.raw();
      if (v) v.playbackRate = this.rate;
      this.flash(this.rate + 'x 倍速');
    },
    flash(t) {
      this.osd = t;
      clearTimeout(this._ot);
      this._ot = setTimeout(() => (this.osd = ''), 900);
    },
    act(k) {
      if (k === 'like') {
        this.on.like = !this.on.like;
        this.likeN += this.on.like ? 1 : -1;
        S.like[ekey(this.title, this.ep + 'L')] = this.on.like;
        this.flash(this.on.like ? '❤ 已点赞' : '取消点赞');
      } else if (k === 'fav') {
        this.on.fav = !this.on.fav;
        this.favN += this.on.fav ? 1 : -1;
        S.fav[ekey(this.title, this.ep + 'F')] = this.on.fav;
        this.flash(this.on.fav ? '★ 已收藏' : '取消收藏');
      } else if (k === 'share') {
        toast('分享链接已复制（演示）');
      } else {
        toast('评论区 · 演示环境未接入');
      }
      save();
    },
    pick(n) {
      this.sheet = false;
      this.go2(n);
    },
    next() {
      this.go2(this.ep + 1);
    },
    onEnd() {
      if (this.autoNext) return;
      this.autoNext = true;
      setTimeout(() => (this.autoNext = false), 600);
      this.go2(this.ep + 1, true);
    },
    go2(n, quiet) {
      if (n < 0) return this.flash('已经是第一集');
      if (n >= this.eps.length) return this.flash('播完啦，去看看别的短剧');
      S.prog[ekey(this.title, this.ep)] = { t: this.cur, at: Date.now() };
      save();
      this.ep = n;
      this.load();
      if (!quiet) this.flash('第 ' + (n + 1) + ' 集');
      this.ctl = true;
      this.hideTimer();
    },
    ts(e) {
      this.t0 = Date.now();
      this.x0 = e.touches[0].pageX;
      this.y0 = e.touches[0].pageY;
      this.moved = false;
    },
    tm(e) {
      const dy = e.changedTouches[0].pageY - this.y0;
      if (Math.abs(dy) > 26) this.moved = true;
    },
    te(e) {
      if (!this.moved) return;
      const dy = e.changedTouches[0].pageY - this.y0;
      this.go2(this.ep + (dy < 0 ? 1 : -1));
    }
  }
};
</script>

<style>
.pl { position: fixed; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; height: 100vh; background: #000; overflow: hidden; }
.pl .vid { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.pl .shade { position: absolute; left: 0; top: 0; width: 100%; height: 130px; background: linear-gradient(180deg, rgba(0, 0, 0, .6), transparent); pointer-events: none; }
.pl .shade::after { content: ''; position: absolute; left: 0; bottom: -350px; width: 100%; height: 350px; background: linear-gradient(0deg, rgba(0, 0, 0, .72), transparent); }
.pl .gest { position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 5; }
.pl .top { position: absolute; left: 0; top: 0; width: 100%; z-index: 10; transition: opacity .2s; }
.pl .top.hide, .pl .bot.hide { opacity: 0; pointer-events: none; }
.pl .tr { display: flex; align-items: center; gap: 8px; padding: 0 12px; }
.pl .bk { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
.pl .tt { flex: 1; font-size: 14.5px; font-weight: 600; text-shadow: 0 1px 6px rgba(0, 0, 0, .7); }
.pl .ep { font-size: 11.5px; color: #F2F1EE; background: rgba(255, 255, 255, .14); border: 1px solid rgba(255, 255, 255, .18); padding: 4px 9px; border-radius: 999px; }
.pl .rail { position: absolute; right: 12px; bottom: 168px; z-index: 12; display: flex; flex-direction: column; gap: 20px; align-items: center; }
.pl .a { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pl .a text { font-size: 11px; text-shadow: 0 1px 4px rgba(0, 0, 0, .7); }
.pl .host {
  position: absolute; left: 14px; bottom: 176px; z-index: 12; width: 172px;
  background: rgba(20, 17, 38, .82); border: 1px solid rgba(255, 255, 255, .12); border-radius: 14px;
  padding: 8px 10px; display: flex; align-items: center; gap: 9px; backdrop-filter: blur(8px);
}
.pl .ha { width: 34px; height: 34px; border-radius: 50%; flex: none; }
.pl .hn { font-size: 12px; font-weight: 600; }
.pl .hp { margin-top: 4px; display: inline-block; font-size: 10.5px; padding: 2px 9px; border-radius: 999px; background: var(--grad-pink); font-weight: 700; }
.pl .bot { position: absolute; left: 0; bottom: 0; width: 100%; padding: 0 16px 26px; z-index: 12; transition: opacity .2s; }
.pl .pg { height: 22px; display: flex; align-items: center; }
.pl .tr2 { width: 100%; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, .28); }
.pl .fi { height: 100%; background: #fff; border-radius: 2px; position: relative; }
.pl .kn { position: absolute; right: -6px; top: -4px; width: 11px; height: 11px; border-radius: 50%; background: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, .5); }
.pl .tm { font-size: 11.5px; color: #E8E4DC; margin-top: 2px; }
.pl .sp { font-size: 12px; color: #fff; font-weight: 700; }
.pl .ctl { display: flex; align-items: center; justify-content: center; gap: 34px; margin-top: 14px; }
.pl .c { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; opacity: .92; }
.pl .c.big { width: 46px; height: 46px; border-radius: 50%; background: rgba(255, 255, 255, .16); border: 1px solid rgba(255, 255, 255, .22); }
.pl .mask { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, .5); z-index: 40; }
.pl .drawer {
  position: absolute; left: 0; bottom: 0; width: 100%; z-index: 45; background: #141416;
  border-radius: 20px 20px 0 0; padding: 16px 16px 24px; transform: translateY(105%); transition: transform .25s;
}
.pl .drawer.on { transform: translateY(0); }
.pl .dh { font-size: 15px; font-weight: 700; margin-bottom: 12px; }
.pl .db { max-height: 46vh; }
.pl .dg { display: flex; flex-wrap: wrap; gap: 10px; }
.pl .di { width: 46px; height: 34px; border-radius: 9px; background: rgba(255, 255, 255, .07); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; font-size: 13px; color: #C9C6BE; }
.pl .di.on { background: var(--grad); color: #fff; font-weight: 700; border-color: transparent; }
.pl .osd {
  position: absolute; left: 50%; top: 46%; transform: translateX(-50%); z-index: 30;
  background: rgba(0, 0, 0, .55); padding: 8px 16px; border-radius: 999px; font-size: 13px;
}
</style>
