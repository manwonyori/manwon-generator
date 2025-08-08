//
// AI 을   을    .

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
            food: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '발', '', ''],
            kitchenware: ['', '', '', '', '', '', '', '', ''],
            appliance: ['', '', '', '', '', '솥'],
            ingredients: ['', '루', '', '', '금', '', '간'],
            snacks: ['', '', '', '', '', '', ''],
            beverage: ['', '', '', '', '', '', '주', '']
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
        명: ${productName}

         의   층을 해주세요:
        1.
        2.
        3. 라프스타일
        4.
        5. 격

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

        return '   을   비';
    },

    //
    async extractKeyFeatures(productName) {
        const prompt = `
        명: ${productName}

         의  을 3지로 :
        1.
        2. 별화
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
            ' 성비',
            ' ',
            '  '
        ];
    },

    //
    async findCompetitiveAdvantage(productName) {
        const prompt = `
        명: ${productName}
           : 성비, , 정직

          시에서 질    를 2지 .
          문으로 , 구체적고   .
        `;

        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            try {
                const result = await callAI(prompt, 'analysis');
                if (result) return result;
            } catch (error) {
                console.error('AI  :', error);
            }
        }

        return ' 격대비 우 로   .';
    },

    // 시
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
                keywords: ['맛', '신선', '', '건강', 'HACCP'],
                emotionalAppeal: '족의  '
            },
            kitchenware: {
                focus: ' ',
                approach: ' 성비 ',
                keywords: ['편리', '튼튼', '', '오래는'],
                emotionalAppeal: ' '
            },
            general: {
                focus: '성비와 ',
                approach: '  ',
                keywords: ['성비', '', '', ' '],
                emotionalAppeal: '현명 '
            }
        };

        return strategies[analysis.category] || strategies.general;
    },

    //
    async determineTonevManor(analysis) {
        // v9.0 과
        const tones = {
            food: ' 친근,  ',
            kitchenware: '실용적고 , 믿음직 ',
            appliance: ' , 라프스타일 ',
            general: ' 친근, 웃집 '
        };

        return {
            primary: tones[analysis.category] || tones.general,
            style: ',  편안 ',
            emotion: '과  '
        };
    },

    //
    async extractKeyMessages(analysis) {
        const prompt = `
        명: ${analysis.productName}
        : ${analysis.category}
        : ${analysis.targetAudience}

            의   3 :
        1.  (15 내)
        2.   (25 내)
        3. CTA  (20 내)

          성비를 하는  .
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

    //      드
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
                style: '구체적고 '
            },
            trustContent: {
                approach: analysis.competitiveAdvantage,
                tone: '진  '
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
        <p><strong>명:</strong> ${analysis.productName}</p>
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
            ${analysis.keyFeatures ? analysis.keyFeatures.map(feature => `<li>${feature}</li>`).join('') : '<li> 성비</li><li> </li><li>  </li>'}
        </ul>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p>${analysis.competitiveAdvantage}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p><strong>:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.focus : '성비와 '}</p>
        <p><strong>:</strong> ${analysis.contentStrategy ? analysis.contentStrategy.approach : '정직 '}</p>
        <p><strong> :</strong> ${analysis.contentStrategy ? analysis.contentStrategy.keywords.join(', ') : '성비, , '}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <h3 style="color: #1F2937;">  </h3>
        <p>${analysis.recommendedTone ? analysis.recommendedTone.primary : ' 정직'}</p>
        <p style="color: #6B7280; font-size: 14px;">${analysis.recommendedTone ? analysis.recommendedTone.style : ',  편안 '}</p>
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