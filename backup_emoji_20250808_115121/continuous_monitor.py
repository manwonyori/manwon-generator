"""

"""
import time
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def monitor_deployment(max_minutes=10):
    """   """
    base_url = "https://manwon-generator.onrender.com"
    check_interval = 30  # 30
    max_checks = max_minutes * 2  # 10 = 20

    print("="*60)
    print("    ")
    print("="*60)
    print(f"URL: {base_url}")
    print(f"  : {max_minutes}")
    print(f" : {check_interval}")
    print("="*60)

    success_endpoints = []

    for check_num in range(1, max_checks + 1):
        print(f"\n[ {check_num}/{max_checks}] {time.strftime('%H:%M:%S')}")

        #
        endpoints_to_check = [
            ("/health", "Health Check"),
            ("/mode-selector.html", " "),
            ("/index.html", "AI "),
            ("/detail-input.html", " ")
        ]

        current_success = []

        for endpoint, name in endpoints_to_check:
            try:
                response = requests.get(f"{base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    print(f"  [] {name}")
                    current_success.append(endpoint)
                else:
                    print(f"  [] {name}: HTTP {response.status_code}")
            except Exception as e:
                print(f"  [] {name}:  ")

        #  가 하면
        if len(current_success) == len(endpoints_to_check):
            print("\n" + "="*60)
            print("[ ]  가  !")
            print("="*60)

            #
            print("  를 합니다...")
            try:
                import subprocess
                result = subprocess.run(
                    [sys.executable, 'complete_test.py'],
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    timeout=60
                )

                if "률: 100" in result.stdout or "  " in result.stdout:
                    print("[ ]  가 되었습니다!")
                    return True
                else:
                    print("[부 ]      .")
                    print(" :")
                    print(result.stdout[-500:])  #  500
            except Exception as e:
                print(f"   : {e}")

            return True

        #
        progress = len(current_success) / len(endpoints_to_check) * 100
        print(f"  : {progress:.0f}% ({len(current_success)}/{len(endpoints_to_check)})")

        if check_num < max_checks:
            print(f"  {check_interval}  재...")
            time.sleep(check_interval)

    print(f"\n[] {max_minutes}  .  이 .")
    print("\nRender Dashboard  :")
    print("1. https://dashboard.render.com ")
    print("2. manwon-generator   ")
    print("3. Deploy logs ")
    print("4. Manual Deploy ")

    return False

if __name__ == "__main__":
    #
    max_mins = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    success = monitor_deployment(max_mins)
    sys.exit(0 if success else 1)