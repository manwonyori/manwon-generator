@echo off
chcp 65001 > nul
title Render

echo.
echo ==========================================
echo    Render
echo ==========================================
echo.
echo Render.com Web Service ?
echo.
echo :
echo 1. https://render.com
echo 2. New + → Web Service
echo 3. GitHub  : manwonyori/manwon-generator
echo 4. Create Web Service
echo.
echo   Enter   ...
pause > nul

:check
cls
echo.
echo    ...
echo.

curl -s -o nul -w "HTTP Status: %%{http_code}\n" https://manwon-generator.onrender.com/health

echo.
echo 200   !
echo 404 000    ...
echo.
echo   Enter,  Ctrl+C
pause > nul
goto check