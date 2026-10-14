<template>
  <view class="xj ms">
    <xj-bar title="消息" center />
    <view class="lst">
      <view v-for="m in msgs" :key="m.k" class="r" @click="open(m)">
        <view class="avw">
          <image v-if="m.img" class="av2" :src="m.img" mode="aspectFill" />
          <view v-else class="sys" :class="m.badge" />
          <view v-if="m.un" class="bdg">{{ m.un > 99 ? '99+' : m.un }}</view>
        </view>
        <view class="f1">
          <view class="row" style="justify-content:space-between"><text class="n">{{ m.n }}</text><text class="t">{{ m.t }}</text></view>
          <view class="s ell">{{ m.s }}</view>
        </view>
        <view class="ic ic-right s16" style="opacity:.3" />
      </view>
    </view>
    <view style="height:88px" />
    <tab-bar cur="msg" />
  </view>
</template>

<script>
import { MSGS } from '@/common/data.js';
import { S, save, go, toast } from '@/common/store.js';
export default {
  data() {
    return { msgs: MSGS };
  },
  onShow() {
    S.unread = 0;
    save();
  },
  methods: {
    open(m) {
      if (m.k === 'lu') return go('/pages/chat/chat');
      if (m.k === 'g1' || m.k === 'g2') return go('/pages/groups/groups');
      toast(m.n + ' · 演示环境未接入');
    }
  }
};
</script>

<style>
.ms .lst { padding: 6px 12px 0; }
.ms .r { display: flex; align-items: center; gap: 12px; padding: 13px 10px; border-radius: 16px; }
.ms .r:active { background: rgba(255, 255, 255, .05); }
.ms .avw { position: relative; width: 48px; height: 48px; flex: none; }
.ms .av2 { width: 48px; height: 48px; border-radius: 15px; }
.ms .sys { width: 48px; height: 48px; border-radius: 15px; background-color: rgba(232, 206, 159, .18); background-size: 24px; background-repeat: no-repeat; background-position: center; border: 1px solid rgba(232, 206, 159, .3); }
.ms .bdg {
  position: absolute; right: -4px; top: -4px; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 9px; background: #D9564B; font-size: 11px; line-height: 18px; text-align: center; border: 2px solid #0A0A0B;
}
.ms .n { font-size: 15px; font-weight: 700; }
.ms .t { font-size: 11px; color: #63625F; }
.ms .s { font-size: 12.5px; color: #9E9C98; margin-top: 4px; }
</style>
