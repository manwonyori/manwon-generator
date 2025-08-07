// API 설정 파일

// v9.0 시스템 프롬프트 로드 (없을 경우 기본값 사용)
let MANWON_SYSTEM_PROMPT_V9 = '';
let getEnhancedPrompt = null;

// 기본 getEnhancedPrompt 함수 정의 (v9.0이 로드되지 않은 경우 사용)
function defaultGetEnhancedPrompt(originalPrompt, contentType) {
    return originalPrompt;
}

// 스크립트 로드를 대기하는 함수
function loadV9Prompt() {
    try {
        // manwon-prompt-v9.js가 로드되었는지 확인
        if (typeof window !== 'undefined' && window.MANWON_SYSTEM_PROMPT_V9) {
            MANWON_SYSTEM_PROMPT_V9 = window.MANWON_SYSTEM_PROMPT_V9;
            getEnhancedPrompt = window.getEnhancedPrompt || defaultGetEnhancedPrompt;
            console.log('✅ v9.0 프롬프트 로드 완료');
            return true;
        } else {
            getEnhancedPrompt = defaultGetEnhancedPrompt;
            console.log('⚠️ v9.0 프롬프트 미로드, 기본 설정 사용');
            return false;
        }
    } catch (e) {
        console.log('v9.0 프롬프트 로드 중 오류, 기본 설정 사용:', e);
        getEnhancedPrompt = defaultGetEnhancedPrompt;
        return false;
    }
}

// 초기 로드 시도
loadV9Prompt();

// DOM 로드 완료 후 재시도
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadV9Prompt, 100);
    });
} else {
    setTimeout(loadV9Prompt, 100);
}

const API_CONFIG = {
    // OpenAI API 설정 - localStorage에서 가져오기
    OPENAI_API_KEY: localStorage.getItem('OPENAI_API_KEY') || 'YOUR_API_KEY_HERE',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    
    // Claude API 설정
    CLAUDE_API_KEY: localStorage.getItem('CLAUDE_API_KEY') || 'YOUR_API_KEY_HERE',
    CLAUDE_API_URL: 'https://api.anthropic.com/v1/messages',
    
    // 응답 대기 시간 설정
    RESPONSE_TIME: parseInt(localStorage.getItem('AI_RESPONSE_TIME') || '5000'),
    
    // 프롬프트 템플릿
    PROMPTS: {
        heritageStory: (productName) => `
            당신은 만원요리 최씨남매의 전문 콘텐츠 작가입니다. "${productName}"에 대한 풍부하고 매력적인 제품 스토리를 작성해주세요.

            작성 가이드라인:
            - 친근하고 따뜻한 톤, 마치 가족이 이야기하는 듯한 느낌
            - 중요한 키워드나 강조할 부분은 <strong> 태그로 감싸기
            - 구체적이고 생생한 표현 사용
            - 고객이 공감할 수 있는 스토리

            내용 구성 (총 400-500자, 3-4문단):
            1. 제품 개발 배경: "만원요리 최씨남매가 <strong>직접 개발</strong>한..." 식으로 시작
            2. 특별한 제조 과정이나 레시피: 핵심 포인트를 <strong> 태그로 강조
            3. 제품의 맛과 특징: 맛을 표현할 때 강조 표현 사용
            4. 고객에게 전하는 메시지: 가성비나 만족도 부분 강조

            HTML 형식 예시:
            <p>만원요리 최씨남매가 <strong>직접 엄선</strong>한 재료로...</p>
            <p><strong>24시간 숙성</strong>시킨 특별한 양념이...</p>
            
            반드시 완전한 문장으로 끝내고, 자연스럽게 연결되도록 작성해주세요.
        `,
        
        trustContent: (productName) => `
            만원요리 최씨남매가 "${productName}"을 추천하는 이유를 작성해주세요.
            
            요구사항:
            - "정말 가성비 좋은 제품이에요!" 같은 직접적인 추천 멘트 포함
            - 실제 사용 경험을 바탕으로 한 듯한 톤
            - 2-3개의 추천 이유를 포함
            - HTML 형식으로 반환 (highlight 클래스 활용)
            - 완전한 문장으로 끝나야 함
            
            반드시 완전한 문장으로 끝내주세요.
        `,
        
        painPoints: (productName) => `
            "${productName}"이 해결하는 고객의 고민/문제점을 작성해주세요.
            - "~하셨나요?" 형식의 공감 질문
            - 2-3개의 구체적인 상황 제시
            - HTML 형식으로 반환
        `,
        
        benefits: (productName) => `
            "${productName}"의 주요 혜택/장점을 5개 나열해주세요.
            - 각 항목은 간결하게 한 줄로
            - 구체적이고 실용적인 내용
            - 배열 형태로 반환
        `,
        
        usageGuide: (productName) => `
            "${productName}"의 사용법과 활용 팁을 작성해주세요.
            - 단계별 사용법 (ol 태그)
            - 추가 활용 팁
            - HTML 형식으로 반환
        `,
        
        features: (productName) => `
            "${productName}"의 핵심 특징을 5개 나열해주세요.
            - 제품의 차별화 포인트
            - 기술적 특징이나 품질 관련
            - 배열 형태로 반환
        `,
        
        faq: (productName) => `
            "${productName}"에 대한 자주 묻는 질문 3개를 작성해주세요.
            - 실제 고객이 궁금해할 만한 내용
            - Q&A 형식
            - faq-item 클래스를 사용한 HTML 형식으로 반환
        `
    }
};

