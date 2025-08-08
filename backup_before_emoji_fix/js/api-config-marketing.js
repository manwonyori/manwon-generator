// 마케팅 전문가 & 웹디자이너 API 설정

const MARKETING_CONFIG = {
    // 시장조사 프롬프트
    MARKET_RESEARCH_PROMPTS: {
        // 시장 분석 조사
        marketAnalysis: (productName, category) => `
당신은 10년차 시장조사 전문가입니다. 다음 제품에 대한 철저한 시장 분석을 수행하세요:

제품명: ${productName}
카테고리: ${category}

분석 항목:
1. 시장 규모 및 성장률
2. 주요 경쟁사 및 제품 (최소 10개)
3. 가격대별 포지셔닝 맵
4. 소비자 선호도 트렌드
5. 구매 결정 요인 순위

각 항목에 대해 구체적인 수치와 함께 JSON 형식으로 응답하세요:
{
    "marketSize": "시장 규모 (억원)",
    "growthRate": "연평균 성장률 (%)",
    "competitors": [
        {
            "brand": "브랜드명",
            "product": "제품명",
            "price": "가격",
            "volume": "용량",
            "marketShare": "시장점유율"
        }
    ],
    "consumerTrends": ["트렌드1", "트렌드2"],
    "purchaseFactors": ["요인1", "요인2"]
}`,

        // 경쟁사 비교 분석
        competitorAnalysis: (productInfo, competitors) => `
당신은 경쟁 분석 전문가입니다. 다음 제품과 경쟁사 제품들을 비교 분석하세요:

대상 제품: ${JSON.stringify(productInfo)}
경쟁사 제품들: ${JSON.stringify(competitors)}

분석 항목:
1. 가격 경쟁력 (가성비 지수)
2. 제품 차별화 포인트
3. 품질/성분 비교
4. 패키징/디자인 차별성
5. 유통 채널 분석

법적 주의사항:
- 경쟁사 직접 비방 금지
- 객관적 사실만 기재
- 검증 가능한 데이터만 사용

JSON 형식으로 응답하세요.`,

        // 고객 리뷰 분석
        reviewAnalysis: (productName, reviews) => `
당신은 소비자 행동 분석 전문가입니다. 다음 제품의 리뷰를 분석하세요:

제품: ${productName}
리뷰 데이터: ${reviews}

분석 항목:
1. 긍정/부정 비율
2. 주요 긍정 키워드 TOP 10
3. 주요 부정 키워드 TOP 5
4. 구매 동기 분석
5. 개선 요구사항

감성 분석과 함께 구체적인 인사이트를 JSON 형식으로 제공하세요.`
    },

    // 정보 검증 프롬프트
    VERIFICATION_PROMPTS: {
        // 정보 교차 검증
        crossVerification: (info, sources) => `
당신은 팩트체커 전문가입니다. 다음 정보의 정확성을 검증하세요:

검증 대상 정보: ${JSON.stringify(info)}
정보 출처들: ${JSON.stringify(sources)}

검증 기준:
1. 3개 이상 독립 소스에서 확인
2. 정보 일치도 평가
3. 신뢰도 점수 부여 (1-100)
4. 상충 정보 식별
5. 최종 검증 결과

다음 형식으로 응답하세요:
{
    "verified": true/false,
    "confidenceScore": 85,
    "consistentSources": ["소스1", "소스2"],
    "conflicts": ["상충정보"],
    "finalValue": "검증된 최종값",
    "recommendation": "권장사항"
}`,

        // 법적 컴플라이언스 체크
        legalCompliance: (content) => `
당신은 광고법 전문 변호사입니다. 다음 내용의 법적 문제를 검토하세요:

검토 대상: ${content}

체크 항목:
1. 허위/과장 광고 요소
2. 경쟁사 비방 표현
3. 부정경쟁방지법 위반
4. 표시광고법 준수
5. 의무 표시사항 누락

위반 사항이 있다면 수정안과 함께 JSON 형식으로 응답하세요.`
    },

    // 마케팅 전략 프롬프트
    MARKETING_STRATEGY_PROMPTS: {
        // 타겟 고객 분석
        targetAnalysis: (productInfo, marketData) => `
당신은 타겟 마케팅 전문가입니다. 다음 제품의 핵심 타겟을 정의하세요:

제품 정보: ${JSON.stringify(productInfo)}
시장 데이터: ${JSON.stringify(marketData)}

분석 항목:
1. 주요 타겟층 (1차, 2차)
2. 인구통계학적 특성
3. 라이프스타일 특성
4. 구매력 및 소비 패턴
5. 미디어 이용 행태

페르소나 3개를 구체적으로 작성하여 JSON 형식으로 응답하세요.`,

        // 핵심 가치 제안
        valueProposition: (productInfo, competitorData, targetAudience) => `
당신은 브랜드 전략가입니다. 제품의 핵심 가치 제안을 개발하세요:

제품: ${JSON.stringify(productInfo)}
경쟁사: ${JSON.stringify(competitorData)}
타겟: ${JSON.stringify(targetAudience)}

개발 항목:
1. 핵심 베네핏 3가지 (검증된 것만)
2. 차별화 포인트 (경쟁사 비방 없이)
3. 감성적 가치
4. 기능적 가치
5. 구매 전환 메시지

소비자 심리를 고려한 설득력 있는 메시지를 JSON 형식으로 작성하세요.`
    },

    // 상품페이지 생성 프롬프트
    PRODUCT_PAGE_PROMPTS: {
        // 헤드라인 생성
        createHeadline: (productName, keyBenefit) => `
당신은 카피라이터입니다. 즉시 구매를 유도하는 헤드라인을 작성하세요:

제품: ${productName}
핵심 베네핏: ${keyBenefit}

요구사항:
1. 20자 이내
2. 강력한 구매 동기 부여
3. 감성적 어필
4. 신뢰감 전달
5. 차별화 강조

5개의 헤드라인 옵션을 제시하세요.`,

        // 상품 설명 생성
        createDescription: (verifiedInfo, targetAudience, valueProps) => `
당신은 퍼포먼스 마케터입니다. 구매 전환율을 높이는 상품 설명을 작성하세요:

검증된 정보: ${JSON.stringify(verifiedInfo)}
타겟 고객: ${JSON.stringify(targetAudience)}
가치 제안: ${JSON.stringify(valueProps)}

구성:
1. 문제 제기 (고객 페인포인트)
2. 해결책 제시 (제품 베네핏)
3. 차별화 포인트
4. 사용 시나리오
5. 구매 촉구

HTML 형식으로 작성하되, 모든 내용은 검증된 사실만 포함하세요.`
    }
};

