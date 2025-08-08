#!/usr/bin/env python3
"""
   -
"""
import requests
import time
import sys
import io
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def monitor_final_deployment():
    """  """
    base_url = "https://manwon-generator.onrender.com"
    max_checks = 30  # 15 (30 )

    print("=" * 60)
    print("     ")
    print("=" * 60)
    print(f"URL: {base_url}")
    print(":      ")
    print("=" * 60)

    for check_num in range(1, max_checks + 1):
        print(f"\n[ {check_num}/{max_checks}] {time.strftime('%H:%M:%S')}")

        try:
            #
            response = requests.get(f"{base_url}/", timeout=15)
            if response.status_code == 200:
                content = response.text

                #
                new_version_indicators = [
                    "   - ",
                    "AI  ",
                    "  ",
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

                print(f"  [] HTTP 200")
                print(f"    : {new_version_score}/{len(new_version_indicators)}")
                print(f"    : {old_version_score}/{len(old_version_indicators)}")

                if new_version_score >= 4 and old_version_score == 0:
                    print("\n" + "" * 20)
                    print("  [ ]    이 되었습니다!")
                    print("" * 20)

                    # Health
                    try:
                        health_response = requests.get(f"{base_url}/health", timeout=10)
                        if health_response.status_code == 200:
                            health_data = health_response.json()
                            if "  " in str(health_data):
                                print("  [ ] Health   으로 ")
                    except:
                        pass

                    print(f"\n  : https://manwon-generator.onrender.com/")
                    print("    이  !")
                    return True

                elif old_version_score > 0:
                    print(f"  []    (   {old_version_score} )")
                else:
                    print(f"  [] 부적  ...")

            else:
                print(f"  [] HTTP {response.status_code}")

        except Exception as e:
            print(f"  [ ] {str(e)}")

        if check_num < max_checks:
            print(f"  ⏳ 30  재...")
            time.sleep(30)

    print(f"\n⏰ [] 15  ")
    print("     .")
    return False

if __name__ == "__main__":
    print(f" : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    success = monitor_final_deployment()
    sys.exit(0 if success else 1)