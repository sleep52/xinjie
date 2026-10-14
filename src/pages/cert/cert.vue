<template>
  <view class="xj cc">
    <xj-bar title="区块链确权证书" back center />
    <view class="card">
      <view class="hd">
        <view class="mark"><view class="hex" /><view class="hex2" /></view>
        <view class="f1">
          <view class="hn">腾讯区块链</view>
          <view class="he">Tencent Blockchain</view>
        </view>
        <view class="ok">已确权</view>
      </view>
      <view class="in">
        <view class="rw" v-for="r in rows" :key="r.k">
          <text class="k">{{ r.k }}</text>
          <text class="v">{{ r.v }}</text>
        </view>
        <image class="qr" :src="qr" mode="aspectFit" />
        <view class="qt">扫码查看链上信息</view>
      </view>
    </view>
    <view class="sup"><view class="mark sm"><view class="hex" /><view class="hex2" /></view><text>腾讯区块链技术支持</text></view>
    <view class="tip">演示说明：本页数据由本机生成，未真正写入任何公链。</view>
  </view>
</template>

<script>
import { S } from '@/common/store.js';
export default {
  data() {
    return { c: null };
  },
  onLoad(q) {
    const found = q.id ? S.certs.find((x) => x.id === q.id) : null;
    this.c = found || S.certs[+q.i || 0] || {
      name: '星河之境',
      token: '1234567890',
      total: 10000,
      owner: '0x8f3a…2c7e',
      block: '#28675321',
      time: '2026-09-09 12:34:56'
    };
  },
  computed: {
    rows() {
      const c = this.c;
      return [
        { k: '作品名称：', v: c.name },
        { k: 'Token ID:', v: '#' + c.token },
        { k: '发行总量：', v: String(c.total) },
        { k: '持有者：', v: c.owner },
        { k: '区块高度：', v: c.block },
        { k: '确权时间：', v: c.time }
      ];
    },
    qr() {
      const n = 25;
      let h = 2166136261;
      const s = this.c.token + this.c.block;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h * 16777619) >>> 0;
      }
      const rnd = (x, y) => {
        const v = (x * 374761393 + y * 668265263 + h) >>> 0;
        return ((v ^ (v >> 13)) * 1274126177) >>> 0;
      };
      const finder = (x, y) => {
        const fx = x < 8 ? 0 : x > n - 9 ? n - 7 : -1;
        const fy = y < 8 ? 0 : y > n - 9 ? n - 7 : -1;
        if (fx < 0 || fy < 0) return null;
        const dx = x - fx - 3;
        const dy = y - fy - 3;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        return d > 3 ? 0 : d === 3 || d === 2 ? (d === 3 ? 1 : 0) : 1;
      };
      let p = '';
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const f = finder(x, y);
          const on = f === null ? rnd(x, y) % 100 < 46 : f === 1;
          if (on) p += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
      }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}"><rect width="${n}" height="${n}" fill="#fff"/><g fill="#0A0A0B">${p}</g></svg>`;
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
  }
};
</script>

<style>
.cc { padding: 6px 18px 30px; }
.cc .card { border-radius: 20px; background: linear-gradient(160deg, #18211F, #121514 55%, #141416); border: 1px solid rgba(111, 168, 152, .35); box-shadow: 0 16px 40px rgba(0, 0, 0, .5); overflow: hidden; }
.cc .hd { display: flex; align-items: center; gap: 10px; padding: 18px 18px 16px; background: radial-gradient(90% 120% at 20% 0%, rgba(111, 168, 152, .28), transparent 70%); }
.cc .mark { width: 34px; height: 34px; position: relative; flex: none; }
.cc .hex { position: absolute; left: 3px; top: 3px; width: 26px; height: 26px; background: linear-gradient(135deg, #6FA898, #E8CE9F); clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); }
.cc .hex2 { position: absolute; left: 11px; top: 11px; width: 12px; height: 12px; background: #121514; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); }
.cc .mark.sm { width: 20px; height: 20px; display: inline-block; }
.cc .mark.sm .hex { left: 1px; top: 1px; width: 18px; height: 18px; }
.cc .mark.sm .hex2 { left: 6px; top: 6px; width: 8px; height: 8px; }
.cc .hn { font-size: 16px; font-weight: 600; letter-spacing: 1px; }
.cc .he { font-size: 10.5px; color: #8FBFAF; letter-spacing: .5px; }
.cc .ok { font-size: 10.5px; color: #8FBFAF; border: 1px solid rgba(126, 231, 135, .4); background: rgba(34, 197, 94, .12); border-radius: 999px; padding: 3px 10px; }
.cc .in { margin: 0 12px 12px; background: #F2F0EB; border-radius: 14px; padding: 16px 16px 18px; color: #17120B; }
.cc .rw { display: flex; font-size: 12.5px; line-height: 2.05; }
.cc .k { color: #63625F; width: 78px; flex: none; }
.cc .v { color: #17120B; font-weight: 600; flex: 1; word-break: break-all; }
.cc .qr { display: block; width: 128px; height: 128px; margin: 14px auto 0; }
.cc .qt { text-align: center; font-size: 11px; color: #8A877F; margin-top: 8px; }
.cc .sup { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 22px; font-size: 13px; color: #9E9C98; }
.cc .tip { margin-top: 14px; text-align: center; font-size: 11px; color: #63625F; }
</style>
