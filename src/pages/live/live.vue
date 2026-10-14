<template>
  <view class="xj lv">
    <image class="bg" src="/static/live.jpg" mode="aspectFill" />
    <view class="shade" />

    <view class="top">
      <xj-bar>
        <template #right><view /></template>
      </xj-bar>
      <view class="row" style="padding:0 12px;gap:8px">
        <view class="bk" @click="back"><view class="ic ic-back s20" /></view>
        <view class="pill">
          <image class="pa" src="/static/p-d.jpg" mode="aspectFill" />
          <view>
            <view class="pn">{{ u.n }} · 直播中</view>
            <view class="ph"><view class="ic ic-heart-f s12" /><text>{{ u.heat }}</text></view>
          </view>
        </view>
        <view class="f1" />
        <view class="top1"><text class="c">TOP</text><text class="n">1</text></view>
        <view class="fol" :class="{ on: followed }" @click="follow">{{ followed ? '已关注' : '+ 关注' }}</view>
      </view>
    </view>

    <view class="side">
      <view class="s" v-for="g in gifts" :key="g.n" @click="send(g)">
        <text class="e">{{ g.e }}</text>
        <text class="p">{{ g.p }}</text>
      </view>
    </view>

    <view class="buls">
      <view class="b" v-for="(b, n) in show" :key="n">
        <view class="ba" :style="{ background: b.c }">{{ b.n.slice(0, 1) }}</view>
        <text class="bt"><text :style="{ color: b.c }">{{ b.n }}</text> {{ b.x }}</text>
      </view>
    </view>

    <view class="bot">
      <view class="q"><view class="ic ic-search s18" /><text>搜索</text></view>
      <view class="g" v-for="g in gifts" :key="g.n" @click="send(g)">
        <text class="ge">{{ g.e }}</text><text class="gn">{{ g.n }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { LIVE_USER, LIVE_BULLETS, GIFTS } from '@/common/data.js';
import { S, save, toast, back } from '@/common/store.js';
export default {
  data() {
    return { u: LIVE_USER, gifts: GIFTS, bullets: LIVE_BULLETS.slice(0, 3), i: 3, followed: !!S.follows.lu };
  },
  computed: {
    show() {
      return this.bullets.slice(-5);
    }
  },
  onLoad() {
    this._t = setInterval(() => {
      this.bullets.push(LIVE_BULLETS[this.i % LIVE_BULLETS.length]);
      this.i++;
      if (this.bullets.length > 30) this.bullets.splice(0, 10);
    }, 2300);
  },
  onUnload() {
    clearInterval(this._t);
  },
  methods: {
    back,
    follow() {
      this.followed = !this.followed;
      S.follows.lu = this.followed;
      save();
      toast(this.followed ? '已关注 小鹿酱' : '已取消关注');
    },
    send(g) {
      if (S.diamonds < g.p) return toast('钻石不足，去钱包充值');
      S.diamonds -= g.p;
      save();
      this.bullets.push({ c: '#E8CE9F', n: '月亮不及你', x: '送出 ' + g.n + ' x1' });
      toast('送出 ' + g.n + ' · 剩余 ' + S.diamonds + ' 钻石');
    }
  }
};
</script>

<style>
.lv { position: fixed; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; height: 100vh; overflow: hidden; background: #000; }
.lv .bg { position: absolute; width: 100%; height: 100%; }
.lv .shade { position: absolute; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(0, 0, 0, .55) 0%, transparent 26%, transparent 52%, rgba(0, 0, 0, .72) 100%); }
.lv .top { position: absolute; left: 0; top: 0; width: 100%; z-index: 8; }
.lv .bk { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
.lv .pill { display: flex; align-items: center; gap: 8px; background: rgba(18, 15, 34, .72); border: 1px solid rgba(255, 255, 255, .12); border-radius: 999px; padding: 4px 12px 4px 4px; backdrop-filter: blur(8px); }
.lv .pa { width: 30px; height: 30px; border-radius: 50%; }
.lv .pn { font-size: 12.5px; font-weight: 700; }
.lv .ph { display: flex; align-items: center; gap: 3px; font-size: 10.5px; color: #FFC2A8; }
.lv .top1 { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #E8CE9F, #D8B98C); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #3a1e00; }
.lv .top1 .c { font-size: 8px; font-weight: 600; letter-spacing: .5px; }
.lv .top1 .n { font-size: 14px; font-weight: 900; line-height: 1; }
.lv .fol { background: var(--grad); border-radius: 999px; padding: 7px 14px; font-size: 12.5px; font-weight: 700; }
.lv .fol.on { background: rgba(255, 255, 255, .16); color: #E8E4DC; }
.lv .side { position: absolute; right: 12px; top: 132px; z-index: 8; display: flex; flex-direction: column; gap: 10px; }
.lv .s { width: 42px; height: 42px; border-radius: 14px; background: rgba(20, 17, 38, .68); border: 1px solid rgba(255, 255, 255, .12); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
.lv .s .e { font-size: 16px; line-height: 1; }
.lv .s .p { font-size: 9px; color: #E8CE9F; }
.lv .buls { position: absolute; left: 12px; bottom: 96px; width: 68%; z-index: 8; display: flex; flex-direction: column; gap: 7px; }
.lv .b { display: flex; align-items: center; gap: 6px; background: rgba(12, 13, 16, .5); border-radius: 999px; padding: 4px 10px 4px 4px; }
.lv .ba { width: 20px; height: 20px; border-radius: 50%; font-size: 11px; color: #17120B; display: flex; align-items: center; justify-content: center; font-weight: 600; flex: none; }
.lv .bt { font-size: 12px; color: #F2F1EE; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lv .bot { position: absolute; left: 0; bottom: 0; width: 100%; z-index: 9; display: flex; gap: 9px; padding: 0 12px 22px; align-items: center; }
.lv .q { flex: 1; height: 38px; border-radius: 999px; background: rgba(12, 13, 16, .6); border: 1px solid rgba(255, 255, 255, .14); display: flex; align-items: center; gap: 8px; padding: 0 14px; font-size: 12.5px; color: #9E9C98; }
.lv .g { width: 46px; height: 38px; border-radius: 12px; background: rgba(20, 17, 38, .7); border: 1px solid rgba(255, 255, 255, .14); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.lv .ge { font-size: 14px; line-height: 1.1; }
.lv .gn { font-size: 9px; color: #C9C6BE; }
</style>
