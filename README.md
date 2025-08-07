# 만원요리 최씨남매 상세페이지 생성기 v9.0

## 간편 명령어 시스템

제품명, 참조 사이트, 이미지 링크만 입력하면 완벽한 상세페이지를 자동 생성합니다.

## 사용 방법

### 1. API 키 설정
- OpenAI (GPT) 또는 Claude API 키 입력
- 한 번 입력하면 자동 저장됨

### 2. 명령어 입력
```
[인생]국물닭발800g
참조 사이트 https://insaengdomae.imweb.me/53/?idx=531
이미지 링크
https://ecimg.cafe24img.com/pg1966b42244249021/manwonyori/web/product/life/feer800g/feet800g-1.jpg
https://ecimg.cafe24img.com/pg1966b42244249021/manwonyori/web/product/life/feer800g/feet800g-2.jpg
https://ecimg.cafe24img.com/pg1966b42244249021/manwonyori/web/product/life/feer800g/feet800g-3.jpg
```

### 3. 즉시 생성하기 클릭
- AI가 제품 분석
- 맞춤형 콘텐츠 생성
- HTML 파일 자동 다운로드
  - 파일명 형식: `회사명_제품명_날짜_시간.html`
  - 예시: `인생_국물닭발800g_20250107_1430.html`

## 특징

### 자동 분석
- 제품 카테고리 자동 감지
- 타겟 고객 분석
- 핵심 키워드 추출

### 맞춤형 콘텐츠
- 제품별 최적화된 스토리
- 카테고리별 전문 콘텐츠
- v9.0 디자인 시스템 적용

### 간편한 사용
- 복잡한 폼 입력 불필요
- 텍스트 기반 명령어
- 샘플 예제 제공

## 기술 스택
- Vanilla JavaScript
- OpenAI GPT / Claude API
- 반응형 HTML/CSS
- Cafe24 최적화

## 파일 구조
```
manwon-generator/
├── index.html          # 메인 페이지
├── css/
│   └── style.css      # 스타일시트
├── js/
│   ├── command-system.js    # 명령어 처리
│   ├── product-analyzer.js  # 제품 분석
│   ├── generator.js         # HTML 생성
│   └── ...                  # 기타 모듈
└── products/           # 생성된 제품 페이지
    ├── 인생_국물닭발800g/
    │   ├── index.html          # 상세페이지
    │   └── cafe24_seo.txt      # SEO 정보
    ├── 인생_통마늘닭근위양념볶음250g/
    │   ├── index.html
    │   ├── cafe24_seo.json
    │   └── cafe24_seo.txt
    ├── 인생_닭볶음탕1kg/
    │   ├── index.html
    │   ├── cafe24_seo.json
    │   └── cafe24_seo.txt
    └── 인생_매콤돼지곱창볶음280g/
        ├── index.html
        ├── cafe24_seo.json
        └── cafe24_seo.txt
```

## 실행 방법
1. `index.html` 파일을 웹 브라우저에서 열기
2. 또는 `run.bat` 더블클릭 (Windows)

## 문의
- 이메일: we@manwonyori.com
- 전화: 070-8835-2885
- 사이트: 만원요리 최씨남매

---
© 2024 만원요리 최씨남매. All rights reserved.