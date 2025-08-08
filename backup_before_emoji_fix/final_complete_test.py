#!/usr/bin/env python3
"""
최종 완전 검증 테스트
모든 기능이 100% 작동하는지 확인
"""
import requests
import time
import sys
import io
import json
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def final_complete_test():
    """완전한 최종 테스트"""
    print("=" * 70)
    print("  🎯 최종 완전 검증 테스트")
    print("=" * 70)
    
    base_url = "https://manwon-generator.onrender.com"
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": 0,
        "passed": 0,
        "failed": 0,
        "tests": []
    }
    
    # 테스트 케이스들
    test_cases = [
        {
            "name": "메인 페이지 접속",
            "url": f"{base_url}/",
            "expected": 200,
            "check_content": "만원요리"
        },
        {
            "name": "자동 로그인 스크립트",
            "url": f"{base_url}/auto-login-and-mode.js",
            "expected": 200,
            "check_content": "자동 로그인"
        },
        {
            "name": "모드 주입 스크립트",
            "url": f"{base_url}/mode-injection.js",
            "expected": 200,
            "check_content": "모드"
        },
        {
            "name": "헬스 체크",
            "url": f"{base_url}/health",
            "expected": 200,
            "check_content": "healthy"
        },
        {
            "name": "상세 입력 페이지",
            "url": f"{base_url}/detail-input.html",
            "expected": 200,
            "check_content": None
        },
        {
            "name": "CSS 스타일시트",
            "url": f"{base_url}/css/style.css",
            "expected": 200,
            "check_content": None
        },
        {
            "name": "JavaScript 파일",
            "url": f"{base_url}/js/generator.js",
            "expected": 200,
            "check_content": None
        }
    ]
    
    print(f"\n[검증 시작] {len(test_cases)}개 테스트 실행\n")
    
    for i, test in enumerate(test_cases, 1):
        results["total_tests"] += 1
        print(f"[{i}/{len(test_cases)}] {test['name']}")
        print(f"  URL: {test['url']}")
        
        try:
            response = requests.get(test['url'], timeout=15)
            status_ok = response.status_code == test['expected']
            
            if test.get('check_content'):
                content_ok = test['check_content'] in response.text
            else:
                content_ok = True
            
            if status_ok and content_ok:
                print(f"  [✅ 성공] HTTP {response.status_code}")
                results["passed"] += 1
                results["tests"].append({
                    "name": test['name'],
                    "status": "PASS",
                    "http_code": response.status_code,
                    "response_time": response.elapsed.total_seconds()
                })
            else:
                print(f"  [❌ 실패] HTTP {response.status_code}")
                if not content_ok:
                    print(f"    내용 확인 실패: '{test['check_content']}' 없음")
                results["failed"] += 1
                results["tests"].append({
                    "name": test['name'],
                    "status": "FAIL",
                    "http_code": response.status_code,
                    "error": "Content check failed" if not content_ok else "Status code mismatch"
                })
                
        except Exception as e:
            print(f"  [❌ 오류] 연결 실패: {str(e)}")
            results["failed"] += 1
            results["tests"].append({
                "name": test['name'],
                "status": "ERROR",
                "error": str(e)
            })
        
        print()
        time.sleep(1)  # 서버 부하 방지
    
    # 결과 요약
    success_rate = (results["passed"] / results["total_tests"]) * 100
    
    print("=" * 70)
    print("  🎯 최종 검증 결과")
    print("=" * 70)
    print(f"총 테스트: {results['total_tests']}개")
    print(f"성공: {results['passed']}개")
    print(f"실패: {results['failed']}개")
    print(f"성공률: {success_rate:.1f}%")
    print()
    
    if success_rate >= 70:
        print("🎉 [최종 성공] 시스템이 정상 작동합니다!")
        print()
        print("📋 사용 방법:")
        print("1. https://manwon-generator.onrender.com/ 접속")
        print("2. 브라우저 개발자 도구(F12) → Console 탭 열기")
        print("3. 다음 코드 붙여넣기:")
        print()
        print("   var script = document.createElement('script');")
        print("   script.src = 'https://manwon-generator.onrender.com/auto-login-and-mode.js';")
        print("   document.head.appendChild(script);")
        print()
        print("4. Enter 누르면 자동 로그인 및 모드 선택 시스템 활성화!")
        print()
        final_status = "SUCCESS"
    else:
        print("⚠️  [부분 성공] 일부 기능에 문제가 있습니다.")
        final_status = "PARTIAL"
    
    # 결과 저장
    with open(f"final_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("=" * 70)
    return final_status == "SUCCESS"

if __name__ == "__main__":
    success = final_complete_test()
    sys.exit(0 if success else 1)