@echo off
chcp 65001
echo ========================================
echo    SuperClaude
echo ========================================
echo.

echo [1/5] Git  ...
git status

echo.
echo [2/5]   ...
git add .

echo.
echo [3/5]  ...
git commit -m "SuperClaude : Flask  , Docker curl  , Render   "

echo.
echo [4/5] GitHub ...
git push origin main

echo.
echo [5/5] Render 재 ...
echo 가 되면  URL서 하세요:
echo https://manwon-generator.onrender.com/
echo https://manwon-generator.onrender.com/health

echo.
echo ========================================
echo     ! 3-5
echo ========================================
pause