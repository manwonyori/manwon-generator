#!/usr/bin/env python3
"""
최종 완성판 - 모드 선택 시스템이 포함된 간단한 Flask 앱
"""
from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    """메인 페이지 - 모드 선택 시스템 포함"""
    print("[LOG] 메인 페이지 요청 - index.html 서빙")
    try:
        return send_from_directory('.', 'index.html')
    except Exception as e:
        print(f"[ERROR] index.html 서빙 실패: {e}")
        return f"Error: {e}", 500

@app.route('/<path:filename>')
def serve_file(filename):
    """정적 파일 서빙"""
    try:
        print(f"[LOG] 파일 요청: {filename}")
        
        # HTML 파일들
        if filename.endswith('.html'):
            return send_from_directory('.', filename)
        
        # CSS 파일들
        if filename.startswith('css/'):
            return send_from_directory('.', filename)
        
        # JS 파일들
        if filename.startswith('js/') or filename.endswith('.js'):
            return send_from_directory('.', filename)
            
        # 기타 파일들
        return send_from_directory('.', filename)
        
    except Exception as e:
        print(f"[ERROR] 파일 서빙 실패 {filename}: {e}")
        return jsonify({"error": "File not found", "file": filename}), 404

@app.route('/health')
def health():
    """헬스 체크"""
    return jsonify({
        "status": "healthy", 
        "message": "모드 선택 시스템 작동 중",
        "files": {
            "index.html": os.path.exists("index.html"),
            "detail-input.html": os.path.exists("detail-input.html")
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    print(f"""
===========================================
  만원요리 상세페이지 생성기 - 최종 완성판
===========================================
포트: {port}
index.html 존재: {os.path.exists('index.html')}
detail-input.html 존재: {os.path.exists('detail-input.html')}
===========================================
""")
    app.run(host='0.0.0.0', port=port, debug=False)