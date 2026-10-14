<template>
  <view class="xj sp">
    <image class="bg" src="/static/bg-splash.jpg" mode="aspectFill" />
    <view class="mask" />
    <view class="body" @click="skip">
      <image class="logo" src="/static/logo.svg" mode="aspectFit" />
      <view class="name">心界</view>
      <view class="sl">遇见有趣的灵魂</view>
      <view class="ln" />
      <view class="tags">短剧 · 社交 · 直播 · AI头像 · 区块链</view>
    </view>
    <view class="bot">
      <view class="track"><view class="fill" :style="{ width: pct + '%' }" /></view>
      <view class="v">v1.0.0 · 正在为你打开心界</view>
    </view>
  </view>
</template>

<script>
import { S } from '@/common/store.js';
export default {
  data() {
    return { pct: 0, done: false };
  },
  onLoad() {
    this._t = setInterval(() => {
      this.pct = Math.min(100, this.pct + 4 + Math.random() * 7);
      if (this.pct >= 100) {
        clearInterval(this._t);
        this._d = setTimeout(() => this.skip(), 320);
      }
    }, 60);
  },
  onUnload() {
    clearInterval(this._t);
    clearTimeout(this._d);
  },
  methods: {
    skip() {
      if (this.done) return;
      this.done = true;
      clearInterval(this._t);
      clearTimeout(this._d);
      uni.reLaunch({ url: S.authed ? '/pages/home/home' : '/pages/login/login' });
    }
  }
};
</script>

<style>
.sp { position: relative; height: 100vh; overflow: hidden; }
.sp .bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.sp .mask {
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(11, 10, 26, .72) 0%, rgba(11, 10, 26, .12) 42%, rgba(11, 10, 26, .55) 100%);
}
.sp .body { position: relative; padding-top: 12vh; display: flex; flex-direction: column; align-items: center; height: 100%; }
.sp .logo { width: 116px; height: 116px; filter: drop-shadow(0 8px 26px rgba(232, 206, 159, 0.39)); }
.sp .name { margin-top: 14px; font-size: 40px; font-weight: 300; letter-spacing: 8px; text-indent: 8px; text-shadow: 0 4px 22px rgba(0, 0, 0, .5); }
.sp .sl { margin-top: 10px; font-size: 15px; letter-spacing: 5px; text-indent: 5px; color: #E8CE9F; }
.sp .ln { width: 210px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .45), transparent); margin: 22px 0 16px; }
.sp .tags { font-size: 12.5px; color: #C9C6BE; letter-spacing: 1.5px; }
.sp .bot { position: absolute; left: 0; right: 0; bottom: 34px; padding: 0 60px; }
.sp .track { height: 3px; border-radius: 2px; background: rgba(255, 255, 255, .18); overflow: hidden; }
.sp .fill { height: 100%; background: linear-gradient(90deg, #E8CE9F, #A9784B); border-radius: 2px; transition: width .12s linear; }
.sp .v { margin-top: 10px; text-align: center; font-size: 11px; color: rgba(255, 255, 255, .55); letter-spacing: 1px; }
</style>
