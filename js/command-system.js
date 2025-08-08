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

    //
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
            //   ,
        }

        return crawledData;
    },

    //    ( )
    async analyzeProductEnhanced(productName, referenceUrl) {
        console.log(' AI   ...');

        //
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
                '    ',
                'HACCP    ',
                ' !  '
            ];
            analysis.targetCustomer = '      ';
        }

        return analysis;
    },

    //
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
            '': { main: 'food', sub: 'chicken', keywords: ['', '', '', ''] },
            '': { main: 'food', sub: 'chicken', keywords: ['', '', '', ''] },
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
        if (productName.includes('')) keywords.push('');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('')) keywords.push('');
        if (productName.includes('') || productName.includes('')) {
            keywords.push('', '');
        }
        if (productName.includes('') || productName.includes('')) {
            keywords.push('', '');
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

        return `${analysis.displayName} `;
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

            // Story  -
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
                <p>  <span class="highlight">    </span> !   ,  .</p>
            `;
        }

        //
        return `
            <p>  ${analysis.displayName}  ?   ?</p>
            <p>   ! <span class="highlight"> </span>   .</p>
        `;
    },

    //
    async generateBenefits(analysis) {
        const benefits = [];

        if (analysis.productName.includes('') && analysis.productName.includes('')) {
            benefits.push(
                '<strong> </strong>   ',
                ' 매콤 <strong> </strong> ',
                ' <strong></strong>  2  ',
                '<strong>' + analysis.weight + ' </strong>   ',
                '<strong>HACCP </strong>   '
            );
        } else if (analysis.productName.includes('') || analysis.productName.includes('')) {
            benefits.push(
                '<strong></strong>     ',
                ' <strong></strong>   ',
                '<strong> </strong>  ',
                '  <strong></strong> ',
                '<strong>' + analysis.weight + '</strong>   ',
                '<strong>HACCP </strong>   '
            );
        } else {
            //
            benefits.push(
                '[]  ',
                '  ',
                '  ',
                '  ',
                '  '
            );
        }

        return benefits;
    },

    //
    async generateHeritageStory(analysis) {
        if (analysis.productName.includes('[]') && analysis.productName.includes('')) {
            return `
                <p>! <strong> </strong>.  <strong>${analysis.productName}</strong>  .</p>
                <p>      <strong>" !"</strong>   .    <strong> </strong>    .</p>
                <p>   <strong> </strong>      !   ,         <strong> </strong> .</p>
                <p class="highlight"> :      2  !</p>
            `;
        }

        if (analysis.productName.includes('[]') && (analysis.productName.includes('') || analysis.productName.includes(''))) {
            return `
                <p>! <strong> </strong>.    <strong>${analysis.productName}</strong> .</p>
                <p>     !   <strong>  </strong>   .      <strong></strong>.       .</p>
                <p><strong> </strong> !  <strong> </strong>  .  ,   . 아들  .</p>
                <p class="highlight"> :         !</p>
            `;
        }

        // AI
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const prompt = `${analysis.productName}       .   톤 3-4문단 ,   <strong>  .`;
            const result = await callAI(prompt, 'heritageStory');
            if (result) return result;
        }

        return `<p>${analysis.displayName}   .</p>`;
    },

    //
    async generateUsageGuide(analysis) {
        if (analysis.productName.includes('')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200%  !</p>
                <ol style="line-height: 2;">
                    <li>   <strong> 5-7</strong> </li>
                    <li>   <strong> </strong> 2-3  </li>
                    <li>  <strong>, </strong>    </li>
                    <li>  <strong></strong>  2  </li>
                    <li> <strong> </strong>   !</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong> :</strong>     용  ,       3-4 열하세!</p>
                </div>
            `;
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200%  !</p>
                <ol style="line-height: 2;">
                    <li> 름  <strong></strong> </li>
                    <li>  <strong>3-4</strong> </li>
                    <li>  <strong>, </strong>   </li>
                    <li> <strong></strong>    UP!</li>
                    <li> <strong></strong>    !</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong> :</strong>    180 10-12,    어주세!</p>
                </div>
            `;
        }

        return `<p>${analysis.displayName}  .</p>`;
    },

    //
    async generateTrustContent(analysis) {
        if (analysis.productName.includes('')) {
            return `
                <p><span class="highlight">"  줘!    !"</span></p>
                <p>  <strong>  </strong> .      ,   <strong>   </strong> ,  <strong> </strong>!   천립니.</p>
            `;
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return `
                <p><span class="highlight">" ,   !     예!"</span></p>
                <p>  <strong>  </strong>.     ,   <strong> </strong> <strong> </strong>,  <strong>  </strong>!  .</p>
            `;
        }

        return `<p>${analysis.displayName}  천립니!</p>`;
    },

    //
    async generateFeatures(analysis) {
        if (analysis.productName.includes('')) {
            return [
                '<strong> </strong>   ',
                '<strong> </strong>   ',
                '<strong>HACCP </strong>   ',
                '<strong> </strong>  ',
                '<strong>' + analysis.weight + ' </strong> '
            ];
        }

        if (analysis.productName.includes('') || analysis.productName.includes('')) {
            return [
                '<strong></strong>  ',
                '<strong></strong>    ',
                '<strong>HACCP </strong>   ',
                '<strong> </strong>  ',
                '<strong>' + analysis.weight + '</strong>  ',
                '  <strong> </strong>'
            ];
        }

        return analysis.sellingPoints || [' ', ' ', ' '];
    },

    // FAQ
    async generateFAQ(analysis) {
        const faqs = [];

        if (analysis.productName.includes('')) {
            faqs.push(
                {
                    question: '   있?',
                    answer: '!          .     .'
                },
                {
                    question: '   정?',
                    answer: ' 정  . 어린     ,   담없    .'
                },
                {
                    question: '  ?',
                    answer: '  , 터 12  .       권장.'
                },
                {
                    question: '  ?',
                    answer: analysis.weight + '  2-3     .    3-4 .'
                }
            );
        } else if (analysis.productName.includes('') || analysis.productName.includes('')) {
            faqs.push(
                {
                    question: '  ?',
                    answer: '!      살아.     예.'
                },
                {
                    question: '  ?',
                    answer: ',       품.  좋아하    .'
                },
                {
                    question: '  ?',
                    answer: '  !  3-4  .    .'
                },
                {
                    question: '  ?',
                    answer: analysis.weight + '  2  즐  .  3-4 .'
                },
                {
                    question: '   ?',
                    answer: 'HACCP    하 쾌   .      .'
                }
            );
        } else {
            //  FAQ
            faqs.push(
                {
                    question: '  ?',
                    answer: ', 엄   준   판매.'
                },
                {
                    question: '  ?',
                    answer: '  2-3    .'
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
                <h2>Why?   ${analysis.displayName} ?</h2>
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
                <h2>How?  !</h2>
            </div>
            <div>
                ${content.usageGuide}
            </div>
        </div>

        <!-- 5. Trust Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>Trust!    </h2>
            </div>
            <div class="trust-box">
                <h3>  보증</h3>
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
                    <td></td>
                </tr>
                <tr>
                    <th></th>
                    <td></td>
                </tr>
                <tr>
                    <th>사업자록</th>
                    <td>434-86-03863</td>
                </tr>
                <tr>
                    <th></th>
                    <td>2025--2195</td>
                </tr>
                <tr>
                    <th></th>
                    <td>   1246, 11 1105-19</td>
                </tr>
                <tr>
                    <th></th>
                    <td>070-8835-2885</td>
                </tr>
                <tr>
                    <th></th>
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
                '',
                '편'
            ].join(','),

            //
            metaTitle: `${productName} |  `,
            metaDescription: `${analysis.displayName} - ${content.mainCopy} ${content.benefits[0].replace(/<[^>]*>/g, '')}`,
            metaKeywords: analysis.keywords.join(', '),

            // Open Graph
            ogTitle: productName,
            ogDescription: content.mainCopy,
            ogType: 'product',

            //
            shortDescription: content.benefits.slice(0, 3).map(b => b.replace(/<[^>]*>/g, '')).join(' | '),

            //   ( )
            longDescription: content.heritageStory.replace(/<[^>]*>/g, '').split('.')[0] + '.',

            //
            category: this.getCafe24Category(analysis.category),

            //
            manufacturer: '',
            origin: '',

            //
            tags: [
                '#',
                '#',
                '#',
                `#${analysis.displayName.replace(/\s/g, '')}`,
                '#',
                '#편'
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
            'general': ' > '
        };

        return categoryMap[category.sub] || categoryMap['general'];
    },

    //
    async execute(input) {
        console.log('   ...');

        // 1.
        const command = this.parseCommand(input);
        console.log('  :', command);

        // 2.
        const analysis = await this.analyzeProductEnhanced(command.productName, command.referenceUrl);
        console.log('  :', analysis);

        // 3.
        const content = await this.generatePerfectContent(command, analysis);
        console.log('[]  :', content);

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

console.log('[]    ');