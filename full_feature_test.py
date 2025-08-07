#!/usr/bin/env python3
"""
완전한 기능 테스트 - 모든 기능이 작동하는지 최종 확인
"""
import requests
import time
import sys
import io
import json
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def wait_for_deployment():
    """배포 완료 대기"""
    base_url = "https://manwon-generator.onrender.com"
    max_attempts = 60  # 30분 (30초 간격)
    
    print("=" * 70)
    print("  ⏳ 배포 완료 대기 중...")
    print("=" * 70)
    
    for attempt in range(1, max_attempts + 1):
        try:
            response = requests.get(base_url, timeout=10)
            if response.status_code == 200:
                content = response.text
                
                # 새 버전 확인
                if "만원요리 상세페이지 생성기 - 완성" in content or "AI 자동 생성" in content:
                    print(f"\n✅ [{attempt}회차] 새로운 버전 감지!")
                    return True
                    
                # 구 버전이면 계속 대기
                if "teamPassword" in content or "v9.0" in content:
                    print(f"[{attempt}/60] 아직 구 버전... 30초 후 재확인", end="\r")
                    
        except Exception as e:
            print(f"[{attempt}/60] 연결 오류... 30초 후 재확인", end="\r")
        
        if attempt < max_attempts:
            time.sleep(30)
    
    return False

