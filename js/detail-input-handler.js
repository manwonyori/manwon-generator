/**
 * 상세 입력 모드 핸들러
 * 기존 generator.js와 완벽하게 호환되도록 설계
 */

// 전역 상태 관리
const DetailInputState = {
    currentTab: 'basic',
    formData: {},
    previewMode: false,
    aiProcessing: false
};

// 탭 전환 기능
function switchTab(tabName) {
    // 모든 탭 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 탭 표시
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    DetailInputState.currentTab = tabName;
}

// 폼 데이터 수집
function collectDetailFormData() {
    const data = {
        // 기본 정보
        productName: document.getElementById('productName')?.value || '',
        brand: document.getElementById('brand')?.value || '만원요리 최씨남매',
        category: document.getElementById('category')?.value || '',
        price: document.getElementById('price')?.value || '',
        composition: document.getElementById('composition')?.value || '',
        
        // 상세 정보
        expiryDate: document.getElementById('expiryDate')?.value || '',
        productType: document.getElementById('productType')?.value || '',
        origin: document.getElementById('origin')?.value || '',
        bundleShipping: document.getElementById('bundleShipping')?.value || '',
        storageType: document.getElementById('storageType')?.value || '',
        packagingType: document.getElementById('packagingType')?.value || '',
        ingredients: document.getElementById('ingredients')?.value || '',
        
        // 마케팅 정보
        productFeatures: document.getElementById('productFeatures')?.value || '',
        targetCustomer: document.getElementById('targetCustomer')?.value || '',
        sellingPoints: document.getElementById('sellingPoints')?.value || '',
        usageMethod: document.getElementById('usageMethod')?.value || '',
        
        // SEO 설정
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

// 기존 generator.js 형식으로 데이터 변환
function convertToGeneratorFormat(detailData) {
    // 제품 특성을 HTML 형식으로 변환
    const formatFeatures = (features) => {
        if (!features) return '';
        return features.split('\n')
            .filter(f => f.trim())
            .map(f => `<li>${f.trim()}</li>`)
            .join('\n');
    };
    
    // 판매 포인트를 benefits 형식으로 변환
    const formatBenefits = (points) => {
        if (!points) return [];
        return points.split('\n')
            .filter(p => p.trim())
            .map(p => p.replace(/^[•·\-\*]\s*/, '').trim());
    };
    
    // generator.js가 기대하는 형식으로 변환
    return {
        title: detailData.productName,
        mainImage: detailData.mainImage,
        detailImages: detailData.detailImages,
        price: detailData.price,
        
        // AI가 보완할 수 있는 필드들
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
            `<p>이런 분들을 위한 제품입니다: ${detailData.targetCustomer}</p>` : '',
        
        benefits: formatBenefits(detailData.sellingPoints),
        
        usageGuide: detailData.usageMethod || '',
        
        features: formatBenefits(detailData.productFeatures),
        
        // 제품 정보 섹션
        productInfo: generateProductInfoHTML(detailData),
        
        // SEO 메타데이터
        metaData: {
            title: detailData.metaTitle || detailData.productName,
            description: detailData.metaDescription,
            keywords: detailData.keywords
        }
    };
}

// 제품 정보 HTML 생성
function generateProductInfoHTML(data) {
    const infoItems = [];
    
    if (data.composition) {
        infoItems.push(`<tr><th>구성 및 규격</th><td>${data.composition.replace(/\n/g, '<br>')}</td></tr>`);
    }
    if (data.expiryDate) {
        infoItems.push(`<tr><th>소비기한</th><td>${data.expiryDate}</td></tr>`);
    }
    if (data.productType) {
        infoItems.push(`<tr><th>제품종류</th><td>${data.productType}</td></tr>`);
    }
    if (data.origin) {
        infoItems.push(`<tr><th>원산지</th><td>${data.origin}</td></tr>`);
    }
    if (data.bundleShipping) {
        infoItems.push(`<tr><th>합배송</th><td>${data.bundleShipping}</td></tr>`);
    }
    if (data.storageType) {
        infoItems.push(`<tr><th>보관방법</th><td>${data.storageType}</td></tr>`);
    }
    if (data.packagingType) {
        infoItems.push(`<tr><th>포장방식</th><td>${data.packagingType}</td></tr>`);
    }
    if (data.ingredients) {
        infoItems.push(`<tr><th>성분</th><td>${data.ingredients.replace(/\n/g, '<br>')}</td></tr>`);
    }
    
    if (infoItems.length === 0) return '';
    
    return `
        <div class="product-info-section">
            <h2>📋 제품 정보</h2>
            <table class="product-info-table">
                ${infoItems.join('\n')}
            </table>
        </div>
    `;
}

// AI 보조 기능
async function aiAssist(fieldType) {
    if (DetailInputState.aiProcessing) {
        alert('AI가 이미 처리 중입니다. 잠시만 기다려주세요.');
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
                prompt = `제품명 "${formData.productName}"의 구성 및 규격을 간결하게 정리해주세요.`;
                targetField = 'composition';
                break;
            
            case 'ingredients':
                const currentIngredients = document.getElementById('ingredients').value;
                prompt = `다음 성분 정보를 읽기 쉽게 정리해주세요:\n${currentIngredients}`;
                targetField = 'ingredients';
                break;
            
            case 'features':
                prompt = `"${formData.productName}" 제품의 주요 특징과 장점을 마케팅 관점에서 5가지로 작성해주세요.`;
                targetField = 'productFeatures';
                break;
            
            case 'sellingPoints':
                prompt = `"${formData.productName}" 제품의 핵심 판매 포인트를 3-5개 작성해주세요. 각 포인트는 한 줄로 작성하고 "•"로 시작해주세요.`;
                targetField = 'sellingPoints';
                break;
            
            case 'metaTitle':
                prompt = `"${formData.productName}" 제품의 SEO 최적화된 메타 제목을 60자 이내로 작성해주세요.`;
                targetField = 'metaTitle';
                break;
            
            case 'metaDesc':
                prompt = `"${formData.productName}" 제품의 SEO 최적화된 메타 설명을 160자 이내로 작성해주세요.`;
                targetField = 'metaDescription';
                break;
            
            case 'keywords':
                prompt = `"${formData.productName}" 제품과 관련된 검색 키워드를 10개 추천해주세요. 쉼표로 구분해주세요.`;
                targetField = 'keywords';
                break;
        }
        
        // AI API 호출 (기존 API 설정 사용)
        const response = await callAI(prompt);
        
        if (response && targetField) {
            document.getElementById(targetField).value = response;
            updatePreview();
        }
        
    } catch (error) {
        console.error('AI 보조 오류:', error);
        alert('AI 처리 중 오류가 발생했습니다.');
    } finally {
        DetailInputState.aiProcessing = false;
        showLoading(false);
    }
}

// AI API 호출 (기존 api-config.js 활용)
async function callAI(prompt) {
    // OpenAI API 우선 시도
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
                            content: '당신은 한국 이커머스 상품 페이지 작성 전문가입니다. 간결하고 매력적인 문구를 작성해주세요.'
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
            console.error('OpenAI API 오류:', error);
        }
    }
    
    // Claude API 대체
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
            console.error('Claude API 오류:', error);
        }
    }
    
    // API 키가 없는 경우 기본 텍스트 반환
    return generateDefaultContent(prompt);
}

