# 만원요리 생성기 - SuperClaude 최적화 Docker 설정
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 curl 설치 (헬스체크용)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일 복사
COPY . .

# 포트 노출 (환경변수 기반)
EXPOSE ${PORT:-10000}

# 헬스체크 설정 - curl이 설치되었으므로 작동
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-10000}/health || exit 1

# 환경변수 기본값 설정
ENV PORT=10000
ENV FLASK_ENV=production

# 실행 명령어 - 환경변수 기반 포트 사용
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --workers 1 --timeout 120 --access-logfile - --error-logfile - app:app"]