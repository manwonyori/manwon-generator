// 오류 처리 및 안전 보장 모듈

// 전역 오류 핸들러
window.addEventListener('error', function(event) {
    // 크리티컬한 오류만 사용자에게 표시
    const criticalErrors = [
        'Cannot read property',
        'Cannot access',
        'is not defined',
        'Failed to fetch'
    ];
    
    const isCritical = criticalErrors.some(err => event.message.includes(err));
    
    console.error('전역 오류 감지:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // 크리티컬한 오류일 경우에만 사용자에게 표시
    if (isCritical) {
        showErrorMessage('시스템 오류가 발생했습니다. 페이지를 새로고침해 주세요.');
    }
});

// Promise 거부 처리
window.addEventListener('unhandledrejection', function(event) {
    console.error('처리되지 않은 Promise 거부:', event.reason);
    
    // API 호출 관련 오류만 사용자에게 표시
    if (event.reason && (event.reason.message || '').includes('API')) {
        showErrorMessage('API 처리 중 오류가 발생했습니다.');
    }
    
    event.preventDefault(); // 기본 처리 방지
});

// 안전한 함수 실행 래퍼
function safeExecute(fn, fallback = null, context = null) {
    try {
        const result = fn.call(context);
        return result instanceof Promise ? result.catch(error => {
            console.error('비동기 함수 실행 중 오류:', error);
            return fallback;
        }) : result;
    } catch (error) {
        console.error('함수 실행 중 오류:', error);
        return fallback;
    }
}

// 안전한 비동기 함수 실행
async function safeAsyncExecute(asyncFn, fallback = null, context = null) {
    try {
        return await asyncFn.call(context);
    } catch (error) {
        console.error('비동기 함수 실행 중 오류:', error);
        return fallback;
    }
}

// API 호출 안전 래퍼
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
            console.warn(`API 호출 실패 (시도 ${attempts}/${maxRetries}):`, error.message);
            
            if (attempts < maxRetries) {
                // 지수 백오프: 1초, 2초, 4초 대기
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        }
    }
    
    console.error('모든 API 호출 시도 실패, fallback 데이터 사용');
    return fallbackData;
}

// 사용자 친화적 오류 메시지 표시
function showErrorMessage(message, type = 'error', duration = 5000) {
    // 기존 오류 메시지 제거
    const existingMessages = document.querySelectorAll('.error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // 새 오류 메시지 생성
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
    
    // 닫기 버튼 추가
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
    
    // 자동 제거
    if (duration > 0) {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, duration);
    }
}

// 함수 존재 여부 확인
function checkFunctionExists(functionName, context = window) {
    const exists = typeof context[functionName] === 'function';
    if (!exists) {
        console.warn(`함수 '${functionName}'이 존재하지 않습니다.`);
    }
    return exists;
}

// 필수 스크립트 로드 확인
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
    
    // 함수 확인
    requiredFunctions.forEach(funcName => {
        if (!checkFunctionExists(funcName)) {
            allLoaded = false;
            missingItems.push(`함수: ${funcName}`);
            console.error(`필수 함수 누락: ${funcName}`);
        }
    });
    
    // 객체 확인
    requiredObjects.forEach(objName => {
        if (typeof window[objName] === 'undefined') {
            allLoaded = false;
            missingItems.push(`객체: ${objName}`);
            console.error(`필수 객체 누락: ${objName}`);
        }
    });
    
    // HTMLValidator 클래스 확인
    if (typeof HTMLValidator === 'undefined') {
        allLoaded = false;
        missingItems.push('클래스: HTMLValidator');
        console.error('필수 클래스 누락: HTMLValidator');
    }
    
    if (!allLoaded) {
        console.error('누락된 항목들:', missingItems);
        showErrorMessage(`필수 스크립트 누락: ${missingItems.join(', ')}`);
    } else {
        console.log('✅ 모든 필수 스크립트 로드 완료');
    }
    
    return allLoaded;
}

// API 키 검증
function validateApiKeys() {
    if (typeof API_CONFIG === 'undefined') {
        showErrorMessage('API 설정이 로드되지 않았습니다.');
        return false;
    }
    
    const hasOpenAI = API_CONFIG.OPENAI_API_KEY && 
                     API_CONFIG.OPENAI_API_KEY !== 'YOUR_API_KEY_HERE' &&
                     API_CONFIG.OPENAI_API_KEY.trim() !== '';
                     
    const hasClaude = API_CONFIG.CLAUDE_API_KEY && 
                     API_CONFIG.CLAUDE_API_KEY !== 'YOUR_API_KEY_HERE' &&
                     API_CONFIG.CLAUDE_API_KEY.trim() !== '';
    
    if (!hasOpenAI && !hasClaude) {
        console.warn('AI API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
        showErrorMessage('AI API 키가 설정되지 않았습니다. Mock 데이터로 테스트가 진행됩니다.', 'warning');
        return false;
    }
    
    return true;
}

// 안전한 JSON 파싱
function safeJsonParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON 파싱 실패:', error);
        return fallback;
    }
}

// 로컬 스토리지 안전 접근
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('로컬 스토리지 접근 실패:', error);
        return defaultValue;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('로컬 스토리지 저장 실패:', error);
        return false;
    }
}

// DOM 요소 안전 접근
function safeGetElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.error(`필수 요소 '${id}'를 찾을 수 없습니다.`);
        showErrorMessage(`페이지 구조 오류: ${id} 요소가 없습니다.`);
    }
    return element;
}

// 페이지 로드 완료 후 검증 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('🔍 스크립트 로딩 검증 시작...');
            validateScriptLoading();
            validateApiKeys();
        }, 1000); // 스크립트 로드 대기 시간 증가
    });
} else {
    // 이미 로드 완료된 경우
    setTimeout(() => {
        console.log('🔍 스크립트 로딩 검증 시작...');
        validateScriptLoading();
        validateApiKeys();
    }, 500); // 대기 시간 증가
}

// 전역으로 노출
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

console.log('✅ 오류 처리 모듈 로드 완료');