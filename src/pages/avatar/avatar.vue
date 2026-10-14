<template>
  <view class="xj avp">
    <view class="hero">
      <image class="hi" :src="a.img" mode="aspectFill" />
      <view class="hg" />
      <view class="hb">
        <xj-bar>
          <template #right><view /></template>
        </xj-bar>
        <view class="row" style="padding:0 12px;justify-content:space-between">
          <view class="bk" @click="back"><view class="ic ic-back s20" /></view>
          <view v-if="a.limited" class="lb">限量</view>
        </view>
      </view>
    </view>

    <view class="body">
      <view class="t">{{ a.n }}</view>
      <view class="pr"><view class="ic ic-dia-f s16" /><text class="pv">{{ a.p }}</text><text class="pu">钻石</text></view>
      <view class="row gap10" style="margin-top:12px">
        <view class="ck">权限</view>
        <view class="pw"><view class="pf" :style="{ width: left + '%' }" /></view>
        <text class="pt">{{ left }}/{{ a.total || 100 }}</text>
      </view>
      <view class="ds">{{ a.limited ? '由知名画师创作，独家上链，永久收藏。购买后自动完成链上确权，生成唯一 TokenID。' : 'AI 生成头像，可用于聊天、评论区与个人主页展示。' }}</view>

      <view class="btn gd" @click="buy">{{ owned ? '已拥有 · 查看证书' : '立即购买' }}</view>
      <view class="sup"><view class="ic ic-shield s16" /><text>腾讯区块链技术支持</text></view>

      <view class="fe">
        <view class="f" @click="toast('已写入链上确权记录')"><view class="ic ic-chain s26" /><text>上链确权</text></view>
        <view class="f" @click="toast('TokenID #' + token)"><view class="ic ic-token s26" /><text>唯一TokenID</text></view>
        <view class="f" @click="cert()"><view class="ic ic-cert s26" /><text>数字证书</text></view>
      </view>
    </view>
  </view>
</template>

<script>
import { AVATARS, LIMIT } from '@/common/data.js';
import { S, save, go, back, toast } from '@/common/store.js';
export default {
  data() {
    return { a: AVATARS[0], left: 100, owned: false, token: '1234567890' };
  },
  onLoad(q) {
    const lim = q.limit === '1';
    this.a = lim ? Object.assign({ limited: true, total: 100 }, LIMIT) : AVATARS.find((x) => x.id === q.id) || AVATARS[0];
    this.left = this.a.total || 100;
    this.owned = S.owned.indexOf(this.a.id) >= 0;
  },
  methods: {
    back,
    toast,
    buy() {
      if (this.owned) return this.cert();
      if (S.diamonds < this.a.p) {
        toast('钻石不足，先去钱包充值');
        return setTimeout(() => go('/pages/wallet/wallet'), 700);
      }
      S.diamonds -= this.a.p;
      this.left = Math.max(0, this.left - 1);
      this.owned = true;
      S.owned.push(this.a.id);
      this.token = String(Math.floor(1e9 + Math.random() * 8e9));
      const c = {
        id: this.a.id,
        name: this.a.n,
        token: this.token,
        total: this.a.total || 10000,
        owner: '0x8f3a' + this.token.slice(0, 4) + '…2c7e',
        block: '#' + (28000000 + Math.floor(Math.random() * 999999)),
        time: '2026-09-09 12:34:56',
        img: this.a.img
      };
      S.certs.unshift(c);
      save();
      toast('购买成功 · 已完成链上确权');
      setTimeout(() => go('/pages/cert/cert?i=0'), 800);
    },
    cert() {
      go('/pages/cert/cert?id=' + this.a.id);
    }
  }
};
</script>

<style>
.avp .hero { position: relative; height: 60vh; }
.avp .hi { position: absolute; width: 100%; height: 100%; }
.avp .hg { position: absolute; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(11, 10, 26, .55) 0%, transparent 30%, transparent 62%, #0A0A0B 100%); }
.avp .hb { position: absolute; left: 0; top: 0; width: 100%; }
.avp .bk { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.avp .lb { font-size: 11px; font-weight: 700; background: var(--grad-pink); padding: 4px 12px; border-radius: 999px; }
.avp .body { padding: 0 20px; }
.avp .t { font-size: 20px; font-weight: 600; letter-spacing: .5px; }
.avp .pr { display: flex; align-items: center; gap: 6px; margin-top: 10px; }
.avp .pv { font-size: 19px; font-weight: 600; color: #E8CE9F; }
.avp .pu { font-size: 12.5px; color: #E8CE9F; }
.avp .ck { font-size: 11px; color: #E8CE9F; background: rgba(232, 206, 159, .14); border: 1px solid rgba(232, 206, 159, .35); border-radius: 6px; padding: 1px 7px; }
.avp .pw { flex: 1; height: 5px; border-radius: 3px; background: rgba(255, 255, 255, .12); overflow: hidden; }
.avp .pf { height: 100%; background: linear-gradient(90deg, #E8CE9F, #A9784B); }
.avp .pt { font-size: 11.5px; color: #9E9C98; }
.avp .ds { margin-top: 16px; font-size: 13px; line-height: 1.85; color: #9E9C98; }
.avp .btn { margin-top: 22px; }
.avp .sup { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; font-size: 12px; color: #9E9C98; }
.avp .fe { display: flex; margin-top: 26px; padding-bottom: 30px; }
.avp .f { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11.5px; color: #9E9C98; }
</style>
