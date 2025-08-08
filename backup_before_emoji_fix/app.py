#!/usr/bin/env python3
"""
만원요리 상세페이지 생성기 - 완전 간단 버전
모드 선택 시스템이 내장된 Flask 앱
SuperClaude 최적화 버전
"""
from flask import Flask, send_from_directory, jsonify, abort
import os
import logging

app = Flask(__name__)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """메인 페이지 - 모드 선택 시스템 내장"""
    try:
        # 새로운 파일 우선순위로 서빙
        if os.path.exists('mode-selection.html'):
            logger.info("Serving mode-selection.html")
            return send_from_directory('.', 'mode-selection.html')
        elif os.path.exists('home.html'):
            logger.info("Serving home.html")
            return send_from_directory('.', 'home.html')
        elif os.path.exists('index.html'):
            logger.info("Serving index.html")
            return send_from_directory('.', 'index.html')
        else:
            logger.error("No HTML files found")
            return jsonify({"error": "No index file found", "status": "error"}), 404
    except Exception as e:
        logger.error(f"Error serving index: {e}")
        return jsonify({"error": "Internal server error", "status": "error"}), 500

@app.route('/health')
def health():
    """헬스 체크 - Render 최적화"""
    try:
        return jsonify({
            "status": "ok", 
            "message": "모드 선택 시스템 정상 작동",
            "port": os.environ.get('PORT', '5000'),
            "files_available": {
                "mode-selection.html": os.path.exists('mode-selection.html'),
                "home.html": os.path.exists('home.html'),
                "index.html": os.path.exists('index.html')
            }
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/<path:filename>')
def serve_files(filename):
    """모든 파일 서빙 - 보안 강화"""
    try:
        # 보안: 상위 디렉토리 접근 방지
        if '..' in filename or filename.startswith('/'):
            logger.warning(f"Suspicious file access attempt: {filename}")
            abort(404)
        
        # 파일 존재 확인
        if not os.path.exists(filename):
            logger.warning(f"File not found: {filename}")
            abort(404)
        
        logger.info(f"Serving file: {filename}")
        return send_from_directory('.', filename)
    except Exception as e:
        logger.error(f"Error serving file {filename}: {e}")
        abort(500)

if __name__ == '__main__':
    # Render에서 제공하는 PORT 환경변수 사용
    port = int(os.environ.get('PORT', 5000))
    print(f"""
========================================
  만원요리 상세페이지 생성기 - 완성
========================================
포트: {port}
모드 선택 시스템: 활성화
URL: http://0.0.0.0:{port}
========================================
    """)
    app.run(host='0.0.0.0', port=port, debug=False)