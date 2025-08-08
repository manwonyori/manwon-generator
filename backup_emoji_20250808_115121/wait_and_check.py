"""

"""
import time
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def wait_and_check(wait_minutes=3):
    """     """
    base_url = "https://manwon-generator.onrender.com"

    print("="*60)
    print(f"[] {wait_minutes}    ")
    print("="*60)

    #  을 30
    total_seconds = wait_minutes * 60
    for i in range(0, total_seconds, 30):
        remaining = total_seconds - i
        mins = remaining // 60
        secs = remaining % 60
        print(f"\r : {mins:02d}:{secs:02d}", end="", flush=True)
        if i < total_seconds - 30:
            time.sleep(30)

    print("\n\n[]    ...")
    print("-"*60)

    #  URL
    test_urls = [
        ("/health", "Health Check"),
        ("/", " "),
        ("/mode-selector.html", " "),
        ("/index.html", "AI "),
        ("/detail-input.html", " ")
    ]

    success_count = 0
    fail_count = 0

    for endpoint, description in test_urls:
        url = f"{base_url}{endpoint}"
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                #
                if endpoint == "/health":
                    try:
                        data = r.json()
                        if data.get('status') == 'healthy':
                            print(f"[] {description}: OK")
                            success_count += 1
                        else:
                            print(f"[] {description}: {data}")
                            fail_count += 1
                    except:
                        print(f"[] {description}: Invalid JSON")
                        fail_count += 1
                elif endpoint in ["/mode-selector.html", "/detail-input.html"]:
                    #
                    if "" in r.text or "mode" in r.text.lower():
                        print(f"[] {description}: OK ( )")
                        success_count += 1
                    else:
                        print(f"[] {description}:    ")
                        fail_count += 1
                else:
                    print(f"[] {description}: OK")
                    success_count += 1
            else:
                print(f"[] {description}: HTTP {r.status_code}")
                fail_count += 1
        except Exception as e:
            print(f"[] {description}: {str(e)[:50]}")
            fail_count += 1

    print("-"*60)
    print(f"\n[] :  {success_count}/{len(test_urls)},  {fail_count}/{len(test_urls)}")

    if success_count == len(test_urls):
        print("\n[]  !  가  !")
        print(f"[] : {base_url}")
        return True
    elif fail_count > 0:
        print("\n[]  에  .")
        print("Render Dashboard  를 .")
        return False

    return False

if __name__ == "__main__":
    #      ( 3)
    wait_mins = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    success = wait_and_check(wait_mins)
    sys.exit(0 if success else 1)