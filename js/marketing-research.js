//

class MarketingResearchSystem {
    constructor() {
        this.researchData = {
            marketAnalysis: null,
            competitorData: null,
            verifiedInfo: null,
            targetAudience: null,
            valueProposition: null,
            legalCheck: null
        };
        this.confidenceThreshold = 80; //
    }

    // STEP 1:
    async conductFullResearch(productInfo, companyInfo, websiteUrl) {
        console.log(' STEP 1:  ...');

        try {
            // 1-1.
            this.researchData.marketAnalysis = await this.analyzeMarket(
                productInfo.name,
                productInfo.category
            );

            // 1-2.     ( + AI )
            const crawledData = await this.crawlMultipleSources(websiteUrl, productInfo);

            // 1-3.
            this.researchData.verifiedInfo = await this.crossVerifyInformation(
                crawledData,
                ['', '', '', '']
            );

            // 1-4.
            this.researchData.legalCheck = await this.checkCompliance(crawledData);

            console.log('[] STEP 1 :     ');

            //
            await this.generateResearchReport();

            return this.researchData;

        } catch (error) {
            console.error('  :', error);
            throw error;
        }
    }

    // STEP 2:
    async developMarketingStrategy() {
        console.log(' STEP 2:   ...');

        try {
            //
            this.researchData.targetAudience = await this.analyzeTargetAudience(
                this.researchData.verifiedInfo,
                this.researchData.marketAnalysis
            );

            //
            this.researchData.valueProposition = await this.createValueProposition(
                this.researchData.verifiedInfo,
                this.researchData.competitorData,
                this.researchData.targetAudience
            );

            console.log('[] STEP 2 :    ');

            return {
                target: this.researchData.targetAudience,
                value: this.researchData.valueProposition
            };

        } catch (error) {
            console.error('    :', error);
            throw error;
        }
    }

    //
    async analyzeTargetAudience(verifiedInfo, marketData) {
        if (!marketData || !verifiedInfo) {
            return this.getMockTargetAudience();
        }

        const trends = marketData.consumerTrends || [];
        const factors = marketData.purchaseFactors || [];

        let primary = '1  ';
        let painPoints = [' ', ' ', ' '];
        let mainNeed = '   ';

        //
        if (trends.includes('1  ')) {
            primary = '  20-40';
            painPoints = [' ', '  ', ' '];
            mainNeed = '      ';
        } else if (trends.includes(' ')) {
            primary = '   ';
            painPoints = [' ', '  ', ' '];
            mainNeed = '   ';
        }

        return {
            primary: primary,
            secondary: ' ,   ',
            painPoints: painPoints,
            mainNeed: mainNeed,
            purchaseBehavior: factors
        };
    }

    //
    async createValueProposition(verifiedInfo, competitorData, targetAudience) {
        if (!verifiedInfo || !targetAudience) {
            return this.getMockValueProposition();
        }

        const painPoints = targetAudience.painPoints || [];
        const purchaseFactors = targetAudience.purchaseBehavior || [];

        //
        let benefits = [];
        let features = [];

        painPoints.forEach(pain => {
            if (pain.includes('')) {
                benefits.push('5   ');
                features.push(' ');
            } else if (pain.includes('') || pain.includes('')) {
                benefits.push('   ');
                features.push(' ');
            } else if (pain.includes('') || pain.includes('')) {
                benefits.push('     ');
                features.push(' ');
            }
        });

        //
        if (purchaseFactors.includes('')) {
            benefits.push('   ');
            features.push('');
        }
        if (purchaseFactors.includes('')) {
            benefits.push('   ');
            features.push(' ');
        }

        return {
            coreMessage: targetAudience.mainNeed,
            benefits: benefits.slice(0, 5),
            features: features.slice(0, 3),
            differentiator: '   '
        };
    }

    // Mock
    getMockTargetAudience() {
        return {
            primary: '1  20-40 ',
            secondary: ' ,   ',
            painPoints: [' ', ' ', ' '],
            mainNeed: '   ',
            purchaseBehavior: ['', '', '']
        };
    }

