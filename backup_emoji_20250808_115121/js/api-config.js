// API

// v9.0    (   )
let MANWON_SYSTEM_PROMPT_V9 = '';
let getEnhancedPrompt = null;

//  getEnhancedPrompt   (v9.0 되지   )
function defaultGetEnhancedPrompt(originalPrompt, contentType) {
    return originalPrompt;
}

//  를
function loadV9Prompt() {
    try {
        // manwon-prompt-v9.js 되었는지
        if (typeof window !== 'undefined' && window.MANWON_SYSTEM_PROMPT_V9) {
            MANWON_SYSTEM_PROMPT_V9 = window.MANWON_SYSTEM_PROMPT_V9;
            getEnhancedPrompt = window.getEnhancedPrompt || defaultGetEnhancedPrompt;
            console.log('[] v9.0   ');
            return true;
        } else {
            getEnhancedPrompt = defaultGetEnhancedPrompt;
            console.log(' v9.0  미,   ');
            return false;
        }
    } catch (e) {
        console.log('v9.0    ,   :', e);
        getEnhancedPrompt = defaultGetEnhancedPrompt;
        return false;
    }
}

//
loadV9Prompt();

// DOM    재
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadV9Prompt, 100);
    });
} else {
    setTimeout(loadV9Prompt, 100);
}

const API_CONFIG = {
    // OpenAI API  - localStorage 져오기
    OPENAI_API_KEY: localStorage.getItem('OPENAI_API_KEY') || 'YOUR_API_KEY_HERE',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',

    // Claude API
    CLAUDE_API_KEY: localStorage.getItem('CLAUDE_API_KEY') || 'YOUR_API_KEY_HERE',
    CLAUDE_API_URL: 'https://api.anthropic.com/v1/messages',

    //
    RESPONSE_TIME: parseInt(localStorage.getItem('AI_RESPONSE_TIME') || '5000'),

    //
    PROMPTS: {
        heritageStory: (productName) => `
                 작입니다. "${productName}"      .

             드라인:
            -   ,  족 야기하는
            - 요    <strong>
            - 구체적고
            - 고객

              ( 400-500, 3-4):
            1.   : " 최씨남매 <strong> </strong>..."
            2. 특별  과정나 :   <strong>
            3.   :  할
            4. 고객게  : 성비나

            HTML  :
            <p> 최씨남매 <strong> </strong> ...</p>
            <p><strong>24 </strong> 특별 양념...</p>

             완전  , 연스럽게  .
        `,

        trustContent: (productName) => `
             최씨남매 "${productName}"  유를 .

            :
            - " 성비  요!"  적인
            -   경험
            - 2-3  유를
            - HTML 형  (highlight  )
            - 완전

             완전  .
        `,

        painPoints: (productName) => `
            "${productName}"   /점 .
            - "~?"
            - 2-3
            - HTML 형
        `,

        benefits: (productName) => `
            "${productName}"  /장점 5 .
            -
            - 구체적고
            -
        `,

        usageGuide: (productName) => `
            "${productName}" 법과   .
            -  법 (ol )
            - 추
            - HTML 형
        `,

        features: (productName) => `
            "${productName}"   5 .
            -
            -  나
            -
        `,

        faq: (productName) => `
            "${productName}"  주   3를 .
            -  고객  만
            - Q&A
            - faq-item 를  HTML 형
        `
    }
};

//   API
function selectOptimalAPI(contentType) {
    const hasOpenAI = API_CONFIG.OPENAI_API_KEY && API_CONFIG.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE';
    const hasClaude = API_CONFIG.CLAUDE_API_KEY && API_CONFIG.CLAUDE_API_KEY !== 'YOUR_API_KEY_HERE';

    //  B:   API
    const apiPreference = {
        'heritageStory': 'claude',    // Claude  창적인 텔링
        'trustContent': 'claude',      // Claude  연스러운
        'painPoints': 'gpt',          // GPT
        'benefits': 'gpt',            // GPT
        'usageGuide': 'gpt',          // GPT  명확
        'features': 'gpt',            // GPT  인
        'faq': 'gpt'                  // GPT  정확 Q&A
    };

    const preferred = apiPreference[contentType] || 'gpt';

    //  API  능지
    if (preferred === 'claude' && hasClaude) {
        return 'claude';
    } else if (preferred === 'gpt' && hasOpenAI) {
        return 'gpt';
    }

    // :  능 API
    if (hasOpenAI) return 'gpt';
    if (hasClaude) return 'claude';

    return null;
}

// Claude API
async function callClaude(prompt, contentType) {
    try {
        // v9.0
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;

        // 충분   위
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
                system: MANWON_SYSTEM_PROMPT_V9 || '     작입니다.',
                messages: [{
                    role: 'user',
                    content: enhancedPrompt
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Claude API  ');
        }

        const data = await response.json();
        const content = data.content[0].text;

        //  완전지
        if (data.stop_reason === 'max_tokens') {
            console.warn('Claude   제으 .');
            return content + '\n\n<p><em>※     생략되었  .</em></p>';
        }

        return content;
    } catch (error) {
        console.error('Claude API :', error);
        return null;
    }
}

//  API
async function callAI(prompt, contentType) {
    const selectedAPI = selectOptimalAPI(contentType);

    console.log(`된 API: ${selectedAPI} ( : ${contentType})`);

    if (selectedAPI === 'claude') {
        const result = await callClaude(prompt, contentType);
        if (result) return result;
    } else if (selectedAPI === 'gpt') {
        const result = await callOpenAI(prompt, contentType);
        if (result) return result;
    }

    // :  API
    if (selectedAPI === 'claude') {
        console.log('Claude , GPT 재...');
        return await callOpenAI(prompt, contentType);
    } else if (selectedAPI === 'gpt') {
        console.log('GPT , Claude 재...');
        return await callClaude(prompt, contentType);
    }

    return null;
}

// OpenAI API   (  추)
async function callOpenAI(prompt, contentType) {
    try {
        // v9.0
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;

        // 충분   위
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
                        content: MANWON_SYSTEM_PROMPT_V9 || '     작입니다. 성비를 시하고,  친근 으 글 합니다.   연스러운  글 , 고객       .'
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
            throw new Error('API  ');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        //  완전지
        if (data.choices[0].finish_reason === 'length') {
            console.warn('AI   제으 .   버전으 재합니다.');
            //   버전으 재
            return await callOpenAI(prompt.replace('( 300-400, 3-4)', '( 200-250, 2-3)'));
        }

        //
        if (content && content.length < 50) {
            console.warn('AI   .  해주세요.');
            return '<p>    .  해주세요.</p>';
        }

        return content;
    } catch (error) {
        console.error('OpenAI API :', error);
        return null;
    }
}