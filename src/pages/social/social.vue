<template>
  <view class="xj sc">
    <xj-bar title="瞬间广场">
      <template #right>
        <view class="sr" @click="toast2('搜索 · 演示')"><view class="ic ic-search s20" /></view>
      </template>
    </xj-bar>
    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tb" :class="{ on: t === tab }" @click="tab = t">{{ t }}</view>
    </view>

    <view class="wrap">
      <view class="post" v-for="p in list" :key="p.id">
        <view class="ph">
          <image class="av" :src="p.av" mode="aspectFill" />
          <view class="f1">
            <view class="n">{{ p.u }}</view>
            <view class="t">{{ p.t }}</view>
          </view>
          <view class="ic ic-more-h s18" @click="toast2('更多')" />
        </view>
        <view class="tx">{{ p.x }}</view>
        <image v-if="p.img" class="pic" :src="p.img" mode="aspectFill" />
        <view v-if="p.card" class="cd">
          <image class="ci" :src="p.card.img" mode="aspectFill" />
          <view class="f1">
            <view class="cn ell">{{ p.card.t }}</view>
            <view class="cs">{{ p.card.ep }}</view>
          </view>
        </view>
        <view class="ft">
          <view class="a" :class="{ lk: p.liked }" @click="like(p)">
            <view class="ic s18" :class="[p.liked ? 'ic-heart-f' : 'ic-hollow-heart']" /><text>{{ wan(p.like) }}</text>
          </view>
          <view class="a" @click="toast2('评论区 · 演示')"><view class="ic ic-cmt-o s18" /><text>评论 {{ p.cmt }}</text></view>
        </view>
      </view>
    </view>

    <view class="fab" @click="pub = true"><view class="ic ic-edit s22" /></view>

    <view v-if="pub" class="maskx" @click="pub = false" />
    <view class="sheet" :class="{ on: pub }">
      <view class="sh">发布瞬间</view>
      <textarea class="ta" v-model="draft" placeholder="此刻的心情，想对有趣的灵魂说…" placeholder-class="ph2" />
      <view class="btn gd" @click="post">发布</view>
    </view>
    <view style="height:24px" />
    <tab-bar cur="msg" />
  </view>
</template>

<script>
import { SEED_POSTS } from '@/common/data.js';
import { S, save, toast, wan } from '@/common/store.js';
export default {
  data() {
    return { tabs: ['关注', '推荐'], tab: '推荐', pub: false, draft: '' };
  },
  computed: {
    list() {
      return S.posts.concat(SEED_POSTS);
    }
  },
  methods: {
    wan,
    toast2(t) {
      toast(t + ' · 演示环境未接入');
    },
    like(p) {
      p.liked = !p.liked;
      p.like += p.liked ? 1 : -1;
    },
    post() {
      const x = this.draft.trim();
      if (!x) return toast('先写点什么');
      S.posts.unshift({ id: 'u' + Date.now(), u: S.nick, av: '/static/a2.jpg', t: '刚刚', x, like: 0, cmt: 0 });
      this.draft = '';
      this.pub = false;
      save();
      toast('已发布到瞬间广场');
    }
  }
};
</script>

<style>
.sc .sr { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.sc .tabs { display: flex; gap: 24px; padding: 2px 18px 14px; }
.sc .tb { font-size: 14.5px; color: var(--tx2); position: relative; padding-bottom: 8px; letter-spacing: .5px; }
.sc .tb.on { font-size: 16.5px; font-weight: 600; color: var(--tx); }
.sc .tb.on::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 14px; height: 2px; border-radius: 1px; background: #E8CE9F; }
.sc .wrap { padding: 0 12px; display: flex; flex-direction: column; gap: 12px; }
.sc .post { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; color: var(--tx); }
.sc .ph { display: flex; align-items: center; gap: 10px; }
.sc .av { width: 36px; height: 36px; border-radius: 50%; }
.sc .n { font-size: 14px; font-weight: 600; color: var(--tx); letter-spacing: .3px; }
.sc .t { font-size: 11px; color: var(--tx3); margin-top: 1px; }
.sc .tx { margin-top: 12px; font-size: 14.5px; line-height: 1.7; color: #D8D5CF; }
.sc .pic { margin-top: 11px; width: 100%; height: 158px; border-radius: 10px; }
.sc .cd { margin-top: 11px; display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, .04); border: 1px solid var(--line); border-radius: 10px; padding: 8px; }
.sc .ci { width: 44px; height: 44px; border-radius: 8px; }
.sc .cn { font-size: 13px; font-weight: 600; color: var(--tx); }
.sc .cs { font-size: 11px; color: var(--tx3); margin-top: 2px; }
.sc .ft { margin-top: 13px; display: flex; align-items: center; gap: 26px; }
.sc .a { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--tx2); }
.sc .a.lk { color: #D9564B; }
.ic-hollow-heart { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239E9C98' stroke-width='1.6' stroke-linejoin='round'><path d='M20.8 6.9a4.8 4.8 0 0 0-7 0L12 8.7l-1.8-1.8a4.8 4.8 0 1 0-7 7l8.8 8.4 8.8-8.4a4.8 4.8 0 0 0 0-7z'/></svg>"); }
.sc .fab { position: fixed; right: max(calc(50% - 199px), 16px); bottom: 96px; width: 48px; height: 48px; border-radius: 16px; background: var(--grad); border: 1px solid rgba(255, 255, 255, .22); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px -10px rgba(201, 162, 104, .8); z-index: 30; }
.sc .maskx { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, .55); z-index: 50; }
.sc .sheet { position: fixed; left: 50%; transform: translate(-50%, 105%); bottom: 0; width: 100%; max-width: 430px; background: #141416; border-radius: 20px 20px 0 0; padding: 18px 18px 28px; z-index: 55; transition: transform .25s; }
.sc .sheet.on { transform: translate(-50%, 0); }
.sc .sh { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.sc .ta { width: 100%; height: 108px; background: rgba(255, 255, 255, .06); border: 1px solid var(--line); border-radius: 14px; padding: 12px; font-size: 14px; color: #fff; }
.sc .ph2 { color: #63625F; }
.sc .sheet .btn { margin-top: 14px; }
</style>
