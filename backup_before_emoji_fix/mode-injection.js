/**
 * 기존 페이지에 모드 선택 기능을 동적으로 주입하는 스크립트
 * 현재 서빙되는 이전 버전에 호환되도록 설계
 */

(function() {
    'use strict';
    
    console.log('[모드 주입] 스크립트 로드됨');
    
    // DOM이 로드된 후 실행
    function injectModeSelector() {
        // 기존 header 섹션 찾기
        const headerSection = document.querySelector('.header') || 
                             document.querySelector('.strategic-header') ||
                             document.querySelector('header');
        
        if (!headerSection) {
            console.log('[모드 주입] 헤더 섹션을 찾을 수 없음');
            return;
        }
        
        // 모드 선택 HTML 생성
        const modeSelectorHTML = `
        <div class="mode-selector-injection" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
            <h3 style="margin: 0 0 15px 0; font-size: 1.4em; font-weight: 600;">
                [선택] 생성 방식을 선택하세요
            </h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 10px;">
                <button id="aiModeBtn" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    [AI] 자동 생성 모드
                </button>
                <button id="detailModeBtn" style="
                    background: #E4A853;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#D4973F'" 
                   onmouseout="this.style.background='#E4A853'">
                    [상세] 정보 입력 모드
                </button>
            </div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                [AI] 제품명만 입력 | [상세] 구체적 정보 직접 입력
            </p>
        </div>
        `;
        
        // 헤더 바로 아래에 삽입
        headerSection.insertAdjacentHTML('afterend', modeSelectorHTML);
        
        // 버튼 이벤트 연결
        const aiModeBtn = document.getElementById('aiModeBtn');
        const detailModeBtn = document.getElementById('detailModeBtn');
        
        if (aiModeBtn) {
            aiModeBtn.addEventListener('click', function() {
                alert('[AI 모드] 현재 페이지에서 제품명만 입력하면 자동으로 상세페이지를 생성합니다.');
                // 기존 입력 영역으로 스크롤
                const inputArea = document.querySelector('#productName') || 
                                 document.querySelector('input[type="text"]') ||
                                 document.querySelector('textarea');
                if (inputArea) {
                    inputArea.scrollIntoView({ behavior: 'smooth' });
                    inputArea.focus();
                }
            });
        }
        
        if (detailModeBtn) {
            detailModeBtn.addEventListener('click', function() {
                // detail-input.html로 이동 시도
                try {
                    window.location.href = '/detail-input.html';
                } catch (e) {
                    // 실패시 상세 입력 폼을 현재 페이지에 표시
                    showDetailInputFormInline();
                }
            });
        }
        
        console.log('[모드 주입] 모드 선택기가 성공적으로 추가됨');
    }
    
    // 상세 입력 폼을 현재 페이지에 표시하는 함수
    function showDetailInputFormInline() {
        alert('[상세 입력] 상세 정보 입력 기능을 준비 중입니다. 곧 이용하실 수 있습니다.');
        
        // 향후 확장: 동적으로 상세 입력 폼 생성
        /*
        const detailFormHTML = `
        <div id="detailInputForm" style="...">
            <!-- 상세 입력 폼 내용 -->
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', detailFormHTML);
        */
    }
    
    // DOM 준비 상태 확인 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModeSelector);
    } else {
        injectModeSelector();
    }
    
    // 페이지 로드 완료 후에도 한 번 더 실행 (동적 콘텐츠 대응)
    window.addEventListener('load', function() {
        setTimeout(injectModeSelector, 1000);
    });
    
})();