"""
빠른 배포 상태 확인
"""
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def quick_test():
    """핵심 엔드포인트만 빠르게 테스트"""
    base_url = "https://manwon-generator.onrender.com"
    
    tests = [
        ("/", "메인 페이지"),
        ("/index.html", "인덱스 파일"),
        ("/ai-generator.html", "AI 모드"),
        ("/detail-input.html", "상세 입력"),
        ("/css/style.css", "CSS 파일")
    ]
    
    print("=" * 50)
    print("  빠른 배포 상태 확인")
    print("=" * 50)
    
    success_count = 0
    total_count = len(tests)
    
    for endpoint, name in tests:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"[성공] {name}")
                success_count += 1
            else:
                print(f"[실패] {name}: HTTP {response.status_code}")
        except Exception as e:
            print(f"[오류] {name}: 연결 실패")
    
    success_rate = (success_count / total_count) * 100
    print("\n" + "=" * 50)
    print(f"성공률: {success_rate:.1f}% ({success_count}/{total_count})")
    
    if success_rate >= 80:
        print("[배포 성공] 대부분의 기능이 정상 작동합니다!")
        return True
    else:
        print("[배포 중] 아직 완전히 준비되지 않았습니다.")
        return False

if __name__ == "__main__":
    success = quick_test()
    sys.exit(0 if success else 1)