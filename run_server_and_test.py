"""
서버 실행 후 테스트 스크립트
"""
import subprocess
import time
import sys
import threading
import os

# UTF-8 인코딩 설정
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def run_server():
    """Flask 서버 실행"""
    try:
        # 환경 변수 설정
        env = os.environ.copy()
        env['PORT'] = '10000'
        
        # Flask 서버 시작
        process = subprocess.Popen(
            [sys.executable, 'app.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            cwd=os.getcwd()
        )
        
        print("Flask 서버 시작 중...")
        
        # 서버 시작 대기
        time.sleep(5)
        
        # 서버 출력 확인
        print("서버 상태:")
        for line in process.stdout:
            output = line.decode('utf-8', errors='ignore').strip()
            if output:
                print(f"  {output}")
            if "Running on" in output or "Serving Flask app" in output:
                break
        
        return process
        
    except Exception as e:
        print(f"서버 시작 실패: {e}")
        return None

def run_tests():
    """테스트 실행"""
    print("\n테스트 시작...")
    try:
        result = subprocess.run(
            [sys.executable, 'complete_test.py', '--local'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        print(result.stdout)
        if result.stderr:
            print("오류 출력:")
            print(result.stderr)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"테스트 실행 실패: {e}")
        return False

def simple_test():
    """간단한 테스트 실행"""
    print("\n간단한 테스트 실행...")
    
    from app import app
    
    with app.test_client() as client:
        tests = [
            ('/', '메인 페이지'),
            ('/health', 'Health Check'),
            ('/mode-selector.html', '모드 선택'),
            ('/index.html', 'AI 모드'),
            ('/detail-input.html', '상세 입력'),
            ('/css/style.css', 'CSS'),
            ('/js/generator.js', 'JavaScript'),
            ('/products/', 'Products API')
        ]
        
        passed = 0
        failed = 0
        
        for endpoint, description in tests:
            try:
                response = client.get(endpoint)
                if response.status_code == 200:
                    print(f"[성공] {description}: HTTP 200")
                    passed += 1
                else:
                    print(f"[실패] {description}: HTTP {response.status_code}")
                    failed += 1
            except Exception as e:
                print(f"[오류] {description}: {str(e)[:50]}")
                failed += 1
        
        print(f"\n테스트 결과: 성공 {passed}개, 실패 {failed}개")
        return failed == 0

def main():
    print("="*60)
    print("  서버 실행 및 테스트")
    print("="*60)
    
    # 현재 디렉토리 확인
    print(f"현재 디렉토리: {os.getcwd()}")
    print(f"app.py 존재: {os.path.exists('app.py')}")
    
    # 간단한 테스트부터 실행
    if simple_test():
        print("\n[성공] 모든 기본 테스트 통과!")
        print("\n이제 GitHub에 푸시하고 Render에서 Manual Deploy를 실행하세요.")
    else:
        print("\n[실패] 기본 테스트에서 문제 발견. Flask 앱을 수정해야 합니다.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()