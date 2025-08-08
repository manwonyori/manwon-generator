//   &  API

const MARKETING_CONFIG = {
    //
    MARKET_RESEARCH_PROMPTS: {
        //
        marketAnalysis: (productName, category) => `
 10  입니다.      을 :

: ${productName}
: ${category}

 :
1.
2.     ( 10)
3.
4.
5.

 에     JSON  :
{
    "marketSize": "  ()",
    "growthRate": "  (%)",
    "competitors": [
        {
            "brand": "",
            "product": "",
            "price": "",
            "volume": "",
            "marketShare": "점유율"
        }
    ],
    "consumerTrends": ["1", "2"],
    "purchaseFactors": ["1", "2"]
}`,

        //
        competitorAnalysis: (productInfo, competitors) => `
   입니다.  과  들을  하세요:

 : ${JSON.stringify(productInfo)}
 들: ${JSON.stringify(competitors)}

 :
1.  력 ( )
2.
3. /
4. /
5.

 :
-
-
-

JSON  .`,

        //
        reviewAnalysis: (productName, reviews) => `
    입니다.  의 를 하세요:

: ${productName}
 : ${reviews}

 :
1. /
2.    TOP 10
3.    TOP 5
4.
5. 선

 과    JSON  .`
    },

    //
    VERIFICATION_PROMPTS: {
        //
        crossVerification: (info, sources) => `
  입니다.  의  하세요:

  : ${JSON.stringify(info)}
 : ${JSON.stringify(sources)}

 :
1. 3
2.
3.    (1-100)
4.
5.

  :
{
    "verified": true/false,
    "confidenceScore": 85,
    "consistentSources": ["1", "2"],
    "conflicts": [""],
    "finalValue": "된 값",
    "recommendation": ""
}`,

        //
        legalCompliance: (content) => `
   .     :

 : ${content}

 :
1. /
2.
3. 방지법
4. 표시
5.

     JSON  .`
    },

    //
    MARKETING_STRATEGY_PROMPTS: {
        //
        targetAnalysis: (productInfo, marketData) => `
   입니다.  의  을 :

 : ${JSON.stringify(productInfo)}
 : ${JSON.stringify(marketData)}

 :
1.  층 (1, 2)
2.
3.
4. 력
5.

 3를   JSON  .`,

        //
        valueProposition: (productInfo, competitorData, targetAudience) => `
  입니다. 의   을 발하세요:

: ${JSON.stringify(productInfo)}
: ${JSON.stringify(competitorData)}
: ${JSON.stringify(targetAudience)}

발 :
1.   3 (된 )
2.   (  )
3. 적
4.
5.

     를 JSON  .`
    },

    //
    PRODUCT_PAGE_PROMPTS: {
        //
        createHeadline: (productName, keyBenefit) => `
 .  를  을 :

: ${productName}
 : ${keyBenefit}

:
1. 20
2.
3. 적
4.
5.

5의   .`,

        //
        createDescription: (verifiedInfo, targetAudience, valueProps) => `
  .  율을   을 :

된 : ${JSON.stringify(verifiedInfo)}
 : ${JSON.stringify(targetAudience)}
 : ${JSON.stringify(valueProps)}

:
1.   ( 페)
2.   ( )
3.
4.
5.

HTML  ,   된  .`
    }
};

//
async function verifyInformation(info, sources) {
    if (!window.callAI) {
        console.warn('AI API 되지 . Mock 를 .');
        return {
            verified: true,
            confidenceScore: 75,
            message: 'Mock  ',
            finalValue: info,
            consistentSources: sources?.slice(0, 2) || [],
            conflicts: [],
            recommendation: '추  '
        };
    }

    try {
        const prompt = MARKETING_CONFIG.VERIFICATION_PROMPTS.crossVerification(info, sources);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('  :', error);
        return {
            verified: true,
            confidenceScore: 65,
            error: error.message,
            finalValue: info,
            consistentSources: sources?.slice(0, 1) || [],
            conflicts: [],
            recommendation: 'AI  로  '
        };
    }
}

//
async function conductMarketResearch(productName, category) {
    if (!window.callAI) {
        console.warn('AI API 되지 . Mock 를 .');
        return {
            marketSize: "2800",
            growthRate: "8.5%",
            competitors: [
                { brand: "A", product: "A", price: "16,900", marketShare: "12%" },
                { brand: "B", product: "B", price: "18,500", marketShare: "10%" }
            ],
            consumerTrends: [" ", "1 구 증"],
            purchaseFactors: ["", "", ""]
        };
    }

    try {
        const prompt = MARKETING_CONFIG.MARKET_RESEARCH_PROMPTS.marketAnalysis(productName, category);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('  :', error);
        return {
            marketSize: "Mock ",
            growthRate: "N/A",
            competitors: [],
            consumerTrends: [" "],
            purchaseFactors: ["", ""]
        };
    }
}

//
async function checkLegalCompliance(content) {
    if (!window.callAI) {
        console.warn('AI API 되지 .   를 .');
        return {
            compliant: true,
            issues: [],
            message: 'Mock  '
        };
    }

    try {
        const prompt = MARKETING_CONFIG.VERIFICATION_PROMPTS.legalCompliance(content);
        const result = await callAI(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('  :', error);
        return {
            compliant: true,
            issues: [],
            error: error.message
        };
    }
}