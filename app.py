#!/usr/bin/env python3
"""
만원요리 상세페이지 생성기 - 완전 간단 버전
모드 선택 시스템이 내장된 Flask 앱
"""
from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    """메인 페이지 - 모드 선택 시스템 내장"""
    # 새로운 파일 우선순위로 서빙
    import os
    if os.path.exists('mode-selection.html'):
        return send_from_directory('.', 'mode-selection.html')
    elif os.path.exists('home.html'):
        return send_from_directory('.', 'home.html')
    return send_from_directory('.', 'index.html')

@app.route('/health')
def health():
    """헬스 체크"""
    return jsonify({"status": "ok", "message": "모드 선택 시스템 정상 작동"})

@app.route('/<path:filename>')
def serve_files(filename):
    """모든 파일 서빙"""
    return send_from_directory('.', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    print(f"""
========================================
  만원요리 상세페이지 생성기 - 완성
========================================
포트: {port}
모드 선택 시스템: 활성화
URL: http://localhost:{port}
========================================
    """)
    app.run(host='0.0.0.0', port=port, debug=False)