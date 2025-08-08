//
//  ,  ,

const CommandSystem = {
    //
    parseCommand(input) {
        const lines = input.trim().split('\n').filter(line => line.trim());
        const command = {
            productName: '',
            referenceUrl: '',
            images: [],
            options: {}
        };

        //
        if (lines.length > 0) {
            command.productName = lines[0].trim();
        }

        //
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();

            //
            if (line.includes('') && line.includes('http')) {
                const urlMatch = line.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                    command.referenceUrl = urlMatch[0];
                }
            }
            //
            else if (line.includes('') || line.includes('.jpg') || line.includes('.png')) {
                //   URL
                for (let j = i; j < lines.length; j++) {
                    const imgLine = lines[j].trim();
                    const imgMatch = imgLine.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
                    if (imgMatch) {
                        command.images.push(imgMatch[0]);
                    }
                }
                break;
            }
        }

        return command;
    },

    //  서
    async crawlReferenceData(url) {
        console.log('    ...', url);

        //    URL
        const crawledData = {
            description: '',
            features: []
        };

        //
        if (url.includes('insaengdomae')) {
            crawledData.siteName = '';
            // 는  ,
        }

        return crawledData;
    },

    //    ( )
    async analyzeProductEnhanced(productName, referenceUrl) {
        console.log(' AI   ...');

        // 서
        const analysis = {
            productName: productName,
            displayName: this.extractDisplayName(productName),
            weight: this.extractWeight(productName),
            category: this.detectCategoryEnhanced(productName),
            keywords: this.extractKeywords(productName),
            sellingPoints: [],
            targetCustomer: '',
            contentStrategy: null
        };

        // AI
        if (window.ProductAnalyzer) {
            const aiAnalysis = await window.ProductAnalyzer.analyzeProduct(productName, referenceUrl);
            Object.assign(analysis, aiAnalysis);
        }

        //
        if (productName.includes('')) {
            analysis.sellingPoints = [
                ' !    ',
                '24   ',
                'HACCP   ',
                '  '
            ];
            analysis.targetCustomer = '   2030 ';
        }

        //
        if (productName.includes('') || productName.includes('')) {
            analysis.sellingPoints = [
                '  ',
                '    ',
                ' 으  향 ',
                'HACCP  서  ',
                ' !  '
            ];
            analysis.targetCustomer = '   향   ';
        }

        return analysis;
    },

    // 서
    extractDisplayName(productName) {
        // []800g ->
        let displayName = productName;
        displayName = displayName.replace(/\[([^\]]+)\]/g, '$1 '); // [] ->
        displayName = displayName.replace(/\d+g$/i, '').trim(); // 800g
        return displayName;
    },

    //
    extractWeight(productName) {
        const weightMatch = productName.match(/(\d+)(g|kg|ml|l)/i);
        return weightMatch ? weightMatch[0] : '';
    },

    //
    detectCategoryEnhanced(productName) {
        const categories = {
            '': { main: 'food', sub: 'chicken', keywords: ['', '', ''] },
            '': { main: 'food', sub: 'chicken', keywords: ['', '통', '', '술'] },
            '': { main: 'food', sub: 'chicken', keywords: ['', '통', '', '술'] },
            '': { main: 'food', sub: 'pork', keywords: ['', ''] },
            '': { main: 'food', sub: 'kimchi', keywords: ['', '', ''] },
            '': { main: 'food', sub: 'sauce', keywords: ['', '', ''] }
        };

        for (const [key, value] of Object.entries(categories)) {
            if (productName.includes(key)) {
                return value;
            }
        }

        return { main: 'food', sub: 'general', keywords: [] };
    },

    //
    extractKeywords(productName) {
        const keywords = [];

        //
        if (productName.includes('')) keywords.push('집');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('') || productName.includes('')) {
            keywords.push('', '술');
        }
        if (productName.includes('통') || productName.includes('')) {
            keywords.push('통', '');
        }
        if (productName.includes('')) keywords.push('');

        return keywords;
    },

    //
    async generateStoryTitle(analysis) {
        //
        if (analysis.productName.includes('')) {
            return '  ';
        } else if (analysis.productName.includes('')) {
            return '   ';
        } else if (analysis.productName.includes('')) {
            return '  ';
        }

        return `${analysis.displayName} 함`;
    },

    //
    async generatePerfectContent(command, analysis) {
        console.log('[]   ...');

        const content = {
            //
            brandLabel: `  X ${analysis.displayName}  `,
            mainCopy: await this.generateMainCopy(analysis),

            // Why
            painPoints: await this.generatePainPoints(analysis),
            benefits: await this.generateBenefits(analysis),

            // Story  - 별  으
            storyTitle: await this.generateStoryTitle(analysis),
            heritageStory: await this.generateHeritageStory(analysis),

            // How
            usageGuide: await this.generateUsageGuide(analysis),

            // Trust
            trustContent: await this.generateTrustContent(analysis),
            features: await this.generateFeatures(analysis),

            // FAQ
            faq: await this.generateFAQ(analysis)
        };

        return content;
    },

    //
    async generateMainCopy(analysis) {
        const templates = {
            '': [
                '  ${product} !',
                '${keyword} ${product} !',
                '  ${product}!'
            ]
        };

        let template = ' ${product} !';
        if (analysis.category.sub === 'chicken' && templates['']) {
            template = templates[''][0];
        }

        return template
            .replace('${product}', analysis.displayName)
            .replace('${keyword}', analysis.keywords[0] || '');
    },

    //
    async generatePainPoints(analysis) {
        if (analysis.category.sub === 'chicken' && analysis.productName.includes('')) {
            return `
                <p>   <strong> ?</strong>    <strong> </strong>   ?</p>
                <p>   ! <span class="highlight">   </span>      .</p>
            `;
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return `
                <p>  <strong> </strong> ?  <strong>  </strong>   ?</p>
                <p>  <span class="highlight">    </span> !   통,  입니.</p>
            `;
        }

        //
        return `
            <p>  ${analysis.displayName}  ? 격  ?</p>
            <p>   ! <span class="highlight"> 격</span>으   .</p>
        `;
    },

    //
    async generateBenefits(analysis) {
        const benefits = [];

        if (analysis.productName.includes('') && analysis.productName.includes('')) {
            benefits.push(
                '<strong> </strong>   ',
                ' 매콤함으 <strong> </strong> ',
                ' <strong></strong> 추하면 2  ',
                '<strong>' + analysis.weight + ' </strong>으  족 ',
                '<strong>HACCP </strong> 서  '
            );
        } else if (analysis.productName.includes('') || analysis.productName.includes('')) {
            benefits.push(
                '<strong></strong>     ',
                ' <strong>통</strong>   ',
                '<strong> </strong>으 감칠 ',
                '술는  <strong></strong>으도 ',
                '<strong>' + analysis.weight + '</strong>  으 ',
                '<strong>HACCP </strong> 서  '
            );
        } else {
            //
            benefits.push(
                '[]  성비',
                '  ',
                '  ',
                '  ',
                '  격'
            );
        }

        return benefits;
    },

    //
    async generateHeritageStory(analysis) {
        if (analysis.productName.includes('[]') && analysis.productName.includes('')) {
            return `
                <p>! <strong> </strong>입니.  <strong>${analysis.productName}</strong>  .</p>
                <p>저희     서도 <strong>" !"</strong> 평  입니.    <strong> </strong>으    자랑합니.</p>
                <p>   <strong> 남김없</strong>      !   ,         <strong> </strong> 자랑합니.</p>
                <p class="highlight"> :   나 우동사리  2  돼요!</p>
            `;
        }

        if (analysis.productName.includes('[]') && (analysis.productName.includes('') || analysis.productName.includes(''))) {
            return `
                <p>! <strong> </strong>입니.    <strong>${analysis.productName}</strong> .</p>
                <p>     !   <strong>  </strong>   있습니.     바 <strong>통</strong>요.    통   .</p>
                <p><strong> </strong> !  <strong> </strong>으 감칠 잡았습니. 도 지만,   해요. 아들도  랍니.</p>
                <p class="highlight"> :   추하면      !</p>
            `;
        }

        // AI
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const prompt = `${analysis.productName}    스타   .   톤으 3-4문단으 , 요 부 <strong> 태 .`;
            const result = await callAI(prompt, 'heritageStory');
            if (result) return result;
        }

        return `<p>${analysis.displayName}   .</p>`;
    },

    //  드
    async generateUsageGuide(analysis) {
        if (analysis.productName.includes('')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200%  !</p>
                <ol style="line-height: 2;">
                    <li>냄비   <strong>불서 5-7</strong> </li>
                    <li>김  하면 <strong>약불 여</strong> 2-3  </li>
                    <li>기  <strong>, </strong> 등 추하면  </li>
                    <li>  <strong></strong>  2  </li>
                    <li> <strong> </strong> 하면  !</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong> :</strong>   는  용기  , 랩   구멍   3-4 열하세요!</p>
                </div>
            `;
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200%  !</p>
                <ol style="line-height: 2;">
                    <li>팬 기름  <strong>불</strong>서 </li>
                    <li>  <strong>3-4</strong> </li>
                    <li>기  <strong>, </strong> 추하면  </li>
                    <li>마지막 <strong></strong>   고소함 UP!</li>
                    <li> <strong></strong> 하면   !</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong> :</strong> 어프라어   180도서 10-12, 간   집어주세요!</p>
                </div>
            `;
        }

        return `<p>${analysis.displayName}  .</p>`;
    },

    //
    async generateTrustContent(analysis) {
        if (analysis.productName.includes('')) {
            return `
                <p><span class="highlight">"  내줘요!    !"</span></p>
                <p>  <strong>  </strong> 입니.    점  ,   <strong>   </strong> , 리고 <strong> </strong>!   추천드립니.</p>
            `;
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return `
                <p><span class="highlight">" 함,   !     대예요!"</span></p>
                <p>  <strong>엄선  </strong>입니. 많   테스트 결,   <strong> </strong> <strong> </strong>, 리고 <strong>감칠  </strong>!  합니.</p>
            `;
        }

        return `<p>${analysis.displayName}  추천드립니!</p>`;
    },

    //
    async generateFeatures(analysis) {
        if (analysis.productName.includes('')) {
            return [
                '<strong> </strong> 으  ',
                '<strong> </strong> 인  ',
                '<strong>HACCP </strong> 서  ',
                '<strong> </strong>으  대',
                '<strong>' + analysis.weight + ' </strong>으 '
            ];
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return [
                '<strong></strong>  ',
                '<strong>통</strong>    ',
                '<strong>HACCP </strong> 서  ',
                '<strong> </strong>으  ',
                '<strong>' + analysis.weight + '</strong>  ',
                '술  <strong> 능</strong>'
            ];
        }

        return analysis.sellingPoints || [' ', ' 격', ' '];
    },

    // FAQ
    async generateFAQ(analysis) {
        const faqs = [];

        if (analysis.productName.includes('')) {
            faqs.push(
                {
                    question: '   있나요?',
                    answer: '!   해  는 원 른   자랑합니.  남김없   .'
                },
                {
                    question: '   정도인요?',
                    answer: ' 정도  입니. 어린는     , 대부  부담없    .'
                },
                {
                    question: '  ?',
                    answer: ' 하면 , 부터 12  능합니.  는 바 해서 드는 것 권장합니.'
                },
                {
                    question: '  ?',
                    answer: analysis.weight + '으  2-3인  먹   입니.    3-4 충합니.'
                }
            );
        } else if (analysis.productName.includes('') || analysis.productName.includes('')) {
            faqs.push(
                {
                    question: '  인요?',
                    answer: '! 신선     살아있습니.     대예요.'
                },
                {
                    question: '통 많 ?',
                    answer: ', 통     향 품입니.  좋아하는 들께  인기 .'
                },
                {
                    question: '  ?',
                    answer: '  않습니! 팬 3-4만 볶아주면 됩니. 어프라어도   능해요.'
                },
                {
                    question: '  ?',
                    answer: analysis.weight + '으  2인  즐기기 충 입니. 으는 3-4인 .'
                },
                {
                    question: '냄새 많  ?',
                    answer: 'HACCP  서  하여 불쾌 냄새 거 없습니.  고소 향  식욕 .'
                }
            );
        } else {
            //  FAQ
            faqs.push(
                {
                    question: '  요?',
                    answer: ', 엄격   기준 통 만 판매합니.'
                },
                {
                    question: '  ?',
                    answer: '  2-3 내   있습니.'
                }
            );
        }

        return faqs;
    },

    //  HTML
    generateFinalHTML(command, analysis, content) {
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${command.productName} -  </title>
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
            content: "[]";
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
            <span class="brand-label">${content.brandLabel}</span>
            <h1 class="main-copy">${content.mainCopy}</h1>
            <img src="${command.images[0] || 'https://via.placeholder.com/600x600'}" alt="${command.productName}" class="main-product-image">
        </div>

        <!-- 2. Why Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>Why?   ${analysis.displayName}어야 ?</h2>
            </div>
            <div>
                ${content.painPoints}
                <ul class="benefit-list">
                    ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('\n                    ')}
                </ul>
            </div>
        </div>

        <!-- 3. Story Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>${content.storyTitle}</h2>
            </div>
            <div>
                ${content.heritageStory}
            </div>
        </div>

        <!-- 4. How Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>How? 렇게 !</h2>
            </div>
            <div>
                ${content.usageGuide}
            </div>
        </div>

        <!-- 5. Trust Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>Trust! 믿   유</h2>
            </div>
            <div class="trust-box">
                <h3>  보증합니</h3>
                ${content.trustContent}
            </div>

            <h3 style="margin-top: 32px;">  </h3>
            <ul class="benefit-list">
                ${content.features.map(feature => `<li>${feature}</li>`).join('\n                ')}
            </ul>

            ${command.images.slice(1).map(img => `<img src="${img}" alt=" " class="product-image">`).join('\n            ')}
        </div>

        <!-- 6. FAQ Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>  </h2>
            </div>
            <div>
                ${content.faq.map(item => `
                <div class="faq-item">
                    <div class="faq-question">Q. ${item.question}</div>
                    <div class="faq-answer">A. ${item.answer}</div>
                </div>`).join('\n                ')}
            </div>
        </div>

        <!-- 7. Company Information -->
        <div class="section">
            <h3 style="text-align: center; margin-bottom: 24px;"> </h3>
            <table class="info-table">
                <tr>
                    <th></th>
                    <td>㈜값끼</td>
                </tr>
                <tr>
                    <th></th>
                    <td></td>
                </tr>
                <tr>
                    <th>사업자등록</th>
                    <td>434-86-03863</td>
                </tr>
                <tr>
                    <th></th>
                    <td>2025--2195</td>
                </tr>
                <tr>
                    <th></th>
                    <td> 파주 경 1246, 11 1105-19</td>
                </tr>
                <tr>
                    <th></th>
                    <td>070-8835-2885</td>
                </tr>
                <tr>
                    <th>메</th>
                    <td>we@manwonyori.com</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>`;
    },

    // 24 SEO
    generateCafe24SEO(productName, analysis, content) {
        const seoData = {
            //
            productName: productName,

            //   (24 )
            searchKeywords: [
                analysis.displayName,
                ...analysis.keywords,
                '',
                '',
                '',
                '식품',
                '간편'
            ].join(','),

            //  태
            metaTitle: `${productName} |  `,
            metaDescription: `${analysis.displayName} - ${content.mainCopy} ${content.benefits[0].replace(/<[^>]*>/g, '')}`,
            metaKeywords: analysis.keywords.join(', '),

            // Open Graph
            ogTitle: productName,
            ogDescription: content.mainCopy,
            ogType: 'product',

            //
            shortDescription: content.benefits.slice(0, 3).map(b => b.replace(/<[^>]*>/g, '')).join(' | '),

            //  설명 ( )
            longDescription: content.heritageStory.replace(/<[^>]*>/g, '').split('.')[0] + '.',

            //
            category: this.getCafe24Category(analysis.category),

            // 추
            manufacturer: '',
            origin: '민국',

            // 태
            tags: [
                '#',
                '#',
                '#',
                `#${analysis.displayName.replace(/\s/g, '')}`,
                '#식품',
                '#간편'
            ].join(' ')
        };

        return seoData;
    },

    // 24
    getCafe24Category(category) {
        const categoryMap = {
            'chicken': ' > /',
            'pork': ' > /',
            'kimchi': '/ > ',
            'sauce': '/ > /',
            'general': '식품 > '
        };

        return categoryMap[category.sub] || categoryMap['general'];
    },

    //   함
    async execute(input) {
        console.log('   ...');

        // 1.
        const command = this.parseCommand(input);
        console.log(' 된 :', command);

        // 2.
        const analysis = await this.analyzeProductEnhanced(command.productName, command.referenceUrl);
        console.log('  결:', analysis);

        // 3.
        const content = await this.generatePerfectContent(command, analysis);
        console.log('[] 된 :', content);

        // 4. HTML
        const html = this.generateFinalHTML(command, analysis, content);

        // 5. 24 SEO
        const seoData = this.generateCafe24SEO(command.productName, analysis, content);
        console.log(' 24 SEO :', seoData);

        console.log('[]   !');
        return { html, seoData };
    }
};

//
window.CommandSystem = CommandSystem;

console.log('[]   드 ');