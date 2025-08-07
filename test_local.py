"""
로컬 테스트 스크립트
배포 전 모든 기능을 검증합니다.
"""

import os
import sys
import json
import time

# UTF-8 인코딩 설정
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from app import app

def test_server():
    """서버 기본 동작 테스트"""
    print("[시작] 서버 테스트 시작...")
    
    with app.test_client() as client:
        # 1. 메인 페이지 테스트
        print("  - 메인 페이지 테스트...", end="")
        response = client.get('/')
        assert response.status_code == 200
        print(" [성공]")
        
        # 2. AI 모드 페이지 테스트
        print("  - AI 모드 페이지 테스트...", end="")
        response = client.get('/index.html')
        assert response.status_code == 200
        print(" [성공]")
        
        # 3. 상세 입력 모드 페이지 테스트
        print("  - 상세 입력 모드 페이지 테스트...", end="")
        response = client.get('/detail-input.html')
        assert response.status_code == 200
        print(" [성공]")
        
        # 4. CSS 파일 테스트
        print("  - CSS 파일 테스트...", end="")
        response = client.get('/css/style.css')
        assert response.status_code == 200
        assert response.content_type.startswith('text/css')
        print(" [성공]")
        
        # 5. JS 파일 테스트
        print("  - JavaScript 파일 테스트...", end="")
        response = client.get('/js/generator.js')
        assert response.status_code == 200
        assert 'javascript' in response.content_type.lower()
        print(" [성공]")
        
        # 6. Health check 테스트
        print("  - Health check 테스트...", end="")
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        print(" [성공]")
        
        # 7. API 엔드포인트 테스트
        print("  - AI 보조 API 테스트...", end="")
        response = client.post('/api/ai-assist', 
                              json={'fieldType': 'features', 'context': {'productName': '테스트'}},
                              content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] == True
        print(" [성공]")
        
        # 8. Products 디렉토리 테스트
        print("  - Products 목록 테스트...", end="")
        response = client.get('/products/')
        assert response.status_code == 200
        print(" [성공]")
        
    print("\n[성공] 모든 테스트 통과!")
    return True

def check_files():
    """필수 파일 확인"""
    print("\n[파일] 필수 파일 확인...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'render.yaml',
        'runtime.txt',
        'mode-selector.html',
        'index.html',
        'detail-input.html',
        'css/style.css',
        'js/generator.js',
        'js/detail-input-handler.js'
    ]
    
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  [성공] {file}")
        else:
            print(f"  [실패] {file} - 파일 없음!")
            all_exist = False
    
    return all_exist

def validate_render_config():
    """Render 설정 검증"""
    print("\n[설정] Render 설정 검증...")
    
    with open('render.yaml', 'r') as f:
        content = f.read()
        assert 'manwon-generator' in content
        assert 'gunicorn' in content
        assert 'singapore' in content
        print("  [성공] render.yaml 설정 정상")
    
    with open('requirements.txt', 'r') as f:
        content = f.read()
        assert 'Flask' in content
        assert 'gunicorn' in content
        print("  [성공] requirements.txt 정상")
    
    return True

def main():
    """메인 테스트 실행"""
    print("="*50)
    print("   만원요리 상세페이지 생성기 로컬 테스트")
    print("="*50)
    
    try:
        # 1. 파일 확인
        if not check_files():
            print("\n[오류] 필수 파일이 누락되었습니다!")
            return False
        
        # 2. Render 설정 검증
        if not validate_render_config():
            print("\n[오류] Render 설정에 문제가 있습니다!")
            return False
        
        # 3. 서버 테스트
        if not test_server():
            print("\n[오류] 서버 테스트 실패!")
            return False
        
        print("\n" + "="*50)
        print("[성공] 모든 테스트 완료! 배포 준비 완료!")
        print("="*50)
        
        print("\n[안내] 배포 방법:")
        print("1. git add .")
        print("2. git commit -m 'fix: 배포 설정 최종 수정'")
        print("3. git push origin main")
        print("4. Render.com에서 자동 배포 확인")
        
        return True
        
    except Exception as e:
        print(f"\n[오류] 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)