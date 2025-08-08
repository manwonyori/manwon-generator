#!/usr/bin/env python3
"""
Render
     .
"""
import datetime
import hashlib

def generate_cache_buster():
    """      """
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    hash_str = hashlib.md5(f"manwon-generator-{timestamp}".encode()).hexdigest()[:8]
    return f"DOCKER_DEPLOY_{timestamp}_{hash_str}"

if __name__ == "__main__":
    cache_buster = generate_cache_buster()
    print(f"Cache Buster: {cache_buster}")

    # requirements.txt
    with open('requirements.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    #
    lines = content.strip().split('\n')
    if lines[-1].startswith('# DOCKER FORCE REBUILD'):
        lines[-1] = f"# DOCKER FORCE REBUILD {cache_buster}"
    else:
        lines.append(f"# DOCKER FORCE REBUILD {cache_buster}")

    with open('requirements.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    print(" requirements.txt   ")