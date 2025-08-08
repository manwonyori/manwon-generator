// 크롤링 관련 함수들

// Safe element getter
function safeGetElementValue(id, defaultValue = '') {
    const element = document.getElementById(id);
    return element ? element.value : defaultValue;
}

// Safe element setter
function safeSetElementValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
        return true;
    }
    return false;
}

// 아임웹 사이트 감지
function isImwebSite(url) {
    return url.includes('imweb.me') || 
           url.includes('.shop') || 
           url.includes('smartstore.naver.com') ||
           url.includes('coupang.com');
}

// 플랫폼별 선택자 정의
const PLATFORM_SELECTORS = {
    imweb: {
        title: '.item_detail_tit, .goods_name, h1.title',
        price: '.pay_detail, .price, .item_pay_detail',
        images: '.owl-item img, .item_detail_slider img, .goods_thumb img',
        description: '.item_detail_cont, .goods_desc'
    },
    naver: {
        title: '._3oDjSvLwq9, .goods_name',
        price: '._2DywKu0J_8, .totalPrice',
        images: '._3VC4zG8vV1 img, .detail_thumb img',
        description: '.se-main-container'
    },
    coupang: {
        title: '.prod-buy-header__title',
        price: '.total-price strong',
        images: '.prod-image__item img',
        description: '.prod-description'
    },
    default: {
        title: 'h1, .product-title, .item-name',
        price: '.price, .product-price, .item-price',
        images: '.product-image img, .gallery img, img[alt*="product"]',
        description: '.description, .product-description, .detail-content'
    }
};

// 제품 정보 크롤링 (CORS 제한으로 인해 프록시 서버 필요)
async function crawlProductInfo() {
    const url = safeGetElementValue('referenceUrl');
    const button = event.target;
    
    if (!url) {
        alert('참조 사이트 URL을 입력해주세요.');
        return;
    }
    
    button.disabled = true;
    button.textContent = '정보를 가져오는 중...';
    
    try {
        // 1차 시도: 이미지 URL 직접 추출 시도 (메타 태그)
        const metaData = await fetchMetaTags(url);
        
        // 2차 시도: AI를 활용한 웹페이지 분석
        if (API_CONFIG && typeof callAI === 'function' && API_CONFIG.PROMPTS.crawlProduct) {
            // 아임웹 사이트인 경우 특별 프롬프트
            let prompt;
            if (isImwebSite(url)) {
                prompt = `
다음은 아임웹/쇼핑몰 제품 페이지 URL입니다: ${url}

아임웹 쇼핑몰의 일반적인 구조를 기반으로 다음 정보를 추출/추측해주세요:
1. 제품명 (URL 경로나 도메인에서 추측 가능)
2. 예상 가격대 (일반적인 ${url.includes('food') ? '식품' : '상품'} 가격)
3. 주요 특징 5개
4. 제품 설명
5. 일반적인 상품 이미지 구성 (메인 1개, 상세 4개)

JSON 형식으로 반환해주세요.`;
            } else {
                prompt = API_CONFIG.PROMPTS.crawlProduct(url);
            }
            
            const result = await callAI(prompt);
            if (result) {
                try {
                    const data = JSON.parse(result);
                    // 메타 데이터와 병합
                    if (metaData) {
                        data.title = data.title || metaData.title;
                        data.price = data.price || metaData.price;
                        if (metaData.image && !data.images?.length) {
                            data.images = [metaData.image];
                        }
                    }
                    applyExtractedData(data);
                    
                    // 이미지 추가 크롤링 시도
                    if (data.images && data.images[0] && !data.images[0].startsWith('http')) {
                        await tryImageExtraction(url);
                    }
                    
                    alert('제품 정보를 성공적으로 가져왔습니다!');
                } catch (e) {
                    console.error('JSON 파싱 오류:', e);
                    // AI 응답을 그대로 활용
                    parseAndApplyTextData(result);
                }
            }
        } else {
            // API가 없을 경우 대안 제시
            showManualInputGuide();
        }
        
    } catch (error) {
        console.error('크롤링 오류:', error);
        alert('정보를 가져오는 중 오류가 발생했습니다.\n수동으로 입력해주세요.');
    } finally {
        button.disabled = false;
        button.textContent = '제품 정보 가져오기';
    }
}

