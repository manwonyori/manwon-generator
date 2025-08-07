// HTML 유효성 검사 및 자동 수정 도구

class HTMLValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
    }

    // HTML 문자열 검증
    validateHTML(htmlString) {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];

        // 1. 기본 구조 검사
        this.checkBasicStructure(htmlString);
        
        // 2. 태그 닫기 검사
        this.checkUnclosedTags(htmlString);
        
        // 3. 필수 메타태그 검사
        this.checkRequiredMetaTags(htmlString);
        
        // 4. 웹 접근성 검사
        this.checkAccessibility(htmlString);
        
        // 5. 리소스 경로 검사
        this.checkResourcePaths(htmlString);
        
        // 6. 특수문자 및 인코딩 검사
        this.checkSpecialCharacters(htmlString);

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            fixes: this.fixes,
            fixedHTML: this.autoFixHTML(htmlString)
        };
    }

    // 기본 HTML 구조 검사
    checkBasicStructure(html) {
        // DOCTYPE 검사
        if (!html.match(/^<!DOCTYPE\s+html>/i)) {
            this.errors.push('DOCTYPE 선언이 없습니다');
            this.fixes.push('<!DOCTYPE html> 추가');
        }

        // html 태그 검사
        const htmlTagMatch = html.match(/<html[^>]*>/i);
        if (!htmlTagMatch) {
            this.errors.push('<html> 태그가 없습니다');
        } else if (!htmlTagMatch[0].includes('lang=')) {
            this.warnings.push('<html> 태그에 lang 속성이 없습니다');
            this.fixes.push('lang="ko" 속성 추가');
        }

        // head와 body 태그 검사
        if (!html.match(/<head>/i)) {
            this.errors.push('<head> 태그가 없습니다');
        }
        if (!html.match(/<body>/i)) {
            this.errors.push('<body> 태그가 없습니다');
        }

        // title 태그 검사
        if (!html.match(/<title>.*?<\/title>/i)) {
            this.errors.push('<title> 태그가 없거나 비어있습니다');
        }
    }

    // 닫히지 않은 태그 검사
    checkUnclosedTags(html) {
        // 자체 닫기 태그 목록
        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        
        // 일반 태그 패턴
        const tagPattern = /<([a-zA-Z]+)(?:\s[^>]*)?>/g;
        const openTags = [];
        let match;

        while ((match = tagPattern.exec(html)) !== null) {
            const tagName = match[1].toLowerCase();
            
            // 자체 닫기 태그는 제외
            if (selfClosingTags.includes(tagName)) {
                continue;
            }

            // 닫기 태그 확인
            const closeTagRegex = new RegExp(`</${tagName}>`, 'i');
            const remainingHtml = html.substring(match.index);
            
            if (!remainingHtml.match(closeTagRegex)) {
                openTags.push(tagName);
                this.errors.push(`닫히지 않은 <${tagName}> 태그`);
                this.fixes.push(`</${tagName}> 태그 자동 추가`);
            }
        }

        // 잘못된 닫기 태그 순서 검사
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
                    this.warnings.push(`태그 순서 오류: <${lastTag}>가 </${tagName}>보다 먼저 닫혀야 합니다`);
                }
            }
        }
    }

    // 필수 메타태그 검사
    checkRequiredMetaTags(html) {
        // charset 검사
        if (!html.match(/<meta\s+charset=["']utf-8["']/i)) {
            this.errors.push('UTF-8 charset 메타태그가 없습니다');
            this.fixes.push('<meta charset="UTF-8"> 추가');
        }

        // viewport 메타태그 검사
        if (!html.match(/<meta\s+name=["']viewport["'][^>]*>/i)) {
            this.errors.push('반응형 viewport 메타태그가 없습니다');
            this.fixes.push('<meta name="viewport" content="width=device-width, initial-scale=1.0"> 추가');
        }

        // description 메타태그 권장
        if (!html.match(/<meta\s+name=["']description["'][^>]*>/i)) {
            this.warnings.push('SEO를 위한 description 메타태그가 없습니다');
        }
    }

    // 웹 접근성 검사
    checkAccessibility(html) {
        // 이미지 alt 속성 검사
        const imgPattern = /<img[^>]*>/g;
        let imgMatch;
        let imgCount = 0;
        let altMissing = 0;

        while ((imgMatch = imgPattern.exec(html)) !== null) {
            imgCount++;
            if (!imgMatch[0].includes('alt=')) {
                altMissing++;
                this.warnings.push(`alt 속성이 없는 이미지: ${imgMatch[0].substring(0, 50)}...`);
            }
        }

        if (altMissing > 0) {
            this.fixes.push(`${altMissing}개 이미지에 alt="" 속성 추가`);
        }

        // 언어 속성 검사
        if (!html.match(/<html[^>]*lang=["'][^"']+["'][^>]*>/i)) {
            this.errors.push('html 태그에 lang 속성이 없습니다');
            this.fixes.push('lang="ko" 추가');
        }

        // 제목 계층 구조 검사
        const headings = html.match(/<h[1-6][^>]*>/gi) || [];
        let prevLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.match(/<h([1-6])/i)[1]);
            if (prevLevel > 0 && level > prevLevel + 1) {
                this.warnings.push(`제목 계층 구조 건너뜀: h${prevLevel} → h${level}`);
            }
            prevLevel = level;
        });
    }

    // 리소스 경로 검사
    checkResourcePaths(html) {
        // CSS 파일 경로
        const cssLinks = html.match(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi) || [];
        cssLinks.forEach(link => {
            const href = link.match(/href=["']([^"']+)["']/i)[1];
            if (href.startsWith('http')) return; // 외부 리소스는 제외
            
            if (!href.startsWith('/') && !href.startsWith('./') && !href.startsWith('../')) {
                this.warnings.push(`상대 경로 CSS 확인 필요: ${href}`);
            }
        });

        // JS 파일 경로
        const scriptTags = html.match(/<script[^>]*src=["']([^"']+\.js)["'][^>]*>/gi) || [];
        scriptTags.forEach(script => {
            const src = script.match(/src=["']([^"']+)["']/i)[1];
            if (src.startsWith('http')) return; // 외부 리소스는 제외
            
            if (!src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
                this.warnings.push(`상대 경로 JS 확인 필요: ${src}`);
            }
        });
    }

    // 특수문자 검사
    checkSpecialCharacters(html) {
        // 반복되는 특수문자
        const repeatingChars = html.match(/(.)\1{4,}/g) || [];
        repeatingChars.forEach(match => {
            if (!/\s/.test(match[0])) { // 공백 제외
                this.warnings.push(`반복되는 문자 발견: ${match}`);
                this.fixes.push(`반복 문자 제거: ${match} → ${match[0]}`);
            }
        });

        // 잘못된 HTML 엔티티
        const invalidEntities = html.match(/&[a-zA-Z]+(?!;)/g) || [];
        invalidEntities.forEach(entity => {
            this.warnings.push(`세미콜론이 없는 HTML 엔티티: ${entity}`);
            this.fixes.push(`${entity} → ${entity};`);
        });
    }

    // HTML 자동 수정
    autoFixHTML(html) {
        let fixedHTML = html;

        // DOCTYPE 추가
        if (!fixedHTML.match(/^<!DOCTYPE\s+html>/i)) {
            fixedHTML = '<!DOCTYPE html>\n' + fixedHTML;
        }

        // html lang 속성 추가
        fixedHTML = fixedHTML.replace(/<html(?![^>]*lang=)/i, '<html lang="ko"');

        // 필수 메타태그 추가
        if (!fixedHTML.includes('charset')) {
            fixedHTML = fixedHTML.replace(/<head>/i, '<head>\n    <meta charset="UTF-8">');
        }
        
        if (!fixedHTML.includes('viewport')) {
            fixedHTML = fixedHTML.replace(/<head>/i, '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }

        // 이미지 alt 속성 추가
        fixedHTML = fixedHTML.replace(/<img(?![^>]*alt=)([^>]*)>/gi, '<img alt=""$1>');

        // 반복 문자 제거
        fixedHTML = fixedHTML.replace(/([^>\s])\1{4,}/g, '$1');

        // HTML 엔티티 수정
        fixedHTML = fixedHTML.replace(/&([a-zA-Z]+)(?!;)/g, '&$1;');

        // 닫히지 않은 태그 자동 닫기
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
        
        // 남은 태그들 닫기
        tagStack.reverse().forEach(tag => {
            fixedHTML += `\n</${tag.name}>`;
        });

        return fixedHTML;
    }
}

// 브라우저 렌더링 시뮬레이션
function simulateBrowserRendering(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const errors = [];

    // 파싱 에러 확인
    const parserErrors = doc.querySelectorAll('parsererror');
    if (parserErrors.length > 0) {
        parserErrors.forEach(error => {
            errors.push(`파싱 에러: ${error.textContent}`);
        });
    }

    // 스크립트 에러 시뮬레이션
    const scripts = doc.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (!src.startsWith('http') && !src.startsWith('//')) {
            // 로컬 파일 체크 시뮬레이션
            console.warn(`스크립트 파일 확인 필요: ${src}`);
        }
    });

    // CSS 파일 체크
    const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('http') && !href.startsWith('//')) {
            console.warn(`CSS 파일 확인 필요: ${href}`);
        }
    });

    return {
        success: errors.length === 0,
        errors: errors,
        warnings: []
    };
}

// 모바일 뷰포트 체크
function checkMobileViewport(html) {
    const viewportMatch = html.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
    
    if (!viewportMatch) {
        return {
            hasMobileViewport: false,
            message: 'viewport 메타태그가 없습니다'
        };
    }

    const content = viewportMatch[1];
    const hasWidth = content.includes('width=device-width');
    const hasInitialScale = content.includes('initial-scale=1');
    
    return {
        hasMobileViewport: hasWidth && hasInitialScale,
        message: hasWidth && hasInitialScale 
            ? '모바일 뷰포트가 올바르게 설정됨' 
            : '모바일 뷰포트 설정이 불완전함',
        content: content
    };
}

// 종합 검증 함수
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