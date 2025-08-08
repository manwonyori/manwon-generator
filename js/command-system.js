// 명령어 기반 상세페이지 생성 시스템
// 사용자가 제품명, 참조 사이트, 이미지만 입력하면 완벽한 상세페이지 생성

const CommandSystem = {
    // 명령어 파싱
    parseCommand(input) {
        const lines = input.trim().split('\n').filter(line => line.trim());
        const command = {
            productName: '',
            referenceUrl: '',
            images: [],
            options: {}
        };
        
        // 첫 줄은 제품명
        if (lines.length > 0) {
            command.productName = lines[0].trim();
        }
        
        // 나머지 줄 파싱
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // 참조 사이트
            if (line.includes('참조') && line.includes('http')) {
                const urlMatch = line.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                    command.referenceUrl = urlMatch[0];
                }
            }
            // 이미지 링크
            else if (line.includes('이미지') || line.includes('.jpg') || line.includes('.png')) {
                // 이후 모든 URL을 이미지로 처리
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
    
    // 참조 사이트에서 정보 크롤링
    async crawlReferenceData(url) {
        console.log('🔍 참조 사이트 분석 중...', url);
        
        // 실제 크롤링 대신 URL 패턴으로 정보 추출
        const crawledData = {
            description: '',
            features: []
        };
        
        // 인생도매 사이트 패턴
        if (url.includes('insaengdomae')) {
            crawledData.siteName = '인생도매';
            // 실제로는 크롤링이 필요하지만, 여기서는 패턴 기반 추출
        }
        
        return crawledData;
    },
    
    // 제품 상세 분석 (강화된 버전)
    async analyzeProductEnhanced(productName, referenceUrl) {
        console.log('🧠 AI 제품 분석 시작...');
        
        // 제품명에서 정보 추출
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
        
        // AI 분석 강화
        if (window.ProductAnalyzer) {
            const aiAnalysis = await window.ProductAnalyzer.analyzeProduct(productName, referenceUrl);
            Object.assign(analysis, aiAnalysis);
        }
        
        // 닭발 특화 분석
        if (productName.includes('닭발')) {
            analysis.sellingPoints = [
                '국물이 진짜! 끝까지 맛있는 진한 국물',
                '24시간 숙성 특제 양념',
                'HACCP 인증 시설 제조',
                '급속냉동으로 신선함 유지'
            ];
            analysis.targetCustomer = '매운맛과 국물을 좋아하는 2030 세대';
        }
        
        // 닭근위 특화 분석
        if (productName.includes('닭근위') || productName.includes('똥집')) {
            analysis.sellingPoints = [
                '쫄깃쫄깃한 식감의 정석',
                '통마늘의 알싸한 맛과 환상 조합',
                '특제 양념으로 맛과 향을 극대화',
                'HACCP 인증 시설에서 위생적으로 제조',
                '술안주로 최고! 밥반찬으로도 훌륭'
            ];
            analysis.targetCustomer = '쫄깃한 식감과 마늘 향을 좋아하는 모든 연령대';
        }
        
        return analysis;
    },
    
    // 제품명에서 표시명 추출
    extractDisplayName(productName) {
        // [인생]국물닭발800g -> 인생 국물닭발
        let displayName = productName;
        displayName = displayName.replace(/\[([^\]]+)\]/g, '$1 '); // [텍스트] -> 텍스트
        displayName = displayName.replace(/\d+g$/i, '').trim(); // 800g 제거
        return displayName;
    },
    
    // 무게 추출
    extractWeight(productName) {
        const weightMatch = productName.match(/(\d+)(g|kg|ml|l)/i);
        return weightMatch ? weightMatch[0] : '';
    },
    
    // 강화된 카테고리 감지
    detectCategoryEnhanced(productName) {
        const categories = {
            '닭발': { main: 'food', sub: 'chicken', keywords: ['매운', '국물', '안주'] },
            '닭근위': { main: 'food', sub: 'chicken', keywords: ['쫄깃', '통마늘', '안주', '술안주'] },
            '똥집': { main: 'food', sub: 'chicken', keywords: ['쫄깃', '통마늘', '안주', '술안주'] },
            '족발': { main: 'food', sub: 'pork', keywords: ['쫄깃', '콜라겐'] },
            '김치': { main: 'food', sub: 'kimchi', keywords: ['발효', '숙성', '국산'] },
            '소스': { main: 'food', sub: 'sauce', keywords: ['양념', '비법', '특제'] }
        };
        
        for (const [key, value] of Object.entries(categories)) {
            if (productName.includes(key)) {
                return value;
            }
        }
        
        return { main: 'food', sub: 'general', keywords: [] };
    },
    
    // 키워드 추출
    extractKeywords(productName) {
        const keywords = [];
        
        // 특별 키워드
        if (productName.includes('인생')) keywords.push('인생맛집');
        if (productName.includes('국물')) keywords.push('진한국물');
        if (productName.includes('매운')) keywords.push('매콤한');
        if (productName.includes('프리미엄')) keywords.push('프리미엄');
        if (productName.includes('닭근위') || productName.includes('똥집')) {
            keywords.push('쫄깃한식감', '술안주');
        }
        if (productName.includes('통마늘') || productName.includes('마늘')) {
            keywords.push('통마늘', '알싸한맛');
        }
        if (productName.includes('양념')) keywords.push('특제양념');
        
        return keywords;
    },
    
    // 스토리 섹션 제목 생성
    async generateStoryTitle(analysis) {
        // 제품에 맞는 적절한 제목 생성
        if (analysis.productName.includes('닭발')) {
            return '특별한 닭발 이야기';
        } else if (analysis.productName.includes('김치')) {
            return '정성 가득한 김치 이야기';
        } else if (analysis.productName.includes('소스')) {
            return '비법 소스의 비밀';
        }
        
        return `${analysis.displayName}의 특별함`;
    },
    
    // 완벽한 콘텐츠 생성
    async generatePerfectContent(command, analysis) {
        console.log('[완료] 콘텐츠 생성 중...');
        
        const content = {
            // 헤더 섹션
            brandLabel: `만원요리 최씨남매 X ${analysis.displayName} 단독 공구`,
            mainCopy: await this.generateMainCopy(analysis),
            
            // Why 섹션
            painPoints: await this.generatePainPoints(analysis),
            benefits: await this.generateBenefits(analysis),
            
            // Story 섹션 - 제품별 적합한 제목으로 변경
            storyTitle: await this.generateStoryTitle(analysis),
            heritageStory: await this.generateHeritageStory(analysis),
            
            // How 섹션
            usageGuide: await this.generateUsageGuide(analysis),
            
            // Trust 섹션
            trustContent: await this.generateTrustContent(analysis),
            features: await this.generateFeatures(analysis),
            
            // FAQ
            faq: await this.generateFAQ(analysis)
        };
        
        return content;
    },
    
    // 메인 카피 생성
    async generateMainCopy(analysis) {
        const templates = {
            '닭발': [
                '인생 최고의 ${product}을 만나보세요!',
                '${keyword} ${product}의 정석!',
                '이것이 진짜 ${product}다!'
            ]
        };
        
        let template = '최고의 ${product}를 만나보세요!';
        if (analysis.category.sub === 'chicken' && templates['닭발']) {
            template = templates['닭발'][0];
        }
        
        return template
            .replace('${product}', analysis.displayName)
            .replace('${keyword}', analysis.keywords[0] || '');
    },
    
    // 고민 포인트 생성
    async generatePainPoints(analysis) {
        if (analysis.category.sub === 'chicken' && analysis.productName.includes('닭발')) {
            return `
                <p>매운 닭발은 좋아하지만 <strong>국물이 아쉬우셨나요?</strong> 닭발 전문점 못지않은 <strong>진한 국물</strong>을 집에서도 즐기고 싶으셨나요?</p>
                <p>이제 그런 고민은 끝! <span class="highlight">국물까지 맛있는 프리미엄 닭발</span>로 집에서도 전문점 부럽지 않은 맛을 경험하세요.</p>
            `;
        }
        
        if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            return `
                <p>술집에서 먹던 <strong>쫄깃한 닭근위</strong>가 그리우셨나요? 집에서도 <strong>통마늘의 알싸한 맛</strong>과 함께 즐기고 싶으셨나요?</p>
                <p>이제 집에서도 <span class="highlight">술집 부럽지 않은 프리미엄 닭근위</span>를 즐겨보세요! 특제 양념에 통마늘까지, 완벽한 조합입니다.</p>
            `;
        }
        
        // 기본 템플릿
        return `
            <p>품질 좋은 ${analysis.displayName}을 찾기 어려우셨나요? 가격 때문에 망설이셨나요?</p>
            <p>이제 그런 고민은 끝! <span class="highlight">합리적인 가격</span>으로 최고의 품질을 경험하세요.</p>
        `;
    },
    
    // 혜택 생성
    async generateBenefits(analysis) {
        const benefits = [];
        
        if (analysis.productName.includes('닭발') && analysis.productName.includes('국물')) {
            benefits.push(
                '<strong>진한 국물</strong>이 일품인 특제 레시피',
                '적당한 매콤함으로 <strong>누구나 즐기는</strong> 맛',
                '국물에 <strong>라면사리</strong> 추가하면 2차 요리 완성',
                '<strong>' + analysis.weight + ' 대용량</strong>으로 온 가족이 함께',
                '<strong>HACCP 인증</strong> 시설에서 안전하게 제조'
            );
        } else if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            benefits.push(
                '<strong>쫄깃쫄깃</strong> 씹는 맛이 일품인 프리미엄 닭근위',
                '풍부한 <strong>통마늘</strong>로 알싸하고 깊은 맛',
                '<strong>특제 양념</strong>으로 감칠맛 극대화',
                '술안주는 물론 <strong>밥반찬</strong>으로도 완벽',
                '<strong>' + analysis.weight + '</strong> 넉넉한 양으로 푸짐하게',
                '<strong>HACCP 인증</strong> 시설에서 위생적으로 제조'
            );
        } else {
            // 기본 혜택
            benefits.push(
                '[완료] 뛰어난 가성비',
                '🏆 검증된 품질',
                '🚚 빠른 배송',
                '💯 만족도 보장',
                '🎁 합리적인 가격'
            );
        }
        
        return benefits;
    },
    
    // 헤리티지 스토리 생성
    async generateHeritageStory(analysis) {
        if (analysis.productName.includes('[인생]') && analysis.productName.includes('국물닭발')) {
            return `
                <p>안녕하세요! <strong>만원요리 최씨남매</strong>입니다. 오늘은 <strong>${analysis.productName}</strong>의 이야기를 들려드릴게요.</p>
                <p>저희가 직접 경험하고 선별한 제품 중에서도 <strong>"국물이 진짜다!"</strong>라는 평가를 받은 제품입니다. 특히 이 제품은 <strong>특제 양념</strong>으로 깊고 진한 맛을 자랑합니다.</p>
                <p>일반 닭발과 달리 <strong>국물까지 남김없이</strong> 즐길 수 있도록 개발된 특별한 레시피! 매운맛을 좋아하는 분들도, 적당한 맛을 원하는 분들도 모두 만족할 수 있는 <strong>매운맛 밸런스</strong>를 자랑합니다.</p>
                <p class="highlight">최씨남매 꿀팁: 남은 국물에 라면사리나 우동사리를 넣으면 2차 요리가 완성돼요!</p>
            `;
        }
        
        if (analysis.productName.includes('[인생]') && (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집'))) {
            return `
                <p>안녕하세요! <strong>만원요리 최씨남매</strong>입니다. 오늘은 정말 특별한 <strong>${analysis.productName}</strong>을 소개해드릴게요.</p>
                <p>술집에서 즐겨 먹던 그 쫄깃한 닭근위! 이제 집에서도 <strong>술집 못지않은 퀄리티</strong>로 즐기실 수 있습니다. 특히 이 제품의 매력은 바로 <strong>통마늘</strong>이에요. 양념과 함께 볶아낸 통마늘이 알싸한 맛을 더해주죠.</p>
                <p><strong>쫄깃쫄깃한 식감</strong>은 기본! 거기에 <strong>특제 양념</strong>으로 감칠맛까지 잡았습니다. 술안주로도 최고지만, 밥반찬으로도 정말 훌륭해요. 아이들도 좋아하는 맛이랍니다.</p>
                <p class="highlight">최씨남매 꿀팁: 양파와 대파를 추가하면 더욱 풍성한 맛을 즐기실 수 있어요!</p>
            `;
        }
        
        // AI 생성 폴백
        if (typeof API_CONFIG !== 'undefined' && typeof callAI === 'function') {
            const prompt = `${analysis.productName}에 대한 만원요리 최씨남매 스타일의 제품 스토리를 작성해주세요. 친근하고 따뜻한 톤으로 3-4문단으로 작성하고, 중요한 부분은 <strong> 태그로 강조해주세요.`;
            const result = await callAI(prompt, 'heritageStory');
            if (result) return result;
        }
        
        return `<p>${analysis.displayName}의 특별한 이야기를 들려드릴게요.</p>`;
    },
    
    // 사용법 가이드 생성
    async generateUsageGuide(analysis) {
        if (analysis.productName.includes('닭발')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200% 즐기는 방법!</p>
                <ol style="line-height: 2;">
                    <li>냄비에 제품을 넣고 <strong>중불에서 5-7분</strong> 데워주세요</li>
                    <li>김이 나기 시작하면 <strong>약불로 줄여</strong> 2-3분 더 끓여주세요</li>
                    <li>기호에 따라 <strong>대파, 양파</strong> 등을 추가하면 더욱 맛있어요</li>
                    <li>남은 국물에 <strong>라면사리</strong>를 넣어 2차 요리로 즐기세요</li>
                    <li>시원한 <strong>맥주나 소주</strong>와 함께하면 최고의 안주!</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong>조리 팁:</strong> 전자레인지 조리 시에는 전용 용기에 옮겨 담고, 랩을 씌운 후 구멍을 낸 뒤 3-4분 가열하세요!</p>
                </div>
            `;
        }
        
        if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            return `
                <p><strong>${analysis.displayName}</strong> 200% 즐기는 방법!</p>
                <ol style="line-height: 2;">
                    <li>팬에 기름을 두르고 <strong>중불</strong>에서 예열해주세요</li>
                    <li>제품을 넣고 <strong>3-4분</strong> 볶아주세요</li>
                    <li>기호에 따라 <strong>양파, 대파</strong>를 추가하면 더욱 풍성해요</li>
                    <li>마지막에 <strong>참기름</strong>을 살짝 둘러주면 고소함이 UP!</li>
                    <li>시원한 <strong>맥주</strong>와 함께하면 최고의 안주 완성!</li>
                </ol>
                <div style="background: var(--light-gray); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0;"><strong>조리 팁:</strong> 에어프라이어 사용 시 180도에서 10-12분, 중간에 한 번 뒤집어주세요!</p>
                </div>
            `;
        }
        
        return `<p>${analysis.displayName} 사용법을 안내해드릴게요.</p>`;
    },
    
    // 신뢰 콘텐츠 생성
    async generateTrustContent(analysis) {
        if (analysis.productName.includes('국물닭발')) {
            return `
                <p><span class="highlight">"정말 국물이 끝내줘요! 닭발 매니아인 저도 감탄했어요!"</span></p>
                <p>만원요리 최씨남매가 <strong>직접 선별하고 검증</strong>한 제품입니다. 특히 국물 맛에 중점을 두고 선별했는데, 이 제품의 <strong>진한 국물과 쫄깃한 닭발</strong>의 조화, 그리고 <strong>적당한 매운맛</strong>까지! 정말 자신있게 추천드립니다.</p>
            `;
        }
        
        if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            return `
                <p><span class="highlight">"이 쫄깃함, 이 통마늘의 알싸함! 술집에서 먹던 그 맛 그대로예요!"</span></p>
                <p>만원요리 최씨남매가 <strong>엄선한 프리미엄 닭근위</strong>입니다. 수많은 제품을 먹어보고 테스트한 결과, 이 제품의 <strong>쫄깃한 식감</strong>과 <strong>통마늘의 조화</strong>, 그리고 <strong>감칠맛 나는 양념</strong>까지! 정말 완벽합니다.</p>
            `;
        }
        
        return `<p>${analysis.displayName}을 자신있게 추천드립니다!</p>`;
    },
    
    // 특징 생성
    async generateFeatures(analysis) {
        if (analysis.productName.includes('닭발')) {
            return [
                '<strong>특제 양념</strong> 사용으로 깊은 맛',
                '<strong>진한 국물</strong>이 특징인 프리미엄 닭발',
                '<strong>HACCP 인증</strong> 시설에서 위생적으로 제조',
                '<strong>급속 냉동</strong>으로 신선함 그대로',
                '<strong>' + analysis.weight + ' 대용량</strong>으로 푸짐하게'
            ];
        }
        
        if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            return [
                '<strong>쫄깃쫄깃</strong>한 프리미엄 닭근위',
                '<strong>통마늘</strong>이 듬뿍 들어간 특제 양념',
                '<strong>HACCP 인증</strong> 시설에서 위생적으로 제조',
                '<strong>급속 냉동</strong>으로 신선함 유지',
                '<strong>' + analysis.weight + '</strong>의 넉넉한 양',
                '술안주와 밥반찬 <strong>겸용 가능</strong>'
            ];
        }
        
        return analysis.sellingPoints || ['뛰어난 품질', '합리적인 가격', '빠른 배송'];
    },
    
    // FAQ 생성
    async generateFAQ(analysis) {
        const faqs = [];
        
        if (analysis.productName.includes('국물닭발')) {
            faqs.push(
                {
                    question: '정말 국물이 진하고 맛있나요?',
                    answer: '네! 특제 양념을 사용해 일반 닭발과는 차원이 다른 깊은 국물맛을 자랑합니다. 국물까지 남김없이 드실 수 있어요.'
                },
                {
                    question: '매운 정도는 어느 정도인가요?',
                    answer: '신라면 정도의 적당한 매운맛입니다. 어린이는 조금 맵게 느낄 수 있지만, 대부분의 성인은 부담없이 즐기실 수 있는 정도예요.'
                },
                {
                    question: '보관은 어떻게 하나요?',
                    answer: '냉동보관 하시면 되며, 제조일로부터 12개월간 보관 가능합니다. 해동 후에는 바로 조리해서 드시는 것을 권장합니다.'
                },
                {
                    question: '양은 얼마나 되나요?',
                    answer: analysis.weight + '으로 성인 2-3인이 푸짐하게 먹을 수 있는 양입니다. 안주로 드실 경우 3-4인도 충분합니다.'
                }
            );
        } else if (analysis.productName.includes('닭근위') || analysis.productName.includes('똥집')) {
            faqs.push(
                {
                    question: '정말 쫄깃한 식감인가요?',
                    answer: '네! 신선한 닭근위를 엄선하여 쫄깃쫄깃한 식감이 살아있습니다. 술집에서 먹던 그 맛 그대로예요.'
                },
                {
                    question: '통마늘이 많이 들어있나요?',
                    answer: '네, 통마늘이 넉넉하게 들어있어 알싸한 맛과 향이 일품입니다. 마늘을 좋아하시는 분들께 특히 인기가 많아요.'
                },
                {
                    question: '조리가 어렵지 않나요?',
                    answer: '전혀 어렵지 않습니다! 팬에 3-4분만 볶아주시면 됩니다. 에어프라이어로도 간편하게 조리 가능해요.'
                },
                {
                    question: '양은 얼마나 되나요?',
                    answer: analysis.weight + '으로 성인 2인이 안주로 즐기기에 충분한 양입니다. 밥반찬으로는 3-4인분 정도예요.'
                },
                {
                    question: '냄새가 많이 나지 않나요?',
                    answer: 'HACCP 인증 시설에서 깨끗하게 처리하여 불쾌한 냄새가 거의 없습니다. 오히려 고소한 향이 나서 식욕을 자극해요.'
                }
            );
        } else {
            // 기본 FAQ
            faqs.push(
                {
                    question: '품질이 정말 좋은가요?',
                    answer: '네, 엄격한 품질 관리 기준을 통과한 제품만 판매합니다.'
                },
                {
                    question: '배송은 얼마나 걸리나요?',
                    answer: '주문 후 2-3일 내에 받아보실 수 있습니다.'
                }
            );
        }
        
        return faqs;
    },
    
    // 최종 HTML 생성
    generateFinalHTML(command, analysis, content) {
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${command.productName} - 만원요리 최씨남매</title>
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
            content: "[완료]";
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
                <h2>Why? 왜 이 ${analysis.displayName}이어야 할까요?</h2>
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
                <h2>How? 이렇게 활용하세요!</h2>
            </div>
            <div>
                ${content.usageGuide}
            </div>
        </div>
        
        <!-- 5. Trust Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>Trust! 믿을 수 있는 이유</h2>
            </div>
            <div class="trust-box">
                <h3>만원요리 최씨남매가 보증합니다</h3>
                ${content.trustContent}
            </div>
            
            <h3 style="margin-top: 32px;">제품의 특별한 특징</h3>
            <ul class="benefit-list">
                ${content.features.map(feature => `<li>${feature}</li>`).join('\n                ')}
            </ul>
            
            ${command.images.slice(1).map(img => `<img src="${img}" alt="상세 이미지" class="product-image">`).join('\n            ')}
        </div>
        
        <!-- 6. FAQ Section -->
        <div class="section">
            <div style="text-align: center;">
                <h2>자주 묻는 질문</h2>
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
            <h3 style="text-align: center; margin-bottom: 24px;">판매원 정보</h3>
            <table class="info-table">
                <tr>
                    <th>상호</th>
                    <td>㈜값진한끼</td>
                </tr>
                <tr>
                    <th>대표자</th>
                    <td>고혜숙</td>
                </tr>
                <tr>
                    <th>사업자등록번호</th>
                    <td>434-86-03863</td>
                </tr>
                <tr>
                    <th>통신판매업</th>
                    <td>2025-경기파주-2195호</td>
                </tr>
                <tr>
                    <th>주소</th>
                    <td>경기도 파주시 경의로 1246, 11층 1105-19호</td>
                </tr>
                <tr>
                    <th>전화</th>
                    <td>070-8835-2885</td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>we@manwonyori.com</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>`;
    },
    
    // 카페24 SEO 정보 생성
    generateCafe24SEO(productName, analysis, content) {
        const seoData = {
            // 상품명
            productName: productName,
            
            // 검색어 설정 (카페24 검색어)
            searchKeywords: [
                analysis.displayName,
                ...analysis.keywords,
                '만원요리',
                '최씨남매',
                '인생도매',
                '냉동식품',
                '간편조리'
            ].join(','),
            
            // 메타 태그 정보
            metaTitle: `${productName} | 만원요리 최씨남매`,
            metaDescription: `${analysis.displayName} - ${content.mainCopy} ${content.benefits[0].replace(/<[^>]*>/g, '')}`,
            metaKeywords: analysis.keywords.join(', '),
            
            // Open Graph 정보
            ogTitle: productName,
            ogDescription: content.mainCopy,
            ogType: 'product',
            
            // 상품 요약설명
            shortDescription: content.benefits.slice(0, 3).map(b => b.replace(/<[^>]*>/g, '')).join(' | '),
            
            // 상품 상세설명 (첫 단락)
            longDescription: content.heritageStory.replace(/<[^>]*>/g, '').split('.')[0] + '.',
            
            // 카테고리 정보
            category: this.getCafe24Category(analysis.category),
            
            // 추가 정보
            manufacturer: '인생도매',
            origin: '대한민국',
            
            // 태그
            tags: [
                '#만원요리',
                '#최씨남매',
                '#인생도매',
                `#${analysis.displayName.replace(/\s/g, '')}`,
                '#냉동식품',
                '#간편조리'
            ].join(' ')
        };
        
        return seoData;
    },
    
    // 카페24 카테고리 매핑
    getCafe24Category(category) {
        const categoryMap = {
            'chicken': '닭고기 > 닭발/닭근위',
            'pork': '돼지고기 > 족발/보쌈',
            'kimchi': '김치/반찬 > 김치',
            'sauce': '소스/양념 > 양념/소스',
            'general': '냉동식품 > 기타'
        };
        
        return categoryMap[category.sub] || categoryMap['general'];
    },
    
    // 메인 실행 함수
    async execute(input) {
        console.log('🚀 명령어 실행 시작...');
        
        // 1. 명령어 파싱
        const command = this.parseCommand(input);
        console.log('📝 파싱된 명령어:', command);
        
        // 2. 제품 분석
        const analysis = await this.analyzeProductEnhanced(command.productName, command.referenceUrl);
        console.log('🔍 분석 결과:', analysis);
        
        // 3. 콘텐츠 생성
        const content = await this.generatePerfectContent(command, analysis);
        console.log('[완료] 생성된 콘텐츠:', content);
        
        // 4. HTML 생성
        const html = this.generateFinalHTML(command, analysis, content);
        
        // 5. 카페24 SEO 정보 생성
        const seoData = this.generateCafe24SEO(command.productName, analysis, content);
        console.log('🔍 카페24 SEO 정보:', seoData);
        
        console.log('[성공] 상세페이지 생성 완료!');
        return { html, seoData };
    }
};

// 전역 노출
window.CommandSystem = CommandSystem;

console.log('[성공] 명령어 시스템 로드 완료');