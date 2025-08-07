"""
배포 대기 후 확인 스크립트
"""
import time
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def wait_and_check(wait_minutes=3):
    """지정된 시간 대기 후 배포 확인"""
    base_url = "https://manwon-generator.onrender.com"
    
    print("="*60)
    print(f"⏳ {wait_minutes}분 대기 후 배포 확인")
    print("="*60)
    
    # 대기 시간을 30초 단위로 표시
    total_seconds = wait_minutes * 60
    for i in range(0, total_seconds, 30):
        remaining = total_seconds - i
        mins = remaining // 60
        secs = remaining % 60
        print(f"\r남은 시간: {mins:02d}:{secs:02d}", end="", flush=True)
        if i < total_seconds - 30:
            time.sleep(30)
    
    print("\n\n🔍 배포 상태 확인 중...")
    print("-"*60)
    
    # 테스트할 URL들
    test_urls = [
        ("/health", "Health Check"),
        ("/", "메인 페이지"),
        ("/mode-selector.html", "모드 선택"),
        ("/index.html", "AI 모드"),
        ("/detail-input.html", "상세 입력")
    ]
    
    success_count = 0
    fail_count = 0
    
    for endpoint, description in test_urls:
        url = f"{base_url}{endpoint}"
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                # 추가 검증
                if endpoint == "/health":
                    try:
                        data = r.json()
                        if data.get('status') == 'healthy':
                            print(f"✅ {description}: OK")
                            success_count += 1
                        else:
                            print(f"⚠️ {description}: {data}")
                            fail_count += 1
                    except:
                        print(f"⚠️ {description}: Invalid JSON")
                        fail_count += 1
                elif endpoint in ["/mode-selector.html", "/detail-input.html"]:
                    # 새 페이지 확인
                    if "모드" in r.text or "mode" in r.text.lower():
                        print(f"✅ {description}: OK (신규 페이지)")
                        success_count += 1
                    else:
                        print(f"⚠️ {description}: 페이지 내용 확인 필요")
                        fail_count += 1
                else:
                    print(f"✅ {description}: OK")
                    success_count += 1
            else:
                print(f"❌ {description}: HTTP {r.status_code}")
                fail_count += 1
        except Exception as e:
            print(f"❌ {description}: {str(e)[:50]}")
            fail_count += 1
    
    print("-"*60)
    print(f"\n📊 결과: 성공 {success_count}/{len(test_urls)}, 실패 {fail_count}/{len(test_urls)}")
    
    if success_count == len(test_urls):
        print("\n🎉 배포 완료! 모든 페이지가 정상 작동합니다!")
        print(f"🔗 접속: {base_url}")
        return True
    elif fail_count > 0:
        print("\n⚠️ 일부 페이지에 문제가 있습니다.")
        print("Render Dashboard에서 수동 배포를 실행해주세요.")
        return False
    
    return False

if __name__ == "__main__":
    # 인자로 대기 시간 전달 가능 (기본 3분)
    wait_mins = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    success = wait_and_check(wait_mins)
    sys.exit(0 if success else 1)