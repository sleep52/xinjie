<template>
  <view class="xj dm">
    <xj-bar title="短剧" center />
    <view class="srch">
      <view class="box"><view class="ic ic-search s18" /><input class="in" v-model="kw" placeholder="搜索剧名 / 演员 / 话题" placeholder-class="ph" /></view>
    </view>
    <scroll-view class="cats" scroll-x :show-scrollbar="false">
      <view class="crow">
        <view v-for="c in cats" :key="c" class="chip" :class="{ on: c === cat }" @click="cat = c">{{ c }}</view>
      </view>
    </scroll-view>

    <view class="sec"><text class="h">{{ cat === '全部' ? '热播短剧' : cat }}</text><text class="m">{{ list.length }} 部</text></view>
    <view class="grid">
      <view class="rp" v-for="d in list" :key="d.id" @click="play(d)">
        <image class="ri" :src="d.img" mode="aspectFill" />
        <view class="rg" />
        <view v-if="d.tag" class="bge">{{ d.tag }}</view>
        <view class="pl"><view class="ic ic-play s12" /><text>{{ wan(d.plays) }}</text></view>
        <view class="rt ell2">{{ d.t }}</view>
        <view class="rs ell">{{ d.sub || (d.eps.length + ' 集') }}</view>
      </view>
    </view>
    <view v-if="!list.length" class="emp">这个分类暂时没有剧，换个标签看看</view>

    <view class="sec"><text class="h">看本机里的剧</text><text class="m">仅存在这台设备</text></view>
    <view class="imp">
      <view class="ib" @click="pickDir"><view class="ic ic-fold s20" /><text>选择文件夹</text></view>
      <view class="ib" @click="link = !link"><view class="ic ic-link s20" /><text>贴视频链接</text></view>
    </view>
    <view v-if="link" class="lrow">
      <input class="lin" v-model="url" placeholder="https://…/demo.mp4" placeholder-class="ph" />
      <view class="lbtn" @click="addUrl">添加</view>
    </view>
    <view class="hint">{{ hint }}</view>
    <view class="mine">
      <view v-for="(d, n) in S.lib" :key="d.id" class="mr">
        <view class="mf1" @click="playLocal(n)">
          <view class="mt ell">{{ d.t }}</view>
          <view class="ms">{{ d.eps.length }} 集{{ d.stale ? ' · 需重新选择文件夹' : '' }}</view>
        </view>
        <view class="md" @click="del(n)">删除</view>
      </view>
      <view v-if="!S.lib.length" class="mr empty">还没有导入本机短剧</view>
    </view>
    <view style="height:88px" />
    <tab-bar cur="drama" />
  </view>
</template>

<script>
import { DRAMAS, CATS } from '@/common/data.js';
import { S, save, go, toast, wan, parseFile } from '@/common/store.js';
export default {
  data() {
    return { S, kw: '', cat: '全部', cats: ['推荐', '热播'].concat(CATS), link: false, url: '', hint: '支持 .mp4 / .mov / .m4v，按文件名自动分集' };
  },
  computed: {
    list() {
      const k = this.kw.trim();
      return DRAMAS.filter((d) => {
        if (k && d.t.indexOf(k) < 0 && (d.sub || '').indexOf(k) < 0 && (d.cat || []).join(' ').indexOf(k) < 0) return false;
        if (this.cat === '全部' || this.cat === '推荐') return true;
        if (this.cat === '热播') return d.tag === '热播' || d.plays >= 80000;
        return (d.cat || []).indexOf(this.cat) >= 0;
      });
    }
  },
  methods: {
    wan,
    play(d) {
      go('/pages/player/player?id=' + d.id);
    },
    playLocal(n) {
      const d = S.lib[n];
      if (d.stale) return toast('刷新页面后浏览器会失去本地文件权限，请重新选择文件夹');
      go('/pages/player/player?loc=' + n);
    },
    del(n) {
      S.lib.splice(n, 1);
      save();
    },
    addUrl() {
      const u = this.url.trim();
      if (!/^https?:\/\/.+/i.test(u)) return toast('请输入 http(s) 视频链接');
      const f = u.split('/').pop().split('?')[0] || 'video.mp4';
      const p = parseFile(decodeURIComponent(f));
      const d = { id: 'u' + Date.now(), t: p.drama, img: '/static/p-b.jpg', eps: [{ t: p.drama, u }] };
      S.lib.unshift(d);
      this.url = '';
      save();
      toast('已加入：' + p.drama);
    },
    pickDir() {
      // #ifdef H5
      const i = document.createElement('input');
      i.type = 'file';
      i.accept = 'video/*';
      i.multiple = true;
      i.setAttribute('webkitdirectory', '');
      i.directory = '';
      i.style.display = 'none';
      i.onchange = () => {
        const fs = Array.from(i.files || []).filter((f) => /\.(mp4|m4v|mov|webm)$/i.test(f.name));
        i.remove();
        if (!fs.length) return (this.hint = '这个文件夹里没有 mp4 / mov 视频');
        const map = {};
        fs.forEach((f) => {
          const rel = f.webkitRelativePath || f.name;
          const folder = rel.indexOf('/') >= 0 ? rel.split('/')[0] : '';
          const p = parseFile(f.name);
          const name = p.drama.length > 2 ? p.drama : folder || p.drama;
          const d = (map[name] = map[name] || { id: 'f' + Math.random().toString(36).slice(2, 8), t: name, img: '/static/p-b.jpg', eps: [] });
          d.eps.push({ t: p.ep ? '第' + p.ep + '集' : f.name.replace(/\.[^.]+$/, ''), u: URL.createObjectURL(f), ep: p.ep });
        });
        Object.keys(map).forEach((k) => {
          const d = map[k];
          d.eps.sort((a, b) => (a.ep || 0) - (b.ep || 0));
          S.lib.unshift(d);
        });
        this.hint = '已导入 ' + Object.keys(map).length + ' 部 · ' + fs.length + ' 个视频（刷新后需重新选择）';
        save();
      };
      document.body.appendChild(i);
      i.click();
      // #endif
      // #ifndef H5
      toast('小程序/App 端请用「贴视频链接」导入');
      // #endif
    }
  }
};
</script>

