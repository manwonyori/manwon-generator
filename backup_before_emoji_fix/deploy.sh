#!/bin/bash

echo "==========================================
   만원요리 상세페이지 생성기 배포 스크립트
==========================================
"

# Git 초기화 확인
if [ ! -d ".git" ]; then
    echo "Git 저장소 초기화 중..."
    git init
    git add .
    git commit -m "Initial commit: 만원요리 상세페이지 생성기 듀얼 모드"
fi

# GitHub 저장소 생성 및 연결
echo "GitHub 저장소 설정 중..."
REPO_NAME="manwon-generator"
GITHUB_USER="manwonyori"

# 원격 저장소 확인
if ! git remote | grep -q "origin"; then
    echo "GitHub 원격 저장소 추가 중..."
    git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
else
    echo "기존 원격 저장소 사용"
fi

# 변경사항 커밋
echo "변경사항 커밋 중..."
git add .
git commit -m "feat: 상세 입력 모드 추가 및 Render 배포 설정

- 듀얼 모드 시스템 구현 (AI 자동 생성 + 상세 입력)
- Flask 서버 구성 추가
- Render 배포 설정 완료
- 실시간 미리보기 기능
- AI 보조 기능 통합"

# GitHub에 푸시
echo "GitHub에 푸시 중..."
git branch -M main
git push -u origin main

echo "
==========================================
✅ GitHub 업로드 완료!

다음 단계:
1. https://github.com/$GITHUB_USER/$REPO_NAME 접속
2. 저장소가 생성되지 않았다면 GitHub에서 수동으로 생성
3. Render.com 접속
4. New > Web Service 선택
5. GitHub 저장소 연결
6. 자동 배포 시작

배포 URL: https://manwon-generator.onrender.com
==========================================
"