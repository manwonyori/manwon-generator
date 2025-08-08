//
if (typeof API_CONFIG !== 'undefined') {
    API_CONFIG.PROMPTS.crawlProduct = (url) => `
 URL    : ${url}

:      , URL        .

  :
1.  (   )
2.  ( )
3.   5 (  )
4.   (1-2)
5.    (  +   4)

 JSON  :
{
    "title": "",
    "price": "29,900",
    "features": [
        " 1",
        " 2",
        " 3",
        " 4",
        " 5"
    ],
    "description": "  ",
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
        .

: ${productName}
 URL: ${url}

   :
1.   (   )
2.    ( )
3.
4.
5.    3

     ,  .
`;
}