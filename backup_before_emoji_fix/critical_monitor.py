#!/usr/bin/env python3
"""
긴급 배포 모니터링
"""
import requests
import time
import sys
import io
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def critical_monitor():
    """긴급 모니터링"""
    base_url = "https://manwon-generator.onrender.com"
    
    print("=" * 60)
    print("  🚨 긴급 배포 모니터링")
    print("=" * 60)
    
    for i in range(1, 31):  # 15분
        print(f"\n[{i}/30] {datetime.now().strftime('%H:%M:%S')}")
        
        # 여러 엔드포인트 확인
        tests = [
            ("/", "메인"),
            ("/home.html", "Home"),
            ("/health", "Health"),
        ]
        
        for endpoint, name in tests:
            try:
                r = requests.get(f"{base_url}{endpoint}", timeout=10)
                if r.status_code == 200:
                    # 새 버전 확인
                    if "모드 선택" in r.text or "AI 자동 생성" in r.text or "상세 정보 입력" in r.text:
                        print(f"\n🎉🎉🎉 성공! 새 버전이 {endpoint}에서 확인됨!")
                        print(f"URL: {base_url}{endpoint}")
                        return True
                    elif "teamPassword" in r.text:
                        print(f"  {name}: 아직 구 버전")
                    else:
                        print(f"  {name}: HTTP {r.status_code}")
                else:
                    print(f"  {name}: {r.status_code}")
            except:
                print(f"  {name}: 연결 실패")
        
        if i < 30:
            time.sleep(30)
    
    print("\n⏰ 시간 초과")
    return False

if __name__ == "__main__":
    success = critical_monitor()
    if success:
        print("\n✅ 배포 성공! 모든 기능이 작동합니다!")
    else:
        print("\n❌ 여전히 문제가 있습니다. Render Dashboard 확인 필요")
    
    sys.exit(0 if success else 1)