// 추출된 데이터를 폼에 적용
function applyExtractedData(data) {
    if (data.title && !safeGetElementValue('pageTitle')) {
        safeGetElementValue('pageTitle') = data.title;
    }
    
    if (data.price) {
        safeSetElementValue('price', data.price);
    }
    
    if (data.features && data.features.length > 0) {
        safeSetElementValue('features', data.features.join('\n'));
    }
    
    if (data.description) {
        // 설명을 여러 필드에 분배
        if (!safeGetElementValue('heritageStory')) {
            safeSetElementValue('heritageStory', `<p>${data.description}</p>`);
        }
    }
    
    if (data.images && data.images.length > 0) {
        // 이미지 URL 적용
        if (data.images[0] && !safeGetElementValue('mainImage')) {
            safeSetElementValue('mainImage', data.images[0]);
        }
        for (let i = 1; i <= 4 && i < data.images.length; i++) {
            if (data.images[i] && !safeGetElementValue(`detailImage${i}`)) {
                safeSetElementValue(`detailImage${i}`, data.images[i]);
            }
        }
    }
}

// 텍스트 형식의 AI 응답을 파싱하여 적용
function parseAndApplyTextData(text) {
    // 제품명 추출
    const titleMatch = text.match(/제품명[:：]\s*(.+)/);
    if (titleMatch && !safeGetElementValue('pageTitle')) {
        safeGetElementValue('pageTitle') = titleMatch[1].trim();
    }
    
    // 가격 추출
    const priceMatch = text.match(/가격[:：]\s*(.+)/);
    if (priceMatch) {
        safeSetElementValue('price', priceMatch[1].trim());
    }
    
    // 특징 추출
    const featuresMatch = text.match(/특징[:：]\s*([\s\S]+?)(?=\n\n|$)/);
    if (featuresMatch) {
        const features = featuresMatch[1].split('\n').filter(f => f.trim());
        safeSetElementValue('features', features.join('\n'));
    }
    
    alert('제품 정보를 부분적으로 가져왔습니다.\n추가 정보는 수동으로 입력해주세요.');
}

// URL과 제품명을 기반으로 전체 콘텐츠 자동 생성
async function generateContentFromUrl() {
    const url = safeGetElementValue('referenceUrl');
    const productName = safeGetElementValue('pageTitle');
    
    if (!url || !productName) {
        alert('제품명과 참조 URL을 모두 입력해주세요.');
        return;
    }
    
    if (API_CONFIG && typeof callAI === 'function' && API_CONFIG.PROMPTS.generateFromUrl) {
        try {
            const prompt = API_CONFIG.PROMPTS.generateFromUrl(url, productName);
            const result = await callAI(prompt);
            
            if (result) {
                // AI 응답을 각 필드에 분배
                applyGeneratedContent(result);
            }
        } catch (error) {
            console.error('AI 콘텐츠 생성 오류:', error);
        }
    }
}

// 생성된 콘텐츠를 폼에 적용
function applyGeneratedContent(content) {
    // 헤리티지 스토리
    const heritageMatch = content.match(/헤리티지 스토리[:：]?\s*([\s\S]+?)(?=\n\n|최씨남매|고객의|$)/i);
    if (heritageMatch && !safeGetElementValue('heritageStory')) {
        safeSetElementValue('heritageStory', `<p>${heritageMatch[1].trim()}</p>`);
    }
    
    // 최씨남매 추천
    const trustMatch = content.match(/최씨남매[\s\S]*?추천[:：]?\s*([\s\S]+?)(?=\n\n|고객의|$)/i);
    if (trustMatch && !safeGetElementValue('trustContent')) {
        safeSetElementValue('trustContent', trustMatch[1].trim());
    }
    
    // 고민 포인트
    const painMatch = content.match(/고객의 고민[:：]?\s*([\s\S]+?)(?=\n\n|사용법|$)/i);
    if (painMatch && !safeGetElementValue('painPoints')) {
        safeSetElementValue('painPoints', painMatch[1].trim());
    }
    
    // FAQ
    const faqMatch = content.match(/자주 묻는 질문[:：]?\s*([\s\S]+?)$/i);
    if (faqMatch && !safeGetElementValue('faqContent')) {
        safeSetElementValue('faqContent', faqMatch[1].trim());
    }
}

