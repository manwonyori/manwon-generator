#!/usr/bin/env python3
"""
SuperClaude
Render
"""

import requests
import time
import sys
import json
from datetime import datetime

# UTF-8
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_deployment():
    """  """
    url = "https://manwon-generator.onrender.com/health"
    max_attempts = 20
    attempt = 0

    print("="*50)
    print("   Render   ")
    print("="*50)
    print(f"\n[] URL: {url}")
    print("[]   ... ( 10 )\n")

    while attempt < max_attempts:
        attempt += 1
        print(f" {attempt}/{max_attempts}...", end=" ")

        try:
            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    print("[] !")
                    print("\n" + "="*50)
                    print("[]  !")
                    print("="*50)
                    print(f"\n[]  URL: https://manwon-generator.onrender.com")
                    print(f"[] Health Check: {data}")

                    #
                    print("\n[]  :")
                    test_endpoints = [
                        "/",
                        "/mode-selector.html",
                        "/index.html",
                        "/detail-input.html"
                    ]

                    for endpoint in test_endpoints:
                        test_url = f"https://manwon-generator.onrender.com{endpoint}"
                        try:
                            r = requests.get(test_url, timeout=5)
                            if r.status_code == 200:
                                print(f"  [] {endpoint}")
                            else:
                                print(f"  [] {endpoint} - Status: {r.status_code}")
                        except:
                            print(f"  [] {endpoint} -  ")

                    return True
            else:
                print(f" : {response.status_code}")

        except requests.exceptions.ConnectionError:
            print("  ...")
        except requests.exceptions.Timeout:
            print("...")
        except Exception as e:
            print(f": {e}")

        if attempt < max_attempts:
            print(f"  30  ...")
            time.sleep(30)

    print("\n" + "="*50)
    print("[]   ")
    print("="*50)
    print("\n :")
    print("1. Render.com    ")
    print("2. Build logs ")
    print("3.  Web Service    ")
    print("\n[]   :")
    print("1. https://render.com ")
    print("2. New + > Web Service")
    print("3. GitHub  : manwonyori/manwon-generator")
    print("4.    Create Web Service")

    return False

if __name__ == "__main__":
    success = check_deployment()
    sys.exit(0 if success else 1)