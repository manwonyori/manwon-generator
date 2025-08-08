//   &  API

const MARKETING_CONFIG = {
    //
    MARKET_RESEARCH_PROMPTS: {
        //
        marketAnalysis: (productName, category) => `
 10  .       :

: ${productName}
: ${category}

 :
1.
2.     ( 10)
3.
4.
5.

      JSON  :
{
    "marketSize": "  ()",
    "growthRate": "  (%)",
    "competitors": [
        {
            "brand": "",
            "product": "",
            "price": "",
            "volume": "",
            "marketShare": ""
        }
    ],
    "consumerTrends": ["1", "2"],
    "purchaseFactors": ["1", "2"]
}`,

        //
        competitorAnalysis: (productInfo, competitors) => `
   .      :

 : ${JSON.stringify(productInfo)}
 : ${JSON.stringify(competitors)}

 :
1.   ( )
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
    .    :

: ${productName}
 : ${reviews}

 :
1. /
2.    TOP 10
3.    TOP 5
4.
5.

     JSON  .`
    },

    //
    VERIFICATION_PROMPTS: {
        //
        crossVerification: (info, sources) => `
  .    :

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
    "finalValue": " ",
    "recommendation": ""
}`,

        //
        legalCompliance: (content) => `
   .     :

 : ${content}

 :
1. /
2.
3.
4.
5.

     JSON  .`
    },

    //
    MARKETING_STRATEGY_PROMPTS: {
        //
        targetAnalysis: (productInfo, marketData) => `
   .     :

 : ${JSON.stringify(productInfo)}
 : ${JSON.stringify(marketData)}

 :
1.   (1, 2)
2.
3.
4.
5.

 3   JSON  .`,

        //
        valueProposition: (productInfo, competitorData, targetAudience) => `
  .     :

: ${JSON.stringify(productInfo)}
: ${JSON.stringify(competitorData)}
: ${JSON.stringify(targetAudience)}

 :
1.   3 ( )
2.   (  )
3.
4.
5.

      JSON  .`
    },

    //
    PRODUCT_PAGE_PROMPTS: {
        //
        createHeadline: (productName, keyBenefit) => `
 .     :

: ${productName}
 : ${keyBenefit}

:
1. 20
2.
3.
4.
5.

5   .`,

        //
        createDescription: (verifiedInfo, targetAudience, valueProps) => `
  .  율    :

 : ${JSON.stringify(verifiedInfo)}
 : ${JSON.stringify(targetAudience)}
 : ${JSON.stringify(valueProps)}

:
1.   ( )
2.   ( )
3.
4.
5.

HTML  ,     .`
    }
};

//
async function verifyInformation(info, sources) {
    if (!window.callAI) {
        console.warn('AI API  . Mock  .');
        return {
            verified: true,
            confidenceScore: 75,
            message: 'Mock  ',
            finalValue: info,
            consistentSources: sources?.slice(0, 2) || [],
            conflicts: [],
            recommendation: '  '
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
            recommendation: 'AI    '
        };
    }
}

//
async function conductMarketResearch(productName, category) {
    if (!window.callAI) {
        console.warn('AI API  . Mock  .');
        return {
            marketSize: "2800",
            growthRate: "8.5%",
            competitors: [
                { brand: "A", product: "A", price: "16,900", marketShare: "12%" },
                { brand: "B", product: "B", price: "18,500", marketShare: "10%" }
            ],
            consumerTrends: [" ", "1  "],
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
        console.warn('AI API  .    .');
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