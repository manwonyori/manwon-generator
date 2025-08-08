/**
 *
 *
 */

(function() {
    'use strict';

    console.log('[ ]  -     ');

    // 1:
    function autoLogin() {
        const passwordInput = document.getElementById('teamPassword');
        if (passwordInput) {
            console.log('[ ]   ...');
            passwordInput.value = '0221';

            //
            const loginButton = document.querySelector('button[onclick*="login"]') ||
                               document.querySelector('#loginBtn') ||
                               document.querySelector('button');

            if (loginButton) {
                console.log('[ ]   ');
                loginButton.click();

                //
                setTimeout(injectModeSelector, 2000);
            }
        }
    }

    // 2:
    function injectModeSelector() {
        console.log('[ ]     ');

        //
        const mainApp = document.querySelector('.main-app') ||
                       document.querySelector('.container') ||
                       document.querySelector('body');

        if (!mainApp) {
            console.log('[ ]     , 3  ');
            setTimeout(injectModeSelector, 3000);
            return;
        }

        //
        const existingSelector = document.querySelector('.mode-selector-complete');
        if (existingSelector) {
            existingSelector.remove();
        }

        //     HTML
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
                    []
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
                    <div style="font-size: 16px; margin-bottom: 5px;">[AI]   </div>
                    <div style="font-size: 12px; opacity: 0.8;">     </div>
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
                    <div style="font-size: 16px; margin-bottom: 5px;">[]   </div>
                    <div style="font-size: 12px; opacity: 0.9;">       </div>
                </button>
            </div>

            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 12px; opacity: 0.8; text-align: center;">
                    []
                </div>
            </div>
        </div>
        `;

        //
        document.body.insertAdjacentHTML('beforeend', modeSelectorHTML);

        //
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
                showNotification('[AI  ]       .');
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

        console.log('[ ]     !');
    }

    //
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

    //
    function highlightInputArea() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach((input, index) => {
            if (input.offsetParent !== null) { //
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

    //
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
            <h2 style="color: #333; margin-bottom: 20px;">[ ]   </h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                      .<br>
                  들  :
            </p>
            <ul style="text-align: left; color: #555; margin-bottom: 25px;">
                <li>,    </li>
                <li>, ,  </li>
                <li>, ,  </li>
                <li>,   </li>
                <li>  </li>
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
                "></button>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); alert(' AI    .');" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">AI  </button>
            </div>
        </div>
        `;

        document.body.appendChild(modal);
    }

    //
    function init() {
        console.log('[기]    ');

        //
        if (sessionStorage.getItem('teamAuth') === 'authenticated') {
            console.log('[]  ,   ');
            setTimeout(injectModeSelector, 1000);
        } else {
            console.log('[]  ,   ');
            setTimeout(autoLogin, 1000);
        }
    }

    // DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    //    도  ()
    window.addEventListener('load', function() {
        setTimeout(init, 2000);
    });

})();

console.log('[ ]    - https://manwon-generator.onrender.com/    ');