// 기본 콘텐츠 생성 (AI API 없을 때)
function generateDefaultContent(prompt) {
    if (prompt.includes('구성 및 규격')) {
        return '제품 구성 정보를 입력해주세요';
    }
    if (prompt.includes('특징과 장점')) {
        return '• 신선한 재료 사용\n• HACCP 인증 시설 생산\n• 간편한 조리 방법\n• 가성비 우수\n• 온 가족이 즐기는 맛';
    }
    if (prompt.includes('판매 포인트')) {
        return '• 프리미엄 품질의 재료\n• 합리적인 가격\n• 빠른 배송 서비스';
    }
    return '';
}

// 미리보기 토글
function togglePreview() {
    const panel = document.getElementById('previewPanel');
    panel.classList.toggle('open');
    DetailInputState.previewMode = panel.classList.contains('open');
    
    if (DetailInputState.previewMode) {
        updatePreview();
    }
}

// 미리보기 업데이트
function updatePreview() {
    if (!DetailInputState.previewMode) return;
    
    const formData = collectDetailFormData();
    const previewContent = document.getElementById('previewContent');
    
    const previewHTML = `
        <div style="padding: 20px; font-family: 'Pretendard', sans-serif;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">${formData.productName || '제품명을 입력하세요'}</h2>
            
            ${formData.price ? `<p style="font-size: 24px; color: #ef4444; font-weight: bold;">${formData.price}</p>` : ''}
            
            ${formData.composition ? `
                <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                    <strong>구성:</strong> ${formData.composition.replace(/\n/g, '<br>')}
                </div>
            ` : ''}
            
            ${formData.productFeatures ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #374151; margin-bottom: 10px;">제품 특징</h3>
                    <p style="line-height: 1.6; color: #6b7280;">${formData.productFeatures.replace(/\n/g, '<br>')}</p>
                </div>
            ` : ''}
            
            ${formData.ingredients ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #374151; margin-bottom: 10px;">성분</h3>
                    <p style="font-size: 14px; color: #9ca3af;">${formData.ingredients}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    previewContent.innerHTML = previewHTML;
}

// 로딩 표시
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// 폼 초기화
function resetForm() {
    if (confirm('모든 입력 내용을 초기화하시겠습니까?')) {
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.id !== 'brand') { // 브랜드는 기본값 유지
                element.value = '';
            }
        });
        DetailInputState.formData = {};
        updatePreview();
    }
}

