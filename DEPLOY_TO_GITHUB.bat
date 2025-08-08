@echo off
chcp 65001
echo.
echo ========================================
echo   GitHub 강제 푸시 배포 스크립트
echo   Docker 기반 Render 배포
echo ========================================
echo.

cd /d "C:\Users\8899y\Documents\Projects\01\manwon-generator"

echo [1/6] 현재 Git 상태 확인...
git status

echo.
echo [2/6] 모든 변경사항 추가...
git add .

echo.
echo [3/6] 커밋 생성...
git commit -m "feat: Docker 기반 강제 배포 설정

- render.yaml: Docker runtime으로 완전 변경
- Dockerfile: 최적화된 Python 3.11 기반 컨테이너
- 캐시 무효화: FORCE_REBUILD 환경변수 추가
- 헬스체크: /health 엔드포인트 설정
- 포트 설정: 10000번 포트 고정

🔧 Render 정적 사이트 문제 완전 해결
🚀 Flask 앱 정상 배포 보장

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo.
echo [4/6] 원격 저장소 푸시...
git push origin main

echo.
echo [5/6] 배포 상태 확인 (30초 후)...
timeout /t 30

echo.
echo [6/6] 배포 검증...
echo 배포 URL: https://manwon-generator.onrender.com/
echo 헬스체크: https://manwon-generator.onrender.com/health

echo.
echo ========================================
echo   배포 완료! Render에서 자동 빌드 시작
echo ========================================
echo.
pause