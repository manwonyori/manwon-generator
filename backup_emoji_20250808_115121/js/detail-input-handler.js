/**
 *
 *  generator.js
 */

//
const DetailInputState = {
    currentTab: 'basic',
    formData: {},
    previewMode: false,
    aiProcessing: false
};

//
function switchTab(tabName) {
    //
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    //
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    DetailInputState.currentTab = tabName;
}

//
function collectDetailFormData() {
    const data = {
        //
        productName: document.getElementById('productName')?.value || '',
        brand: document.getElementById('brand')?.value || ' ',
        category: document.getElementById('category')?.value || '',
        price: document.getElementById('price')?.value || '',
        composition: document.getElementById('composition')?.value || '',

        //
        expiryDate: document.getElementById('expiryDate')?.value || '',
        productType: document.getElementById('productType')?.value || '',
        origin: document.getElementById('origin')?.value || '',
        bundleShipping: document.getElementById('bundleShipping')?.value || '',
        storageType: document.getElementById('storageType')?.value || '',
        packagingType: document.getElementById('packagingType')?.value || '',
        ingredients: document.getElementById('ingredients')?.value || '',

        //
        productFeatures: document.getElementById('productFeatures')?.value || '',
        targetCustomer: document.getElementById('targetCustomer')?.value || '',
        sellingPoints: document.getElementById('sellingPoints')?.value || '',
        usageMethod: document.getElementById('usageMethod')?.value || '',

        // SEO
        metaTitle: document.getElementById('metaTitle')?.value || '',
        metaDescription: document.getElementById('metaDescription')?.value || '',
        keywords: document.getElementById('keywords')?.value || '',
        mainImage: document.getElementById('mainImage')?.value || '',
        detailImages: [
            document.getElementById('detailImage1')?.value,
            document.getElementById('detailImage2')?.value,
            document.getElementById('detailImage3')?.value
        ].filter(url => url)
    };

    DetailInputState.formData = data;
    return data;
}

//  generator.js
function convertToGeneratorFormat(detailData) {
    //   HTML
    const formatFeatures = (features) => {
        if (!features) return '';
        return features.split('\n')
            .filter(f => f.trim())
            .map(f => `<li>${f.trim()}</li>`)
            .join('\n');
    };

    //   benefits
    const formatBenefits = (points) => {
        if (!points) return [];
        return points.split('\n')
            .filter(p => p.trim())
            .map(p => p.replace(/^[•·\-\*]\s*/, '').trim());
    };

    // generator.js
    return {
        title: detailData.productName,
        mainImage: detailData.mainImage,
        detailImages: detailData.detailImages,
        price: detailData.price,

        // AI
        heritageStory: detailData.productFeatures ?
            `<div class="product-intro">
                <h3>${detailData.brand} ${detailData.productName}</h3>
                <p>${detailData.productFeatures}</p>
            </div>` : '',

        trustContent: detailData.sellingPoints ?
            `<div class="trust-points">
                ${formatFeatures(detailData.sellingPoints)}
            </div>` : '',

        painPoints: detailData.targetCustomer ?
            `<p>   입니다: ${detailData.targetCustomer}</p>` : '',

        benefits: formatBenefits(detailData.sellingPoints),

        usageGuide: detailData.usageMethod || '',

        features: formatBenefits(detailData.productFeatures),

        //
        productInfo: generateProductInfoHTML(detailData),

        // SEO
        metaData: {
            title: detailData.metaTitle || detailData.productName,
            description: detailData.metaDescription,
            keywords: detailData.keywords
        }
    };
}

//   HTML
function generateProductInfoHTML(data) {
    const infoItems = [];

    if (data.composition) {
        infoItems.push(`<tr><th>  </th><td>${data.composition.replace(/\n/g, '<br>')}</td></tr>`);
    }
    if (data.expiryDate) {
        infoItems.push(`<tr><th></th><td>${data.expiryDate}</td></tr>`);
    }
    if (data.productType) {
        infoItems.push(`<tr><th>종류</th><td>${data.productType}</td></tr>`);
    }
    if (data.origin) {
        infoItems.push(`<tr><th></th><td>${data.origin}</td></tr>`);
    }
    if (data.bundleShipping) {
        infoItems.push(`<tr><th></th><td>${data.bundleShipping}</td></tr>`);
    }
    if (data.storageType) {
        infoItems.push(`<tr><th></th><td>${data.storageType}</td></tr>`);
    }
    if (data.packagingType) {
        infoItems.push(`<tr><th></th><td>${data.packagingType}</td></tr>`);
    }
    if (data.ingredients) {
        infoItems.push(`<tr><th></th><td>${data.ingredients.replace(/\n/g, '<br>')}</td></tr>`);
    }

    if (infoItems.length === 0) return '';

    return `
        <div class="product-info-section">
            <h2>  </h2>
            <table class="product-info-table">
                ${infoItems.join('\n')}
            </table>
        </div>
    `;
}

