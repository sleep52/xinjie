<template>
  <view class="xj hm">
    <xj-bar bare />
    <view class="tops">
      <view v-for="t in tops" :key="t.k" class="tp" :class="{ on: t.k === 'rec' }" @click="top(t)">{{ t.n }}</view>
      <view class="f1" />
      <view class="sr" @click="go('/pages/drama/drama')"><view class="ic ic-search s20" /></view>
    </view>

    <view class="hero" @click="play(DRAMAS[2])">
      <image class="hi" :src="HERO.img" mode="aspectFill" />
      <view class="hm2" />
      <view class="ht">《{{ HERO.t }}》</view>
      <view class="hs">{{ HERO.sub }}</view>
      <view class="dots"><view class="d" v-for="n in 3" :key="n" :class="{ a: n === 1 }" /></view>
    </view>

    <view class="quick">
      <view class="q" v-for="q in QUICK" :key="q.k" @click="act(q.k)">
        <view class="qc"><view class="ic s26" :class="q.ic" /></view>
        <text>{{ q.n }}</text>
      </view>
    </view>

    <view class="sec"><text class="h">为你推荐</text><text class="m" @click="go('/pages/drama/drama')">更多 ›</text></view>
    <view class="grid">
      <view class="rp" v-for="d in list" :key="d.id" @click="play(d)">
        <image class="ri" :src="d.img" mode="aspectFill" />
        <view class="rg" />
        <view v-if="d.tag" class="bge">{{ d.tag }}</view>
        <view class="pl"><view class="ic ic-play s12" /><text>{{ wan(d.plays) }}</text></view>
        <view class="rt ell2">{{ d.t }}</view>
        <view class="rs ell">{{ d.sub }}</view>
      </view>
    </view>
    <view style="height:88px" />
    <tab-bar cur="home" />
  </view>
</template>

<script>
import { HERO, QUICK, DRAMAS } from '@/common/data.js';
import { go, toast, wan } from '@/common/store.js';
export default {
  data() {
    return {
      HERO,
      QUICK,
      tops: [
        { k: 'rec', n: '推荐' },
        { k: 'drama', n: '短剧' },
        { k: 'live', n: '直播' },
        { k: 'soc', n: '社交' }
      ],
      list: DRAMAS
    };
  },
  methods: {
    go,
    wan,
    top(t) {
      if (t.k === 'rec') return;
      if (t.k === 'drama') return go('/pages/drama/drama');
      if (t.k === 'live') return go('/pages/live/live');
      go('/pages/social/social');
    },
    act(k) {
      if (k === 'drama') return go('/pages/drama/drama');
      if (k === 'live') return go('/pages/live/live');
      if (k === 'near') return toast('附近的人 · 演示环境不采集定位');
      go('/pages/social/social');
    },
    play(d) {
      go('/pages/player/player?id=' + d.id);
    }
  }
};
</script>

<style>
.hm .tops { display: flex; align-items: center; gap: 24px; padding: 4px 16px 14px 18px; min-height: 42px; }
.hm .tp { font-size: 15px; color: var(--tx2); position: relative; padding-bottom: 8px; letter-spacing: .5px; }
.hm .tp.on { font-size: 17px; font-weight: 600; color: var(--tx); }
.hm .tp.on::after {
  content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0;
  width: 14px; height: 2px; border-radius: 1px; background: #E8CE9F;
}
.hm .sr { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.hm .hero { position: relative; margin: 0 16px; height: 212px; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.hm .hi { position: absolute; width: 100%; height: 100%; }
.hm .hm2 { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(10, 10, 11, 0) 38%, rgba(10, 10, 11, .9) 100%); }
.hm .ht { position: absolute; left: 16px; bottom: 34px; font-size: 21px; font-weight: 700; letter-spacing: 1.5px; text-shadow: 0 2px 14px rgba(0, 0, 0, .7); }
.hm .hs { position: absolute; left: 16px; bottom: 14px; font-size: 10.5px; color: #E8CE9F; letter-spacing: 2.5px; }
.hm .dots { position: absolute; right: 14px; bottom: 16px; display: flex; gap: 5px; }
.hm .d { width: 4px; height: 4px; border-radius: 50%; background: rgba(255, 255, 255, .3); }
.hm .d.a { background: #E8CE9F; width: 12px; border-radius: 2px; }
.hm .quick { display: flex; padding: 22px 14px 0; }
.hm .q { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.hm .qc { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: var(--card); border: 1px solid var(--line); }
.hm .q text { font-size: 11.5px; color: var(--tx2); letter-spacing: .5px; }
.hm .grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 16px; }
.hm .rp { width: calc(50% - 6px); position: relative; }
.hm .ri { width: 100%; height: 168px; border-radius: 10px; }
.hm .rg { position: absolute; left: 0; top: 0; width: 100%; height: 168px; border-radius: 10px; background: linear-gradient(180deg, rgba(0, 0, 0, .06) 55%, rgba(0, 0, 0, .62)); }
.hm .bge { position: absolute; left: 8px; top: 8px; font-size: 10px; padding: 2px 7px; border-radius: 4px; background: rgba(10, 10, 11, .55); backdrop-filter: blur(8px); border: 1px solid rgba(232, 206, 159, .3); color: #E8CE9F; font-weight: 600; letter-spacing: .6px; }
.hm .pl { position: absolute; right: 8px; top: 148px; display: flex; align-items: center; gap: 3px; font-size: 10.5px; color: #fff; text-shadow: 0 1px 4px rgba(0, 0, 0, .7); }
.hm .rt { margin-top: 9px; font-size: 13.5px; font-weight: 600; line-height: 1.35; letter-spacing: .3px; }
.hm .rs { margin-top: 3px; font-size: 11px; color: var(--tx3); letter-spacing: .3px; }
.ic-play { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'><path d='M8 5.2 19 12 8 18.8z'/></svg>"); }
</style>
