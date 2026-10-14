<template>
  <view class="xj lg">
    <image class="bg" src="/static/bg-splash.jpg" mode="aspectFill" />
    <view class="mask" />
    <view class="wrap">
      <xj-bar />
      <view class="top">
        <image class="logo" src="/static/logo.svg" mode="aspectFit" />
        <view class="name">心界</view>
        <view class="sl">遇见有趣的灵魂</view>
      </view>

      <view class="pan">
        <block v-if="!phone">
          <view class="btn gd big" @click="phone = true"><view class="ic ic-phone s18" />手机号登录</view>
          <view class="btn wx big" @click="quick('微信登录')"><view class="ic ic-wechat s20" />微信登录</view>
          <view class="btn ap big" @click="quick('Apple ID 登录')"><view class="ic ic-apple s20" />Apple ID 登录</view>
          <view class="other">其他登录方式</view>
        </block>

        <block v-else>
          <view class="field">
            <text class="pre">+86</text>
            <input class="ip" type="number" maxlength="11" v-model="tel" placeholder="请输入手机号" placeholder-class="ph" />
          </view>
          <view class="field">
            <input class="ip" type="number" maxlength="6" v-model="code" placeholder="请输入验证码（演示环境任意 6 位）" placeholder-class="ph" />
            <view class="get" :class="{ off: cd > 0 }" @click="send">{{ cd > 0 ? cd + 's' : '获取验证码' }}</view>
          </view>
          <view class="btn gd" style="margin-top:18px" @click="login">进入心界</view>
          <view class="other" @click="phone = false">返回其他登录方式</view>
        </block>
      </view>

      <view class="agr" @click="agree = !agree">
        <view class="cb" :class="{ on: agree }"><view v-if="agree" class="ic ic-check" style="width:12px;height:12px" /></view>
        <view class="at">我已阅读并同意 <text class="lk">《用户协议》</text> 和 <text class="lk">《隐私政策》</text></view>
      </view>
      <view style="height:26px" />
    </view>
  </view>
</template>

<script>
import { S, save, toast } from '@/common/store.js';
export default {
  data() {
    return { phone: false, agree: false, tel: '', code: '', cd: 0 };
  },
  methods: {
    send() {
      if (this.cd > 0) return;
      if (!/^1\d{10}$/.test(this.tel)) return toast('请输入 11 位手机号');
      this.cd = 60;
      this._t = setInterval(() => {
        this.cd--;
        if (this.cd <= 0) clearInterval(this._t);
      }, 1000);
      toast('验证码已发送（演示环境任意 6 位）');
    },
    quick(how) {
      if (!this.agree) return toast('请先阅读并同意用户协议');
      toast(how + '（演示环境未接入第三方）');
      this.enter();
    },
    login() {
      if (!this.agree) return toast('请先阅读并同意用户协议');
      if (!/^1\d{10}$/.test(this.tel)) return toast('请输入 11 位手机号');
      if (!/^\d{6}$/.test(this.code)) return toast('请输入 6 位验证码');
      this.enter();
    },
    enter() {
      S.authed = true;
      if (this.tel) S.phone = this.tel;
      save();
      uni.reLaunch({ url: S.quiz ? '/pages/home/home' : '/pages/quiz/quiz' });
    }
  },
  onUnload() {
    clearInterval(this._t);
  }
};
</script>

<style>
.lg { position: relative; height: 100vh; overflow: hidden; }
.lg .bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.lg .mask {
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(8, 9, 12, .82) 0%, rgba(8, 9, 12, .93) 46%, #0A0A0B 78%);
}
.lg .wrap { position: relative; height: 100%; display: flex; flex-direction: column; }
.lg .top { padding: 11vh 0 0; display: flex; flex-direction: column; align-items: center; }
.lg .logo { width: 84px; height: 84px; filter: drop-shadow(0 6px 20px rgba(232, 206, 159, 0.35)); }
.lg .name { margin-top: 8px; font-size: 30px; font-weight: 500; letter-spacing: 6px; text-indent: 6px; }
.lg .sl { margin-top: 6px; font-size: 13px; letter-spacing: 4px; text-indent: 4px; color: #E8CE9F; }
.lg .pan { margin-top: 9vh; padding: 0 30px; display: flex; flex-direction: column; gap: 16px; }
.lg .pan .big { height: 52px; line-height: 52px; font-size: 16px; }
.lg .other { text-align: center; font-size: 12.5px; color: #8A877F; margin-top: 6px; }
.lg .field {
  height: 52px; border-radius: 999px; background: rgba(255, 255, 255, .07);
  border: 1px solid rgba(255, 255, 255, .1); display: flex; align-items: center; padding: 0 18px; gap: 10px;
}
.lg .pre { font-size: 14px; color: #D6D2C9; }
.lg .ip { flex: 1; font-size: 14.5px; color: #fff; }
.lg .ph { color: #63625F; }
.lg .get { font-size: 13px; color: #E8CE9F; padding-left: 10px; border-left: 1px solid rgba(255, 255, 255, .12); }
.lg .get.off { color: #63625F; }
.lg .agr { display: flex; align-items: flex-start; gap: 8px; padding: 20px 24px 0; margin-top: auto; }
.lg .cb { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .45); margin-top: 1px; display: flex; align-items: center; justify-content: center; flex: none; }
.lg .cb.on { background: linear-gradient(135deg, #E8CE9F, #B9905A); border-color: transparent; }
.lg .at { font-size: 11.5px; color: #8A877F; line-height: 1.6; }
.lg .lk { color: #6FA898; }
</style>