<style>
.dm .srch { padding: 2px 16px 10px; }
.dm .box { height: 38px; border-radius: 999px; background: rgba(255, 255, 255, .07); border: 1px solid var(--line); display: flex; align-items: center; gap: 8px; padding: 0 14px; }
.dm .in { flex: 1; font-size: 13.5px; color: #fff; }
.dm .ph { color: #63625F; }
.dm .cats { white-space: nowrap; }
.dm .crow { display: flex; gap: 9px; padding: 0 16px 4px; }
.dm .grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 16px; }
.dm .rp { width: calc(50% - 6px); position: relative; }
.dm .ri { width: 100%; height: 168px; border-radius: 12px; }
.dm .rg { position: absolute; left: 0; top: 0; width: 100%; height: 168px; border-radius: 12px; background: linear-gradient(180deg, rgba(0, 0, 0, .1) 55%, rgba(0, 0, 0, .6)); }
.dm .bge { position: absolute; left: 8px; top: 8px; font-size: 10px; padding: 2px 7px; border-radius: 4px; background: rgba(10, 10, 11, .55); backdrop-filter: blur(8px); border: 1px solid rgba(232, 206, 159, .3); color: #E8CE9F; font-weight: 600; letter-spacing: .6px; }
.dm .pl { position: absolute; right: 8px; top: 148px; display: flex; align-items: center; gap: 3px; font-size: 10.5px; text-shadow: 0 1px 4px rgba(0, 0, 0, .7); }
.dm .rt { margin-top: 8px; font-size: 13.5px; font-weight: 700; line-height: 1.35; }
.dm .rs { margin-top: 2px; font-size: 11px; color: #8A877F; }
.dm .emp { padding: 26px 16px; text-align: center; color: #63625F; font-size: 12.5px; }
.dm .imp { display: flex; gap: 12px; padding: 0 16px; }
.dm .ib {
  flex: 1; height: 46px; border-radius: 14px; background: rgba(232, 206, 159, .12);
  border: 1px dashed rgba(232, 206, 159, .45); display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 13px; color: #E8CE9F;
}
.dm .lrow { display: flex; gap: 10px; padding: 12px 16px 0; }
.dm .lin { flex: 1; height: 38px; border-radius: 999px; background: rgba(255, 255, 255, .07); border: 1px solid var(--line); padding: 0 14px; font-size: 13px; color: #fff; }
.dm .lbtn { width: 68px; height: 38px; border-radius: 999px; background: var(--grad); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
.dm .hint { padding: 10px 16px 12px; font-size: 11.5px; color: #63625F; }
.dm .mine { padding: 0 16px; }
.dm .mr { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--card); border: 1px solid var(--line); border-radius: 14px; margin-bottom: 10px; }
.dm .mr.empty { color: #63625F; font-size: 12.5px; justify-content: center; }
.dm .mf1 { flex: 1; min-width: 0; }
.dm .mt { font-size: 13.5px; font-weight: 700; }
.dm .ms { font-size: 11px; color: #8A877F; margin-top: 2px; }
.dm .md { font-size: 12px; color: #C98070; padding-left: 10px; }
</style>