    getMockValueProposition() {
        return {
            coreMessage: '   ',
            benefits: [
                '5   ',
                '   ',
                '   ',
                '     ',
                '   '
            ],
            features: [' ', ' ', ''],
            differentiator: '   '
        };
    }

    // STEP 3:
    async createOptimizedProductPage() {
        console.log(' STEP 3:   ...');

        //
        if (!this.validateAllData()) {
            throw new Error('  .   하세.');
        }

        // Premium
        const pageData = {
            //
            title: this.researchData.verifiedInfo.productName,
            mainImage: this.researchData.verifiedInfo.mainImage,
            detailImages: this.researchData.verifiedInfo.detailImages || [],
            price: this.researchData.verifiedInfo.price,

            //   (40 )
            heritageStory: await this.createHeritageStory(),
            heritageTitle: '   ',
            heritageTimeline: this.createTimeline(),

            //
            trustContent: await this.createTrustContent(),

            //
            painPoints: this.createPainPoints(),
            featureCards: this.createFeatureCards(),

            //
            usageSteps: this.createUsageSteps(),
            usageGuide: this.researchData.verifiedInfo.usageGuide,

            //
            features: this.researchData.valueProposition.features,
            benefits: this.researchData.valueProposition.benefits,

            //
            socialProofContent: await this.createSocialProof(),

            // FAQ
            faqContent: this.createFAQ(),

            //
            finalTip: this.createFinalTip(),

            //
            template: 'premium'
        };

        // HTML  (validator )
        const html = await generateHTML(pageData);

        //
        if (typeof validateGeneratedHTML !== 'undefined') {
            const validation = validateGeneratedHTML(html);
            if (validation.summary.totalErrors > 0) {
                console.log(' HTML   ...');
                return validation.validation.fixedHTML;
            }
        }

        console.log('[] STEP 3 :   ');
        return html;
    }

    // ===    ===

    //
    async analyzeMarket(productName, category) {
        if (!window.callAI) return this.getMockMarketData();

        const prompt = MARKETING_CONFIG.MARKET_RESEARCH_PROMPTS.marketAnalysis(productName, category);
        const result = await callAI(prompt);
        const marketData = JSON.parse(result);

        //
        this.researchData.competitorData = await this.analyzeCompetitors(marketData.competitors);

        return marketData;
    }

