#!/usr/bin/env python3
"""

  100%
"""
import requests
import time
import sys
import io
import json
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def final_complete_test():
    """한  """
    print("=" * 70)
    print("      ")
    print("=" * 70)

    base_url = "https://manwon-generator.onrender.com"
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": 0,
        "passed": 0,
        "failed": 0,
        "tests": []
    }

    #
    test_cases = [
        {
            "name": "  ",
            "url": f"{base_url}/",
            "expected": 200,
            "check_content": ""
        },
        {
            "name": "  ",
            "url": f"{base_url}/auto-login-and-mode.js",
            "expected": 200,
            "check_content": " "
        },
        {
            "name": "  ",
            "url": f"{base_url}/mode-injection.js",
            "expected": 200,
            "check_content": ""
        },
        {
            "name": " ",
            "url": f"{base_url}/health",
            "expected": 200,
            "check_content": "healthy"
        },
        {
            "name": "  ",
            "url": f"{base_url}/detail-input.html",
            "expected": 200,
            "check_content": None
        },
        {
            "name": "CSS ",
            "url": f"{base_url}/css/style.css",
            "expected": 200,
            "check_content": None
        },
        {
            "name": "JavaScript ",
            "url": f"{base_url}/js/generator.js",
            "expected": 200,
            "check_content": None
        }
    ]

    print(f"\n[ ] {len(test_cases)}  \n")

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
                print(f"  [ ] HTTP {response.status_code}")
                results["passed"] += 1
                results["tests"].append({
                    "name": test['name'],
                    "status": "PASS",
                    "http_code": response.status_code,
                    "response_time": response.elapsed.total_seconds()
                })
            else:
                print(f"  [ ] HTTP {response.status_code}")
                if not content_ok:
                    print(f"      : '{test['check_content']}' ")
                results["failed"] += 1
                results["tests"].append({
                    "name": test['name'],
                    "status": "FAIL",
                    "http_code": response.status_code,
                    "error": "Content check failed" if not content_ok else "Status code mismatch"
                })

        except Exception as e:
            print(f"  [ ]  : {str(e)}")
            results["failed"] += 1
            results["tests"].append({
                "name": test['name'],
                "status": "ERROR",
                "error": str(e)
            })

        print()
        time.sleep(1)  #

    #
    success_rate = (results["passed"] / results["total_tests"]) * 100

    print("=" * 70)
    print("     ")
    print("=" * 70)
    print(f" : {results['total_tests']}")
    print(f": {results['passed']}")
    print(f": {results['failed']}")
    print(f"률: {success_rate:.1f}%")
    print()

    if success_rate >= 70:
        print(" [ ]   !")
        print()
        print("  :")
        print("1. https://manwon-generator.onrender.com/ ")
        print("2.  발자 (F12) → Console  ")
        print("3.   :")
        print()
        print("   var script = document.createElement('script');")
        print("   script.src = 'https://manwon-generator.onrender.com/auto-login-and-mode.js';")
        print("   document.head.appendChild(script);")
        print()
        print("4. Enter        !")
        print()
        final_status = "SUCCESS"
    else:
        print("  [ ]    .")
        final_status = "PARTIAL"

    #
    with open(f"final_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("=" * 70)
    return final_status == "SUCCESS"

if __name__ == "__main__":
    success = final_complete_test()
    sys.exit(0 if success else 1)