// AI
async function aiAssist(fieldType) {
    if (DetailInputState.aiProcessing) {
        alert('AI   .  .');
        return;
    }

    DetailInputState.aiProcessing = true;
    showLoading(true);

    try {
        const formData = collectDetailFormData();
        let prompt = '';
        let targetField = '';

        switch(fieldType) {
            case 'composition':
                prompt = `명 "${formData.productName}"   을  .`;
                targetField = 'composition';
                break;

            case 'ingredients':
                const currentIngredients = document.getElementById('ingredients').value;
                prompt = `  를   :\n${currentIngredients}`;
                targetField = 'ingredients';
                break;

            case 'features':
                prompt = `"${formData.productName}"       5지 .`;
                targetField = 'productFeatures';
                break;

            case 'sellingPoints':
                prompt = `"${formData.productName}"     3-5 .      "•" .`;
                targetField = 'sellingPoints';
                break;

            case 'metaTitle':
                prompt = `"${formData.productName}"  SEO    60 내 .`;
                targetField = 'metaTitle';
                break;

            case 'metaDesc':
                prompt = `"${formData.productName}"  SEO    160 내 .`;
                targetField = 'metaDescription';
                break;

            case 'keywords':
                prompt = `"${formData.productName}" 과    10 . 쉼표 .`;
                targetField = 'keywords';
                break;
        }

        // AI API  ( API  )
        const response = await callAI(prompt);

        if (response && targetField) {
            document.getElementById(targetField).value = response;
            updatePreview();
        }

    } catch (error) {
        console.error('AI  :', error);
        alert('AI    .');
    } finally {
        DetailInputState.aiProcessing = false;
        showLoading(false);
    }
}

// AI API  ( api-config.js )
async function callAI(prompt) {
    // OpenAI API
    const openaiKey = localStorage.getItem('openai_api_key');
    const claudeKey = localStorage.getItem('claude_api_key');

    if (openaiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        {
                            role: 'system',
                            content: ' 국     전문입니다.    .'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API :', error);
        }
    }

    // Claude API
    if (claudeKey) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': claudeKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-opus-20240229',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500
                })
            });

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API :', error);
        }
    }

    // API
    return generateDefaultContent(prompt);
}

//    (AI API  )
function generateDefaultContent(prompt) {
    if (prompt.includes('  ')) {
        return '  를 해주세요';
    }
    if (prompt.includes(' ')) {
        return '• 신선  \n• HACCP   \n• 간편  \n• 성비 우\n•  족  ';
    }
    if (prompt.includes(' ')) {
        return '•  품질 \n•  격\n•   ';
    }
    return '';
}

//
function togglePreview() {
    const panel = document.getElementById('previewPanel');
    panel.classList.toggle('open');
    DetailInputState.previewMode = panel.classList.contains('open');

    if (DetailInputState.previewMode) {
        updatePreview();
    }
}

//
function updatePreview() {
    if (!DetailInputState.previewMode) return;

    const formData = collectDetailFormData();
    const previewContent = document.getElementById('previewContent');

    const previewHTML = `
        <div style="padding: 20px; font-family: 'Pretendard', sans-serif;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">${formData.productName || '명을 하세요'}</h2>

            ${formData.price ? `<p style="font-size: 24px; color: #ef4444; font-weight: bold;">${formData.price}</p>` : ''}

            ${formData.composition ? `
                <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                    <strong>:</strong> ${formData.composition.replace(/\n/g, '<br>')}
                </div>
            ` : ''}

            ${formData.productFeatures ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #374151; margin-bottom: 10px;"> </h3>
                    <p style="line-height: 1.6; color: #6b7280;">${formData.productFeatures.replace(/\n/g, '<br>')}</p>
                </div>
            ` : ''}

            ${formData.ingredients ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #374151; margin-bottom: 10px;"></h3>
                    <p style="font-size: 14px; color: #9ca3af;">${formData.ingredients}</p>
                </div>
            ` : ''}
        </div>
    `;

    previewContent.innerHTML = previewHTML;
}

// 딩
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

//
function resetForm() {
    if (confirm('   하시겠습니까?')) {
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.id !== 'brand') { //  값
                element.value = '';
            }
        });
        DetailInputState.formData = {};
        updatePreview();
    }
}

//
function saveTemplate() {
    const formData = collectDetailFormData();
    const templateName = prompt('  하세요:');

    if (templateName) {
        const templates = JSON.parse(localStorage.getItem('detailTemplates') || '{}');
        templates[templateName] = formData;
        localStorage.setItem('detailTemplates', JSON.stringify(templates));
        alert(` "${templateName}"() 되었습니다.`);
    }
}