// 정보 검증 함수
async function verifyInformation(info, sources) {
    if (!window.callAI) {
        console.warn('AI API가 설정되지 않았습니다. Mock 데이터를 반환합니다.');
        return {
            verified: true,
            confidenceScore: 75,
            message: 'Mock 검증 데이터',
            finalValue: info,
            consistentSources: sources?.slice(0, 2) || [],
            conflicts: [],
            recommendation: '추가 검증 권장'
        };
    }

    try {
        const prompt = MARKETING_CONFIG.VERIFICATION_PROMPTS.crossVerification(info, sources);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('정보 검증 실패:', error);
        return {
            verified: true,
            confidenceScore: 65,
            error: error.message,
            finalValue: info,
            consistentSources: sources?.slice(0, 1) || [],
            conflicts: [],
            recommendation: 'AI 검증 실패로 기본값 사용'
        };
    }
}

// 시장 조사 함수
async function conductMarketResearch(productName, category) {
    if (!window.callAI) {
        console.warn('AI API가 설정되지 않았습니다. Mock 데이터를 반환합니다.');
        return {
            marketSize: "2800억원",
            growthRate: "8.5%",
            competitors: [
                { brand: "A브랜드", product: "A제품", price: "16,900원", marketShare: "12%" },
                { brand: "B브랜드", product: "B제품", price: "18,500원", marketShare: "10%" }
            ],
            consumerTrends: ["간편식 선호", "1인 가구 증가"],
            purchaseFactors: ["맛", "가격", "편의성"]
        };
    }

    try {
        const prompt = MARKETING_CONFIG.MARKET_RESEARCH_PROMPTS.marketAnalysis(productName, category);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('시장 조사 실패:', error);
        return {
            marketSize: "Mock 데이터",
            growthRate: "N/A",
            competitors: [],
            consumerTrends: ["간편식 선호"],
            purchaseFactors: ["맛", "가격"]
        };
    }
}

// 법적 검토 함수
async function checkLegalCompliance(content) {
    if (!window.callAI) {
        console.warn('AI API가 설정되지 않았습니다. 기본 검토 결과를 반환합니다.');
        return {
            compliant: true,
            issues: [],
            message: 'Mock 검토 완료'
        };
    }

    try {
        const prompt = MARKETING_CONFIG.VERIFICATION_PROMPTS.legalCompliance(content);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('법적 검토 실패:', error);
        return {
            compliant: true,
            issues: [],
            error: error.message
        };
    }
}