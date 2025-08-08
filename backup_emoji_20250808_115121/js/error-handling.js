//

//
window.addEventListener('error', function(event) {
    //  만
    const criticalErrors = [
        'Cannot read property',
        'Cannot access',
        'is not defined',
        'Failed to fetch'
    ];

    const isCritical = criticalErrors.some(err => event.message.includes(err));

    console.error('  :', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });

    //  일
    if (isCritical) {
        showErrorMessage(' 가 .   .');
    }
});

// Promise
window.addEventListener('unhandledrejection', function(event) {
    console.error('되지  Promise :', event.reason);

    // API   만
    if (event.reason && (event.reason.message || '').includes('API')) {
        showErrorMessage('API   가 .');
    }

    event.preventDefault(); //
});

// 한
function safeExecute(fn, fallback = null, context = null) {
    try {
        const result = fn.call(context);
        return result instanceof Promise ? result.catch(error => {
            console.error('    :', error);
            return fallback;
        }) : result;
    } catch (error) {
        console.error('   :', error);
        return fallback;
    }
}

// 한
async function safeAsyncExecute(asyncFn, fallback = null, context = null) {
    try {
        return await asyncFn.call(context);
    } catch (error) {
        console.error('    :', error);
        return fallback;
    }
}

// API
async function safeApiCall(apiFunction, fallbackData = null, maxRetries = 3) {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const result = await apiFunction();
            if (result !== null && result !== undefined) {
                return result;
            }
        } catch (error) {
            attempts++;
            console.warn(`API   ( ${attempts}/${maxRetries}):`, error.message);

            if (attempts < maxRetries) {
                //  : 1, 2, 4
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        }
    }

    console.error(' API   , fallback  ');
    return fallbackData;
}

// 자
function showErrorMessage(message, type = 'error', duration = 5000) {
    //
    const existingMessages = document.querySelectorAll('.error-message');
    existingMessages.forEach(msg => msg.remove());

    //
    const messageDiv = document.createElement('div');
    messageDiv.className = `error-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4caf50'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        line-height: 1.4;
    `;
    messageDiv.textContent = message;

    //
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
    `;
    closeBtn.onclick = () => messageDiv.remove();

    messageDiv.appendChild(closeBtn);
    document.body.appendChild(messageDiv);

    //
    if (duration > 0) {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, duration);
    }
}

//
function checkFunctionExists(functionName, context = window) {
    const exists = typeof context[functionName] === 'function';
    if (!exists) {
        console.warn(` '${functionName}' 하지 .`);
    }
    return exists;
}

//
function validateScriptLoading() {
    const requiredFunctions = [
        'MarketingResearchSystem',
        'generateHTML',
        'escapeHtml',
        'cleanHtmlContent',
        'validateGeneratedHTML'
    ];

    const requiredObjects = [
        'MARKETING_CONFIG',
        'API_CONFIG'
    ];

    let allLoaded = true;
    let missingItems = [];

    //
    requiredFunctions.forEach(funcName => {
        if (!checkFunctionExists(funcName)) {
            allLoaded = false;
            missingItems.push(`: ${funcName}`);
            console.error(`  : ${funcName}`);
        }
    });

    //
    requiredObjects.forEach(objName => {
        if (typeof window[objName] === 'undefined') {
            allLoaded = false;
            missingItems.push(`: ${objName}`);
            console.error(`  : ${objName}`);
        }
    });

    // HTMLValidator
    if (typeof HTMLValidator === 'undefined') {
        allLoaded = false;
        missingItems.push(': HTMLValidator');
        console.error('  : HTMLValidator');
    }

    if (!allLoaded) {
        console.error('된 :', missingItems);
        showErrorMessage(`  : ${missingItems.join(', ')}`);
    } else {
        console.log('[]     ');
    }

    return allLoaded;
}

// API
function validateApiKeys() {
    if (typeof API_CONFIG === 'undefined') {
        showErrorMessage('API 설정 되지 .');
        return false;
    }

    const hasOpenAI = API_CONFIG.OPENAI_API_KEY &&
                     API_CONFIG.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE' &&
                     API_CONFIG.OPENAI_API_KEY.trim() !== '';

    const hasClaude = API_CONFIG.CLAUDE_API_KEY &&
                     API_CONFIG.CLAUDE_API_KEY !== 'YOUR_API_KEY_HERE' &&
                     API_CONFIG.CLAUDE_API_KEY.trim() !== '';

    if (!hasOpenAI && !hasClaude) {
        console.warn('AI API 가  . Mock  합니다.');
        showErrorMessage('AI API 가  . Mock 로  .', 'warning');
        return false;
    }

    return true;
}

// 한 JSON
function safeJsonParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON  :', error);
        return fallback;
    }
}

//
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('   :', error);
        return defaultValue;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('   :', error);
        return false;
    }
}

// DOM
function safeGetElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.error(`  '${id}'   .`);
        showErrorMessage(`페지  : ${id} 가 .`);
    }
    return element;
}

// 페지
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('    ...');
            validateScriptLoading();
            validateApiKeys();
        }, 1000); //
    });
} else {
    // 미  된
    setTimeout(() => {
        console.log('    ...');
        validateScriptLoading();
        validateApiKeys();
    }, 500); //
}

// 으로
window.ErrorHandling = {
    safeExecute,
    safeAsyncExecute,
    safeApiCall,
    showErrorMessage,
    checkFunctionExists,
    validateScriptLoading,
    validateApiKeys,
    safeJsonParse,
    safeLocalStorageGet,
    safeLocalStorageSet,
    safeGetElement
};

console.log('[]     ');