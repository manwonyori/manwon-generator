//
if (typeof API_CONFIG !== 'undefined') {
    API_CONFIG.PROMPTS.crawlProduct = (url) => `
 URL    : ${url}

:      , URL        .

  :
1. 명 (   )
2.  ( )
3.   5 (  )
4.   (1-2)
5.    (  +   4)

 JSON  :
{
    "title": "명",
    "price": "29,900",
    "features": [
        " 1",
        " 2",
        " 3",
        " 4",
        " 5"
    ],
    "description": "에  ",
    "images": [
        "  ",
        "  1 ",
        "  2 ",
        "  3 ",
        "  4 "
    ],
    "category": " "
}
`;

    API_CONFIG.PROMPTS.generateFromUrl = (url, productName) => `
 에    만요리   .

명: ${productName}
 URL: ${url}

 을  :
1.   (  발 )
2.    ( )
3. 고객
4.
5.    3

 은    , 를 해주세요.
`;
}