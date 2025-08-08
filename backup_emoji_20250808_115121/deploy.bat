@echo off
chcp 65001 > nul
title    - Render

echo.
echo ==========================================
echo
echo ==========================================
echo.

cd /d "%~dp0"

echo 1. Git   ...
if not exist ".git" (
    echo Git  ...
    git init
)

echo.
echo 2.   ...
git add .

echo.
echo 3.   ...
git commit -m "feat:      Render  "

echo.
echo 4. GitHub   ...
git remote remove origin 2>nul
git remote add origin https://github.com/manwonyori/manwon-generator.git

echo.
echo 5. main  ...
git branch -M main

echo.
echo 6. GitHub  ...
git push -u origin main

echo.
echo ==========================================
echo []   !
echo.
echo  :
echo 1. https://github.com/manwonyori/manwon-generator
echo 2. Render.com
echo 3. New Web Service
echo 4. GitHub
echo 5.
echo.
echo  URL: https://manwon-generator.onrender.com
echo ==========================================
echo.
pause