// Page generation function (asynchronous processing)
async function generatePage() {
    // Show loading
    const generateBtn = event.target;
    const originalText = generateBtn.textContent;
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    try {
        const pageData = await collectFormData();
        if (!validateFormData(pageData)) {
            return;
        }
        
        let htmlContent = await generateHTML(pageData);
        
        // Perform HTML validation
        if (typeof validateGeneratedHTML !== 'undefined') {
            const validationResult = validateGeneratedHTML(htmlContent);
            
            if (validationResult.summary.totalErrors > 0) {
                console.warn('HTML validation errors found:', validationResult.validation.errors);
                // Use auto-corrected HTML
                htmlContent = validationResult.validation.fixedHTML;
                console.log('HTML has been automatically corrected.');
            }
        }
        
        const fileName = createFileName(pageData.title);
        
        // Server-side processing is required to save as an actual file
        // Here we handle it with download method
        downloadHTML(htmlContent, fileName);
        
        // Success message
        alert('Page has been generated! Download will start.');
    } catch (error) {
        console.error('Page generation error:', error);
        alert('An error occurred while generating the page.\n\nError details: ' + error.message);
    } finally {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

// Safe element getter
function safeGetElementValue(id, defaultValue = '') {
    const element = document.getElementById(id);
    return element ? element.value : defaultValue;
}

// Collect form data (changed to async for asynchronous processing)
async function collectFormData() {
    // Collect detail images
    const detailImages = [];
    for (let i = 1; i <= 4; i++) {
        const imageUrl = safeGetElementValue(`detailImage${i}`);
        if (imageUrl) {
            detailImages.push(imageUrl);
        }
    }
    
    const productTitle = safeGetElementValue('pageTitle');
    
    // Process fields that require AI generation asynchronously
    const data = {
        title: productTitle,
        mainImage: safeGetElementValue('mainImage'),
        detailImages: detailImages,
        price: safeGetElementValue('price'),
        heritageStory: safeGetElementValue('heritageStory') || await generateHeritageStory(productTitle),
        trustContent: safeGetElementValue('trustContent') || await generateTrustContent(productTitle),
        painPoints: safeGetElementValue('painPoints') || await generatePainPoints(productTitle),
        benefits: safeGetElementValue('benefits') ? 
            safeGetElementValue('benefits').split('\n').filter(b => b.trim()) : 
            await generateBenefits(productTitle),
        usageGuide: safeGetElementValue('usageGuide') || await generateUsageGuide(productTitle),
        features: safeGetElementValue('features') ? 
            safeGetElementValue('features').split('\n').filter(f => f.trim()) : 
            await generateFeatures(productTitle),
        faqContent: safeGetElementValue('faqContent') || await generateFAQ(productTitle),
        productInfo: generateProductInfo(), // Remove non-existent element access
        template: safeGetElementValue('template', 'default')
    };
    
    return data;
}

// Data validation
function validateFormData(data) {
    if (!data.title) {
        alert('Please enter a page title.');
        return false;
    }
    // Main image is required if no reference URL
    const referenceUrl = safeGetElementValue('referenceUrl');
    if (!referenceUrl && !data.mainImage) {
        alert('Please enter a Main Image URL or Reference Site URL.');
        return false;
    }
    return true;
}

// HTML content cleanup function
function cleanHtmlContent(content) {
    if (!content) return '';
    
    // Remove repeated special characters, fix HTML tag errors
    return String(content)
        .replace(/(.)\1{3,}/g, '$1')     // Remove same character repeated 4+ times
        .replace(/```html\s*/gi, '')      // Remove ```html tags
        .replace(/```\s*/g, '')           // Remove ``` tags
        .replace(/盛+/g, '')              // Remove repeated specific Chinese characters
        .replace(/<\/?\s*html\s*>/gi, '') // Remove incorrect html tags
        .replace(/\n{3,}/g, '\n\n')       // Remove excessive line breaks
        .trim();
}

// Generate HTML
async function generateHTML(data) {
    const template = await getTemplate(data.template);
    
    // Replace template variables
    let html = template;
    // 분석 결과가 있으면 제목에 핵심 메시지 반영
    let displayTitle = escapeHtml(data.title);
    if (window.currentProductAnalysis && window.currentProductAnalysis.keyMessages) {
        displayTitle = escapeHtml(window.currentProductAnalysis.keyMessages.headline || data.title);
    }
    
    html = html.replace(/{{title}}/g, displayTitle);
    html = html.replace(/{{mainImage}}/g, data.mainImage || 'https://via.placeholder.com/500x500');
    
    // Handle optional price display
    const priceDisplay = data.price ? 
        `<div class="price-tag">${escapeHtml(data.price)}</div>` : '';
    html = html.replace(/{{priceDisplay}}/g, priceDisplay);
    html = html.replace(/{{heritageStory}}/g, cleanHtmlContent(data.heritageStory));
    html = html.replace(/{{trustContent}}/g, cleanHtmlContent(data.trustContent));
    html = html.replace(/{{painPoints}}/g, cleanHtmlContent(data.painPoints));
    
    // Premium template additional variables
    if (data.template === 'premium') {
        // Heritage title
        html = html.replace(/{{heritageTitle}}/g, data.heritageTitle || '🇪🇸 La Historia de Hamón');
        
        // Heritage timeline
        html = html.replace(/{{heritageTimeline}}/g, data.heritageTimeline || generateHeritageTimeline());
        
        // Impact content
        html = html.replace(/{{impactContent}}/g, data.impactContent || generateImpactContent(data.title));
        
        // Feature cards
        html = html.replace(/{{featureCards}}/g, data.featureCards || generateFeatureCards());
        
        // Usage steps
        html = html.replace(/{{usageSteps}}/g, data.usageSteps || generateUsageSteps());
        
        // Social proof content
        html = html.replace(/{{socialProofContent}}/g, data.socialProofContent || generateSocialProofContent());
        
        // Final tip
        html = html.replace(/{{finalTip}}/g, data.finalTip || generateFinalTip());
    }
    
    // Generate benefits list
    const benefitsHTML = data.benefits.map(benefit => 
        `<li>${escapeHtml(benefit)}</li>`
    ).join('');
    html = html.replace(/{{benefits}}/g, benefitsHTML);
    
    html = html.replace(/{{usageGuide}}/g, cleanHtmlContent(data.usageGuide));
    
    // Generate features list
    const featuresHTML = data.features.map(feature => 
        `<li>${escapeHtml(feature)}</li>`
    ).join('');
    html = html.replace(/{{features}}/g, featuresHTML);
    
    html = html.replace(/{{faqContent}}/g, cleanHtmlContent(data.faqContent));
    html = html.replace(/{{productInfo}}/g, cleanHtmlContent(data.productInfo));
    
    // Add detail images
    let detailImagesHTML = '';
    if (data.detailImages && data.detailImages.length > 0) {
        detailImagesHTML = data.detailImages.map(imageUrl => 
            `<img src="${escapeHtml(imageUrl)}" alt="Detail image" class="product-image">`
        ).join('\n');
    }
    html = html.replace(/{{detailImages}}/g, detailImagesHTML);
    
    return html;
}

// Get template
async function getTemplate(templateName) {
    // Read from file if Premium template
    if (templateName === 'premium') {
        try {
            const response = await fetch('templates/premium.html');
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.error('Premium template load failed:', error);
        }
    }
    
    // Manwon Cuisine Choi Siblings exclusive template v9.0
    const defaultTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - 만원요리 최씨남매</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* v9.0 Design System */
        :root {
            --saffron-gold: #E4A853;
            --deep-rose: #C53030;
            --deep-charcoal: #1F2937;
            --pure-white: #FFFFFF;
            --light-gray: #F9FAFB;
            --medium-gray: #6B7280;
            --border-gray: #E5E7EB;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--deep-charcoal);
            background-color: var(--pure-white);
            font-size: 16px;
        }
        
        .container {
            max-width: 860px;
            margin: 0 auto;
            padding: 0;
            background-color: var(--pure-white);
        }
        
        /* Typography System */
        h1 {
            font-size: clamp(28px, 5vw, 36px);
            font-weight: 700;
            color: var(--deep-charcoal);
            line-height: 1.4;
        }
        
        h2 {
            font-size: clamp(22px, 4vw, 28px);
            font-weight: 700;
            color: var(--deep-charcoal);
            margin-bottom: 24px;
        }
        
        h3 {
            font-size: clamp(18px, 3vw, 22px);
            font-weight: 700;
            color: var(--deep-charcoal);
            margin-bottom: 16px;
        }
        
        p {
            font-size: clamp(14px, 2.5vw, 16px);
            line-height: 1.8;
            color: var(--deep-charcoal);
            margin-bottom: 16px;
        }
        /* Section Styles */
        .section {
            padding: 40px 24px;
            background-color: var(--pure-white);
            border-bottom: 1px solid var(--border-gray);
        }
        
        .section:nth-child(even) {
            background-color: var(--light-gray);
        }
        
        /* Strategic Header */
        .strategic-header {
            text-align: center;
            padding: 60px 24px;
            background: linear-gradient(135deg, var(--light-gray) 0%, var(--pure-white) 100%);
        }
        
        .brand-label {
            color: var(--saffron-gold);
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 16px;
            display: block;
        }
        
        .main-copy {
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 700;
            color: var(--deep-charcoal);
            margin-bottom: 24px;
            line-height: 1.4;
        }
        
        .section-icon {
            font-size: 32px;
            margin-bottom: 16px;
            display: inline-block;
        }
        
        /* Image Styles */
        .product-image {
            max-width: 100%;
            width: 100%;
            height: auto;
            margin: 32px 0;
            display: block;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .main-product-image {
            max-width: 600px;
            width: 100%;
            height: auto;
            margin: 32px auto;
            display: block;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        /* Benefit Cards */
        .benefit-card {
            background: var(--pure-white);
            border: 1px solid var(--border-gray);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
        }
        
        .benefit-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        
        .benefit-number {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: var(--saffron-gold);
            color: var(--pure-white);
            border-radius: 50%;
            text-align: center;
            line-height: 32px;
            font-weight: 700;
            margin-right: 12px;
        }
        /* Text Highlights */
        .highlight {
            color: var(--deep-rose);
            font-weight: 700;
        }
        
        .price-tag {
            display: inline-block;
            background: var(--deep-rose);
            color: var(--pure-white);
            padding: 8px 24px;
            border-radius: 24px;
            font-size: 20px;
            font-weight: 700;
            margin: 16px 0;
        }
        
        /* List Styles */
        .benefit-list {
            list-style: none;
            padding: 0;
            margin: 24px 0;
        }
        
        .benefit-list li {
            position: relative;
            padding: 12px 0 12px 36px;
            line-height: 1.8;
            font-size: 16px;
        }
        
        .benefit-list li:before {
            content: "[완료]";
            position: absolute;
            left: 0;
            font-size: 20px;
        }
        
        /* Trust Box */
        .trust-box {
            background: var(--light-gray);
            border-left: 4px solid var(--saffron-gold);
            padding: 24px;
            margin: 24px 0;
            border-radius: 8px;
        }
        
        .trust-box h3 {
            color: var(--saffron-gold);
            margin-bottom: 16px;
        }
        
        /* FAQ Styles */
        .faq-item {
            background: var(--light-gray);
            padding: 20px;
            margin-bottom: 16px;
            border-radius: 8px;
            border: 1px solid var(--border-gray);
        }
        
        .faq-question {
            font-weight: 700;
            color: var(--deep-charcoal);
            margin-bottom: 12px;
            font-size: 16px;
        }
        
        .faq-answer {
            color: var(--medium-gray);
            line-height: 1.8;
            font-size: 15px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .section {
                padding: 32px 16px;
            }
            
            .strategic-header {
                padding: 40px 16px;
            }
            
            .main-copy {
                font-size: 24px;
            }
        }
        
        /* Company Info Table */
        .info-table {
            width: 100%;
            margin: 24px 0;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        .info-table th,
        .info-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-gray);
        }
        
        .info-table th {
            background-color: var(--light-gray);
            font-weight: 700;
            width: 30%;
            color: var(--deep-charcoal);
        }
        
        .info-table td {
            color: var(--medium-gray);
        }
        </style>
</head>
<body>
    <div class="container">
        <!-- 1. Strategic Header -->
        <div class="strategic-header">
            <span class="brand-label">만원요리 최씨남매 X {{title}} 단독 공구</span>
            <h1 class="main-copy">{{title}}</h1>
            <img src="{{mainImage}}" alt="{{title}}" class="main-product-image">
            {{priceDisplay}}
        </div>
        
        <!-- 2. Why Section -->
        <div class="section">
            <div style="text-align: center;">
                <span class="section-icon">🤔</span>
                <h2>Why? 왜 이 {{title}}이어야 할까요?</h2>
            </div>
            <div>
                {{painPoints}}
                <ul class="benefit-list">
                    {{benefits}}
                </ul>
            </div>
        </div>
        
        <!-- 3. Wow Section -->
        <div class="section">
            <div style="text-align: center;">
                <span class="section-icon">💰</span>
                <h2>배송비 절약의 기회! 🚚</h2>
            </div>
            <div>
                {{heritageStory}}
            </div>
        </div>
        
        <!-- 4. How Section -->
        <div class="section">
            <div style="text-align: center;">
                <span class="section-icon">🍳</span>
                <h2>How? 이렇게 활용하세요!</h2>
            </div>
            <div>
                {{usageGuide}}
            </div>
        </div>
        
        <!-- 5. Trust Section -->
        <div class="section">
            <div style="text-align: center;">
                <span class="section-icon">🛡️</span>
                <h2>Trust! 믿을 수 있는 이유</h2>
            </div>
            <div class="trust-box">
                <h3>🏆 만원요리 최씨남매가 보증합니다</h3>
                {{trustContent}}
            </div>
            
            <h3 style="margin-top: 32px;">[완료] 제품의 특별한 특징</h3>
            <ul class="benefit-list">
                {{features}}
            </ul>
            
            {{detailImages}}
        </div>
        
        <!-- 6. FAQ Section -->
        <div class="section">
            <div style="text-align: center;">
                <span class="section-icon">[질문]</span>
                <h2>자주 묻는 질문</h2>
            </div>
            <div>
                {{faqContent}}
            </div>
        </div>
        
        <!-- 6. Company Information -->
        <div class="section">
            <h3 style="text-align: center; margin-bottom: 24px;">판매원 정보</h3>
            <table class="info-table">
                <tr>
                    <th>상호</th>
                    <td>㈜값진한끼</td>
                </tr>
                <tr>
                    <th>대표자</th>
                    <td>고혜숙</td>
                </tr>
                <tr>
                    <th>사업자등록번호</th>
                    <td>434-86-03863</td>
                </tr>
                <tr>
                    <th>통신판매업</th>
                    <td>2025-경기파주-2195호</td>
                </tr>
                <tr>
                    <th>주소</th>
                    <td>경기도 파주시 경의로 1246, 11층 1105-19호</td>
                </tr>
                <tr>
                    <th>전화</th>
                    <td>070-8835-2885</td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>we@manwonyori.com</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>`;
    
    // Add here to apply different styles per template
    if (templateName === 'modern') {
        // Modern template (to be implemented later)
        return defaultTemplate;
    } else if (templateName === 'minimal') {
        // Minimal template (to be implemented later)
        return defaultTemplate;
    }
    
    return defaultTemplate;
}

// Preview function (asynchronous processing)
async function previewPage() {
    // Show loading
    const previewBtn = event.target;
    const originalText = previewBtn.textContent;
    previewBtn.textContent = 'Loading...';
    previewBtn.disabled = true;
    
    try {
        const pageData = await collectFormData();
        if (!validateFormData(pageData)) {
            return;
        }
        
        const htmlContent = await generateHTML(pageData);
        const previewDiv = document.getElementById('preview');
        
        // Safe preview method
        showSafePreview(htmlContent, previewDiv);
        
    } catch (error) {
        console.error('Preview error:', error);
        alert('An error occurred while generating the preview.\n\nError details: ' + error.message);
        const previewDiv = document.getElementById('preview');
        if (previewDiv) {
            previewDiv.innerHTML = '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
        }
    } finally {
        previewBtn.textContent = originalText;
        previewBtn.disabled = false;
    }
}

// Safe preview display function
function showSafePreview(htmlContent, container) {
    if (!htmlContent || !container) {
        console.error('No preview data available.');
        return;
    }
    
    try {
        // Clean HTML
        const cleanHTML = sanitizePreviewHTML(htmlContent);
        
        // Preview with Blob URL method (safer)
        const blob = new Blob([cleanHTML], { type: 'text/html;charset=utf-8' });
        const blobURL = URL.createObjectURL(blob);
        
        const iframe = document.createElement('iframe');
        iframe.src = blobURL;
        iframe.style.cssText = 'width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;';
        iframe.sandbox = 'allow-same-origin allow-scripts';
        
        // Clear existing content and add new iframe
        container.innerHTML = '';
        container.appendChild(iframe);
        
        // Memory cleanup (after 5 minutes)
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
        }, 300000);
        
        console.log('[성공] Safe preview display completed');
        
    } catch (error) {
        console.error('Safe preview failed:', error);
        
        // Alternative: use srcdoc (simpler but more limited)
        try {
            const cleanHTML = sanitizePreviewHTML(htmlContent);
            const iframe = document.createElement('iframe');
            iframe.srcdoc = cleanHTML;
            iframe.style.cssText = 'width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;';
            iframe.sandbox = 'allow-same-origin allow-scripts';
            
            container.innerHTML = '';
            container.appendChild(iframe);
            
            console.log('[성공] Alternative preview display completed');
            
        } catch (fallbackError) {
            console.error('All preview methods failed:', fallbackError);
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666; border: 1px solid #ddd; border-radius: 8px;">
                    <h3>[경고] Preview Display Error</h3>
                    <p>Cannot display preview. Please generate and download the page.</p>
                    <button onclick="generatePage()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Generate Page
                    </button>
                </div>
            `;
        }
    }
}

// Preview HTML cleanup function
function sanitizePreviewHTML(html) {
    if (!html) return '';
    
    // Check and clean basic structure
    let cleaned = html;
    
    // Check required meta tags
    if (!cleaned.includes('<!DOCTYPE html>')) {
        cleaned = '<!DOCTYPE html>\n' + cleaned;
    }
    
    if (!cleaned.includes('<meta charset=')) {
        cleaned = cleaned.replace('<head>', '<head>\n<meta charset="UTF-8">');
    }
    
    if (!cleaned.includes('<meta name="viewport"')) {
        cleaned = cleaned.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
    
    // Change relative paths to absolute paths (images, etc.)
    cleaned = cleaned.replace(/src="(?!http|https|data:)/g, 'src="https://via.placeholder.com/400x300?text=');
    
    return cleaned;
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

// Reset form
function resetForm() {
    if (confirm('Reset all input fields?')) {
        safeSetElementValue('pageTitle', '');
        safeSetElementValue('mainImage', '');
        // Reset detail images
        for (let i = 1; i <= 4; i++) {
            safeSetElementValue(`detailImage${i}`, '');
        }
        safeSetElementValue('price', '');
        safeSetElementValue('heritageStory', '');
        safeSetElementValue('trustContent', '');
        safeSetElementValue('painPoints', '');
        safeSetElementValue('benefits', '');
        safeSetElementValue('usageGuide', '');
        safeSetElementValue('features', '');
        safeSetElementValue('faqContent', '');
        safeSetElementValue('template', 'default');
        document.getElementById('preview').innerHTML = '<p class="preview-placeholder">Generated page will be displayed here</p>';
    }
}

// HTML escape and special character cleanup
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    
    // First remove repeated special characters (like 盛盛盛)
    let cleaned = String(unsafe)
        .replace(/(.)\1{3,}/g, '$1')  // Reduce same character repeated 4+ times to 1
        .replace(/```html\s*/gi, '')   // Remove ```html tags
        .replace(/```\s*/g, '')        // Remove ``` tags
        .trim();
    
    // HTML escape
    return cleaned
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Create filename with company and product organization
function createFileName(title) {
    // Extract company name from brackets [회사명]제품명
    const companyMatch = title.match(/\[([^\]]+)\]/);
    const company = companyMatch ? companyMatch[1] : '기타';
    
    // Extract product name (remove company bracket)
    const productName = title.replace(/\[[^\]]+\]/g, '').trim();
    
    // Sanitize for file system
    const sanitizedCompany = company.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const sanitizedProduct = productName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    
    // Create date string
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Format: 회사명_제품명_날짜_시간.html
    return `${sanitizedCompany}_${sanitizedProduct}_${dateStr}_${timeStr}.html`;
}

// Download HTML
function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// AI-based content generation functions
async function generateHeritageStory(productName) {
    if (!productName) {
        return `<p>오랜 전통과 신뢰로 만든 최고의 품질</p>`;
    }
    
    // 분석 결과가 있으면 활용
    let enhancedPrompt = productName;
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG.PROMPTS) {
        enhancedPrompt = API_CONFIG.PROMPTS.heritageStory(productName);
    }
    
    if (window.currentProductAnalysis) {
        const analysis = window.currentProductAnalysis;
        enhancedPrompt = `
        ${enhancedPrompt}
        
        [제품 분석 정보]
        - 카테고리: ${analysis.category}
        - 타겟 고객: ${analysis.targetAudience}
        - 핵심 키워드: ${analysis.contentStrategy ? analysis.contentStrategy.keywords.join(', ') : '가성비, 품질'}
        - 감성 포인트: ${analysis.contentStrategy ? analysis.contentStrategy.emotionalAppeal : '합리적인 선택'}
        - 추천 톤: ${analysis.recommendedTone ? analysis.recommendedTone.primary : '친근하고 정직한'}
        
        위 분석 정보를 반영하여 더욱 정교하고 타겟에 맞는 스토리를 작성해주세요.
        `;
    }
    
    // Try AI generation with content-based API selection
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(enhancedPrompt, 'heritageStory');
        if (result) {
            return result;
        }
    }
    
    // Default template
    return `<p>${productName}의 특별한 가치와 전통</p>`;
}

async function generateTrustContent(productName) {
    if (!productName) {
        return `<p><span class="highlight">"정말 가성비 좋은 제품이에요!"</span></p>
    <p>만원요리 최씨남매가 직접 사용해보고 확신하게 추천드립니다. 합리적인 가격에 뛰어난 품질, 그리고 실용성까지 갖췄습니다.</p>`;
    }
    
    let enhancedPrompt = productName;
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG.PROMPTS) {
        enhancedPrompt = API_CONFIG.PROMPTS.trustContent(productName);
    }
    
    if (window.currentProductAnalysis) {
        const analysis = window.currentProductAnalysis;
        enhancedPrompt += `\n\n[제품 분석 정보]\n- 경쟁 우위: ${analysis.competitiveAdvantage}\n- 핵심 메시지: ${analysis.keyMessages.headline}\n이 정보를 활용하여 더 설득력 있는 추천 이유를 작성해주세요.`;
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(enhancedPrompt, 'trustContent');
        if (result) return result;
    }
    
    return `<p><span class="highlight">"${productName}, 정말 가성비 최고예요!"</span></p>
    <p>만원요리 최씨남매가 직접 사용해보고 자신있게 추천드립니다. 합리적인 가격에 뛰어난 품질을 경험하실 수 있어요.</p>`;
}

async function generatePainPoints(productName) {
    if (!productName) {
        return `<p>비싼 제품에 지치셨나요? 품질은 좋은데 가격이 부담스러우셨나요?</p>
    <p>이제 그런 고민은 끝! <span class="highlight">똑똑한 선택</span>으로 합리적인 소비를 하세요.</p>`;
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(API_CONFIG.PROMPTS.painPoints(productName), 'painPoints');
        if (result) return result;
    }
    
    return `<p>품질 좋은 ${productName}을(를) 찾기 어려우셨나요? 가격 때문에 망설이셨나요?</p>
    <p>이제 그런 고민은 끝! <span class="highlight">합리적인 가격</span>으로 최고의 품질을 경험하세요.</p>`;
}

async function generateUsageGuide(productName) {
    if (!productName) {
        return `<p>사용법은 정말 간단합니다!</p>
    <ol>
        <li>패키지를 개봉합니다</li>
        <li>설명서에 따라 사용합니다</li>
        <li>매일 편리하게 사용하세요</li>
    </ol>`;
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(API_CONFIG.PROMPTS.usageGuide(productName), 'usageGuide');
        if (result) return result;
    }
    
    return `<p>${productName} 사용법은 정말 간단합니다!</p>
    <ol>
        <li>제품을 개봉합니다</li>
        <li>동봉된 설명서를 참고하여 사용합니다</li>
        <li>매일 편리하게 활용하세요</li>
    </ol>`;
}

async function generateFAQ(productName) {
    if (!productName) {
        return `<div class="faq-item">
        <div class="faq-question">Q. 품질이 정말 좋은가요?</div>
        <div class="faq-answer">A. 네, 엄격한 품질 관리를 통해 제작되었습니다.</div>
    </div>
    <div class="faq-item">
        <div class="faq-question">Q. 배송은 얼마나 걸리나요?</div>
        <div class="faq-answer">A. 주문 후 2-3일 내에 받아보실 수 있습니다.</div>
    </div>`;
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(API_CONFIG.PROMPTS.faq(productName), 'faq');
        if (result) return result;
    }
    
    return `<div class="faq-item">
        <div class="faq-question">Q. ${productName}의 품질이 정말 좋은가요?</div>
        <div class="faq-answer">A. 네, 엄격한 품질 관리 기준을 통과한 제품만 판매합니다.</div>
    </div>
    <div class="faq-item">
        <div class="faq-question">Q. 배송은 얼마나 걸리나요?</div>
        <div class="faq-answer">A. 주문 후 2-3일 내에 받아보실 수 있습니다.</div>
    </div>`;
}

function generateProductInfo() {
    return `<div class="info-item">
        <span class="info-label">제품명</span>
        <span class="info-colon">:</span>
        <span class="info-value">제품 이름</span>
    </div>
    <div class="info-item">
        <span class="info-label">규격</span>
        <span class="info-colon">:</span>
        <span class="info-value">기본 규격</span>
    </div>
    <div class="info-item">
        <span class="info-label">제조사</span>
        <span class="info-colon">:</span>
        <span class="info-value">제조사명</span>
    </div>
    <div class="info-item">
        <span class="info-label">원산지</span>
        <span class="info-colon">:</span>
        <span class="info-value">국내산 또는 수입산</span>
    </div>`;
}

// Add benefits generation function
async function generateBenefits(productName) {
    if (!productName) {
        return ['가성비 최고의 선택', '검증된 품질', '빠른 배송', '친절한 고객 서비스', '만족도 보장'];
    }
    
    let enhancedPrompt = productName;
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG.PROMPTS) {
        enhancedPrompt = API_CONFIG.PROMPTS.benefits(productName);
    }
    
    if (window.currentProductAnalysis) {
        const analysis = window.currentProductAnalysis;
        enhancedPrompt += `\n\n[제품 분석 정보]\n- 핵심 특징: ${analysis.keyFeatures.join(', ')}\n- 타겟 고객: ${analysis.targetAudience}\n이 정보를 반영하여 타겟 고객에게 어필할 수 있는 혜택을 작성해주세요.`;
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(enhancedPrompt, 'benefits');
        if (result) {
            try {
                return JSON.parse(result);
            } catch (e) {
                return result.split('\n').filter(b => b.trim());
            }
        }
    }
    
    return [
        `${productName}의 뛰어난 가성비`,
        '검증된 품질과 내구성',
        '편리한 사용성',
        '빠르고 안전한 배송',
        '친절한 고객 지원'
    ];
}

// Add features generation function
async function generateFeatures(productName) {
    if (!productName) {
        return ['프리미엄 소재 사용', '인체공학적 디자인', '친환경 제조 공정', '국내 생산', 'KC 인증 획듍'];
    }
    
    if (typeof API_CONFIG !== 'undefined' && API_CONFIG && typeof callAI === 'function') {
        const result = await callAI(API_CONFIG.PROMPTS.features(productName), 'features');
        if (result) {
            try {
                return JSON.parse(result);
            } catch (e) {
                return result.split('\n').filter(f => f.trim());
            }
        }
    }
    
    return [
        `${productName}만의 특별한 기술`,
        '엄선된 고품질 소재',
        '세심한 품질 관리',
        '사용자 중심 디자인',
        '안전 인증 완료'
    ];
}

// Premium template-specific generation functions
function generateHeritageTimeline() {
    return `
    <div class="timeline-container">
        <div class="timeline-item">
            <div class="timeline-year">1890년</div>
            <div class="timeline-content">스페인 안달루시아 지방의 작은 마을에서 시작된 전통</div>
        </div>
        <div class="timeline-item">
            <div class="timeline-year">1950년</div>
            <div class="timeline-content">3대째 이어지는 가족 경영의 시작</div>
        </div>
        <div class="timeline-item">
            <div class="timeline-year">2010년</div>
            <div class="timeline-content">전통과 현대 기술의 조화로운 융합</div>
        </div>
        <div class="timeline-item">
            <div class="timeline-year">2025년</div>
            <div class="timeline-content">한국 시장 진출, 만원요리 최씨남매와의 만남</div>
        </div>
    </div>`;
}

function generateImpactContent(productName) {
    return `<p class="heritage-quote">"130년 전통의 스페인 장인정신이 만들어낸 최고의 ${productName}"</p>
    <p>세계 3대 프리미엄 하몽 생산지인 스페인 하부고(Jabugo) 지역에서 직수입한 최고급 제품입니다. 
    엄격한 품질 관리와 전통적인 숙성 방법으로 만들어진 이 제품은 미슐랭 레스토랑에서도 사용되는 프리미엄 등급입니다.</p>`;
}

function generateFeatureCards() {
    return `
    <div class="feature-card">
        <i class="feature-icon fas fa-medal"></i>
        <h3>프리미엄 품질</h3>
        <p>D.O.P 인증을 받은 최고 등급의 원료만을 사용합니다</p>
    </div>
    <div class="feature-card">
        <i class="feature-icon fas fa-clock"></i>
        <h3>전통 숙성법</h3>
        <p>36개월 이상 자연 숙성으로 깊은 풍미를 자랑합니다</p>
    </div>
    <div class="feature-card">
        <i class="feature-icon fas fa-certificate"></i>
        <h3>정품 인증</h3>
        <p>스페인 정부 공식 인증 마크가 부착된 정품입니다</p>
    </div>`;
}

function generateUsageSteps() {
    return `
    <div class="usage-step">
        <div class="step-number">1</div>
        <p>개봉 후 30분간 실온에서 숙성</p>
    </div>
    <div class="usage-step">
        <div class="step-number">2</div>
        <p>얇게 슬라이스하여 준비</p>
    </div>
    <div class="usage-step">
        <div class="step-number">3</div>
        <p>와인과 함께 즐기기</p>
    </div>
    <div class="usage-step">
        <div class="step-number">4</div>
        <p>남은 제품은 밀봉하여 냉장보관</p>
    </div>`;
}

function generateSocialProofContent() {
    return `
    <p style="margin-top: 30px;">
        <strong>구매 만족도: ⭐⭐⭐⭐⭐ 4.9/5.0</strong><br>
        "정말 맛있어요! 스페인 현지에서 먹었던 그 맛 그대로예요!" - 김**님<br>
        "선물용으로 구매했는데 받으신 분이 너무 좋아하셨어요" - 이**님<br>
        "가격대비 품질이 정말 훌륭합니다. 재구매 의사 100%!" - 박**님
    </p>`;
}

function generateFinalTip() {
    return `
    <div style="background-color: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3 style="color: var(--deep-rose); margin-bottom: 10px;">💡 만원요리 최씨남매 특별 팁</h3>
        <p>이 제품은 냉장 보관이 필수이며, 개봉 후에는 2주 이내에 드시는 것을 권장합니다. 
        얇게 슬라이스할수록 풍미가 더욱 살아나며, 실온에서 30분 정도 두었다가 드시면 최상의 맛을 즐기실 수 있습니다.</p>
    </div>`;
}