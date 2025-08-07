#!/usr/bin/env python3
"""
최종 확인
"""
import requests
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=" * 70)
print("  최종 배포 확인")
print("=" * 70)

base_url = "https://manwon-generator.onrender.com"

# 5분 동안 30초마다 확인
for i in range(1, 11):
    print(f"\n[{i}/10] 확인 중...")
    
    try:
        # 메인 페이지
        r = requests.get(base_url, timeout=10)
        if r.status_code == 200:
            content = r.text[:500]  # 처음 500자만
            
            # 새 버전 체크
            if "만원요리 상세페이지 생성기 - 완성" in r.text:
                print("🎉 새 버전 타이틀 확인!")
            if "mode-selector" in r.text or "modeSelector" in r.text:
                print("🎉 모드 선택 시스템 확인!")
            if "AI 자동 생성" in r.text:
                print("🎉 AI 모드 확인!")
            if "상세 정보 입력" in r.text:
                print("🎉 상세 입력 모드 확인!")
                
            # 구 버전 체크
            if "teamPassword" in r.text:
                print("❌ 아직 구 버전 (로그인 시스템)")
            
            # Health 체크
            try:
                health = requests.get(f"{base_url}/health", timeout=5)
                if health.status_code == 200:
                    print("✅ Flask 서버 작동 중!")
                else:
                    print(f"⚠️ Health: {health.status_code}")
            except:
                print("⚠️ Flask 서버 미작동")
                
    except Exception as e:
        print(f"오류: {e}")
    
    if i < 10:
        time.sleep(30)

print("\n" + "=" * 70)
print("확인 완료")