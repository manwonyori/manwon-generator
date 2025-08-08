// HTML

class HTMLValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
    }

    // HTML
    validateHTML(htmlString) {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];

        // 1.
        this.checkBasicStructure(htmlString);

        // 2.
        this.checkUnclosedTags(htmlString);

        // 3.  메타
        this.checkRequiredMetaTags(htmlString);

        // 4.
        this.checkAccessibility(htmlString);

        // 5.
        this.checkResourcePaths(htmlString);

        // 6.
        this.checkSpecialCharacters(htmlString);

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            fixes: this.fixes,
            fixedHTML: this.autoFixHTML(htmlString)
        };
    }

    //  HTML
    checkBasicStructure(html) {
        // DOCTYPE
        if (!html.match(/^<!DOCTYPE\s+html>/i)) {
            this.errors.push('DOCTYPE  ');
            this.fixes.push('<!DOCTYPE html> ');
        }

        // html
        const htmlTagMatch = html.match(/<html[^>]*>/i);
        if (!htmlTagMatch) {
            this.errors.push('<html>  ');
        } else if (!htmlTagMatch[0].includes('lang=')) {
            this.warnings.push('<html> 에 lang  ');
            this.fixes.push('lang="ko"  ');
        }

        // head body
        if (!html.match(/<head>/i)) {
            this.errors.push('<head>  ');
        }
        if (!html.match(/<body>/i)) {
            this.errors.push('<body>  ');
        }

        // title
        if (!html.match(/<title>.*?<\/title>/i)) {
            this.errors.push('<title>   ');
        }
    }

    //
    checkUnclosedTags(html) {
        //
        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

        //
        const tagPattern = /<([a-zA-Z]+)(?:\s[^>]*)?>/g;
        const openTags = [];
        let match;

        while ((match = tagPattern.exec(html)) !== null) {
            const tagName = match[1].toLowerCase();

            //   는
            if (selfClosingTags.includes(tagName)) {
                continue;
            }

            //
            const closeTagRegex = new RegExp(`</${tagName}>`, 'i');
            const remainingHtml = html.substring(match.index);

            if (!remainingHtml.match(closeTagRegex)) {
                openTags.push(tagName);
                this.errors.push(`  <${tagName}> `);
                this.fixes.push(`</${tagName}>   `);
            }
        }

        //
        const tagStack = [];
        const allTagsPattern = /<\/?([a-zA-Z]+)(?:\s[^>]*)?>/g;

        while ((match = allTagsPattern.exec(html)) !== null) {
            const isClosing = match[0].startsWith('</');
            const tagName = match[1].toLowerCase();

            if (selfClosingTags.includes(tagName)) continue;

            if (!isClosing) {
                tagStack.push(tagName);
            } else {
                const lastTag = tagStack.pop();
                if (lastTag !== tagName) {
                    this.warnings.push(`  : <${lastTag}> </${tagName}>   `);
                }
            }
        }
    }

    //  메타
    checkRequiredMetaTags(html) {
        // charset
        if (!html.match(/<meta\s+charset=["']utf-8["']/i)) {
            this.errors.push('UTF-8 charset 메타 ');
            this.fixes.push('<meta charset="UTF-8"> ');
        }

        // viewport 메타
        if (!html.match(/<meta\s+name=["']viewport["'][^>]*>/i)) {
            this.errors.push(' viewport 메타 ');
            this.fixes.push('<meta name="viewport" content="width=device-width, initial-scale=1.0"> ');
        }

        // description 메타
        if (!html.match(/<meta\s+name=["']description["'][^>]*>/i)) {
            this.warnings.push('SEO  description 메타 ');
        }
    }

    //
    checkAccessibility(html) {
        //  alt
        const imgPattern = /<img[^>]*>/g;
        let imgMatch;
        let imgCount = 0;
        let altMissing = 0;

        while ((imgMatch = imgPattern.exec(html)) !== null) {
            imgCount++;
            if (!imgMatch[0].includes('alt=')) {
                altMissing++;
                this.warnings.push(`alt   : ${imgMatch[0].substring(0, 50)}...`);
            }
        }

        if (altMissing > 0) {
            this.fixes.push(`${altMissing} 에 alt=""  `);
        }

        //
        if (!html.match(/<html[^>]*lang=["'][^"']+["'][^>]*>/i)) {
            this.errors.push('html 에 lang  ');
            this.fixes.push('lang="ko" ');
        }

        //
        const headings = html.match(/<h[1-6][^>]*>/gi) || [];
        let prevLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.match(/<h([1-6])/i)[1]);
            if (prevLevel > 0 && level > prevLevel + 1) {
                this.warnings.push(`   : h${prevLevel} → h${level}`);
            }
            prevLevel = level;
        });
    }

    //
    checkResourcePaths(html) {
        // CSS
        const cssLinks = html.match(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi) || [];
        cssLinks.forEach(link => {
            const href = link.match(/href=["']([^"']+)["']/i)[1];
            if (href.startsWith('http')) return; //  는

            if (!href.startsWith('/') && !href.startsWith('./') && !href.startsWith('../')) {
                this.warnings.push(`  CSS  : ${href}`);
            }
        });

        // JS
        const scriptTags = html.match(/<script[^>]*src=["']([^"']+\.js)["'][^>]*>/gi) || [];
        scriptTags.forEach(script => {
            const src = script.match(/src=["']([^"']+)["']/i)[1];
            if (src.startsWith('http')) return; //  는

            if (!src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
                this.warnings.push(`  JS  : ${src}`);
            }
        });
    }

    //
    checkSpecialCharacters(html) {
        //
        const repeatingChars = html.match(/(.)\1{4,}/g) || [];
        repeatingChars.forEach(match => {
            if (!/\s/.test(match[0])) { //
                this.warnings.push(`  : ${match}`);
                this.fixes.push(`  : ${match} → ${match[0]}`);
            }
        });

        //  HTML
        const invalidEntities = html.match(/&[a-zA-Z]+(?!;)/g) || [];
        invalidEntities.forEach(entity => {
            this.warnings.push(`  HTML : ${entity}`);
            this.fixes.push(`${entity} → ${entity};`);
        });
    }

    // HTML
    autoFixHTML(html) {
        let fixedHTML = html;

        // DOCTYPE
        if (!fixedHTML.match(/^<!DOCTYPE\s+html>/i)) {
            fixedHTML = '<!DOCTYPE html>\n' + fixedHTML;
        }

        // html lang
        fixedHTML = fixedHTML.replace(/<html(?![^>]*lang=)/i, '<html lang="ko"');

        //  메타
        if (!fixedHTML.includes('charset')) {
            fixedHTML = fixedHTML.replace(/<head>/i, '<head>\n    <meta charset="UTF-8">');
        }

        if (!fixedHTML.includes('viewport')) {
            fixedHTML = fixedHTML.replace(/<head>/i, '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }

        //  alt
        fixedHTML = fixedHTML.replace(/<img(?![^>]*alt=)([^>]*)>/gi, '<img alt=""$1>');

        //
        fixedHTML = fixedHTML.replace(/([^>\s])\1{4,}/g, '$1');

        // HTML
        fixedHTML = fixedHTML.replace(/&([a-zA-Z]+)(?!;)/g, '&$1;');

        //
        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        const tagStack = [];
        const lines = fixedHTML.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const openTagMatch = line.match(/<([a-zA-Z]+)(?:\s[^>]*)?>/g) || [];
            const closeTagMatch = line.match(/<\/([a-zA-Z]+)>/g) || [];

            openTagMatch.forEach(tag => {
                const tagName = tag.match(/<([a-zA-Z]+)/)[1].toLowerCase();
                if (!selfClosingTags.includes(tagName)) {
                    tagStack.push({ name: tagName, line: i });
                }
            });

            closeTagMatch.forEach(tag => {
                const tagName = tag.match(/<\/([a-zA-Z]+)>/)[1].toLowerCase();
                const lastIndex = tagStack.map(t => t.name).lastIndexOf(tagName);
                if (lastIndex !== -1) {
                    tagStack.splice(lastIndex, 1);
                }
            });
        }

        //  들
        tagStack.reverse().forEach(tag => {
            fixedHTML += `\n</${tag.name}>`;
        });

        return fixedHTML;
    }
}

//
function simulateBrowserRendering(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const errors = [];

    //
    const parserErrors = doc.querySelectorAll('parsererror');
    if (parserErrors.length > 0) {
        parserErrors.forEach(error => {
            errors.push(` : ${error.textContent}`);
        });
    }

    //
    const scripts = doc.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (!src.startsWith('http') && !src.startsWith('//')) {
            //
            console.warn(`   : ${src}`);
        }
    });

    // CSS
    const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('http') && !href.startsWith('//')) {
            console.warn(`CSS   : ${href}`);
        }
    });

    return {
        success: errors.length === 0,
        errors: errors,
        warnings: []
    };
}

//
function checkMobileViewport(html) {
    const viewportMatch = html.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']+)["']/i);

    if (!viewportMatch) {
        return {
            hasMobileViewport: false,
            message: 'viewport 메타 '
        };
    }

    const content = viewportMatch[1];
    const hasWidth = content.includes('width=device-width');
    const hasInitialScale = content.includes('initial-scale=1');

    return {
        hasMobileViewport: hasWidth && hasInitialScale,
        message: hasWidth && hasInitialScale
            ? '   '
            : '   ',
        content: content
    };
}

//
function validateGeneratedHTML(html) {
    const validator = new HTMLValidator();
    const validationResult = validator.validateHTML(html);
    const renderingResult = simulateBrowserRendering(validationResult.fixedHTML);
    const mobileResult = checkMobileViewport(validationResult.fixedHTML);

    return {
        validation: validationResult,
        rendering: renderingResult,
        mobile: mobileResult,
        summary: {
            totalErrors: validationResult.errors.length + renderingResult.errors.length,
            totalWarnings: validationResult.warnings.length + renderingResult.warnings.length,
            isValid: validationResult.isValid && renderingResult.success,
            hasMobileSupport: mobileResult.hasMobileViewport
        }
    };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HTMLValidator, validateGeneratedHTML };
}