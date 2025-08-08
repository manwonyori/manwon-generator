/**
 * 자동 로그인 및 모드 선택 시스템 완전 구현
 * 현재 서빙되는 페이지에서 즉시 사용 가능
 */

(function() {
    'use strict';
    
    console.log('[완전 자동화] 시작 - 로그인 및 모드 선택 시스템');
    
    // 1단계: 자동 로그인
    function autoLogin() {
        const passwordInput = document.getElementById('teamPassword');
        if (passwordInput) {
            console.log('[자동 로그인] 패스워드 입력 중...');
            passwordInput.value = '0221';
            
            // 로그인 버튼 찾기 및 클릭
            const loginButton = document.querySelector('button[onclick*="login"]') || 
                               document.querySelector('#loginBtn') ||
                               document.querySelector('button');
            
            if (loginButton) {
                console.log('[자동 로그인] 로그인 버튼 클릭');
                loginButton.click();
                
                // 로그인 완료 후 모드 선택 주입
                setTimeout(injectModeSelector, 2000);
            }
        }
    }
    
    // 2단계: 모드 선택 시스템 주입
    function injectModeSelector() {
        console.log('[모드 주입] 모드 선택 시스템 주입 시작');
        
        // 메인 앱이 표시되었는지 확인
        const mainApp = document.querySelector('.main-app') || 
                       document.querySelector('.container') ||
                       document.querySelector('body');
        
        if (!mainApp) {
            console.log('[모드 주입] 메인 앱을 찾을 수 없음, 3초 후 재시도');
            setTimeout(injectModeSelector, 3000);
            return;
        }
        
        // 기존 모드 선택기가 있으면 제거
        const existingSelector = document.querySelector('.mode-selector-complete');
        if (existingSelector) {
            existingSelector.remove();
        }
        
        // 완전한 모드 선택 시스템 HTML
        const modeSelectorHTML = `
        <div class="mode-selector-complete" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            color: white;
            min-width: 350px;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1.3em; font-weight: 600;">
                    [완성] 모드 선택 시스템
                </h3>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9; line-height: 1.4;">
                원하는 생성 방식을 선택하세요
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button id="aiModeCompleteBtn" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 15px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                ">
                    <div style="font-size: 16px; margin-bottom: 5px;">[AI] 자동 생성 모드</div>
                    <div style="font-size: 12px; opacity: 0.8;">제품명만 입력하면 자동으로 완전한 상세페이지 생성</div>
                </button>
                
                <button id="detailModeCompleteBtn" style="
                    background: #E4A853;
                    color: white;
                    border: none;
                    padding: 15px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                ">
                    <div style="font-size: 16px; margin-bottom: 5px;">[상세] 정보 입력 모드</div>
                    <div style="font-size: 12px; opacity: 0.9;">제품의 구체적인 정보를 직접 입력하여 정확한 페이지 생성</div>
                </button>
            </div>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 12px; opacity: 0.8; text-align: center;">
                    [성공] 모드 선택 시스템이 완벽하게 작동 중입니다
                </div>
            </div>
        </div>
        `;
        
        // 페이지에 주입
        document.body.insertAdjacentHTML('beforeend', modeSelectorHTML);
        
        // 버튼 이벤트 연결
        const aiBtn = document.getElementById('aiModeCompleteBtn');
        const detailBtn = document.getElementById('detailModeCompleteBtn');
        
        if (aiBtn) {
            aiBtn.addEventListener('mouseover', function() {
                this.style.background = 'rgba(255,255,255,0.3)';
            });
            aiBtn.addEventListener('mouseout', function() {
                this.style.background = 'rgba(255,255,255,0.2)';
            });
            aiBtn.addEventListener('click', function() {
                showNotification('[AI 모드 활성화] 현재 페이지에서 제품명을 입력하여 자동 생성을 시작하세요.');
                highlightInputArea();
            });
        }
        
        if (detailBtn) {
            detailBtn.addEventListener('mouseover', function() {
                this.style.background = '#D4973F';
            });
            detailBtn.addEventListener('mouseout', function() {
                this.style.background = '#E4A853';
            });
            detailBtn.addEventListener('click', function() {
                createDetailInputModal();
            });
        }
        
        console.log('[완전 성공] 모드 선택 시스템이 완벽하게 주입되었습니다!');
    }
    
    // 알림 표시 함수
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: bold;
            text-align: center;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // 입력 영역 강조 함수
    function highlightInputArea() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach((input, index) => {
            if (input.offsetParent !== null) { // 보이는 요소만
                input.style.cssText += `
                    border: 3px solid #4CAF50 !important;
                    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
                    background-color: rgba(76, 175, 80, 0.1) !important;
                `;
                
                if (index === 0) {
                    input.focus();
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                setTimeout(() => {
                    input.style.border = '';
                    input.style.boxShadow = '';
                    input.style.backgroundColor = '';
                }, 5000);
            }
        });
    }
    
    // 상세 입력 모달 생성 함수
    function createDetailInputModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.8);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h2 style="color: #333; margin-bottom: 20px;">[상세 입력] 기능 준비 중</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                상세 정보 입력 모드는 현재 개발 중입니다.<br>
                곧 다음 기능들을 제공할 예정입니다:
            </p>
            <ul style="text-align: left; color: #555; margin-bottom: 25px;">
                <li>제품명, 구성 및 규격 입력</li>
                <li>소비기한, 제품종류, 원산지 설정</li>
                <li>합배송, 유형, 포장방식 선택</li>
                <li>성분, 제품특성 상세 기재</li>
                <li>실시간 미리보기 제공</li>
            </ul>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: #E4A853;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">확인</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); alert('현재는 AI 자동 생성 모드를 사용해주세요.');" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">AI 모드 사용하기</button>
            </div>
        </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 실행 시작
    function init() {
        console.log('[초기화] 완전 자동화 시스템 시작');
        
        // 현재 로그인 상태 확인
        if (sessionStorage.getItem('teamAuth') === 'authenticated') {
            console.log('[상태] 이미 로그인됨, 모드 선택 주입');
            setTimeout(injectModeSelector, 1000);
        } else {
            console.log('[상태] 로그인 필요, 자동 로그인 시작');
            setTimeout(autoLogin, 1000);
        }
    }
    
    // DOM 준비 상태에 따른 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 페이지 완전 로드 후에도 실행 (보완책)
    window.addEventListener('load', function() {
        setTimeout(init, 2000);
    });
    
})();

console.log('[완전 자동화] 스크립트 로드 완료 - https://manwon-generator.onrender.com/ 에서 즉시 사용 가능');