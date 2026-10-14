<template>
  <view class="xj sh">
    <xj-bar title="AI头像商城" back />
    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tb" :class="{ on: t === tab }" @click="tab = t">{{ t }}</view>
    </view>

    <view class="ban">
      <view class="bf">
        <view class="bt">AI 定制专属头像</view>
        <view class="bs">输入关键词，一键生成</view>
        <view class="brow">
          <input class="bi" v-model="kw" placeholder="赛博朋克 · 蓝发少女" placeholder-class="ph" />
          <view class="bb" @click="gen">生成</view>
        </view>
      </view>
      <image class="bim" src="/static/a1.jpg" mode="aspectFill" />
    </view>

    <scroll-view class="cats" scroll-x :show-scrollbar="false">
      <view class="crow">
        <view v-for="c in cats" :key="c" class="chip" :class="{ on: c === cat }" @click="cat = c">{{ c }}</view>
      </view>
    </scroll-view>

    <view class="grid">
      <view class="g" v-for="a in list" :key="a.id" @click="open(a)">
        <image class="gi" :src="a.img" mode="aspectFill" />
        <view class="gp"><view class="ic ic-dia-f s12" /><text>{{ a.p }}</text></view>
        <view v-if="a.ai" class="ai">AI 生成</view>
        <view class="gn ell">{{ a.n }}</view>
      </view>
    </view>

    <view class="sec"><text class="h">限量系列</text><text class="m">链上确权 · 全球限量</text></view>
    <scroll-view class="lim" scroll-x :show-scrollbar="false">
      <view class="lrow">
        <view class="lc" @click="openLimit()">
          <image class="li" :src="limit.img" mode="aspectFill" />
          <view class="lb">限量</view>
          <view class="ln">{{ limit.n }}</view>
          <view class="lq"><text>第 {{ limit.left }} 个 / {{ limit.total }}</text><view class="tm">02:34 / 100</view></view>
          <view class="lp"><view class="fi" style="width:76%" /></view>
        </view>
        <view class="lc" v-for="a in list.slice(0, 3)" :key="'l' + a.id" @click="open(a)">
          <image class="li" :src="a.img" mode="aspectFill" />
          <view class="ln ell">{{ a.n }} · 系列</view>
          <view class="lq"><text>第 {{ 40 + a.p % 30 }} 个 / 100</text><view class="tm">05:12 / 100</view></view>
          <view class="lp"><view class="fi" :style="{ width: 30 + (a.p % 50) + '%' }" /></view>
        </view>
      </view>
    </scroll-view>
    <view style="height:26px" />
  </view>
</template>

<script>
import { AVATARS, AV_CATS, LIMIT } from '@/common/data.js';
import { S, save, go, toast } from '@/common/store.js';
export default {
  data() {
    return {
      tabs: ['推荐', '限量系列', '创作者'],
      tab: '推荐',
      cats: AV_CATS,
      cat: '全部',
      kw: '',
      mine: [],
      limit: LIMIT
    };
  },
  computed: {
    list() {
      const all = this.mine.concat(AVATARS);
      return this.tab === '限量系列' ? all.slice(0, 3) : this.cat === '全部' ? all : all.filter((a) => a.cat === this.cat);
    }
  },
  methods: {
    gen() {
      const k = this.kw.trim();
      if (!k) return toast('先输入一个关键词');
      const img = ['/static/a1.jpg', '/static/a2.jpg', '/static/a3.jpg'][this.mine.length % 3];
      this.mine.unshift({ id: 'ai' + Date.now(), n: k, p: 199, img, cat: '二次元', ai: true });
      this.kw = '';
      this.cat = '全部';
      toast('已生成 1 张候选头像');
    },
    open(a) {
      go('/pages/avatar/avatar?id=' + a.id);
    },
    openLimit() {
      go('/pages/avatar/avatar?limit=1');
    }
  }
};
</script>

<style>
.sh .tabs { display: flex; gap: 22px; padding: 2px 18px 12px; }
.sh .tb { font-size: 14.5px; color: var(--tx2); position: relative; padding-bottom: 8px; letter-spacing: .5px; }
.sh .tb.on { font-size: 16.5px; font-weight: 600; color: var(--tx); }
.sh .tb.on::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 14px; height: 2px; border-radius: 1px; background: #E8CE9F; }
.sh .ban { position: relative; margin: 0 16px; height: 128px; border-radius: 14px; overflow: hidden; background: radial-gradient(120% 140% at 88% 0%, rgba(232, 206, 159, .16), rgba(20, 20, 22, 0) 55%), var(--card); border: 1px solid var(--line); display: flex; align-items: center; }
.sh .bf { flex: 1; padding: 0 16px; position: relative; z-index: 2; }
.sh .bt { font-size: 17px; font-weight: 600; letter-spacing: 1px; color: #F2F1EE; }
.sh .bs { font-size: 12px; color: var(--tx2); margin-top: 5px; letter-spacing: .5px; }
.sh .brow { display: flex; gap: 8px; margin-top: 14px; }
.sh .bi { flex: 1; height: 34px; border-radius: 8px; background: rgba(255, 255, 255, .04); border: 1px solid var(--line2); padding: 0 12px; font-size: 12px; color: #fff; }
.sh .ph { color: var(--tx3); }
.sh .bb { width: 60px; height: 34px; border-radius: 8px; background: var(--grad); color: #17120B; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 600; letter-spacing: .5px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .3); }
.sh .bim { position: absolute; right: 0; top: 0; width: 128px; height: 128px; }
.sh .cats { white-space: nowrap; margin-top: 16px; }
.sh .crow { display: flex; gap: 9px; padding: 0 16px 4px; }
.sh .grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 12px 16px 0; }
.sh .g { width: calc((100% - 24px) / 3); }
.sh .gi { width: 100%; height: 108px; border-radius: 12px; }
.sh .gp {
  margin-top: -22px; margin-left: 6px; width: 46px; height: 20px; border-radius: 999px;
  background: rgba(10, 9, 22, .78); border: 1px solid rgba(255, 255, 255, .16);
  display: flex; align-items: center; justify-content: center; gap: 3px; font-size: 10.5px; position: relative;
}
.sh .ai { position: absolute; right: 6px; margin-top: 22px; font-size: 9px; background: rgba(111, 168, 152, .9); border-radius: 6px; padding: 1px 5px; }
.sh .g { position: relative; }
.sh .gn { font-size: 11.5px; color: #9E9C98; margin-top: 5px; }
.sh .lim { margin-top: 4px; }
.sh .lrow { display: flex; gap: 12px; padding: 0 16px; }
.sh .lc { width: 158px; flex: none; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 8px 8px 12px; position: relative; }
.sh .li { width: 100%; height: 116px; border-radius: 10px; }
.sh .lb { position: absolute; right: 14px; top: 14px; font-size: 10px; background: rgba(232, 206, 159, .16); color: #E8CE9F; border: 1px solid rgba(232, 206, 159, .3); padding: 2px 8px; border-radius: 5px; font-weight: 600; letter-spacing: .5px; }
.sh .ln { font-size: 12.5px; font-weight: 600; margin-top: 8px; }
.sh .lq { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; font-size: 10.5px; color: #8A877F; }
.sh .tm { background: rgba(217, 86, 75, .18); color: #E88C82; border: 1px solid rgba(217, 86, 75, .3); border-radius: 5px; padding: 1px 6px; font-size: 10px; }
.sh .lp { margin-top: 8px; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, .08); overflow: hidden; }
.sh .fi { height: 100%; background: linear-gradient(90deg, #E8CE9F, #C9A268); }
</style>
