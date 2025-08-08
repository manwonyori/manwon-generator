#!/usr/bin/env python3
"""

"""
import requests
import time
import sys
import io
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def critical_monitor():
    """ """
    base_url = "https://manwon-generator.onrender.com"

    print("=" * 60)
    print("     ")
    print("=" * 60)

    for i in range(1, 31):  # 15
        print(f"\n[{i}/30] {datetime.now().strftime('%H:%M:%S')}")

        #
        tests = [
            ("/", ""),
            ("/home.html", "Home"),
            ("/health", "Health"),
        ]

        for endpoint, name in tests:
            try:
                r = requests.get(f"{base_url}{endpoint}", timeout=10)
                if r.status_code == 200:
                    #
                    if " " in r.text or "AI  " in r.text or "  " in r.text:
                        print(f"\n !  이 {endpoint} 됨!")
                        print(f"URL: {base_url}{endpoint}")
                        return True
                    elif "teamPassword" in r.text:
                        print(f"  {name}:   ")
                    else:
                        print(f"  {name}: HTTP {r.status_code}")
                else:
                    print(f"  {name}: {r.status_code}")
            except:
                print(f"  {name}:  ")

        if i < 30:
            time.sleep(30)

    print("\n⏰  ")
    return False

if __name__ == "__main__":
    success = critical_monitor()
    if success:
        print("\n  !   !")
    else:
        print("\n   . Render Dashboard  ")

    sys.exit(0 if success else 1)