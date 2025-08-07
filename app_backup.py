from flask import Flask, render_template, send_from_directory, jsonify, request, make_response, Response
import os
import json
from datetime import datetime
import mimetypes

app = Flask(__name__, static_folder='.', template_folder='.')

# MIME 타입 설정
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')

# 루트 경로 설정
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

# 기본 라우트 - 모드 선택이 포함된 index.html 제공
@app.route('/')
def index():
    """메인 페이지 - 새로운 모드 선택 시스템 포함"""
    # 항상 업데이트된 index.html을 제공
    try:
        return send_from_directory('.', 'index.html')
    except Exception as e:
        return f"Error serving index.html: {str(e)}", 500

# HTML 파일들 직접 서빙
@app.route('/<path:filename>')
def serve_html(filename):
    """HTML 파일 서빙"""
    if filename.endswith('.html'):
        file_path = os.path.join(ROOT_PATH, filename)
        if os.path.exists(file_path):
            return send_from_directory('.', filename)
    # 404 처리
    return jsonify({"error": "Not found"}), 404

# CSS 파일 서빙
@app.route('/css/<path:filename>')
def serve_css(filename):
    css_path = os.path.join(ROOT_PATH, 'css')
    if os.path.exists(css_path):
        return send_from_directory('css', filename, mimetype='text/css')
    return jsonify({"error": "Not found"}), 404

# JS 파일 서빙
@app.route('/js/<path:filename>')
def serve_js(filename):
    js_path = os.path.join(ROOT_PATH, 'js')
    if os.path.exists(js_path):
        return send_from_directory('js', filename, mimetype='application/javascript')
    return jsonify({"error": "Not found"}), 404

# Products 디렉토리 서빙
@app.route('/products/')
def list_products():
    """생성된 제품 목록"""
    products_dir = os.path.join(ROOT_PATH, 'products')
    if os.path.exists(products_dir):
        products = []
        for item in os.listdir(products_dir):
            item_path = os.path.join(products_dir, item)
            if os.path.isdir(item_path):
                products.append({
                    'name': item,
                    'created': datetime.fromtimestamp(os.path.getctime(item_path)).isoformat()
                })
        return jsonify(products)
    return jsonify([])

@app.route('/products/<path:filename>')
def serve_products(filename):
    products_path = os.path.join(ROOT_PATH, 'products')
    if os.path.exists(products_path):
        return send_from_directory('products', filename)
    return jsonify({"error": "Not found"}), 404

# API proxy for Claude (기존 서버 호환)
@app.route('/api/claude', methods=['POST', 'OPTIONS'])
def proxy_claude():
    """Claude API 프록시 (기존 서버 호환)"""
    if request.method == 'OPTIONS':
        # CORS preflight
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    
    # 실제 Claude API 호출은 클라이언트에서 처리
    return jsonify({
        'error': 'Proxy not configured. Use client-side API key.'
    }), 501

# API 엔드포인트 - AI 보조 기능
@app.route('/api/ai-assist', methods=['POST'])
def ai_assist():
    """AI 보조 기능 API"""
    data = request.json
    field_type = data.get('fieldType')
    context = data.get('context', {})
    
    # 여기서는 기본 응답만 제공 (실제로는 OpenAI/Claude API 호출)
    responses = {
        'composition': f"{context.get('productName', '제품')}의 구성품이 포함됩니다.",
        'ingredients': "주요 성분이 표시됩니다.",
        'features': "• 프리미엄 품질\n• 간편한 조리\n• 영양 균형",
        'sellingPoints': "• 가성비 우수\n• 빠른 배송\n• 품질 보증",
        'metaTitle': f"{context.get('productName', '제품')} | 만원요리 최씨남매",
        'metaDesc': f"최고 품질의 {context.get('productName', '제품')}을 합리적인 가격에 만나보세요.",
        'keywords': "만원요리, 밀키트, 간편식, 프리미엄"
    }
    
    return jsonify({
        'success': True,
        'content': responses.get(field_type, '내용을 입력해주세요.')
    })