// 컨텐츠별 최적 API 선택
function selectOptimalAPI(contentType) {
    const hasOpenAI = API_CONFIG.OPENAI_API_KEY && API_CONFIG.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE';
    const hasClaude = API_CONFIG.CLAUDE_API_KEY && API_CONFIG.CLAUDE_API_KEY !== 'YOUR_API_KEY_HERE';
    
    // 방안 B: 컨텐츠별 최적 API 선택
    const apiPreference = {
        'heritageStory': 'claude',    // Claude가 더 창의적인 스토리텔링
        'trustContent': 'claude',      // Claude가 더 자연스러운 추천
        'painPoints': 'gpt',          // GPT가 더 구조화된 문제 분석
        'benefits': 'gpt',            // GPT가 더 체계적인 목록 생성
        'usageGuide': 'gpt',          // GPT가 더 명확한 설명서
        'features': 'gpt',            // GPT가 더 기술적인 특징 설명
        'faq': 'gpt'                  // GPT가 더 정확한 Q&A
    };
    
    const preferred = apiPreference[contentType] || 'gpt';
    
    // 선호 API가 사용 가능한지 확인
    if (preferred === 'claude' && hasClaude) {
        return 'claude';
    } else if (preferred === 'gpt' && hasOpenAI) {
        return 'gpt';
    }
    
    // 폴백: 사용 가능한 API 반환
    if (hasOpenAI) return 'gpt';
    if (hasClaude) return 'claude';
    
    return null;
}

// Claude API 호출 함수
async function callClaude(prompt, contentType) {
    try {
        // v9.0 프롬프트로 강화
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;
        
        // 충분한 검토 시간을 위한 지연
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RESPONSE_TIME));
        
        const response = await fetch(API_CONFIG.CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_CONFIG.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 3000,
                temperature: 0.7,
                system: MANWON_SYSTEM_PROMPT_V9 || '당신은 만원요리 최씨남매의 전문 콘텐츠 작가입니다.',
                messages: [{
                    role: 'user',
                    content: enhancedPrompt
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Claude API 호출 실패');
        }

        const data = await response.json();
        const content = data.content[0].text;
        
        // 응답이 완전한지 확인
        if (data.stop_reason === 'max_tokens') {
            console.warn('Claude 응답이 토큰 제한으로 잘렸습니다.');
            return content + '\n\n<p><em>※ 응답이 길어서 일부 내용이 생략되었을 수 있습니다.</em></p>';
        }
        
        return content;
    } catch (error) {
        console.error('Claude API 오류:', error);
        return null;
    }
}

// 통합 API 호출 함수
async function callAI(prompt, contentType) {
    const selectedAPI = selectOptimalAPI(contentType);
    
    console.log(`선택된 API: ${selectedAPI} (콘텐츠 타입: ${contentType})`);
    
    if (selectedAPI === 'claude') {
        const result = await callClaude(prompt, contentType);
        if (result) return result;
    } else if (selectedAPI === 'gpt') {
        const result = await callOpenAI(prompt, contentType);
        if (result) return result;
    }
    
    // 폴백: 다른 API 시도
    if (selectedAPI === 'claude') {
        console.log('Claude 실패, GPT로 재시도...');
        return await callOpenAI(prompt, contentType);
    } else if (selectedAPI === 'gpt') {
        console.log('GPT 실패, Claude로 재시도...');
        return await callClaude(prompt, contentType);
    }
    
    return null;
}

// OpenAI API 호출 함수 (응답 시간 추가)
async function callOpenAI(prompt, contentType) {
    try {
        // v9.0 프롬프트로 강화
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;
        
        // 충분한 검토 시간을 위한 지연
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RESPONSE_TIME));
        
        const response = await fetch(API_CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: MANWON_SYSTEM_PROMPT_V9 || '당신은 만원요리 최씨남매의 전문 콘텐츠 작가입니다. 가성비를 중시하고, 솔직하고 친근한 톤으로 글을 작성합니다. 항상 완전하고 자연스러운 문장으로 글을 마무리하며, 고객이 공감할 수 있는 따뜻하고 생생한 스토리를 만들어냅니다.'
                    },
                    {
                        role: 'user',
                        content: enhancedPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 응답이 완전한지 확인
        if (data.choices[0].finish_reason === 'length') {
            console.warn('AI 응답이 토큰 제한으로 잘렸습니다. 더 짧은 버전으로 재시도합니다.');
            // 더 짧은 버전으로 재시도
            return await callOpenAI(prompt.replace('(총 300-400자, 3-4문단)', '(총 200-250자, 2-3문단)'));
        }
        
        // 응답이 너무 짧은 경우 체크
        if (content && content.length < 50) {
            console.warn('AI 응답이 너무 짧습니다. 다시 시도해주세요.');
            return '<p>콘텐츠 생성 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
        }
        
        return content;
    } catch (error) {
        console.error('OpenAI API 오류:', error);
        return null;
    }
}