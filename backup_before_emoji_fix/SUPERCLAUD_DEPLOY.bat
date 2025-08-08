@echo off
chcp 65001
echo ========================================
echo    SuperClaude 배포 자동화 시스템
echo ========================================
echo.

echo [1/5] Git 상태 확인...
git status

echo.
echo [2/5] 모든 변경사항 스테이징...
git add .

echo.
echo [3/5] 커밋 생성...
git commit -m "SuperClaude 최적화: Flask 보안 강화, Docker curl 헬스체크 수정, Render 배포 설정 완료"

echo.
echo [4/5] GitHub에 푸시...
git push origin main

echo.
echo [5/5] Render 재배포 트리거...
echo 배포가 완료되면 다음 URL에서 확인하세요:
echo https://manwon-generator.onrender.com/
echo https://manwon-generator.onrender.com/health

echo.
echo ========================================
echo    배포 완료! 3-5분 후 사이트 확인
echo ========================================
pause