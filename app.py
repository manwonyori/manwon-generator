from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='.', template_folder='.')

# 정적 파일 서빙을 위한 설정
@app.route('/')
def index():
    """모드 선택 화면"""
    return send_from_directory('.', 'mode-selector.html')

@app.route('/index.html')
def ai_mode():
    """AI 자동 생성 모드"""
    return send_from_directory('.', 'index.html')

@app.route('/detail-input.html')
def detail_mode():
    """상세 입력 모드"""
    return send_from_directory('.', 'detail-input.html')

@app.route('/mode-selector.html')
def mode_selector():
    """모드 선택 화면"""
    return send_from_directory('.', 'mode-selector.html')

# CSS 파일 서빙
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

# JS 파일 서빙
@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

# Products 디렉토리 서빙
@app.route('/products/')
def list_products():
    """생성된 제품 목록"""
    products_dir = 'products'
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
    return send_from_directory('products', filename)

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

# Health check
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'manwon-generator'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)