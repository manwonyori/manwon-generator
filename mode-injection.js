/**
 *
 *
 */

(function() {
    'use strict';

    console.log('[ ]  ');

    // DOM
    function injectModeSelector() {
        //  header
        const headerSection = document.querySelector('.header') ||
                             document.querySelector('.strategic-header') ||
                             document.querySelector('header');

        if (!headerSection) {
            console.log('[ ]     ');
            return;
        }

        //   HTML
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
                []
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
                    [AI]
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
                    []
                </button>
            </div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                [AI]   | []
            </p>
        </div>
        `;

        //
        headerSection.insertAdjacentHTML('afterend', modeSelectorHTML);

        //
        const aiModeBtn = document.getElementById('aiModeBtn');
        const detailModeBtn = document.getElementById('detailModeBtn');

        if (aiModeBtn) {
            aiModeBtn.addEventListener('click', function() {
                alert('[AI ]       .');
                //
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
                // detail-input.html
                try {
                    window.location.href = '/detail-input.html';
                } catch (e) {
                    //
                    showDetailInputFormInline();
                }
            });
        }

        console.log('[ ]   성공적 ');
    }

    //
    function showDetailInputFormInline() {
        alert('[ ]      .    .');

        //  :
        /*
        const detailFormHTML = `
        <div id="detailInputForm" style="...">
            <!--     -->
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', detailFormHTML);
        */
    }

    // DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModeSelector);
    } else {
        injectModeSelector();
    }

    //         (  )
    window.addEventListener('load', function() {
        setTimeout(injectModeSelector, 1000);
    });

})();