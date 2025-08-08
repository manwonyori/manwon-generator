//

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

//
function isImwebSite(url) {
    return url.includes('imweb.me') ||
           url.includes('.shop') ||
           url.includes('smartstore.naver.com') ||
           url.includes('coupang.com');
}

//
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

//    (CORS     )
async function crawlProductInfo() {
    const url = safeGetElementValue('referenceUrl');
    const button = event.target;

    if (!url) {
        alert('  URL .');
        return;
    }

    button.disabled = true;
    button.textContent = '  ...';

    try {
        // 1 :  URL    ( )
        const metaData = await fetchMetaTags(url);

        // 2 : AI
        if (API_CONFIG && typeof callAI === 'function' && API_CONFIG.PROMPTS.crawlProduct) {
            //  인
            let prompt;
            if (isImwebSite(url)) {
                prompt = `
 /   URL: ${url}

 의  구조    /:
1. 명 (URL    )
2.   ( ${url.includes('food') ? '' : ''} )
3.   5
4.
5.     ( 1,  4)

JSON  .`;
            } else {
                prompt = API_CONFIG.PROMPTS.crawlProduct(url);
            }

            const result = await callAI(prompt);
            if (result) {
                try {
                    const data = JSON.parse(result);
                    //
                    if (metaData) {
                        data.title = data.title || metaData.title;
                        data.price = data.price || metaData.price;
                        if (metaData.image && !data.images?.length) {
                            data.images = [metaData.image];
                        }
                    }
                    applyExtractedData(data);

                    //
                    if (data.images && data.images[0] && !data.images[0].startsWith('http')) {
                        await tryImageExtraction(url);
                    }

                    alert('   !');
                } catch (e) {
                    console.error('JSON  :', e);
                    // AI 응답
                    parseAndApplyTextData(result);
                }
            }
        } else {
            // API 없
            showManualInputGuide();
        }

    } catch (error) {
        console.error(' :', error);
        alert('    .\n .');
    } finally {
        button.disabled = false;
        button.textContent = '  져오기';
    }
}

// 된 데이터
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
        //
        if (!safeGetElementValue('heritageStory')) {
            safeSetElementValue('heritageStory', `<p>${data.description}</p>`);
        }
    }

    if (data.images && data.images.length > 0) {
        //  URL
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

//   AI 응답 하여
function parseAndApplyTextData(text) {
    // 명
    const titleMatch = text.match(/명[:]\s*(.+)/);
    if (titleMatch && !safeGetElementValue('pageTitle')) {
        safeGetElementValue('pageTitle') = titleMatch[1].trim();
    }

    //
    const priceMatch = text.match(/[:]\s*(.+)/);
    if (priceMatch) {
        safeSetElementValue('price', priceMatch[1].trim());
    }

    //
    const featuresMatch = text.match(/[:]\s*([\s\S]+?)(?=\n\n|$)/);
    if (featuresMatch) {
        const features = featuresMatch[1].split('\n').filter(f => f.trim());
        safeSetElementValue('features', features.join('\n'));
    }

    alert('   .\n 는  .');
}

// URL 명
async function generateContentFromUrl() {
    const url = safeGetElementValue('referenceUrl');
    const productName = safeGetElementValue('pageTitle');

    if (!url || !productName) {
        alert('명  URL  .');
        return;
    }

    if (API_CONFIG && typeof callAI === 'function' && API_CONFIG.PROMPTS.generateFromUrl) {
        try {
            const prompt = API_CONFIG.PROMPTS.generateFromUrl(url, productName);
            const result = await callAI(prompt);

            if (result) {
                // AI 응답
                applyGeneratedContent(result);
            }
        } catch (error) {
            console.error('AI   :', error);
        }
    }
}

// 된
function applyGeneratedContent(content) {
    //
    const heritageMatch = content.match(/ [:]?\s*([\s\S]+?)(?=\n\n|||$)/i);
    if (heritageMatch && !safeGetElementValue('heritageStory')) {
        safeSetElementValue('heritageStory', `<p>${heritageMatch[1].trim()}</p>`);
    }

    //
    const trustMatch = content.match(/[\s\S]*?[:]?\s*([\s\S]+?)(?=\n\n||$)/i);
    if (trustMatch && !safeGetElementValue('trustContent')) {
        safeSetElementValue('trustContent', trustMatch[1].trim());
    }

    //
    const painMatch = content.match(/ [:]?\s*([\s\S]+?)(?=\n\n||$)/i);
    if (painMatch && !safeGetElementValue('painPoints')) {
        safeSetElementValue('painPoints', painMatch[1].trim());
    }

    // FAQ
    const faqMatch = content.match(/  [:]?\s*([\s\S]+?)$/i);
    if (faqMatch && !safeGetElementValue('faqContent')) {
        safeSetElementValue('faqContent', faqMatch[1].trim());
    }
}

//   :
async function fetchMetaTags(url) {
    try {
        //  CORS
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

                        //
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
                console.log(` ${proxyUrl} ,  ...`);
            }
        }
    } catch (error) {
        console.error('   :', error);
    }
    return null;
}

//
async function tryImageExtraction(url) {
    try {
        //    URL
        const baseUrl = new URL(url).origin;
        const possibleImagePatterns = [
            '/product_image_',
            '/goods_',
            '/item_',
            '/upload/product/',
            '/data/goods/',
            '/shopimages/'
        ];

        //  ID
        const idMatch = url.match(/[?&](?:product_no|goods_no|item_no|id)=([0-9]+)/i) ||
                       url.match(/\/([0-9]+)(?:\.html?)?$/i);

        if (idMatch) {
            const productId = idMatch[1];

            //   URL
            for (const pattern of possibleImagePatterns) {
                const imageUrl = `${baseUrl}${pattern}${productId}_1.jpg`;
                //    여부    URL
                console.log('  URL:', imageUrl);
            }
        }
    } catch (error) {
        console.error('  :', error);
    }
}

// 동  이드
function showManualInputGuide() {
    const guide = `
할      :

1. 동 /:
   -  에서
   -

2.  URL :
   -   → "  "
   -  발자 (F12) → Elements → img

3. AI  :
   - 명만 하고 " "
   - AI

4.  :
   -
   -   에
   -  URL
`;

    alert(guide);

    // 말
    showHelperPopup();
}

// 말
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
        <h3>  URL   </h3>
        <ol>
            <li><strong> </strong>:   → "  "</li>
            <li><strong>발자 </strong>: F12 → Elements → img 의 src </li>
            <li><strong></strong>:    → "  "</li>
        </ol>
        <p style="margin-top: 20px; color: #666;">
            <strong></strong>:  는  /data/goods/   .
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
        "></button>
    `;

    document.body.appendChild(popup);

    //
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