// API

// v9.0    (   )
let MANWON_SYSTEM_PROMPT_V9 = '';
let getEnhancedPrompt = null;

//  getEnhancedPrompt   (v9.0    )
function defaultGetEnhancedPrompt(originalPrompt, contentType) {
    return originalPrompt;
}

//
function loadV9Prompt() {
    try {
        // manwon-prompt-v9.js
        if (typeof window !== 'undefined' && window.MANWON_SYSTEM_PROMPT_V9) {
            MANWON_SYSTEM_PROMPT_V9 = window.MANWON_SYSTEM_PROMPT_V9;
            getEnhancedPrompt = window.getEnhancedPrompt || defaultGetEnhancedPrompt;
            console.log('[] v9.0   ');
            return true;
        } else {
            getEnhancedPrompt = defaultGetEnhancedPrompt;
            console.log(' v9.0  ,   ');
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

// DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadV9Prompt, 100);
    });
} else {
    setTimeout(loadV9Prompt, 100);
}

const API_CONFIG = {
    // OpenAI API  - localStorage
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
                 . "${productName}"      .

             :
            -   ,
            -     <strong>
            -
            -

              ( 400-500, 3-4):
            1.   : "  <strong> </strong>..."
            2.    :   <strong>
            3.   :
            4. 게  :

            HTML  :
            <p>  <strong> </strong> ...</p>
            <p><strong>24 </strong>  ...</p>

               ,   .
        `,

        trustContent: (productName) => `
              "${productName}"  유 .

            :
            - "   !"
            -
            - 2-3  유
            - HTML   (highlight  )
            -

               .
        `,

        painPoints: (productName) => `
            "${productName}"   / .
            - "~?"
            - 2-3
            - HTML
        `,

        benefits: (productName) => `
            "${productName}"  /장 5 .
            -
            -
            -
        `,

        usageGuide: (productName) => `
            "${productName}"    .
            -   (ol )
            -
            - HTML
        `,

        features: (productName) => `
            "${productName}"   5 .
            -
            -
            -
        `,

        faq: (productName) => `
            "${productName}"     3 .
            -
            - Q&A
            - faq-item   HTML
        `
    }
};

//   API
function selectOptimalAPI(contentType) {
    const hasOpenAI = API_CONFIG.OPENAI_API_KEY && API_CONFIG.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE';
    const hasClaude = API_CONFIG.CLAUDE_API_KEY && API_CONFIG.CLAUDE_API_KEY !== 'YOUR_API_KEY_HERE';

    //  B:   API
    const apiPreference = {
        'heritageStory': 'claude',    // Claude  창
        'trustContent': 'claude',      // Claude
        'painPoints': 'gpt',          // GPT
        'benefits': 'gpt',            // GPT
        'usageGuide': 'gpt',          // GPT
        'features': 'gpt',            // GPT
        'faq': 'gpt'                  // GPT   Q&A
    };

    const preferred = apiPreference[contentType] || 'gpt';

    //  API
    if (preferred === 'claude' && hasClaude) {
        return 'claude';
    } else if (preferred === 'gpt' && hasOpenAI) {
        return 'gpt';
    }

    // :   API
    if (hasOpenAI) return 'gpt';
    if (hasClaude) return 'claude';

    return null;
}

// Claude API
async function callClaude(prompt, contentType) {
    try {
        // v9.0
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;

        //
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
                system: MANWON_SYSTEM_PROMPT_V9 || '     .',
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

        //  지
        if (data.stop_reason === 'max_tokens') {
            console.warn('Claude    .');
            return content + '\n\n<p><em>※       .</em></p>';
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

    console.log(` API: ${selectedAPI} ( : ${contentType})`);

    if (selectedAPI === 'claude') {
        const result = await callClaude(prompt, contentType);
        if (result) return result;
    } else if (selectedAPI === 'gpt') {
        const result = await callOpenAI(prompt, contentType);
        if (result) return result;
    }

    // :  API
    if (selectedAPI === 'claude') {
        console.log('Claude , GPT ...');
        return await callOpenAI(prompt, contentType);
    } else if (selectedAPI === 'gpt') {
        console.log('GPT , Claude ...');
        return await callClaude(prompt, contentType);
    }

    return null;
}

// OpenAI API   (  )
async function callOpenAI(prompt, contentType) {
    try {
        // v9.0
        const enhancedPrompt = getEnhancedPrompt ? getEnhancedPrompt(prompt, contentType || 'general') : prompt;

        //
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
                        content: MANWON_SYSTEM_PROMPT_V9 || '     .  ,     .      ,        .'
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

        //  지
        if (data.choices[0].finish_reason === 'length') {
            console.warn('AI    .   버전 .');
            //   버전
            return await callOpenAI(prompt.replace('( 300-400, 3-4)', '( 200-250, 2-3)'));
        }

        //
        if (content && content.length < 50) {
            console.warn('AI   .  해세.');
            return '<p>    .  해세.</p>';
        }

        return content;
    } catch (error) {
        console.error('OpenAI API :', error);
        return null;
    }
}