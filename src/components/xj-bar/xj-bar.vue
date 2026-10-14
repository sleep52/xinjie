<template>
  <view class="xjbar">
    <view class="sbar">
      <text>{{ time }}</text>
      <view class="r">
        <view class="i ic-signal" />
        <view class="i ic-wifi" />
        <view class="i ic-batt" />
      </view>
    </view>
    <view v-if="!bare" class="nav">
      <view v-if="back" class="bk" @click="onBack"><view class="ic ic-back s20" /></view>
      <view class="ttl" :class="{ c: center, gd: grad }"><slot>{{ title }}</slot></view>
      <slot name="right" />
    </view>
  </view>
</template>

<script>
import { back as goBack } from '@/common/store.js';
export default {
  props: {
    title: { type: String, default: '' },
    back: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    grad: { type: Boolean, default: false },
    bare: { type: Boolean, default: false }
  },
  data() {
    return { time: '9:31' };
  },
  mounted() {
    const t = () => {
      const d = new Date();
      this.time = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    };
    t();
    this._t = setInterval(t, 20000);
  },
  unmounted() {
    clearInterval(this._t);
  },
  methods: {
    onBack() {
      goBack();
    }
  }
};
</script>

<style>
.xjbar { padding-bottom: 2px; }
</style>
