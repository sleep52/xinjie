<template>
  <view class="xj gp">
    <xj-bar title="兴趣群组" />
    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tb" :class="{ on: t === tab }" @click="tab = t">{{ t }}</view>
    </view>
    <view class="lst">
      <view v-for="(g, n) in shown" :key="g.n" class="r" @click="in2(g)">
        <image class="av" :src="g.img" mode="aspectFill" />
        <view class="f1">
          <view class="n">{{ g.n }}</view>
          <view class="s">{{ g.m }}人 · {{ g.msg }}条新消息</view>
        </view>
        <view v-if="joined[g.n]" class="jd">已加入</view>
        <view v-else class="ic ic-right s16" style="opacity:.3" />
      </view>
    </view>
    <view style="height:96px" />
    <view class="bar"><view class="in"><view class="btn gd" @click="create">+ 创建群组</view></view></view>
  </view>
</template>

<script>
import { GROUPS } from '@/common/data.js';
import { toast } from '@/common/store.js';
export default {
  data() {
    return { tabs: ['推荐', '我的群组'], tab: '推荐', joined: {} };
  },
  computed: {
    shown() {
      return this.tab === '推荐' ? GROUPS : GROUPS.filter((g) => this.joined[g.n]);
    }
  },
  methods: {
    in2(g) {
      this.joined[g.n] = true;
      toast('进入「' + g.n + '」· 演示环境未接入群聊');
    },
    create() {
      toast('创建群组需要先绑定手机号');
    }
  }
};
</script>

<style>
.gp .tabs { display: flex; gap: 22px; padding: 2px 18px 10px; }
.gp .tb { font-size: 14.5px; color: #9E9C98; position: relative; padding-bottom: 7px; }
.gp .tb.on { font-size: 16.5px; font-weight: 600; color: var(--tx); }
.gp .tb.on::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 14px; height: 2px; border-radius: 1px; background: #E8CE9F; }
.gp .lst { padding: 4px 14px 0; }
.gp .r { display: flex; align-items: center; gap: 12px; padding: 12px 14px; margin-bottom: 10px; border-radius: 18px; background: var(--card); }
.gp .av { width: 48px; height: 48px; border-radius: 50%; flex: none; }
.gp .n { font-size: 15px; font-weight: 700; }
.gp .s { font-size: 12px; color: #8A877F; margin-top: 4px; }
.gp .jd { font-size: 11px; color: #E8CE9F; background: rgba(232, 206, 159, .14); border-radius: 999px; padding: 3px 10px; }
.gp .bar .in { padding: 0 24px 22px; }
</style>
