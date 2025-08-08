#!/usr/bin/env python3
"""

"""
import requests
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=" * 70)
print("    ")
print("=" * 70)

base_url = "https://manwon-generator.onrender.com"

# 5  30
for i in range(1, 11):
    print(f"\n[{i}/10]  ...")

    try:
        #
        r = requests.get(base_url, timeout=10)
        if r.status_code == 200:
            content = r.text[:500]  #  500

            #
            if "   - " in r.text:
                print("    !")
            if "mode-selector" in r.text or "modeSelector" in r.text:
                print("    !")
            if "AI  " in r.text:
                print(" AI  !")
            if "  " in r.text:
                print("    !")

            #
            if "teamPassword" in r.text:
                print("    ( )")

            # Health
            try:
                health = requests.get(f"{base_url}/health", timeout=5)
                if health.status_code == 200:
                    print(" Flask   !")
                else:
                    print(f" Health: {health.status_code}")
            except:
                print(" Flask  ")

    except Exception as e:
        print(f": {e}")

    if i < 10:
        time.sleep(30)

print("\n" + "=" * 70)
print(" ")