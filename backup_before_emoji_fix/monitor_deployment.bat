@echo off
chcp 65001 > nul
title Render 배포 모니터링

echo.
echo ==========================================
echo    Render 배포 모니터링
echo ==========================================
echo.
echo Render.com에서 Web Service를 생성하셨나요?
echo.
echo 아직이라면:
echo 1. https://render.com 접속
echo 2. New + → Web Service
echo 3. GitHub 저장소 연결: manwonyori/manwon-generator
echo 4. Create Web Service 클릭
echo.
echo 이미 생성했다면 Enter를 눌러 상태 확인...
pause > nul

:check
cls
echo.
echo 배포 상태 확인 중...
echo.

curl -s -o nul -w "HTTP Status: %%{http_code}\n" https://manwon-generator.onrender.com/health

echo.
echo 200이 나오면 배포 성공!
echo 404나 000이 나오면 아직 배포 중...
echo.
echo 다시 확인하려면 Enter, 종료는 Ctrl+C
pause > nul
goto check