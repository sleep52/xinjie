<template>
  <view class="xj pb">
    <xj-bar title="发布" back center />
    <view class="wrap">
      <view class="c" @click="go('/pages/social/social')">
        <view class="i"><view class="ic ic-edit-g s26" /></view>
        <view class="f1"><view class="t">发布动态</view><view class="s">写下此刻，遇见同频的灵魂</view></view>
        <view class="ic ic-right s16" style="opacity:.35" />
      </view>
      <view class="c" @click="go('/pages/live/live')">
        <view class="i"><view class="ic ic-play-c-g s26" /></view>
        <view class="f1"><view class="t">进入直播</view><view class="s">开播或逛一逛热门直播间</view></view>
        <view class="ic ic-right s16" style="opacity:.35" />
      </view>
      <view class="c" @click="match">
        <view class="i"><view class="ic ic-pin-g s26" /></view>
        <view class="f1"><view class="t">快速匹配</view><view class="s">按灵魂画像匹配 1 对 1 聊天</view></view>
        <view class="ic ic-right s16" style="opacity:.35" />
      </view>
    </view>
    <view class="tip">{{ soul }}</view>
    <view class="btn gh" @click="back">取消</view>
    <tab-bar cur="pub" />
  </view>
</template>

<script>
import { S, go, back, toast } from '@/common/store.js';
export default {
  computed: {
    soul() {
      return S.quiz ? '你的灵魂画像：' + S.quiz.n : '完成灵魂鉴定，匹配更准';
    }
  },
  methods: {
    go,
    back,
    match() {
      toast('正在为你寻找有趣的灵魂…');
      setTimeout(() => go('/pages/chat/chat'), 900);
    }
  }
};
</script>

<style>
.pb .wrap { padding: 10px 16px 0; display: flex; flex-direction: column; gap: 12px; }
.pb .c {
  display: flex; align-items: center; gap: 14px; padding: 16px 14px; background: var(--card);
  border: 1px solid var(--line); border-radius: 14px;
}
.pb .i { width: 46px; height: 46px; border-radius: 14px; background: rgba(232, 206, 159, .08); border: 1px solid rgba(232, 206, 159, .18); display: flex; align-items: center; justify-content: center; }
.pb .t { font-size: 15.5px; font-weight: 600; letter-spacing: .5px; }
.pb .s { font-size: 11.5px; color: var(--tx3); margin-top: 4px; letter-spacing: .3px; }
.pb .tip { text-align: center; font-size: 11.5px; color: #63625F; margin: 18px 0 14px; }
.pb .btn { margin: 0 16px; }
</style>
