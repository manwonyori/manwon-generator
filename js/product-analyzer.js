// 제품 분석 및 전략 수립 모듈
// AI가 제품을 먼저 이해하고 전략을 수립한 후 콘텐츠를 생성합니다.

// 제품 분석 시스템
const ProductAnalyzer = {
    // 1단계: 제품 정보 수집 및 분석
    async analyzeProduct(productName, referenceUrl = null) {
        console.log('🔍 제품 분석 시작:', productName);
        
        const analysis = {
            productName: productName,
            timestamp: new Date().toISOString(),
            category: await this.detectCategory(productName),
            targetAudience: await this.identifyTargetAudience(productName),
            keyFeatures: await this.extractKeyFeatures(productName),
            competitiveAdvantage: await this.findCompetitiveAdvantage(productName),
            marketPosition: await this.analyzeMarketPosition(productName),
            contentStrategy: null,
            recommendedTone: null,
            keyMessages: []
        };
        
        // 2단계: 콘텐츠 전략 수립
        analysis.contentStrategy = await this.developContentStrategy(analysis);
        
        // 3단계: 톤앤매너 결정
        analysis.recommendedTone = await this.determineTonevManor(analysis);
        
        // 4단계: 핵심 메시지 도출
        analysis.keyMessages = await this.extractKeyMessages(analysis);
        
        console.log('✅ 제품 분석 완료:', analysis);
        return analysis;
    },
    
    // 카테고리 감지
    async detectCategory(productName) {
        const categories = {
            food: ['떡', '김치', '장', '소스', '양념', '반찬', '국', '찌개', '밥', '면', '육류', '해산물', '닭', '돼지', '소', '생선', '닭발', '족발', '순대'],
            kitchenware: ['팬', '냄비', '도마', '칼', '주방', '조리', '그릇', '접시', '컵'],
            appliance: ['에어프라이어', '전기', '믹서', '블렌더', '오븐', '밥솥'],
            ingredients: ['재료', '가루', '오일', '기름', '소금', '설탕', '간장'],
            snacks: ['과자', '스낵', '쿠키', '빵', '케이크', '초콜릿', '사탕'],
            beverage: ['차', '커피', '음료', '주스', '술', '맥주', '소주', '와인']
        };
        
        const lowerName = productName.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerName.includes(keyword))) {
                return category;
            }
        }
        
        return 'general';
    },
    
    // 타겟 고객 분석
    async identifyTargetAudience(productName) {
        // v9.0 프롬프트와 연계하여 타겟 분석
        const prompt = `
        제품명: ${productName}
        
        이 제품의 주요 타겟 고객층을 분석해주세요:
        1. 연령대
        2. 성별
        3. 라이프스타일
        4. 구매 동기
        5. 가격 민감도
        
        간단명료하게 3-4줄로 요약해주세요.
        `;
        
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            try {
                const result = await callAI(prompt, 'analysis');
                if (result) return result;
            } catch (error) {
                console.error('AI 호출 오류:', error);
            }
        }
        
        return '만원으로 품질 좋은 제품을 찾는 실속형 소비자';
    },
    
    // 핵심 특징 추출
    async extractKeyFeatures(productName) {
        const prompt = `
        제품명: ${productName}
        
        이 제품의 핵심 특징을 3가지로 정리해주세요:
        1. 가장 중요한 특징
        2. 차별화 포인트
        3. 고객 혜택
        
        각각 한 줄로 간단명료하게 작성해주세요.
        `;
        
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const result = await callAI(prompt, 'analysis');
            if (result) {
                try {
                    return result.split('\n').filter(line => line.trim());
                } catch (e) {
                    return [result];
                }
            }
        }
        
        return [
            '뛰어난 가성비',
            '검증된 품질',
            '만원요리 최씨남매의 엄선'
        ];
    },
    
    // 경쟁 우위 분석
    async findCompetitiveAdvantage(productName) {
        const prompt = `
        제품명: ${productName}
        만원요리 최씨남매 브랜드 특성: 가성비, 실속, 정직한 추천
        
        이 제품이 시장에서 가질 수 있는 경쟁 우위를 2가지 제시해주세요.
        각각 한 문장으로 작성하고, 구체적이고 신뢰감 있게 표현해주세요.
        `;
        
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            try {
                const result = await callAI(prompt, 'analysis');
                if (result) return result;
            } catch (error) {
                console.error('AI 호출 오류:', error);
            }
        }
        
        return '합리적인 가격대비 우수한 품질로 고객 만족도를 극대화합니다.';
    },
    
    // 시장 포지션 분석
    async analyzeMarketPosition(productName) {
        return {
            pricePosition: 'value', // premium, value, budget
            qualityLevel: 'high',  // high, medium, standard
            brandFit: 'perfect'    // perfect, good, average
        };
    },
    
    // 콘텐츠 전략 수립
    async developContentStrategy(analysis) {
        const strategies = {
            food: {
                focus: '맛과 품질',
                approach: '신선함과 정성을 강조',
                keywords: ['맛있는', '신선한', '정성', '건강한', 'HACCP'],
                emotionalAppeal: '가족의 건강과 행복'
            },
            kitchenware: {
                focus: '실용성과 내구성',
                approach: '편리함과 가성비 강조',
                keywords: ['편리한', '튼튼한', '실용적인', '오래가는'],
                emotionalAppeal: '요리의 즐거움'
            },
            general: {
                focus: '가성비와 신뢰',
                approach: '최씨남매의 검증 강조',
                keywords: ['가성비', '추천', '검증된', '만족도 높은'],
                emotionalAppeal: '현명한 선택'
            }
        };
        
        return strategies[analysis.category] || strategies.general;
    },
    
    // 톤앤매너 결정
    async determineTonevManor(analysis) {
        // v9.0 시스템과 연계
        const tones = {
            food: '따뜻하고 친근한, 엄마의 마음으로',
            kitchenware: '실용적이고 전문적인, 믿음직한 조언자',
            appliance: '스마트하고 현대적인, 라이프스타일 파트너',
            general: '정직하고 친근한, 이웃집 최씨남매'
        };
        
        return {
            primary: tones[analysis.category] || tones.general,
            style: '대화체, 쉽고 편안한 설명',
            emotion: '신뢰감과 친근감을 동시에'
        };
    },
    
    // 핵심 메시지 도출
    async extractKeyMessages(analysis) {
        const prompt = `
        제품명: ${analysis.productName}
        카테고리: ${analysis.category}
        타겟: ${analysis.targetAudience}
        
        만원요리 최씨남매 스타일로 이 제품의 핵심 메시지 3개를 작성해주세요:
        1. 헤드라인 (15자 이내)
        2. 서브 카피 (25자 이내)
        3. CTA 문구 (20자 이내)
        
        반드시 친근하고 가성비를 강조하는 톤으로 작성해주세요.
        `;
        
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const result = await callAI(prompt, 'analysis');
            if (result) {
                try {
                    const lines = result.split('\n').filter(line => line.trim());
                    return {
                        headline: lines[0] || `${analysis.productName}, 만원의 행복`,
                        subCopy: lines[1] || '최씨남매가 직접 골랐어요',
                        cta: lines[2] || '지금 만나보세요!'
                    };
                } catch (e) {
                    console.error('메시지 파싱 오류:', e);
                }
            }
        }
        
        return {
            headline: `${analysis.productName}, 만원의 행복`,
            subCopy: '최씨남매가 직접 골랐어요',
            cta: '지금 만나보세요!'
        };
    },
    
    // 분석 결과 기반 콘텐츠 생성 가이드
    generateContentGuide(analysis) {
        return {
            heritageStory: {
                focus: analysis.contentStrategy.emotionalAppeal,
                keywords: analysis.contentStrategy.keywords,
                length: '3-4문단',
                style: analysis.recommendedTone.primary
            },
            benefits: {
                count: 5,
                focus: analysis.keyFeatures,
                style: '구체적이고 실용적인'
            },
            trustContent: {
                approach: analysis.competitiveAdvantage,
                tone: '진정성 있는 추천'
            },
            faq: {
                topics: [
                    '품질 관련',
                    '사용/조리 방법',
                    '보관 방법',
                    '배송 관련'
                ]
            }
        };
    },
    
    // 분석 결과 포맷팅 (미리보기용)
    formatAnalysisReport(analysis) {
        return `
<div style="font-family: 'Noto Sans KR', sans-serif; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h2 style="color: #E4A853; margin-bottom: 20px;">🔍 제품 분석 리포트</h2>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">📦 제품 정보</h3>
        <p><strong>제품명:</strong> ${analysis.productName}</p>
        <p><strong>카테고리:</strong> ${analysis.category}</p>
        <p><strong>분석 시간:</strong> ${new Date(analysis.timestamp).toLocaleString('ko-KR')}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">🎯 타겟 고객</h3>
        <p>${analysis.targetAudience}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">✨ 핵심 특징</h3>
        <ul style="color: #6B7280;">
            ${analysis.keyFeatures ? analysis.keyFeatures.map(feature => `<li>${feature}</li>`).join('') : '<li>뛰어난 가성비</li><li>검증된 품질</li><li>만원요리 최씨남매의 엄선</li>'}
        </ul>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">🏆 경쟁 우위</h3>
        <p>${analysis.competitiveAdvantage}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">📝 콘텐츠 전략</h3>
        <p><strong>포커스:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.focus : '가성비와 품질'}</p>
        <p><strong>접근법:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.approach : '정직한 추천'}</p>
        <p><strong>핵심 키워드:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.keywords.join(', ') : '가성비, 품질, 추천'}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">💬 추천 톤앤매너</h3>
        <p>${analysis.recommendedTone ? analysis.recommendedTone.primary : '친근하고 정직한'}</p>
        <p style="color: #6B7280; font-size: 14px;">${analysis.recommendedTone ? analysis.recommendedTone.style : '대화체, 쉽고 편안한 설명'}</p>
    </div>
    
    <div style="background: #E4A853; color: white; padding: 15px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">${analysis.keyMessages ? analysis.keyMessages.headline : '만원의 행복'}</h3>
        <p style="margin: 0 0 10px 0;">${analysis.keyMessages ? analysis.keyMessages.subCopy : '최씨남매가 직접 골랐어요'}</p>
        <button style="background: white; color: #E4A853; border: none; padding: 8px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">
            ${analysis.keyMessages ? analysis.keyMessages.cta : '지금 만나보세요!'}
        </button>
    </div>
</div>
        `;
    }
};

// 전역 객체로 노출
window.ProductAnalyzer = ProductAnalyzer;

console.log('✅ 제품 분석 모듈 로드 완료');