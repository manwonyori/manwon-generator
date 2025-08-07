# 🚀 Render 배포 가이드

## 📋 배포 단계

### 1. Render.com 접속
- https://render.com 접속
- 계정이 없다면 회원가입 (GitHub 계정으로 가능)

### 2. 새 웹 서비스 생성
1. Dashboard에서 **"New +"** 버튼 클릭
2. **"Web Service"** 선택

### 3. GitHub 저장소 연결
1. **"Build and deploy from a Git repository"** 선택
2. **"Connect GitHub"** 클릭
3. GitHub 권한 부여
4. **manwonyori/manwon-generator** 저장소 선택
5. **"Connect"** 클릭

### 4. 서비스 설정
다음 설정을 확인/입력:

- **Name**: `manwon-generator`
- **Region**: Singapore (아시아)
- **Branch**: main
- **Root Directory**: (비워둠)
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`

### 5. 환경 변수 설정 (선택사항)
필요한 경우 다음 환경 변수 추가:
- `PYTHON_VERSION`: 3.11.0
- `PORT`: 10000

### 6. 플랜 선택
- **Free** 플랜 선택 (무료)
- 월 750시간 무료 제공

### 7. 배포 시작
- **"Create Web Service"** 클릭
- 자동으로 빌드 및 배포 시작
- 약 3-5분 소요

## 🔗 배포 완료 후

### 접속 URL
```
https://manwon-generator.onrender.com
```

### 상태 확인
- Render Dashboard에서 배포 상태 모니터링
- "Live" 표시가 나타나면 배포 완료

### 자동 배포
- GitHub main 브랜치에 푸시하면 자동 재배포
- 약 3-5분 내 변경사항 반영

## ⚠️ 주의사항

### 무료 플랜 제한
- 15분 동안 요청이 없으면 서버 슬립 모드
- 첫 요청 시 10-30초 정도 지연 발생
- 월 750시간 무료 사용

### 문제 해결

#### 배포 실패 시
1. Render Dashboard > Logs 확인
2. Build logs에서 오류 메시지 확인
3. 주요 체크 포인트:
   - requirements.txt 파일 존재 여부
   - Python 버전 호환성
   - 포트 설정 확인

#### 서버 오류 시
1. Health check: https://manwon-generator.onrender.com/health
2. 로그 확인
3. GitHub 저장소 파일 확인

## 📱 사용 방법

### 1. 모드 선택
- AI 자동 생성 모드
- 상세 정보 입력 모드

### 2. API 키 설정 (선택)
- OpenAI 또는 Claude API 키 입력
- 브라우저에 안전하게 저장

### 3. 상세페이지 생성
- 제품 정보 입력
- 생성 버튼 클릭
- HTML 파일 다운로드

## 🔧 업데이트 방법

```bash
# 1. 로컬에서 수정
cd C:\Users\8899y\Documents\Projects\01\manwon-generator

# 2. 테스트
python test_local.py

# 3. 커밋 및 푸시
git add .
git commit -m "update: 기능 개선"
git push origin main

# 4. Render에서 자동 배포 (3-5분)
```

## 📞 지원

문제가 있으시면 GitHub Issues에 등록해주세요:
https://github.com/manwonyori/manwon-generator/issues