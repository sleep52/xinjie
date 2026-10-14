<template>
  <view class="bar tbar">
    <view class="in">
      <view class="it" v-for="i in items" :key="i.k" @click="tap(i)">
        <view v-if="i.k !== 'pub'" class="ic s26" :class="[cur === i.k ? i.on : i.off]" />
        <view v-else class="pub"><view class="ic ic-plus s26" /></view>
        <text :class="cur === i.k ? 'a' : ''">{{ i.n }}</text>
        <view v-if="i.badge" class="bdg">{{ i.badge }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { S, tab, go } from '@/common/store.js';
export default {
  props: { cur: { type: String, default: 'home' } },
  computed: {
    items() {
      return [
        { k: 'home', n: '首页', off: 'ic-home', on: 'ic-home-f', url: '/pages/home/home' },
        { k: 'drama', n: '短剧', off: 'ic-drama', on: 'ic-drama-f', url: '/pages/drama/drama' },
        { k: 'pub', n: '', off: '', on: '', url: '/pages/publish/publish' },
        { k: 'msg', n: '消息', off: 'ic-chat', on: 'ic-chat-f', url: '/pages/messages/messages', badge: S.unread },
        { k: 'me', n: '我的', off: 'ic-user', on: 'ic-user-f', url: '/pages/profile/profile' }
      ];
    }
  },
  methods: {
    tap(i) {
      if (i.k === this.cur) return;
      if (i.k === 'pub') go(i.url);
      else tab(i.url);
    }
  }
};
</script>

<style>
.tbar { z-index: 70; }
.tbar .in {
  margin: 0 12px 10px;
  height: 58px;
  border-radius: 18px;
  background: rgba(16, 16, 18, .9);
  border: 1px solid rgba(255, 255, 255, .06);
  box-shadow: 0 -8px 28px rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  backdrop-filter: blur(16px);
}
.tbar .it {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  position: relative;
}
.tbar .it text { font-size: 10.5px; color: var(--tx2, #9E9C98); letter-spacing: .5px; }
.tbar .it text.a { color: #E8CE9F; font-weight: 600; }
.tbar .pub {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  margin-top: -20px;
  background: linear-gradient(180deg, #1A1A1D, #101012);
  border: 1px solid rgba(232, 206, 159, .35);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 22px -8px rgba(0, 0, 0, .8), inset 0 1px 0 rgba(255, 255, 255, .06);
}
.tbar .bdg {
  position: absolute;
  top: 6px;
  right: 22%;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #D9564B;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
}
</style>