//   함
async function generateDetailPage() {
    const btn = document.querySelector('#generateBtnText');
    const originalText = btn.textContent;
    btn.textContent = '⏳  ...';
    showLoading(true);

    try {
        // 1.
        const detailData = collectDetailFormData();

        // 2. 필
        if (!detailData.productName) {
            alert('명은 필  .');
            return;
        }

        // 3. generator.js
        const generatorData = convertToGeneratorFormat(detailData);

        // 4.   AI 동  ()
        if (!generatorData.heritageStory || !generatorData.trustContent) {
            console.log('AI    ...');

            //  manwon-prompt-v9.js 함
            if (!generatorData.heritageStory && typeof generateHeritageStory === 'function') {
                generatorData.heritageStory = await generateHeritageStory(detailData.productName);
            }
            if (!generatorData.trustContent && typeof generateTrustContent === 'function') {
                generatorData.trustContent = await generateTrustContent(detailData.productName);
            }
            if (generatorData.benefits.length === 0 && typeof generateBenefits === 'function') {
                generatorData.benefits = await generateBenefits(detailData.productName);
            }
        }

        // 5. HTML  ( generator.js generateHTML 함 )
        let htmlContent;
        if (typeof generateHTML === 'function') {
            htmlContent = await generateHTML(generatorData);
        } else {
            // :  HTML
            htmlContent = generateDetailHTML(generatorData);
        }

        // 6. HTML
        if (typeof validateGeneratedHTML === 'function') {
            const validationResult = validateGeneratedHTML(htmlContent);
            if (validationResult.summary.totalErrors > 0) {
                htmlContent = validationResult.validation.fixedHTML;
            }
        }

        // 7.  다운드
        const fileName = createSafeFileName(detailData.productName);
        downloadDetailHTML(htmlContent, fileName);

        // 8. Cafe24 SEO
        const seoData = {
            title: detailData.metaTitle || detailData.productName,
            description: detailData.metaDescription,
            keywords: detailData.keywords,
            category: detailData.category,
            brand: detailData.brand
        };

        // SEO 도 다운드
        downloadSEOData(seoData, fileName);

        alert(' 성공적으 되었습니다!');

    } catch (error) {
        console.error('  :', error);
        alert('   : ' + error.message);
    } finally {
        btn.textContent = originalText;
        showLoading(false);
    }
}

//  HTML   ()
function generateDetailHTML(data) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} -  </title>
    <meta name="description" content="${data.metaData?.description || data.title}">
    <meta name="keywords" content="${data.metaData?.keywords || ', '}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .product-header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-bottom: 40px; }
        .product-header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .price { font-size: 2em; color: #ef4444; font-weight: bold; margin: 20px 0; }
        .product-images { margin: 40px 0; }
        .main-image { width: 100%; max-width: 600px; margin: 0 auto; display: block; }
        .detail-images { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .detail-images img { width: 100%; border-radius: 8px; }
        .product-info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .product-info-table th { background: #f3f4f6; padding: 12px; text-align: left; width: 30%; }
        .product-info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .benefits-list { list-style: none; padding: 20px 0; }
        .benefits-list li { padding: 10px 0; padding-left: 30px; position: relative; }
        .benefits-list li:before { content: ""; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 1.2em; }
        .section { margin: 40px 0; padding: 30px; background: #f9fafb; border-radius: 12px; }
        .section h2 { color: #1e40af; margin-bottom: 20px; font-size: 1.8em; }
    </style>
</head>
<body>
    <div class="product-header">
        <div class="container">
            <h1>${data.title}</h1>
            ${data.price ? `<div class="price">${data.price}</div>` : ''}
        </div>
    </div>

    <div class="container">
        ${data.mainImage ? `
            <div class="product-images">
                <img src="${data.mainImage}" alt="${data.title}" class="main-image">
                ${data.detailImages.length > 0 ? `
                    <div class="detail-images">
                        ${data.detailImages.map(img => `<img src="${img}" alt="${data.title} ">`).join('')}
                    </div>
                ` : ''}
            </div>
        ` : ''}

        ${data.productInfo || ''}

        ${data.heritageStory ? `
            <div class="section">
                <h2> 소</h2>
                ${data.heritageStory}
            </div>
        ` : ''}

        ${data.benefits.length > 0 ? `
            <div class="section">
                <h2> </h2>
                <ul class="benefits-list">
                    ${data.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${data.usageGuide ? `
            <div class="section">
                <h2> </h2>
                ${data.usageGuide}
            </div>
        ` : ''}
    </div>
</body>
</html>`;
}

// 안전 명
function createSafeFileName(productName) {
    const safeName = productName
        .replace(/[\[\]]/g, '')
        .replace(/[^\w-\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);

    const timestamp = new Date().toISOString().slice(0, 10);
    return `${safeName}_${timestamp}`;
}

// HTML 다운드
function downloadDetailHTML(content, fileName) {
    const blob = new Blob([content], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// SEO  다운드
function downloadSEOData(seoData, fileName) {
    const jsonContent = JSON.stringify(seoData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_seo.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//
document.addEventListener('DOMContentLoaded', function() {
    //   에 벤트  추
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (DetailInputState.previewMode) {
                updatePreview();
            }
        });
    });

    // API  드
    const openaiKey = localStorage.getItem('openai_api_key');
    const claudeKey = localStorage.getItem('claude_api_key');

    if (!openaiKey && !claudeKey) {
        console.log('API  되지 . AI   제됩니다.');
    }
});

//  함
window.switchTab = switchTab;
window.aiAssist = aiAssist;
window.togglePreview = togglePreview;
window.resetForm = resetForm;
window.saveTemplate = saveTemplate;
window.generateDetailPage = generateDetailPage;