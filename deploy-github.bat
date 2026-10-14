@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   心界 - 推送到 GitHub
echo ============================================
echo.

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin https://github.com/sleep52/xinjie.git
)
git remote -v
echo.

echo 正在推送，稍后会弹出一个浏览器窗口让你登录 GitHub。
echo 登录时请选 sleep52 这个账号，授权后回到本窗口等待即可。
echo.
git push -u origin main

echo.
echo ============================================
if errorlevel 1 (
  echo 推送失败。请把上面红字部分截图或复制发给我。
) else (
  echo 推送成功！接下来去设置 Pages：
  echo   1. 打开 https://github.com/sleep52/xinjie/settings/pages
  echo   2. Source 选 Deploy from a branch
  echo   3. Branch 选 main，文件夹选 /(docs)，点 Save
  echo   4. 等 1-2 分钟，地址会是
  echo      https://sleep52.github.io/xinjie/
)
echo ============================================
pause