// 대체 크롤링 방법: 메타 태그 정보 활용
async function fetchMetaTags(url) {
    try {
        // 여러 CORS 프록시 서비스 시도
        const proxyServices = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];
        
        for (const proxyUrl of proxyServices) {
            try {
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const contents = data.contents || data;
                    
                    if (contents) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(contents, 'text/html');
                        
                        const metaData = {
                            title: doc.querySelector('meta[property="og:title"]')?.content || 
                                   doc.querySelector('title')?.textContent || '',
                            description: doc.querySelector('meta[property="og:description"]')?.content || 
                                         doc.querySelector('meta[name="description"]')?.content || '',
                            image: doc.querySelector('meta[property="og:image"]')?.content || '',
                            price: doc.querySelector('meta[property="product:price:amount"]')?.content || 
                                   doc.querySelector('meta[property="product:price"]')?.content || ''
                        };
                        
                        // 아임웹 특별 처리
                        if (isImwebSite(url)) {
                            const imwebImages = doc.querySelectorAll('.owl-item img, .goods_thumb img');
                            if (imwebImages.length > 0) {
                                metaData.images = Array.from(imwebImages).map(img => img.src).slice(0, 5);
                            }
                        }
                        
                        return metaData;
                    }
                }
            } catch (e) {
                console.log(`프록시 ${proxyUrl} 실패, 다음 시도...`);
            }
        }
    } catch (error) {
        console.error('메타 태그 추출 오류:', error);
    }
    return null;
}

// 이미지 추출 시도
async function tryImageExtraction(url) {
    try {
        // 일반적인 이미지 패턴으로 URL 생성
        const baseUrl = new URL(url).origin;
        const possibleImagePatterns = [
            '/product_image_',
            '/goods_',
            '/item_',
            '/upload/product/',
            '/data/goods/',
            '/shopimages/'
        ];
        
        // 상품 ID 추출 시도
        const idMatch = url.match(/[?&](?:product_no|goods_no|item_no|id)=([0-9]+)/i) ||
                       url.match(/\/([0-9]+)(?:\.html?)?$/i);
        
        if (idMatch) {
            const productId = idMatch[1];
            
            // 예상 이미지 URL 생성
            for (const pattern of possibleImagePatterns) {
                const imageUrl = `${baseUrl}${pattern}${productId}_1.jpg`;
                // 실제로는 이미지 존재 여부를 확인할 수 없지만 URL 제안
                console.log('예상 이미지 URL:', imageUrl);
            }
        }
    } catch (error) {
        console.error('이미지 추출 오류:', error);
    }
}

// 수동 입력 가이드 표시
function showManualInputGuide() {
    const guide = `
크롤링할 수 없는 경우 다음 방법을 사용하세요:

1. 수동 복사/붙여넣기:
   - 제품 페이지에서 정보를 직접 복사
   - 각 필드에 붙여넣기

2. 이미지 URL 찾기:
   - 이미지 우클릭 → "이미지 주소 복사"
   - 또는 개발자 도구(F12) → Elements → img 태그 찾기

3. AI 도움 받기:
   - 제품명만 입력하고 "페이지 생성"
   - AI가 나머지 내용 자동 생성

4. 스크린샷 활용:
   - 제품 페이지 스크린샷 촬영
   - 이미지 호스팅 서비스에 업로드
   - 이미지 URL 사용
`;
    
    alert(guide);
    
    // 도움말 팝업 표시
    showHelperPopup();
}

// 도움말 팝업 표시
function showHelperPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 500px;
    `;
    
    popup.innerHTML = `
        <h3>💡 이미지 URL 쉽게 찾는 방법</h3>
        <ol>
            <li><strong>크롬 브라우저</strong>: 이미지 우클릭 → "이미지 주소 복사"</li>
            <li><strong>개발자 도구</strong>: F12 → Elements → img 태그의 src 속성</li>
            <li><strong>모바일</strong>: 이미지 길게 누르기 → "이미지 주소 복사"</li>
        </ol>
        <p style="margin-top: 20px; color: #666;">
            <strong>팁</strong>: 아임웹 사이트는 보통 /data/goods/ 폴더에 이미지가 있습니다.
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
        ">확인</button>
    `;
    
    document.body.appendChild(popup);
    
    // 배경 클릭 시 닫기
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;
    overlay.onclick = () => {
        popup.remove();
        overlay.remove();
    };
    document.body.appendChild(overlay);
}