# 템플릿 저장/불러오기 API
@app.route('/api/templates', methods=['GET', 'POST'])
def handle_templates():
    """템플릿 관리 API"""
    templates_file = 'templates.json'
    
    if request.method == 'GET':
        if os.path.exists(templates_file):
            with open(templates_file, 'r', encoding='utf-8') as f:
                return jsonify(json.load(f))
        return jsonify({})
    
    elif request.method == 'POST':
        data = request.json
        templates = {}
        
        if os.path.exists(templates_file):
            with open(templates_file, 'r', encoding='utf-8') as f:
                templates = json.load(f)
        
        template_name = data.get('name')
        template_data = data.get('data')
        
        if template_name and template_data:
            templates[template_name] = template_data
            with open(templates_file, 'w', encoding='utf-8') as f:
                json.dump(templates, f, ensure_ascii=False, indent=2)
            return jsonify({'success': True})
        
        return jsonify({'success': False, 'error': 'Invalid data'})

# 모드 주입 스크립트 제공
@app.route('/mode-injection.js')
def serve_mode_injection():
    """모드 선택 기능을 동적으로 주입하는 스크립트"""
    try:
        return send_from_directory('.', 'mode-injection.js', mimetype='application/javascript')
    except:
        # 파일이 없으면 인라인으로 생성
        js_content = """
(function() {
    'use strict';
    console.log('[모드 주입] 스크립트 로드됨');
    
    function injectModeSelector() {
        const headerSection = document.querySelector('.header') || 
                             document.querySelector('.strategic-header') ||
                             document.querySelector('header') ||
                             document.querySelector('.container');
        
        if (!headerSection) return;
        
        const modeSelectorHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 15px 0; font-size: 1.4em; font-weight: 600;">[선택] 생성 방식을 선택하세요</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 10px;">
                <button onclick="alert('[AI 모드] 현재 페이지에서 제품명을 입력하여 자동 생성하세요.')" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    [AI] 자동 생성 모드
                </button>
                <button onclick="alert('[상세 입력] 상세 입력 기능을 준비 중입니다.')" style="background: #E4A853; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                    [상세] 정보 입력 모드
                </button>
            </div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">[AI] 제품명만 입력 | [상세] 구체적 정보 직접 입력</p>
        </div>`;
        
        headerSection.insertAdjacentHTML('afterend', modeSelectorHTML);
        console.log('[모드 주입] 모드 선택기 추가 완료');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModeSelector);
    } else {
        injectModeSelector();
    }
    
    window.addEventListener('load', function() {
        setTimeout(injectModeSelector, 1000);
    });
})();
        """
        return Response(js_content, mimetype='application/javascript')

# Health check
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'manwon-generator'})

# 정적 파일 폴백 처리
@app.errorhandler(404)
def not_found(e):
    # JSON 응답 요청인 경우
    if request.path.startswith('/api/'):
        return jsonify({"error": "Not found"}), 404
    
    # HTML 파일 요청인 경우 index.html로 폴백
    if request.path.endswith('.html') or '.' not in request.path:
        # 기본 페이지로 리다이렉트
        if os.path.exists(os.path.join(ROOT_PATH, 'index.html')):
            return send_from_directory('.', 'index.html')
    
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    print(f"Starting manwon-generator server on port {port}")
    print(f"Root path: {ROOT_PATH}")
    print(f"Files in root: {os.listdir(ROOT_PATH) if os.path.exists(ROOT_PATH) else 'Directory not found'}")
    print(f"Mode selector exists: {os.path.exists(os.path.join(ROOT_PATH, 'mode-selector.html'))}")
    print(f"Index exists: {os.path.exists(os.path.join(ROOT_PATH, 'index.html'))}")
    print("Server ready for deployment!")
    app.run(host='0.0.0.0', port=port, debug=False)