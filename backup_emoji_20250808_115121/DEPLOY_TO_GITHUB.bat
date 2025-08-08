@echo off
chcp 65001
echo.
echo ========================================
echo   GitHub
echo   Docker  Render
echo ========================================
echo.

cd /d "C:\Users\8899y\Documents\Projects\01\manwon-generator"

echo [1/6]  Git  ...
git status

echo.
echo [2/6]   ...
git add .

echo.
echo [3/6]  ...
git commit -m "feat: Docker

- render.yaml: Docker runtime
- Dockerfile:  Python 3.11
-  : FORCE_REBUILD
- : /health
-  : 10000

 Render
 Flask

 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo.
echo [4/6]   ...
git push origin main

echo.
echo [5/6]    (30 )...
timeout /t 30

echo.
echo [6/6]  ...
echo  URL: https://manwon-generator.onrender.com/
echo : https://manwon-generator.onrender.com/health

echo.
echo ========================================
echo    ! Render
echo ========================================
echo.
pause