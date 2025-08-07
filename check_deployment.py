"""
Render 배포 상태 확인 스크립트
"""

import requests
import time
import sys

# UTF-8 인코딩 설정
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_deployment():
    """배포 상태 확인"""
    url = "https://manwon-generator.onrender.com/health"
    max_attempts = 20
    attempt = 0
    
    print("="*50)
    print("   Render 배포 상태 확인")
    print("="*50)
    print(f"\n🔍 URL: {url}")
    print("⏳ 배포 확인 중... (최대 10분 대기)\n")
    
    while attempt < max_attempts:
        attempt += 1
        print(f"시도 {attempt}/{max_attempts}...", end=" ")
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy':
                    print("✅ 성공!")
                    print("\n" + "="*50)
                    print("🎉 배포 완료!")
                    print("="*50)
                    print(f"\n✅ 서비스 URL: https://manwon-generator.onrender.com")
                    print(f"✅ Health Check: {data}")
                    
                    # 추가 엔드포인트 테스트
                    print("\n📋 추가 테스트:")
                    test_endpoints = [
                        "/",
                        "/mode-selector.html",
                        "/index.html",
                        "/detail-input.html"
                    ]
                    
                    for endpoint in test_endpoints:
                        test_url = f"https://manwon-generator.onrender.com{endpoint}"
                        try:
                            r = requests.get(test_url, timeout=5)
                            if r.status_code == 200:
                                print(f"  ✅ {endpoint}")
                            else:
                                print(f"  ⚠️ {endpoint} - Status: {r.status_code}")
                        except:
                            print(f"  ❌ {endpoint} - 접속 실패")
                    
                    return True
            else:
                print(f"응답 코드: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("연결 대기 중...")
        except requests.exceptions.Timeout:
            print("타임아웃...")
        except Exception as e:
            print(f"오류: {e}")
        
        if attempt < max_attempts:
            print(f"  30초 후 재시도...")
            time.sleep(30)
    
    print("\n" + "="*50)
    print("⚠️ 배포 확인 실패")
    print("="*50)
    print("\n다음을 확인해주세요:")
    print("1. Render.com 대시보드에서 배포 상태 확인")
    print("2. Build logs 확인")
    print("3. 수동으로 Web Service 생성 필요할 수 있음")
    print("\n📌 수동 배포 방법:")
    print("1. https://render.com 접속")
    print("2. New + > Web Service")
    print("3. GitHub 저장소 연결: manwonyori/manwon-generator")
    print("4. 설정 확인 후 Create Web Service")
    
    return False

if __name__ == "__main__":
    success = check_deployment()
    sys.exit(0 if success else 1)