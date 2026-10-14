<template>
  <view class="xj qz">
    <xj-bar title="灵魂鉴定" back center grad />
    <view class="sub">5题测试，找到真实的你</view>

    <block v-if="!result">
      <view class="step">{{ i + 1 }}/5</view>
      <view class="qq">{{ cur.q }}</view>
      <view class="grid">
        <view v-for="(o, n) in cur.o" :key="n" class="op" :class="{ on: sel === n }" @click="sel = n">
          <image class="oi" :src="o.img" mode="aspectFill" />
          <view class="ot">{{ L[n] }}. {{ o.t }}</view>
          <view class="os ell">{{ o.s }}</view>
          <view v-if="sel === n" class="tick"><view class="ic ic-check" style="width:13px;height:13px" /></view>
        </view>
      </view>
      <view class="pad" />
      <view class="bar"><view class="in"><view class="btn gd" @click="next">{{ i === 4 ? '查看我的灵魂画像' : '下一题' }}</view></view></view>
    </block>

    <view v-else class="res">
      <image class="rl" src="/static/logo.svg" mode="aspectFit" />
      <view class="rk">你的灵魂画像</view>
      <view class="rn gdtx">{{ result.n }}</view>
      <view class="rd">{{ result.d }}</view>
      <view class="rt">匹配标签 · {{ result.tag }}</view>
      <view class="rgrid">
        <view class="rc" v-for="(c, n) in counts" :key="n">
          <text class="cv">{{ c }}</text>
          <text class="cl">{{ L[n] }} 型</text>
        </view>
      </view>
      <view class="btn gd" style="width:78%;margin:26px auto 0" @click="done">进入心界</view>
    </view>
  </view>
</template>

<script>
import { QUIZ, SOULS } from '@/common/data.js';
import { S, save, toast } from '@/common/store.js';
export default {
  data() {
    return { L: ['A', 'B', 'C', 'D'], i: 0, sel: -1, picks: [], result: null };
  },
  computed: {
    cur() {
      return QUIZ[this.i];
    },
    counts() {
      const c = [0, 0, 0, 0];
      this.picks.forEach((p) => c[p]++);
      return c;
    }
  },
  methods: {
    next() {
      if (this.sel < 0) return toast('先选一个答案');
      this.picks.push(this.sel);
      if (this.i < 4) {
        this.i++;
        this.sel = -1;
        return;
      }
      const c = [0, 0, 0, 0];
      this.picks.forEach((p) => c[p]++);
      let best = 0;
      c.forEach((v, n) => {
        if (v > c[best]) best = n;
      });
      this.result = SOULS[best];
      S.quiz = this.result;
      save();
    },
    done() {
      uni.reLaunch({ url: '/pages/home/home' });
    }
  }
};
</script>

<style>
.qz { padding-bottom: 90px; }
.qz .sub { text-align: center; font-size: 12.5px; color: #9E9C98; margin-top: 2px; }
.qz .step { padding: 18px 20px 6px; font-size: 12.5px; color: #8A877F; letter-spacing: 1px; }
.qz .qq { padding: 0 20px 16px; font-size: 19px; font-weight: 600; letter-spacing: .5px; }
.qz .grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 16px; }
.qz .op {
  width: calc(50% - 6px); background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; overflow: hidden; position: relative; padding-bottom: 10px;
}
.qz .op.on { border-color: #E8CE9F; box-shadow: 0 0 0 1px #E8CE9F, 0 8px 22px rgba(232, 206, 159, .3); }
.qz .oi { width: 100%; height: 96px; }
.qz .ot { font-size: 13px; font-weight: 700; padding: 9px 10px 0; }
.qz .os { font-size: 11px; color: #8A877F; padding: 3px 10px 0; }
.qz .tick {
  position: absolute; right: 8px; top: 8px; width: 20px; height: 20px; border-radius: 50%;
  background: linear-gradient(135deg, #E8CE9F, #B9905A); display: flex; align-items: center; justify-content: center;
}
.qz .pad { height: 30px; }
.qz .bar .in { padding: 0 24px 22px; }
.qz .res { padding: 24px 24px 0; display: flex; flex-direction: column; align-items: center; }
.qz .rl { width: 92px; height: 92px; margin-top: 6vh; filter: drop-shadow(0 6px 20px rgba(232, 206, 159, 0.35)); }
.qz .rk { margin-top: 18px; font-size: 12.5px; color: #9E9C98; letter-spacing: 3px; }
.qz .rn { margin-top: 6px; font-size: 27px; font-weight: 500; letter-spacing: 1px; }
.qz .rd { margin-top: 14px; font-size: 13.5px; line-height: 1.9; color: #9E9C98; text-align: center; }
.qz .rt { margin-top: 16px; font-size: 12px; color: #E8CE9F; background: rgba(232, 206, 159, .14); border: 1px solid rgba(232, 206, 159, .35); padding: 5px 14px; border-radius: 999px; }
.qz .rgrid { margin-top: 26px; width: 100%; display: flex; gap: 10px; }
.qz .rc { flex: 1; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.qz .cv { font-size: 18px; font-weight: 600; }
.qz .cl { font-size: 11px; color: #8A877F; }
</style>