// 템플릿 저장
function saveTemplate() {
    const formData = collectDetailFormData();
    const templateName = prompt('템플릿 이름을 입력하세요:');
    
    if (templateName) {
        const templates = JSON.parse(localStorage.getItem('detailTemplates') || '{}');
        templates[templateName] = formData;
        localStorage.setItem('detailTemplates', JSON.stringify(templates));
        alert(`템플릿 "${templateName}"이(가) 저장되었습니다.`);
    }
}

// 메인 생성 함수
async function generateDetailPage() {
    const btn = document.querySelector('#generateBtnText');
    const originalText = btn.textContent;
    btn.textContent = '⏳ 생성 중...';
    showLoading(true);
    
    try {
        // 1. 상세 입력 데이터 수집
        const detailData = collectDetailFormData();
        
        // 2. 필수 필드 검증
        if (!detailData.productName) {
            alert('제품명은 필수 입력 항목입니다.');
            return;
        }
        
        // 3. generator.js 형식으로 변환
        const generatorData = convertToGeneratorFormat(detailData);
        
        // 4. 빈 필드 AI 자동 채우기 (선택적)
        if (!generatorData.heritageStory || !generatorData.trustContent) {
            console.log('AI로 빈 필드 보완 중...');
            
            // 기존 manwon-prompt-v9.js의 함수 활용
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
        
        // 5. HTML 생성 (기존 generator.js의 generateHTML 함수 활용)
        let htmlContent;
        if (typeof generateHTML === 'function') {
            htmlContent = await generateHTML(generatorData);
        } else {
            // 폴백: 직접 HTML 생성
            htmlContent = generateDetailHTML(generatorData);
        }
        
        // 6. HTML 검증
        if (typeof validateGeneratedHTML === 'function') {
            const validationResult = validateGeneratedHTML(htmlContent);
            if (validationResult.summary.totalErrors > 0) {
                htmlContent = validationResult.validation.fixedHTML;
            }
        }
        
        // 7. 파일 다운로드
        const fileName = createSafeFileName(detailData.productName);
        downloadDetailHTML(htmlContent, fileName);
        
        // 8. Cafe24 SEO 데이터 생성
        const seoData = {
            title: detailData.metaTitle || detailData.productName,
            description: detailData.metaDescription,
            keywords: detailData.keywords,
            category: detailData.category,
            brand: detailData.brand
        };
        
        // SEO 데이터도 다운로드
        downloadSEOData(seoData, fileName);
        
        alert('상세페이지가 성공적으로 생성되었습니다!');
        
    } catch (error) {
        console.error('상세페이지 생성 오류:', error);
        alert('생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
        btn.textContent = originalText;
        showLoading(false);
    }
}

// 상세 HTML 직접 생성 (폴백)
function generateDetailHTML(data) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - 만원요리 최씨남매</title>
    <meta name="description" content="${data.metaData?.description || data.title}">
    <meta name="keywords" content="${data.metaData?.keywords || '만원요리, 최씨남매'}">
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
        .benefits-list li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 1.2em; }
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
                        ${data.detailImages.map(img => `<img src="${img}" alt="${data.title} 상세">`).join('')}
                    </div>
                ` : ''}
            </div>
        ` : ''}
        
        ${data.productInfo || ''}
        
        ${data.heritageStory ? `
            <div class="section">
                <h2>제품 소개</h2>
                ${data.heritageStory}
            </div>
        ` : ''}
        
        ${data.benefits.length > 0 ? `
            <div class="section">
                <h2>제품의 장점</h2>
                <ul class="benefits-list">
                    ${data.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${data.usageGuide ? `
            <div class="section">
                <h2>사용 방법</h2>
                ${data.usageGuide}
            </div>
        ` : ''}
    </div>
</body>
</html>`;
}

// 안전한 파일명 생성
function createSafeFileName(productName) {
    const safeName = productName
        .replace(/[\[\]]/g, '')
        .replace(/[^\w가-힣\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
    
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${safeName}_${timestamp}`;
}

// HTML 다운로드
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

// SEO 데이터 다운로드
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

// 실시간 입력 감지 및 미리보기 업데이트
document.addEventListener('DOMContentLoaded', function() {
    // 모든 입력 필드에 이벤트 리스너 추가
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (DetailInputState.previewMode) {
                updatePreview();
            }
        });
    });
    
    // API 키 로드
    const openaiKey = localStorage.getItem('openai_api_key');
    const claudeKey = localStorage.getItem('claude_api_key');
    
    if (!openaiKey && !claudeKey) {
        console.log('API 키가 설정되지 않았습니다. AI 보조 기능이 제한됩니다.');
    }
});

// 전역 함수로 내보내기
window.switchTab = switchTab;
window.aiAssist = aiAssist;
window.togglePreview = togglePreview;
window.resetForm = resetForm;
window.saveTemplate = saveTemplate;
window.generateDetailPage = generateDetailPage;