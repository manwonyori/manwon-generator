"""
실시간 Render 배포 상태 확인
"""

import requests
import time
import sys
import json

# UTF-8 인코딩 설정
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_deployment_status():
    """현재 배포 상태 확인"""
    base_url = "https://manwon-generator.onrender.com"
    
    print("="*60)
    print("   [검색] Render 자동 배포 상태 확인")
    print("="*60)
    print(f"\n[위치] URL: {base_url}")
    print("[대기] 배포 진행 상황 확인 중...\n")
    
    # 테스트할 엔드포인트들
    endpoints = [
        ("/health", "Health Check"),
        ("/", "메인 페이지 (모드 선택)"),
        ("/mode-selector.html", "모드 선택 화면"),
        ("/index.html", "AI 자동 생성 모드"),
        ("/detail-input.html", "상세 입력 모드"),
    ]
    
    results = {}
    all_success = True
    
    for endpoint, description in endpoints:
        url = f"{base_url}{endpoint}"
        print(f"테스트: {description}")
        print(f"  URL: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            
            if endpoint == "/health":
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get('status') == 'healthy':
                            print(f"  [성공] 성공: {data}")
                            results[endpoint] = "성공"
                        else:
                            print(f"  [경고] 응답: {data}")
                            results[endpoint] = "경고"
                    except:
                        print(f"  [경고] JSON 파싱 실패")
                        results[endpoint] = "경고"
                else:
                    print(f"  [실패] 실패: HTTP {response.status_code}")
                    results[endpoint] = "실패"
                    all_success = False
            else:
                if response.status_code == 200:
                    # HTML 페이지 확인
                    if "mode-selector" in endpoint and "모드 선택" in response.text:
                        print(f"  [성공] 성공: 신규 페이지 확인됨")
                        results[endpoint] = "성공"
                    elif "detail-input" in endpoint and "상세 입력 모드" in response.text:
                        print(f"  [성공] 성공: 신규 페이지 확인됨")
                        results[endpoint] = "성공"
                    elif response.text:
                        print(f"  [성공] 페이지 로드 성공")
                        results[endpoint] = "성공"
                    else:
                        print(f"  [경고] 빈 응답")
                        results[endpoint] = "경고"
                else:
                    print(f"  [실패] 실패: HTTP {response.status_code}")
                    results[endpoint] = "실패"
                    all_success = False
                    
        except requests.exceptions.ConnectionError:
            print(f"  [실패] 연결 실패")
            results[endpoint] = "연결 실패"
            all_success = False
        except requests.exceptions.Timeout:
            print(f"  [실패] 타임아웃")
            results[endpoint] = "타임아웃"
            all_success = False
        except Exception as e:
            print(f"  [실패] 오류: {e}")
            results[endpoint] = f"오류: {e}"
            all_success = False
        
        print()
    
    # 결과 요약
    print("="*60)
    print("[요약] 배포 상태 요약")
    print("="*60)
    
    for endpoint, status in results.items():
        emoji = "[성공]" if "성공" in status else "[경고]" if "경고" in status else "[실패]"
        print(f"{emoji} {endpoints[next(i for i, (e, _) in enumerate(endpoints) if e == endpoint)][1]}: {status}")
    
    print("\n" + "="*60)
    
    if all_success:
        print("[완료] 배포 완료! 모든 기능이 정상 작동 중입니다!")
        print(f"\n[링크] 접속 URL: {base_url}")
        print("\n[안내] 사용 방법:")
        print("1. 모드 선택 화면에서 원하는 모드 선택")
        print("2. AI 자동 생성 또는 상세 입력 모드 사용")
        print("3. 생성된 HTML 파일 다운로드")
    else:
        print("[경고] 일부 기능에 문제가 있습니다.")
        print("\n[원인] 가능한 원인:")
        print("1. Render가 아직 배포 중 (3-5분 소요)")
        print("2. 기존 버전이 아직 실행 중")
        print("3. 빌드 오류 발생")
        print("\n[해결] 해결 방법:")
        print("1. 5분 후 다시 확인")
        print("2. Render Dashboard에서 Deploy logs 확인")
        print("3. Manual Deploy 실행")
    
    print("="*60)
    
    return all_success

def monitor_deployment(max_attempts=10, interval=30):
    """배포 모니터링 (최대 5분)"""
    print("[모니터링] 자동 배포 모니터링 시작 (최대 5분)\n")
    
    for attempt in range(1, max_attempts + 1):
        print(f"\n[시도] 시도 {attempt}/{max_attempts}")
        print("-"*60)
        
        if check_deployment_status():
            return True
        
        if attempt < max_attempts:
            print(f"\n[대기] {interval}초 후 재확인...")
            time.sleep(interval)
    
    print("\n[실패] 배포 확인 시간 초과")
    print("Render Dashboard에서 직접 확인해주세요:")
    print("https://dashboard.render.com")
    return False

if __name__ == "__main__":
    # 단일 체크 또는 모니터링 모드
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--monitor":
        success = monitor_deployment()
    else:
        success = check_deployment_status()
    
    sys.exit(0 if success else 1)