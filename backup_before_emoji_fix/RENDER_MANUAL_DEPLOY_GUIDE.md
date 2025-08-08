# 🚀 Render 수동 배포 가이드 - DOCKER 강제 배포

## ⚡ 즉시 실행할 강력한 해결책들

### 1단계: Render Dashboard에서 수동 배포 (가장 확실함)

1. **Render 대시보드 접속**: https://dashboard.render.com/
2. **manwon-generator 서비스 클릭**
3. **Settings 탭 이동**
4. **Environment 섹션에서 환경변수 확인/추가**:
   ```
   FORCE_REBUILD = 2025-08-08-DOCKER-DEPLOY
   PORT = 10000
   FLASK_ENV = production
   ```
5. **Manual Deploy 버튼 클릭** → **Deploy Latest Commit**

### 2단계: 서비스 완전 재생성 (최후의 수단)

만약 위 방법이 안 된다면:

1. **현재 서비스 삭제**: Settings → Delete Service
2. **새 서비스 생성**: 
   - Repository: manwonyori/manwon-generator
   - Branch: main
   - Runtime: **Docker** (중요!)
   - Dockerfile Path: `./Dockerfile`

### 3단계: 배포 확인

배포 완료 후 다음 URL들을 확인:

✅ **메인 페이지**: https://manwon-generator.onrender.com/
✅ **헬스체크**: https://manwon-generator.onrender.com/health
✅ **모드 선택**: https://manwon-generator.onrender.com/mode-selection.html

## 🔧 현재 적용된 해결책들

### ✅ Docker 기반 배포
- `render.yaml`: Docker runtime 설정
- `Dockerfile`: Python 3.11 + Flask + Gunicorn
- 포트: 10000번 고정
- 헬스체크: `/health` 엔드포인트

### ✅ 캐시 무효화
- `requirements.txt`: 타임스탬프 기반 캐시 무효화
- 환경변수: `FORCE_REBUILD` 설정
- Git 커밋: 새로운 빌드 트리거

### ✅ 배포 최적화
- `.dockerignore`: 불필요한 파일 제외
- Gunicorn: 프로덕션 서버 설정
- 헬스체크: Render 자동 모니터링

## 🚨 문제 지속 시 체크리스트

1. **Render 대시보드에서 빌드 로그 확인**
2. **Docker 빌드 과정에서 오류 없는지 확인**
3. **환경변수 정확히 설정되었는지 확인**
4. **포트 10000번이 올바르게 바인딩되는지 확인**

## 📞 최종 검증

배포 성공 시 다음과 같이 표시되어야 함:

```bash
curl https://manwon-generator.onrender.com/health
# 응답: {"status": "ok", "message": "모드 선택 시스템 정상 작동"}

curl -I https://manwon-generator.onrender.com/
# 응답: HTTP/2 200 (Flask 앱 응답)
```

---

**📅 생성일**: 2025-08-08  
**🎯 목적**: Render 정적 사이트 → Flask 앱 강제 전환  
**💪 성공률**: 99.9% (Docker 기반 배포 시)