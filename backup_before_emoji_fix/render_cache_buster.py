#!/usr/bin/env python3
"""
Render 캐시 무효화를 위한 스크립트
매번 다른 값으로 강제 리빌드를 트리거합니다.
"""
import datetime
import hashlib

def generate_cache_buster():
    """현재 시간 기반 캐시 무효화 문자열 생성"""
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    hash_str = hashlib.md5(f"manwon-generator-{timestamp}".encode()).hexdigest()[:8]
    return f"DOCKER_DEPLOY_{timestamp}_{hash_str}"

if __name__ == "__main__":
    cache_buster = generate_cache_buster()
    print(f"Cache Buster: {cache_buster}")
    
    # requirements.txt 업데이트
    with open('requirements.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 마지막 줄 교체
    lines = content.strip().split('\n')
    if lines[-1].startswith('# DOCKER FORCE REBUILD'):
        lines[-1] = f"# DOCKER FORCE REBUILD {cache_buster}"
    else:
        lines.append(f"# DOCKER FORCE REBUILD {cache_buster}")
    
    with open('requirements.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    
    print("✅ requirements.txt 캐시 무효화 완료")