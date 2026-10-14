<template>
  <view class="xj wl">
    <xj-bar title="我的钱包" back />
    <view class="main">
      <view class="gem">
        <view class="gl">钻石</view>
        <view class="row gap10">
          <view class="ic ic-dia-f s28" />
          <text class="gv">{{ S.diamonds }}</text>
        </view>
        <view class="gb" @click="pay">充值</view>
      </view>

      <view class="acts">
        <view class="ac" v-for="a in acts" :key="a.n" @click="toast(a.n)">
          <view class="ai" :class="a.i" />
          <text>{{ a.n }}</text>
        </view>
      </view>
    </view>

    <view class="sec"><text class="h">充值金额</text><text class="m">支持微信 / 支付宝（演示）</text></view>
    <view class="grid">
      <view v-for="r in opts" :key="r.rmb" class="o" :class="{ on: sel === r.rmb }" @click="sel = r.rmb">
        <text class="ov">{{ r.rmb }}元</text>
        <text class="og">{{ r.gem }}钻</text>
      </view>
    </view>

    <view class="bon">
      <image class="bi" src="/static/a1.jpg" mode="aspectFill" />
      <view class="f1">
        <view class="bn">首充双倍 · 最高送 100% 钻石</view>
        <view class="bs">当前选择：{{ sel }}元 → {{ selGem }} 钻</view>
      </view>
      <view class="ic ic-gift s26" />
    </view>

    <view class="bar"><view class="in">
      <view class="btn gd" @click="pay">立即支付 ¥{{ sel }}</view>
      <view class="pr">支付成功后 {{ selGem }} 钻石将到账，1 元 = 10 钻石</view>
    </view></view>
    <view style="height:110px" />
  </view>
</template>

<script>
import { RECHARGE } from '@/common/data.js';
import { S, save, toast } from '@/common/store.js';
export default {
  data() {
    return {
      S,
      opts: RECHARGE,
      sel: 30,
      acts: [
        { n: '收益', i: 'ic-dia' },
        { n: '提现', i: 'ic-wallet' },
        { n: '礼物记录', i: 'ic-gift' },
        { n: '交易记录', i: 'ic-list' }
      ]
    };
  },
  computed: {
    selGem() {
      const o = this.opts.find((x) => x.rmb === this.sel);
      return o ? o.gem : 0;
    }
  },
  methods: {
    toast(n) {
      toast(n + ' · 演示环境不接入真实支付');
    },
    pay() {
      S.diamonds += this.selGem;
      save();
      toast('已到账 ' + this.selGem + ' 钻石（演示）');
    }
  }
};
</script>

<style>
.wl .main { padding: 4px 16px 0; }
.wl .gem {
  position: relative; border-radius: 18px; padding: 16px 18px 18px; overflow: hidden;
  background: linear-gradient(120deg, #1C1A16, #1A1814 60%, #14120E); border: 1px solid rgba(232, 206, 159, .28);
}
.wl .gem::after { content: ''; position: absolute; right: -30px; top: -40px; width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, rgba(232, 206, 159, .4), transparent 70%); }
.wl .gl { font-size: 12px; color: #9E9C98; letter-spacing: 2px; }
.wl .gv { font-size: 30px; font-weight: 500; letter-spacing: 1px; }
.wl .gb { position: absolute; right: 16px; top: 34px; z-index: 2; background: var(--grad); border-radius: 999px; padding: 7px 18px; font-size: 13px; font-weight: 700; }
.wl .acts { display: flex; margin-top: 14px; }
.wl .ac { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px; font-size: 11.5px; color: #9E9C98; }
.wl .ai { width: 40px; height: 40px; border-radius: 14px; background-color: var(--card); border: 1px solid var(--line); background-size: 22px; background-repeat: no-repeat; background-position: center; }
.wl .grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 16px; }
.wl .o {
  width: calc((100% - 24px) / 3); height: 66px; border-radius: 14px; background: var(--card);
  border: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
}
.wl .o.on { border-color: #E8CE9F; background: rgba(232, 206, 159, .16); box-shadow: 0 0 0 1px #E8CE9F inset; }
.wl .ov { font-size: 16px; font-weight: 600; }
.wl .og { font-size: 11.5px; color: #9E9C98; }
.wl .bon { display: flex; align-items: center; gap: 12px; margin: 18px 16px 0; padding: 12px 14px; border-radius: 12px; background: radial-gradient(120% 140% at 100% 0%, rgba(232, 206, 159, .14), rgba(20, 20, 22, 0) 60%), var(--card); border: 1px solid rgba(232, 206, 159, .22); }
.wl .bi { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(232, 206, 159, .4); }
.wl .bn { font-size: 13.5px; font-weight: 600; color: #E8CE9F; letter-spacing: .5px; }
.wl .bs { font-size: 11px; color: var(--tx2); margin-top: 2px; }
.wl .bar .in { padding: 0 16px 20px; background: linear-gradient(180deg, rgba(11, 10, 26, 0), #0A0A0B 26%); }
.wl .pr { text-align: center; font-size: 11px; color: #63625F; margin-top: 9px; }
</style>
