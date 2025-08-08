# 🔄 Render 업데이트 가이드

## 현재 상황
- GitHub 저장소: https://github.com/manwonyori/manwon-generator ✅
- Render 서버: https://manwon-generator.onrender.com (기존 버전 실행 중)
- 새 코드: GitHub에 푸시 완료 ✅

## 🚀 Render Dashboard에서 수동 배포하기

### 1. Render Dashboard 접속
- https://dashboard.render.com 로그인

### 2. manwon-generator 서비스 찾기
- Dashboard에서 **manwon-generator** 웹 서비스 클릭

### 3. 수동 배포 실행
**방법 A: Manual Deploy**
- 서비스 페이지 상단의 **"Manual Deploy"** 버튼 클릭
- **"Deploy latest commit"** 선택

**방법 B: Settings 확인**
- Settings 탭으로 이동
- Build & Deploy 섹션 확인:
  - **Auto-Deploy**: On (자동 배포 켜기)
  - **Branch**: main
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`

### 4. 배포 로그 확인
- **Events** 또는 **Logs** 탭에서 배포 진행 상황 확인
- "Deploy live for..." 메시지가 나타나면 배포 완료

## 📊 배포 확인 명령어

```bash
# 배포 상태 단일 확인
cd C:\Users\8899y\Documents\Projects\01\manwon-generator
python check_live_deployment.py

# 5분간 자동 모니터링
python check_live_deployment.py --monitor
```

## ✅ 배포 성공 체크리스트

배포가 성공하면 다음 URL들이 모두 작동해야 합니다:

1. **Health Check**: https://manwon-generator.onrender.com/health
   - `{"status": "healthy", "service": "manwon-generator"}` 응답

2. **모드 선택**: https://manwon-generator.onrender.com/
   - 듀얼 모드 선택 화면 표시

3. **AI 모드**: https://manwon-generator.onrender.com/index.html
   - 기존 AI 자동 생성 모드

4. **상세 입력**: https://manwon-generator.onrender.com/detail-input.html
   - 새로운 상세 입력 모드

## 🔧 트러블슈팅

### 배포가 실패하는 경우
1. **Build 오류**
   - Logs에서 빌드 오류 확인
   - requirements.txt 파일 확인
   - Python 버전 호환성 확인

2. **Start 오류**
   - Start command 확인
   - PORT 환경 변수 설정 확인
   - app.py 파일 문법 오류 확인

3. **404 오류**
   - 파일 경로 확인
   - Flask 라우팅 설정 확인
   - 정적 파일 서빙 설정 확인

### 강제 재배포
1. Settings → Build & Deploy
2. **Clear build cache & deploy** 클릭
3. 캐시 삭제 후 새로 빌드

## 📱 최종 테스트

배포 완료 후 테스트 순서:
1. 모드 선택 화면 접속
2. AI 자동 생성 모드 테스트
3. 상세 입력 모드 테스트
4. 각 모드에서 상세페이지 생성
5. HTML 파일 다운로드 확인

## 🎯 예상 소요 시간
- 자동 배포: 3-5분
- 수동 배포: 2-3분
- 캐시 삭제 후 재배포: 5-7분

## 📞 지원
문제가 지속되면:
1. Render Support 문의
2. GitHub Issues 등록
3. 로컬 테스트로 코드 검증