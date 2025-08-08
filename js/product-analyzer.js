//
// AI        .

//
const ProductAnalyzer = {
    // 1:
    async analyzeProduct(productName, referenceUrl = null) {
        console.log('   :', productName);

        const analysis = {
            productName: productName,
            timestamp: new Date().toISOString(),
            category: await this.detectCategory(productName),
            targetAudience: await this.identifyTargetAudience(productName),
            keyFeatures: await this.extractKeyFeatures(productName),
            competitiveAdvantage: await this.findCompetitiveAdvantage(productName),
            marketPosition: await this.analyzeMarketPosition(productName),
            contentStrategy: null,
            recommendedTone: null,
            keyMessages: []
        };

        // 2:
        analysis.contentStrategy = await this.developContentStrategy(analysis);

        // 3:
        analysis.recommendedTone = await this.determineTonevManor(analysis);

        // 4:
        analysis.keyMessages = await this.extractKeyMessages(analysis);

        console.log('[]   :', analysis);
        return analysis;
    },

    //
    async detectCategory(productName) {
        const categories = {
            food: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            kitchenware: ['', '', '', '', '', '', '', '', ''],
            appliance: ['', '', '', '', '', ''],
            ingredients: ['', '', '', '', '', '', ''],
            snacks: ['', '', '', '', '', '', ''],
            beverage: ['', '', '', '', '', '', '', '']
        };

        const lowerName = productName.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerName.includes(keyword))) {
                return category;
            }
        }

        return 'general';
    },

    //
    async identifyTargetAudience(productName) {
        // v9.0
        const prompt = `
        : ${productName}

            층 해세요:
        1.
        2.
        3.
        4.
        5.

         3-4 .
        `;

        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            try {
                const result = await callAI(prompt, 'analysis');
                if (result) return result;
            } catch (error) {
                console.error('AI  :', error);
            }
        }

        return '      ';
    },

    //
    async extractKeyFeatures(productName) {
        const prompt = `
        : ${productName}

            3 :
        1.
        2.
        3.

            .
        `;

        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const result = await callAI(prompt, 'analysis');
            if (result) {
                try {
                    return result.split('\n').filter(line => line.trim());
                } catch (e) {
                    return [result];
                }
            }
        }

        return [
            ' 성',
            ' ',
            '  '
        ];
    },

    //
    async findCompetitiveAdvantage(productName) {
        const prompt = `
        : ${productName}
           : 성, ,

                2 .
           ,    .
        `;

        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            try {
                const result = await callAI(prompt, 'analysis');
                if (result) return result;
            } catch (error) {
                console.error('AI  :', error);
            }
        }

        return ' 대     .';
    },

    //
    async analyzeMarketPosition(productName) {
        return {
            pricePosition: 'value', // premium, value, budget
            qualityLevel: 'high',  // high, medium, standard
            brandFit: 'perfect'    // perfect, good, average
        };
    },

    //
    async developContentStrategy(analysis) {
        const strategies = {
            food: {
                focus: ' ',
                approach: '  ',
                keywords: ['', '', '', '', 'HACCP'],
                emotionalAppeal: '족  '
            },
            kitchenware: {
                focus: ' ',
                approach: ' 성 ',
                keywords: ['', '', '', ''],
                emotionalAppeal: ' '
            },
            general: {
                focus: '성와 ',
                approach: '  ',
                keywords: ['성', '', '', ' '],
                emotionalAppeal: '현 '
            }
        };

        return strategies[analysis.category] || strategies.general;
    },

    //
    async determineTonevManor(analysis) {
        // v9.0
        const tones = {
            food: ' ,  ',
            kitchenware: ' ,  ',
            appliance: ' ,  ',
            general: ' ,  '
        };

        return {
            primary: tones[analysis.category] || tones.general,
            style: ',   ',
            emotion: '  '
        };
    },

    //
    async extractKeyMessages(analysis) {
        const prompt = `
        : ${analysis.productName}
        : ${analysis.category}
        : ${analysis.targetAudience}

               3 :
        1.  (15 )
        2.   (25 )
        3. CTA  (20 )

          성   .
        `;

        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const result = await callAI(prompt, 'analysis');
            if (result) {
                try {
                    const lines = result.split('\n').filter(line => line.trim());
                    return {
                        headline: lines[0] || `${analysis.productName},  `,
                        subCopy: lines[1] || '  ',
                        cta: lines[2] || ' !'
                    };
                } catch (e) {
                    console.error('  :', e);
                }
            }
        }

        return {
            headline: `${analysis.productName},  `,
            subCopy: '  ',
            cta: ' !'
        };
    },

    //
    generateContentGuide(analysis) {
        return {
            heritageStory: {
                focus: analysis.contentStrategy.emotionalAppeal,
                keywords: analysis.contentStrategy.keywords,
                length: '3-4',
                style: analysis.recommendedTone.primary
            },
            benefits: {
                count: 5,
                focus: analysis.keyFeatures,
                style: ' '
            },
            trustContent: {
                approach: analysis.competitiveAdvantage,
                tone: '  '
            },
            faq: {
                topics: [
                    ' ',
                    '/ ',
                    ' ',
                    ' '
                ]
            }
        };
    },

    //    ()
    formatAnalysisReport(analysis) {
        return `
<div style="font-family: 'Noto Sans KR', sans-serif; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h2 style="color: #E4A853; margin-bottom: 20px;">   </h2>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p><strong>:</strong> ${analysis.productName}</p>
        <p><strong>:</strong> ${analysis.category}</p>
        <p><strong> :</strong> ${new Date(analysis.timestamp).toLocaleString('ko-KR')}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p>${analysis.targetAudience}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">[]  </h3>
        <ul style="color: #6B7280;">
            ${analysis.keyFeatures ? analysis.keyFeatures.map(feature => `<li>${feature}</li>`).join('') : '<li> 성</li><li> </li><li>  </li>'}
        </ul>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p>${analysis.competitiveAdvantage}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p><strong>:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.focus : '성와 '}</p>
        <p><strong>:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.approach : ' '}</p>
        <p><strong> :</strong> ${analysis.contentStrategy ? analysis.contentStrategy.keywords.join(', ') : '성, , '}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p>${analysis.recommendedTone ? analysis.recommendedTone.primary : ' '}</p>
        <p style="color: #6B7280; font-size: 14px;">${analysis.recommendedTone ? analysis.recommendedTone.style : ',   '}</p>
    </div>

    <div style="background: #E4A853; color: white; padding: 15px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">${analysis.keyMessages ? analysis.keyMessages.headline : ' '}</h3>
        <p style="margin: 0 0 10px 0;">${analysis.keyMessages ? analysis.keyMessages.subCopy : '  '}</p>
        <button style="background: white; color: #E4A853; border: none; padding: 8px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">
            ${analysis.keyMessages ? analysis.keyMessages.cta : ' !'}
        </button>
    </div>
</div>
        `;
    }
};

//
window.ProductAnalyzer = ProductAnalyzer;

console.log('[]     ');