<template>
  <view class="xj pf">
    <view class="cov">
      <image class="ci" src="/static/p-e.jpg" mode="aspectFill" />
      <view class="cg" />
      <xj-bar>
        <template #right>
          <view class="set" @click="toast('设置 · 演示')"><view class="ic ic-list s20" /></view>
        </template>
      </xj-bar>
    </view>

    <view class="hd">
      <view class="ring"><image class="av" :src="me.av" mode="aspectFill" /></view>
      <view class="f1">
        <view class="row gap8">
          <text class="n">{{ me.n }}</text>
          <text class="b1">已上链</text>
          <text class="b2">VIP用户</text>
        </view>
        <view class="id">心界号：{{ S.uid }}</view>
      </view>
    </view>

    <view class="st">
      <view class="s"><text class="v">{{ follow }}</text><text class="k">关注</text></view>
      <view class="s"><text class="v">6.8w</text><text class="k">粉丝</text></view>
      <view class="s"><text class="v">32.4w</text><text class="k">获赞</text></view>
      <view class="s"><text class="v">{{ S.certs.length }}</text><text class="k">链上藏品</text></view>
    </view>
    <view class="bio">{{ S.bio }}</view>
    <view class="btn gh" @click="toast('编辑资料 · 演示')">编辑资料</view>

    <view class="asset">
      <view class="a" @click="go('/pages/wallet/wallet')">
        <view class="ic ic-dia-f s20" /><text class="an">{{ S.diamonds }}</text><text class="ak">钻石</text>
      </view>
      <view class="a" @click="go('/pages/shop/shop')">
        <view class="ic ic-edit s20" /><text class="an">{{ S.owned.length }}</text><text class="ak">头像</text>
      </view>
      <view class="a" @click="go('/pages/cert/cert')">
        <view class="ic ic-cert s20" /><text class="an">{{ S.certs.length }}</text><text class="ak">证书</text>
      </view>
      <view class="a" @click="go('/pages/groups/groups')">
        <view class="ic ic-chat s20" /><text class="an">5</text><text class="ak">群组</text>
      </view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tb" :class="{ on: t === tab }" @click="tab = t">{{ t }}</view>
    </view>
    <view class="grid">
      <view class="g" v-for="(p, n) in shown" :key="n" @click="tap(n)">
        <image class="gi" :src="p.img" mode="aspectFill" />
        <view class="gg" />
        <view class="gt ell">{{ p.t }}</view>
        <view class="gl"><view class="ic ic-heart-f s12" /><text>{{ p.l }}</text></view>
      </view>
    </view>
    <view style="height:88px" />
    <tab-bar cur="me" />
  </view>
</template>

<script>
import { S, go, toast } from '@/common/store.js';
export default {
  data() {
    return {
      S,
      me: { n: '月亮不及你 ✨', av: '/static/p-d.jpg' },
      follow: 128,
      tabs: ['动态', '作品', '收藏'],
      tab: '动态',
      posts: [
        { img: '/static/a1.jpg', t: '新头像到货', l: '1.2w' },
        { img: '/static/p-a.jpg', t: '今晚追剧', l: '890' },
        { img: '/static/p-e.jpg', t: '校园的晚风', l: '2.3w' },
        { img: '/static/a3.jpg', t: '赛博朋克尝试', l: '456' },
        { img: '/static/p-c.jpg', t: '婚礼那场戏', l: '3.1w' },
        { img: '/static/p-f.jpg', t: '雨夜', l: '778' }
      ]
    };
  },
  computed: {
    shown() {
      if (this.tab === '动态') return this.posts;
      if (this.tab === '作品') return this.posts.slice(2, 5);
      return this.posts.slice(0, 2);
    }
  },
  methods: { go, toast, tap() { toast('作品详情 · 演示'); } }
};
</script>

<style>
.pf .cov { position: relative; height: 138px; }
.pf .ci { position: absolute; width: 100%; height: 100%; filter: blur(2px) saturate(1.2); }
.pf .cg { position: absolute; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(11, 10, 26, .5), rgba(11, 10, 26, .96)); }
.pf .set { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 3; }
.pf .hd { display: flex; align-items: flex-end; gap: 14px; padding: 0 18px; margin-top: -46px; position: relative; z-index: 3; }
.pf .ring { width: 82px; height: 82px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #E8CE9F, #A9784B, #6FA898); flex: none; }
.pf .av { width: 76px; height: 76px; border-radius: 50%; border: 3px solid #0A0A0B; }
.pf .n { font-size: 19px; font-weight: 600; }
.pf .b1, .pf .b2 { font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
.pf .b1 { color: #E8CE9F; background: rgba(232, 206, 159, .2); border: 1px solid rgba(232, 206, 159, .45); }
.pf .b2 { color: #E8CE9F; background: rgba(111, 168, 152, .2); border: 1px solid rgba(111, 168, 152, .45); }
.pf .id { font-size: 11px; color: #8A877F; margin-top: 6px; }
.pf .st { display: flex; margin: 18px 18px 0; padding: 12px 0; background: var(--card); border: 1px solid var(--line); border-radius: 14px; }
.pf .s { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.pf .v { font-size: 16px; font-weight: 600; }
.pf .k { font-size: 11px; color: #8A877F; }
.pf .bio { padding: 14px 20px 0; font-size: 12.5px; color: #9E9C98; }
.pf .btn { margin: 14px 18px 0; height: 40px; line-height: 40px; font-size: 13.5px; }
.pf .asset { display: flex; gap: 10px; padding: 16px 18px 0; }
.pf .a { flex: 1; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.pf .an { font-size: 15px; font-weight: 600; margin-top: 3px; }
.pf .ak { font-size: 10.5px; color: #8A877F; }
.pf .tabs { display: flex; gap: 24px; padding: 20px 18px 10px; }
.pf .tb { font-size: 14.5px; color: #9E9C98; position: relative; padding-bottom: 7px; }
.pf .tb.on { font-size: 16px; font-weight: 600; color: var(--tx); }
.pf .tb.on::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 14px; height: 2px; border-radius: 1px; background: #E8CE9F; }
.pf .grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 6px 18px 0; }
.pf .g { width: calc((100% - 20px) / 3); position: relative; }
.pf .gi { width: 100%; height: 118px; border-radius: 12px; }
.pf .gg { position: absolute; left: 0; top: 0; width: 100%; height: 118px; border-radius: 12px; background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, .7)); }
.pf .gt { position: absolute; left: 8px; bottom: 22px; right: 8px; font-size: 11px; }
.pf .gl { position: absolute; left: 8px; bottom: 7px; display: flex; align-items: center; gap: 3px; font-size: 10px; color: #FFC9BE; }
</style>
