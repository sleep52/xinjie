<template>
  <view class="xj ct">
    <xj-bar>
      <template #right><view /></template>
    </xj-bar>
    <view class="nav2">
      <view class="bk" @click="back"><view class="ic ic-back s20" /></view>
      <image class="av" src="/static/p-d.jpg" mode="aspectFill" />
      <view class="f1">
        <view class="n">小鹿酱</view>
        <view class="s"><view class="dot" />在线</view>
      </view>
      <view class="ic ic-more s20" style="opacity:.7" @click="toast('会话设置 · 演示')" />
    </view>

    <scroll-view class="body" scroll-y :scroll-into-view="'m' + (list.length - 1)" scroll-with-animation>
      <view class="days">今天</view>
      <view v-for="(m, i) in list" :key="i" :id="'m' + i" class="ln" :class="{ me: m.me }">
        <image v-if="!m.me" class="cav" src="/static/p-d.jpg" mode="aspectFill" />
        <view v-if="m.voice" class="bb vo"><view class="ic ic-mic s18" /><text>{{ m.voice }}s</text></view>
        <view v-else-if="m.gift" class="bb gf">
          <view class="f1"><view class="gt">🎁 {{ m.gift }}</view><view class="gs">礼物</view></view>
          <text class="he">💗</text>
        </view>
        <view v-else class="bb">{{ m.x }}</view>
        <image v-if="m.me" class="cav" src="/static/a2.jpg" mode="aspectFill" />
      </view>
      <view style="height:14px" />
    </scroll-view>

    <view class="bar in2">
      <view class="plus" @click="toast('更多 · 相册/拍摄/位置 未接入')"><view class="ic ic-plus-c s26" /></view>
      <view class="box">
        <input class="ip" v-model="txt" placeholder="输入消息…" placeholder-class="ph" confirm-type="send" @confirm="send" />
        <view class="ic ic-emoji s22" @click="emoji" />
      </view>
      <view class="snd" @click="send"><view class="ic ic-send s22" /></view>
    </view>
  </view>
</template>

<script>
import { SEED_CHAT, CHAT_REPLY } from '@/common/data.js';
import { S, save, back, toast } from '@/common/store.js';
export default {
  data() {
    return { txt: '', list: S.chats.lu && S.chats.lu.length ? S.chats.lu : SEED_CHAT.slice() };
  },
  methods: {
    back,
    toast,
    send() {
      const t = this.txt.trim();
      if (!t) return;
      this.list.push({ me: true, x: t });
      this.txt = '';
      this.sync();
      setTimeout(() => {
        this.list.push({ me: false, x: CHAT_REPLY[this.list.length % CHAT_REPLY.length] });
        this.sync();
      }, 900);
    },
    emoji() {
      this.txt += '😊';
    },
    sync() {
      S.chats.lu = this.list;
      save();
    }
  }
};
</script>

<style>
.ct { height: 100vh; display: flex; flex-direction: column; }
.ct .nav2 { display: flex; align-items: center; gap: 9px; padding: 0 12px 10px; border-bottom: 1px solid var(--line); }
.ct .bk { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
.ct .av { width: 34px; height: 34px; border-radius: 50%; }
.ct .n { font-size: 15.5px; font-weight: 700; }
.ct .s { font-size: 11px; color: #8FBFAF; display: flex; align-items: center; gap: 4px; }
.ct .dot { width: 6px; height: 6px; border-radius: 50%; background: #6FA898; }
.ct .body { flex: 1; padding: 12px 12px 0; }
.ct .days { text-align: center; font-size: 11px; color: #63625F; margin-bottom: 12px; }
.ct .ln { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 14px; }
.ct .ln.me { justify-content: flex-end; }
.ct .cav { width: 34px; height: 34px; border-radius: 50%; flex: none; }
.ct .bb { max-width: 68%; padding: 10px 13px; border-radius: 14px; font-size: 14px; line-height: 1.6; background: #1A1A1D; border: 1px solid var(--line); }
.ct .me .bb { background: linear-gradient(135deg, #E8CE9F, #C29A62); border-color: transparent; }
.ct .vo { display: flex; align-items: center; gap: 8px; min-width: 96px; }
.ct .gf { display: flex; align-items: center; gap: 10px; width: 68%; background: linear-gradient(135deg, rgba(232, 206, 159, .16), rgba(201, 162, 104, .1)); border-color: rgba(232, 206, 159, .34); }
.ct .gt { font-size: 13.5px; font-weight: 600; }
.ct .gs { font-size: 10.5px; color: #C9C6BE; margin-top: 2px; }
.ct .he { font-size: 22px; }
.ct .in2 { display: flex; align-items: center; gap: 10px; padding: 10px 12px 22px; background: rgba(11, 10, 26, .9); border-top: 1px solid var(--line); position: relative; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; }
.ct .plus { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.ct .box { flex: 1; height: 40px; border-radius: 999px; background: rgba(255, 255, 255, .07); border: 1px solid var(--line); display: flex; align-items: center; padding: 0 14px; gap: 8px; }
.ct .ip { flex: 1; font-size: 14px; color: #fff; }
.ct .ph { color: #63625F; }
.ct .snd { width: 40px; height: 40px; border-radius: 50%; background: rgba(232, 206, 159, .18); border: 1px solid rgba(232, 206, 159, .4); display: flex; align-items: center; justify-content: center; }
</style>
