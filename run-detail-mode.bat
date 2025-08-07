@echo off
chcp 65001 > nul
title 만원요리 상세페이지 생성기 - 상세 입력 모드

echo.
echo ================================================
echo     만원요리 상세페이지 생성기 실행
echo     상세 입력 모드
echo ================================================
echo.

echo 브라우저에서 상세 입력 모드를 실행합니다...
echo.

cd /d "%~dp0"
start "" "mode-selector.html"

echo.
echo 실행이 완료되었습니다.
echo 브라우저가 자동으로 열리지 않으면
echo mode-selector.html 파일을 직접 열어주세요.
echo.
echo 종료하려면 아무 키나 누르세요...
pause > nul