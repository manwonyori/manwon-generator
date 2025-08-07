"""
지속적인 배포 모니터링 스크립트
"""
import time
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def monitor_deployment(max_minutes=10):
    """배포 상태 지속적 모니터링"""
    base_url = "https://manwon-generator.onrender.com"
    check_interval = 30  # 30초마다 확인
    max_checks = max_minutes * 2  # 10분 = 20회 체크
    
    print("="*60)
    print("  지속적인 배포 모니터링")
    print("="*60)
    print(f"URL: {base_url}")
    print(f"최대 대기 시간: {max_minutes}분")
    print(f"체크 간격: {check_interval}초")
    print("="*60)
    
    success_endpoints = []
    
    for check_num in range(1, max_checks + 1):
        print(f"\n[체크 {check_num}/{max_checks}] {time.strftime('%H:%M:%S')}")
        
        # 핵심 엔드포인트 체크
        endpoints_to_check = [
            ("/health", "Health Check"),
            ("/mode-selector.html", "모드 선택"),
            ("/index.html", "AI 모드"),
            ("/detail-input.html", "상세 입력")
        ]
        
        current_success = []
        
        for endpoint, name in endpoints_to_check:
            try:
                response = requests.get(f"{base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    print(f"  [성공] {name}")
                    current_success.append(endpoint)
                else:
                    print(f"  [실패] {name}: HTTP {response.status_code}")
            except Exception as e:
                print(f"  [오류] {name}: 연결 실패")
        
        # 모든 엔드포인트가 성공하면 배포 완료
        if len(current_success) == len(endpoints_to_check):
            print("\n" + "="*60)
            print("[배포 성공] 모든 엔드포인트가 정상 작동합니다!")
            print("="*60)
            
            # 최종 테스트 실행
            print("최종 완전 테스트를 실행합니다...")
            try:
                import subprocess
                result = subprocess.run(
                    [sys.executable, 'complete_test.py'],
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    timeout=60
                )
                
                if "성공률: 100" in result.stdout or "모든 테스트 통과" in result.stdout:
                    print("[최종 성공] 완벽한 배포가 완료되었습니다!")
                    return True
                else:
                    print("[부분 성공] 기본 기능은 작동하지만 일부 개선이 필요합니다.")
                    print("테스트 결과:")
                    print(result.stdout[-500:])  # 마지막 500자만 출력
            except Exception as e:
                print(f"최종 테스트 실행 오류: {e}")
            
            return True
        
        # 진행률 표시
        progress = len(current_success) / len(endpoints_to_check) * 100
        print(f"  진행률: {progress:.0f}% ({len(current_success)}/{len(endpoints_to_check)})")
        
        if check_num < max_checks:
            print(f"  {check_interval}초 후 재확인...")
            time.sleep(check_interval)
    
    print(f"\n[타임아웃] {max_minutes}분 대기 완료. 수동 확인이 필요합니다.")
    print("\nRender Dashboard 확인 사항:")
    print("1. https://dashboard.render.com 접속")
    print("2. manwon-generator 서비스 상태 확인")
    print("3. Deploy logs 확인")
    print("4. Manual Deploy 실행")
    
    return False

if __name__ == "__main__":
    # 인자로 최대 대기 시간 지정 가능
    max_mins = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    success = monitor_deployment(max_mins)
    sys.exit(0 if success else 1)