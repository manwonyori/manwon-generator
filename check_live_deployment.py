"""
 Render
"""

import requests
import time
import sys
import json

# UTF-8
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_deployment_status():
    """   """
    base_url = "https://manwon-generator.onrender.com"

    print("="*60)
    print("   [] Render    ")
    print("="*60)
    print(f"\n[] URL: {base_url}")
    print("[]     ...\n")

    #
    endpoints = [
        ("/health", "Health Check"),
        ("/", "  ( )"),
        ("/mode-selector.html", "  "),
        ("/index.html", "AI   "),
        ("/detail-input.html", "  "),
    ]

    results = {}
    all_success = True

    for endpoint, description in endpoints:
        url = f"{base_url}{endpoint}"
        print(f": {description}")
        print(f"  URL: {url}")

        try:
            response = requests.get(url, timeout=10)

            if endpoint == "/health":
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get('status') == 'healthy':
                            print(f"  [] : {data}")
                            results[endpoint] = ""
                        else:
                            print(f"  [] : {data}")
                            results[endpoint] = ""
                    except:
                        print(f"  [] JSON  ")
                        results[endpoint] = ""
                else:
                    print(f"  [] : HTTP {response.status_code}")
                    results[endpoint] = ""
                    all_success = False
            else:
                if response.status_code == 200:
                    # HTML
                    if "mode-selector" in endpoint and " " in response.text:
                        print(f"  [] :   ")
                        results[endpoint] = ""
                    elif "detail-input" in endpoint and "  " in response.text:
                        print(f"  [] :   ")
                        results[endpoint] = ""
                    elif response.text:
                        print(f"  []   ")
                        results[endpoint] = ""
                    else:
                        print(f"  []  ")
                        results[endpoint] = ""
                else:
                    print(f"  [] : HTTP {response.status_code}")
                    results[endpoint] = ""
                    all_success = False

        except requests.exceptions.ConnectionError:
            print(f"  []  ")
            results[endpoint] = " "
            all_success = False
        except requests.exceptions.Timeout:
            print(f"  [] ")
            results[endpoint] = ""
            all_success = False
        except Exception as e:
            print(f"  [] : {e}")
            results[endpoint] = f": {e}"
            all_success = False

        print()

    #
    print("="*60)
    print("[]   ")
    print("="*60)

    for endpoint, status in results.items():
        emoji = "[]" if "" in status else "[]" if "" in status else "[]"
        print(f"{emoji} {endpoints[next(i for i, (e, _) in enumerate(endpoints) if e == endpoint)][1]}: {status}")

    print("\n" + "="*60)

    if all_success:
        print("[]  !     !")
        print(f"\n[]  URL: {base_url}")
        print("\n[]  :")
        print("1.      ")
        print("2. AI       ")
        print("3.  HTML  ")
    else:
        print("[]    .")
        print("\n[]  :")
        print("1. Render    (3-5 )")
        print("2.     ")
        print("3.   ")
        print("\n[]  :")
        print("1. 5   ")
        print("2. Render Dashboard Deploy logs ")
        print("3. Manual Deploy ")

    print("="*60)

    return all_success

def monitor_deployment(max_attempts=10, interval=30):
    """  ( 5)"""
    print("[]     ( 5)\n")

    for attempt in range(1, max_attempts + 1):
        print(f"\n[]  {attempt}/{max_attempts}")
        print("-"*60)

        if check_deployment_status():
            return True

        if attempt < max_attempts:
            print(f"\n[] {interval}  ...")
            time.sleep(interval)

    print("\n[]    ")
    print("Render Dashboard  :")
    print("https://dashboard.render.com")
    return False

if __name__ == "__main__":
    #
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--monitor":
        success = monitor_deployment()
    else:
        success = check_deployment_status()

    sys.exit(0 if success else 1)