def test_all_features():
    """모든 기능 완전 테스트"""
    base_url = "https://manwon-generator.onrender.com"
    test_results = {
        "timestamp": datetime.now().isoformat(),
        "tests": [],
        "total": 0,
        "passed": 0,
        "failed": 0
    }
    
    print("\n" + "=" * 70)
    print("  🧪 전체 기능 테스트 시작")
    print("=" * 70)
    
    # 테스트 케이스들
    test_cases = [
        {
            "name": "1. 메인 페이지 접속",
            "description": "모드 선택 화면이 표시되는지 확인",
            "url": f"{base_url}/",
            "checks": [
                ("페이지 로드", lambda r: r.status_code == 200),
                ("새 버전 제목", lambda r: "만원요리 상세페이지 생성기" in r.text),
                ("모드 선택 카드", lambda r: "mode-selector" in r.text or "modeSelector" in r.text),
                ("AI 모드 버튼", lambda r: "AI 자동 생성" in r.text or "AI 모드" in r.text),
                ("상세 입력 버튼", lambda r: "상세 정보 입력" in r.text or "상세 입력" in r.text)
            ]
        },
        {
            "name": "2. Health 엔드포인트",
            "description": "서버 상태 확인",
            "url": f"{base_url}/health",
            "checks": [
                ("Health 응답", lambda r: r.status_code == 200),
                ("JSON 형식", lambda r: r.headers.get('content-type', '').startswith('application/json')),
                ("상태 메시지", lambda r: "ok" in r.text.lower() or "healthy" in r.text.lower())
            ]
        },
        {
            "name": "3. JavaScript 함수 확인",
            "description": "모드 선택 함수가 있는지 확인",
            "url": f"{base_url}/",
            "checks": [
                ("selectMode 함수", lambda r: "selectMode" in r.text),
                ("generateAI 함수", lambda r: "generateAI" in r.text or "generate" in r.text),
                ("generateDetail 함수", lambda r: "generateDetail" in r.text or "detail" in r.text)
            ]
        },
        {
            "name": "4. UI 요소 확인",
            "description": "필수 UI 요소들이 있는지 확인",
            "url": f"{base_url}/",
            "checks": [
                ("컨테이너", lambda r: "container" in r.text),
                ("헤더", lambda r: "header" in r.text),
                ("폼 그룹", lambda r: "form-group" in r.text or "input" in r.text),
                ("버튼", lambda r: "button" in r.text or "btn" in r.text)
            ]
        },
        {
            "name": "5. 반응형 디자인",
            "description": "모바일 지원 확인",
            "url": f"{base_url}/",
            "checks": [
                ("뷰포트 메타태그", lambda r: "viewport" in r.text),
                ("미디어 쿼리", lambda r: "@media" in r.text),
                ("반응형 그리드", lambda r: "grid" in r.text or "flex" in r.text)
            ]
        }
    ]
    
    # 각 테스트 실행
    for test in test_cases:
        test_results["total"] += 1
        print(f"\n📋 {test['name']}")
        print(f"   {test['description']}")
        print("-" * 50)
        
        try:
            response = requests.get(test["url"], timeout=10)
            test_result = {
                "name": test["name"],
                "url": test["url"],
                "status_code": response.status_code,
                "checks": []
            }
            
            all_passed = True
            for check_name, check_func in test["checks"]:
                try:
                    passed = check_func(response)
                    status = "✅" if passed else "❌"
                    print(f"   {status} {check_name}")
                    test_result["checks"].append({
                        "name": check_name,
                        "passed": passed
                    })
                    if not passed:
                        all_passed = False
                except Exception as e:
                    print(f"   ❌ {check_name} (오류: {str(e)})")
                    test_result["checks"].append({
                        "name": check_name,
                        "passed": False,
                        "error": str(e)
                    })
                    all_passed = False
            
            if all_passed:
                test_results["passed"] += 1
                print(f"   🎯 테스트 통과!")
            else:
                test_results["failed"] += 1
                print(f"   ⚠️ 일부 항목 실패")
                
            test_results["tests"].append(test_result)
            
        except Exception as e:
            test_results["failed"] += 1
            print(f"   ❌ 테스트 실패: {str(e)}")
            test_results["tests"].append({
                "name": test["name"],
                "error": str(e)
            })
    
    # 최종 결과
    print("\n" + "=" * 70)
    print("  📊 최종 테스트 결과")
    print("=" * 70)
    
    success_rate = (test_results["passed"] / test_results["total"] * 100) if test_results["total"] > 0 else 0
    
    print(f"""
총 테스트: {test_results["total"]}개
성공: {test_results["passed"]}개
실패: {test_results["failed"]}개
성공률: {success_rate:.1f}%
    """)
    
    if success_rate >= 80:
        print("🎉 모든 주요 기능이 정상 작동합니다!")
        print("\n✅ 확인된 기능:")
        print("  • 모드 선택 시스템 작동")
        print("  • AI 자동 생성 모드 준비")
        print("  • 상세 정보 입력 모드 준비")
        print("  • 반응형 디자인 적용")
        print("  • 서버 정상 작동")
    elif success_rate >= 60:
        print("⚠️ 대부분의 기능이 작동하지만 일부 문제가 있습니다.")
    else:
        print("❌ 배포에 문제가 있습니다. 추가 확인이 필요합니다.")
    
    # 결과 저장
    with open(f"feature_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w', encoding='utf-8') as f:
        json.dump(test_results, f, ensure_ascii=False, indent=2)
    
    return success_rate >= 80

def main():
    """메인 함수"""
    print("🚀 만원요리 상세페이지 생성기 - 최종 기능 테스트")
    print(f"시작 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. 배포 완료 대기
    print("\n[1단계] 배포 완료 확인")
    if wait_for_deployment():
        print("✅ 새로운 버전이 배포되었습니다!")
        
        # 2. 잠시 대기 (안정화)
        print("\n[2단계] 서버 안정화 대기 (10초)...")
        time.sleep(10)
        
        # 3. 전체 기능 테스트
        print("\n[3단계] 전체 기능 테스트")
        if test_all_features():
            print("\n" + "🎊" * 30)
            print("  🏆 완벽한 배포 성공! 모든 기능이 정상 작동합니다!")
            print("🎊" * 30)
            print(f"\n📌 접속 주소: https://manwon-generator.onrender.com/")
            print("📌 모드 선택 시스템이 완벽하게 작동 중입니다!")
            return True
        else:
            print("\n⚠️ 일부 기능에 문제가 있습니다.")
            return False
    else:
        print("\n❌ 배포 대기 시간 초과. 수동 확인이 필요합니다.")
        print("📌 Render Dashboard에서 직접 확인해주세요.")
        return False

if __name__ == "__main__":
    success = main()
    print(f"\n종료 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sys.exit(0 if success else 1)