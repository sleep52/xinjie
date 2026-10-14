# 心界 · uni-app 版

按设计稿 1:1 还原的「心界」App（短剧 · 社交 · 直播 · AI头像 · 区块链），用 uni-app Vue3 + Vite 写的 H5 项目。
旧的单文件版本在 `D:\games\xinjie`，没有删，两版并存。

## 跑起来

```bash
cd D:\games\xinjie-uniapp
npm install        # 已经装过了，重装才需要
npm run dev:h5     # 开发：http://127.0.0.1:5199
npm run build:h5   # 打包：产物在 dist/build/h5，1.4MB
```

打包后**不能**直接双击 `index.html` 看（浏览器不允许 file:// 加载 ES 模块，会白屏）。
起个本地服务器看打包版：

```bash
node _tools/serve.js        # 然后打开 http://127.0.0.1:4173
```

要挂到服务器上就把 `dist/build/h5` 整个目录丢进去，路由是 hash 模式，不需要服务端配合改写。

## 目录

```
src/
  pages.json      17 个页面 + 全局样式（navigationStyle 全部 custom，状态栏自己画）
  manifest.json   H5 标题 / 主题色 / hash 路由 / 端口
  common/
    store.js      唯一的响应式状态 + localStorage 存档（键 xinjie.uni.v1）
    data.js       设计稿里的剧名、问题、群组、商品、文案，全部照抄
    theme.css     颜色变量 + 45 个图标（内联 SVG）+ 按钮/卡片/胶囊等公共样式
  components/
    xj-bar/       假状态栏 + 导航栏
    tab-bar/      底部悬浮导航（首页/短剧/+/消息/我的）
  pages/          17 个页面，一屏一个目录
  static/         logo、11 张配图、3 段演示视频
_tools/
  shot.js         用本机 Edge 无头模式截图，做视觉验收
  t1_login.js ~ t5b_read.js  功能回归脚本（喂给 shot.js --drive 用）
_验证截图/        每个页面的截图，和设计稿对过
```

## 哪些是真的，哪些是演示

真的能用的部分：

- 手机号登录（本机校验格式，验证码任意 6 位，不发短信）
- 灵魂鉴定 5 题 → 灵魂画像
- 短剧播放：真视频、进度条拖动、倍速、选集、上下滑切集、点赞收藏
- 看本机里的剧：选本地文件夹或贴视频链接，按文件名自动分集（只有 H5 有这功能）
- 看到第几集会自动记住，下次进来接着播
- 钻石余额、买头像、送礼物、充值、发瞬间、聊天，全部写进本机 localStorage，刷新不丢
- 买完头像会生成一张链上确权证书

演示性质、没有真接后端的：

- 微信 / Apple ID 登录（点了直接进）
- 直播间、弹幕、礼物（本地模拟）
- 区块链证书：数据由本机生成，**没有写入任何公链**，证书页底部有说明
- 腾讯区块链只是设计稿上的文案，没有合作关系

## 隐私

导入本机短剧时，文件只在本机用 `URL.createObjectURL` 读，不上传、不联网。
所有存档都在浏览器自己的 localStorage 里，清浏览器数据就没了。

## 截图验收

```bash
node _tools/shot.js _验证截图/home.png "http://127.0.0.1:5199/#/pages/home/home"
node _tools/shot.js _验证截图/t.png "http://127.0.0.1:5199/#/pages/login/login" --drive _tools/t1_login.js
```

## 已知没做的

- 微信小程序端能编译，但没在真机/开发者工具里验过
- 没有后端，多人互动都是本地假数据
- 分类「古风」暂时没有剧，会显示空状态
