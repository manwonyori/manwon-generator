@echo off
chcp 65001 > nul
title 만원요리 상세페이지 생성기 - Render 배포

echo.
echo ==========================================
echo    만원요리 상세페이지 생성기 배포
echo ==========================================
echo.

cd /d "%~dp0"

echo 1. Git 저장소 확인 중...
if not exist ".git" (
    echo Git 저장소 초기화...
    git init
)

echo.
echo 2. 파일 추가 중...
git add .

echo.
echo 3. 커밋 생성 중...
git commit -m "feat: 상세 입력 모드 추가 및 Render 배포 설정"

echo.
echo 4. GitHub 원격 저장소 설정...
git remote remove origin 2>nul
git remote add origin https://github.com/manwonyori/manwon-generator.git

echo.
echo 5. main 브랜치로 변경...
git branch -M main

echo.
echo 6. GitHub에 푸시 중...
git push -u origin main

echo.
echo ==========================================
echo [성공] 배포 준비 완료!
echo.
echo 다음 단계:
echo 1. https://github.com/manwonyori/manwon-generator 확인
echo 2. Render.com 접속
echo 3. New Web Service 생성
echo 4. GitHub 저장소 연결
echo 5. 자동 배포 시작
echo.
echo 예상 URL: https://manwon-generator.onrender.com
echo ==========================================
echo.
pause