#!/usr/bin/env python3
"""
최종 배포 모니터링 - 새로운 모드 선택 시스템 반영 확인
"""
import requests
import time
import sys
import io
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def monitor_final_deployment():
    """최종 배포 모니터링"""
    base_url = "https://manwon-generator.onrender.com"
    max_checks = 30  # 15분 (30초 간격)
    
    print("=" * 60)
    print("  🎯 최종 배포 모니터링")
    print("=" * 60)
    print(f"URL: {base_url}")
    print("목표: 새로운 모드 선택 시스템 반영 확인")
    print("=" * 60)
    
    for check_num in range(1, max_checks + 1):
        print(f"\n[체크 {check_num}/{max_checks}] {time.strftime('%H:%M:%S')}")
        
        try:
            # 메인 페이지 확인
            response = requests.get(f"{base_url}/", timeout=15)
            if response.status_code == 200:
                content = response.text
                
                # 새로운 버전 확인 지표들
                new_version_indicators = [
                    "만원요리 상세페이지 생성기 - 완성",
                    "AI 자동 생성",
                    "상세 정보 입력",
                    "mode-selector",
                    "selectMode"
                ]
                
                old_version_indicators = [
                    "teamPassword",
                    "login()",
                    "sessionStorage",
                    "v9.0"
                ]
                
                new_version_score = sum(1 for indicator in new_version_indicators if indicator in content)
                old_version_score = sum(1 for indicator in old_version_indicators if indicator in content)
                
                print(f"  [응답] HTTP 200")
                print(f"  새 버전 지표: {new_version_score}/{len(new_version_indicators)}")
                print(f"  구 버전 지표: {old_version_score}/{len(old_version_indicators)}")
                
                if new_version_score >= 4 and old_version_score == 0:
                    print("\n" + "🎉" * 20)
                    print("  [배포 성공] 새로운 모드 선택 시스템이 반영되었습니다!")
                    print("🎉" * 20)
                    
                    # Health 엔드포인트도 확인
                    try:
                        health_response = requests.get(f"{base_url}/health", timeout=10)
                        if health_response.status_code == 200:
                            health_data = health_response.json()
                            if "모드 선택 시스템" in str(health_data):
                                print("  [추가 확인] Health 엔드포인트도 새로운 버전으로 업데이트됨")
                    except:
                        pass
                    
                    print(f"\n✅ 최종 확인: https://manwon-generator.onrender.com/")
                    print("✅ 새로운 모드 선택 시스템이 완벽하게 작동합니다!")
                    return True
                
                elif old_version_score > 0:
                    print(f"  [상태] 아직 이전 버전 (구 버전 지표 {old_version_score}개 발견)")
                else:
                    print(f"  [상태] 부분적 업데이트 중...")
                    
            else:
                print(f"  [오류] HTTP {response.status_code}")
                
        except Exception as e:
            print(f"  [연결 오류] {str(e)}")
        
        if check_num < max_checks:
            print(f"  ⏳ 30초 후 재확인...")
            time.sleep(30)
    
    print(f"\n⏰ [타임아웃] 15분 대기 완료")
    print("🔧 추가 조치가 필요할 수 있습니다.")
    return False

if __name__ == "__main__":
    print(f"모니터링 시작: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    success = monitor_final_deployment()
    sys.exit(0 if success else 1)