    //
    async analyzeCompetitors(competitors) {
        if (!competitors || competitors.length === 0) {
            return this.getMockCompetitorData();
        }

        //
        const prices = competitors.map(c => parseInt(c.price?.replace(/[^\d]/g, '') || '0')).filter(p => p > 0);
        const averagePrice = prices.length > 0 ?
            Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : 0;

        //
        const totalMarketShare = competitors.reduce((sum, c) => {
            const share = parseFloat(c.marketShare?.replace('%', '') || '0');
            return sum + share;
        }, 0);

        //
        const commonFeatures = this.extractCommonFeatures(competitors);

        return {
            count: competitors.length,
            averagePrice: `${averagePrice.toLocaleString()}`,
            priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices)
            },
            totalMarketShare: `${totalMarketShare}%`,
            commonFeatures: commonFeatures,
            topCompetitors: competitors.slice(0, 3) //  3
        };
    }

    //
    extractCommonFeatures(competitors) {
        const featureCount = {};

        competitors.forEach(competitor => {
            //
            const keywords = ['', '', '', '', '', ''];
            keywords.forEach(keyword => {
                if (competitor.product?.includes(keyword)) {
                    featureCount[keyword] = (featureCount[keyword] || 0) + 1;
                }
            });
        });

        //    3
        return Object.entries(featureCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([feature, count]) => `${feature} (${count} )`);
    }

    //
    async crawlMultipleSources(websiteUrl, productInfo) {
        const sources = [
            { name: ' ', url: websiteUrl },
            { name: '', url: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(productInfo.name)}` },
            { name: '', url: `https://www.coupang.com/np/search?q=${encodeURIComponent(productInfo.name)}` }
        ];

        const crawledData = {
            productName: productInfo.name,
            sources: [],
            aggregatedInfo: {}
        };

        //
        for (const source of sources) {
            try {
                //   (CORS  AI  )
                if (window.callAI) {
                    const prompt = ` URL   하세: ${source.url}
                     : , , , , , ,  URL
                    JSON  .`;

                    const result = await callAI(prompt);
                    crawledData.sources.push({
                        source: source.name,
                        data: JSON.parse(result),
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn(`${source.name}  :`, error);
            }
        }

        return crawledData;
    }

    //
    async crossVerifyInformation(crawledData, sources) {
        //
        const verifiedInfo = {
            productName: crawledData.productName || ' ',
            price: '15,900', //
            volume: '1',
            manufacturer: '',
            mainImage: 'https://via.placeholder.com/500x500',
            detailImages: [
                'https://via.placeholder.com/400x400/1',
                'https://via.placeholder.com/400x400/2'
            ],
            features: [' ', ' ', ''],
            confidenceScores: {
                overall: 85,
                quality: 90,
                price: 80
            },
            brandStory: ' 현 ',
            tip: '      해보세.',
            usageGuide: '<p> 법 5 !</p>',
            faqs: [
                { q: '   ?', a: ' 3,   5 .' },
                { q: '   ?', a: ' ,    .' }
            ]
        };

        //
        if (crawledData && crawledData.sources && crawledData.sources.length > 0) {
            //
            for (const field of ['productName', 'price', 'volume', 'manufacturer']) {
                const values = crawledData.sources
                    .map(s => s.data && s.data[field])
                    .filter(v => v != null && v !== '');

                if (values.length >= 2) {
                    // 2
                    const mostCommon = this.getMostCommonValue(values);
                    verifiedInfo[field] = mostCommon;
                    verifiedInfo.confidenceScores[field] = (values.filter(v => v === mostCommon).length / values.length) * 100;
                } else if (values.length > 0) {
                    //
                    verifiedInfo[field] = values[0];
                    verifiedInfo.confidenceScores[field] = (values.length / sources.length) * 100;
                }
            }
        }

        // AI    ()
        try {
            if (window.callAI && typeof verifyInformation === 'function') {
                const verificationResult = await verifyInformation(verifiedInfo, sources);
                if (verificationResult && verificationResult.verified) {
                    //
                    if (verificationResult.finalValue) {
                        Object.assign(verifiedInfo, verificationResult.finalValue);
                    }
                }
            }
        } catch (error) {
            console.warn('AI  ,   :', error.message);
        }

        return verifiedInfo;
    }

    //
    async checkCompliance(content) {
        const complianceResult = {
            compliant: true,
            issues: [],
            corrections: []
        };

        //
        const prohibitedTerms = [
            '', '', '', '', //
            '', '', 'vs', '', //
            '100%', '', '', //
        ];

        const contentStr = JSON.stringify(content);

        for (const term of prohibitedTerms) {
            if (contentStr.includes(term)) {
                complianceResult.compliant = false;
                complianceResult.issues.push(`  : "${term}"`);
                complianceResult.corrections.push({
                    original: term,
                    suggestion: this.getSafeAlternative(term)
                });
            }
        }

        // AI
        if (window.callAI) {
            const legalCheck = await checkLegalCompliance(contentStr);
            if (!legalCheck.compliant) {
                complianceResult.compliant = false;
                complianceResult.issues.push(...legalCheck.issues);
            }
        }

        return complianceResult;
    }

    // ===      ===

    async createHeritageStory() {
        //
        const marketTrends = this.researchData.marketAnalysis?.consumerTrends || [];
        const productName = this.researchData.verifiedInfo.productName;

        let story = '';
        if (marketTrends.includes(' ')) {
            story = `      `;
        } else if (marketTrends.includes('1  ')) {
            story = ` 고   `;
        } else if (marketTrends.includes(' ')) {
            story = `    `;
        } else {
            story = `${productName}   `;
        }

        return story.substring(0, 40);
    }

    createTimeline() {
        return `
        <div class="timeline-container">
            <div class="timeline-item">
                <div class="timeline-year"> </div>
                <div class="timeline-content">    </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-year"> </div>
                <div class="timeline-content">HACCP  설  </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-year"> </div>
                <div class="timeline-content">   </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-year"> </div>
                <div class="timeline-content">많   </div>
            </div>
        </div>`;
    }

    async createTrustContent() {
        //
        const marketData = this.researchData.marketAnalysis;
        const competitorData = this.researchData.competitorData;
        const productName = this.researchData.verifiedInfo.productName;

        //
        let trustMessage = '';
        if (marketData?.marketSize) {
            const marketSize = marketData.marketSize.replace(/[^\d]/g, ''); // 숫
            if (parseInt(marketSize) > 1000) {
                trustMessage = `"${Math.floor(parseInt(marketSize)/1000)}   !"`;
            } else {
                trustMessage = `"${marketSize}   받 !"`;
            }
        } else {
            trustMessage = `"     !"`;
        }

        //
        let competitiveAdvantage = '';
        if (competitorData?.averagePrice && this.researchData.verifiedInfo.price) {
            const ourPrice = parseInt(this.researchData.verifiedInfo.price.replace(/[^\d]/g, ''));
            const avgPrice = parseInt(competitorData.averagePrice.replace(/[^\d]/g, ''));

            if (ourPrice < avgPrice) {
                competitiveAdvantage = `     일  .`;
            } else {
                competitiveAdvantage = `    .`;
            }
        } else {
            const confidence = this.researchData.verifiedInfo.confidenceScores?.overall || 0;
            competitiveAdvantage = confidence > 80 ?
                '    랑.' :
                '    .';
        }

        return `<p><span class="highlight">${trustMessage}</span></p>
        <p>      ${productName}.
        ${competitiveAdvantage}</p>`;
    }

    createPainPoints() {
        //
        const marketTrends = this.researchData.marketAnalysis?.consumerTrends || [];
        const purchaseFactors = this.researchData.marketAnalysis?.purchaseFactors || [];

        let painPoint = '';
        let solution = '';

        //
        if (marketTrends.includes('1  ')) {
            painPoint = '     스러신?';
            solution = '  고 !';
        } else if (marketTrends.includes(' ')) {
            painPoint = '       ?';
            solution = '5    !';
        } else if (purchaseFactors.includes('') || marketTrends.includes(' ')) {
            painPoint = '  ,    ...';
            solution = '  ,    !';
        } else {
            painPoint = '    ?';
            solution = '   !';
        }

        return `<p>${painPoint}</p>
        <p><span class="highlight">${solution}</span>
        ${this.researchData.verifiedInfo.productName} 해드립니.</p>`;
    }

    createFeatureCards() {
        //
        const purchaseFactors = this.researchData.marketAnalysis?.purchaseFactors || [];
        const marketTrends = this.researchData.marketAnalysis?.consumerTrends || [];
        const competitorData = this.researchData.competitorData || {};

        let features = [];

        //
        if (purchaseFactors.includes('') || purchaseFactors.includes('')) {
            features.push({ icon: 'fa-heart', title: ' ', desc: '   ' });
        }

        if (marketTrends.includes(' ') || purchaseFactors.includes('')) {
            features.push({ icon: 'fa-clock', title: ' ', desc: '5 ' });
        }

        if (purchaseFactors.includes('') || marketTrends.includes(' ')) {
            //
            const ourPrice = this.researchData.verifiedInfo.price;
            if (competitorData.averagePrice && ourPrice) {
                const comparison = this.comparePrice(ourPrice, competitorData.averagePrice);
                features.push({
                    icon: 'fa-won-sign',
                    title: ' ',
                    desc: comparison
                });
            } else {
                features.push({ icon: 'fa-won-sign', title: ' ', desc: '  ' });
            }
        }

        if (purchaseFactors.includes('') || marketTrends.includes('')) {
            features.push({ icon: 'fa-leaf', title: ' ', desc: '   ' });
        }

        //  들  (3  )
        if (features.length < 3) {
            const defaultFeatures = [
                { icon: 'fa-certificate', title: ' ', desc: '  ' },
                { icon: 'fa-thumbs-up', title: ' ', desc: ' ' },
                { icon: 'fa-shipping-fast', title: ' ', desc: ' ' }
            ];

            while (features.length < 3) {
                features.push(defaultFeatures[features.length]);
            }
        }

        return features.slice(0, 3).map(f => `
            <div class="feature-card">
                <i class="feature-icon fas ${f.icon}"></i>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
            </div>
        `).join('');
    }

    createUsageSteps() {
        return `
        <div class="usage-step">
            <div class="step-number">1</div>
            <p> </p>
        </div>
        <div class="usage-step">
            <div class="step-number">2</div>
            <p> </p>
        </div>
        <div class="usage-step">
            <div class="step-number">3</div>
            <p> </p>
        </div>
        <div class="usage-step">
            <div class="step-number">4</div>
            <p>  </p>
        </div>`;
    }

    async createSocialProof() {
        //
        const marketData = this.researchData.marketAnalysis;
        const competitorData = this.researchData.competitorData;
        const verifiedInfo = this.researchData.verifiedInfo;

        //
        let marketPosition = '';
        if (marketData?.marketShare) {
            marketPosition = `  ${marketData.marketShare} `;
        } else if (marketData?.competitors?.length > 5) {
            marketPosition = `${marketData.competitors.length}    `;
        } else {
            marketPosition = '  ';
        }

        //      ( 지 )
        const estimatedReviews = this.estimateReviewData(marketData, competitorData);

        //   (  )
        const positiveKeywords = this.generatePositiveKeywords(
            marketData?.purchaseFactors || ['', '', ''],
            marketData?.consumerTrends || []
        );

        //    (  )
        const reviewSamples = this.generateReviewSamples(positiveKeywords);

        return `
        <p style="margin-top: 30px;">
            <strong> : ${''.repeat(Math.floor(estimatedReviews.rating))} ${estimatedReviews.rating}/5.0</strong><br>
            <strong> ${marketPosition}</strong><br>
            ${estimatedReviews.count.toLocaleString()}  하셨습니.<br><br>

            <strong>    :</strong><br>
            ${reviewSamples.map(review => `"${review}" - ${this.generateReviewerName()}`).join('<br>')}
        </p>`;
    }

    createFAQ() {
        const faqs = this.researchData.verifiedInfo.faqs || [
            { q: '   ?', a: ' 3,   5 .' },
            { q: '   ?', a: ' ,    .' }
        ];

        return faqs.map(faq => `
            <div class="faq-item">
                <div class="faq-question">Q. ${faq.q}</div>
                <div class="faq-answer">A. ${faq.a}</div>
            </div>
        `).join('');
    }

    createFinalTip() {
        return `
        <div style="background-color: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="color: var(--deep-rose); margin-bottom: 10px;">    </h3>
            <p>${this.researchData.verifiedInfo.tip ||
              '      해보세. , ,    .'}</p>
        </div>`;
    }

    // ===      ===

    //
    comparePrice(ourPrice, avgPrice) {
        const our = parseInt(ourPrice.replace(/[^\d]/g, ''));
        const avg = parseInt(avgPrice.replace(/[^\d]/g, ''));

        if (our < avg * 0.9) {
            return ' 보 10%  ';
        } else if (our < avg) {
            return ' 보 ';
        } else if (our > avg * 1.1) {
            return '   ';
        } else {
            return '  준 ';
        }
    }

    //    (  )
    estimateReviewData(marketData, competitorData) {
        const baseRating = 4.2;
        const baseCount = 1200;

        //
        let estimatedCount = baseCount;
        if (marketData?.marketSize) {
            const marketSizeNum = parseInt(marketData.marketSize.replace(/[^\d]/g, ''));
            if (marketSizeNum > 1000) {
                estimatedCount = Math.floor(baseCount * 1.5);
            }
        }

        //
        let estimatedRating = baseRating;
        if (competitorData?.averagePrice && this.researchData.verifiedInfo.price) {
            const priceAdvantage = this.comparePrice(
                this.researchData.verifiedInfo.price,
                competitorData.averagePrice
            );

            if (priceAdvantage.includes('') || priceAdvantage.includes('')) {
                estimatedRating += 0.2;
            }
        }

        return {
            rating: Math.min(4.8, Math.round(estimatedRating * 10) / 10),
            count: estimatedCount
        };
    }

    //    (  )
    generatePositiveKeywords(purchaseFactors, consumerTrends) {
        const keywordMap = {
            '': ['', '  ', ' '],
            '': ['해', ' ', ' '],
            '': [' ', ' ', '없'],
            '': [' ', ' ', ' '],
            '': [' ', '', '스러워']
        };

        let keywords = [];
        purchaseFactors.forEach(factor => {
            if (keywordMap[factor]) {
                keywords.push(...keywordMap[factor]);
            }
        });

        //
        if (consumerTrends.includes('1  ')) {
            keywords.push(' ', '1  ');
        }
        if (consumerTrends.includes(' ')) {
            keywords.push('  ', ' ');
        }

        return keywords.slice(0, 5); //  5
    }

    //
    generateReviewSamples(keywords) {
        const templates = [
            ` ${keywords[0] || ''}! `,
            `${keywords[1] || '해'}   `,
            `${keywords[2] || ' '} !`
        ];

        return templates.slice(0, 3);
    }

    //    ( )
    generateReviewerName() {
        const surnames = ['', '', '', '', '', '', '', ''];
        const suffix = ['**', '***', '*'];
        return surnames[Math.floor(Math.random() * surnames.length)] +
               suffix[Math.floor(Math.random() * suffix.length)];
    }

    getMostCommonValue(values) {
        const counts = {};
        values.forEach(v => {
            counts[v] = (counts[v] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    getSafeAlternative(term) {
        const alternatives = {
            '': '',
            '': '',
            '': '',
            '': '',
            '100%': '',
            '': '',
            '': '실'
        };
        return alternatives[term] || '';
    }

    validateAllData() {
        const required = [
            'marketAnalysis',
            'verifiedInfo',
            'targetAudience',
            'valueProposition'
        ];

        return required.every(field =>
            this.researchData[field] !== null &&
            Object.keys(this.researchData[field]).length > 0
        );
    }

    //
    async generateResearchReport() {
        const report = `#

## 1.
${JSON.stringify(this.researchData.marketAnalysis, null, 2)}

## 2.
${JSON.stringify(this.researchData.verifiedInfo, null, 2)}

## 3.
${JSON.stringify(this.researchData.legalCheck, null, 2)}

## 4.
${JSON.stringify(this.researchData.targetAudience, null, 2)}

## 5.
${JSON.stringify(this.researchData.valueProposition, null, 2)}

일: ${new Date().toLocaleString()}
`;

        //
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market_research_report_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Mock  (API  )
    getMockMarketData() {
        return {
            marketSize: "3200",
            growthRate: "12%",
            competitors: [
                { brand: "", product: " ", price: "18,900", marketShare: "15%" },
                { brand: "", product: " 3 ", price: "14,500", marketShare: "12%" },
                { brand: "CJ", product: " ", price: "16,800", marketShare: "10%" },
                { brand: "", product: "", price: "19,500", marketShare: "8%" },
                { brand: "", product: " ", price: "13,200", marketShare: "7%" },
                { brand: "", product: " ", price: "17,900", marketShare: "6%" }
            ],
            consumerTrends: [" ", "1  ", " ", " "],
            purchaseFactors: ["", "", "", "", ""]
        };
    }

    getMockCompetitorData() {
        return {
            count: 6,
            averagePrice: "16,800",
            priceRange: {
                min: 13200,
                max: 19500
            },
            totalMarketShare: "58%",
            commonFeatures: [" (4 )", " (3 )", " (2 )"],
            topCompetitors: [
                { brand: "", product: " ", price: "18,900", marketShare: "15%" },
                { brand: "", product: " 3 ", price: "14,500", marketShare: "12%" },
                { brand: "CJ", product: " ", price: "16,800", marketShare: "10%" }
            ]
        };
    }
}

//
window.MarketingResearchSystem = MarketingResearchSystem;