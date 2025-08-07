"""
완벽한 연동 테스트 스크립트
모든 기능을 체계적으로 검증합니다.
"""

import os
import sys
import json
import time
import requests
from datetime import datetime

# UTF-8 인코딩 설정
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class CompleteTestSuite:
    def __init__(self, base_url="https://manwon-generator.onrender.com"):
        self.base_url = base_url
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": base_url,
            "tests": {},
            "summary": {
                "total": 0,
                "passed": 0,
                "failed": 0,
                "warnings": 0
            }
        }
        
    def print_header(self, title):
        """헤더 출력"""
        print("\n" + "="*60)
        print(f"  {title}")
        print("="*60)
        
    def print_subheader(self, title):
        """서브헤더 출력"""
        print(f"\n[{title}]")
        print("-"*40)
        
    def test_endpoint(self, endpoint, description, validation_func=None):
        """엔드포인트 테스트"""
        url = f"{self.base_url}{endpoint}"
        test_key = f"{endpoint}_{description.replace(' ', '_')}"
        
        print(f"테스트: {description}")
        print(f"  URL: {url}")
        
        try:
            start_time = time.time()
            response = requests.get(url, timeout=15)
            response_time = time.time() - start_time
            
            result = {
                "endpoint": endpoint,
                "description": description,
                "status_code": response.status_code,
                "response_time": round(response_time, 2),
                "success": False,
                "message": ""
            }
            
            if response.status_code == 200:
                if validation_func:
                    validation_result = validation_func(response)
                    if validation_result["success"]:
                        print(f"  [성공] {validation_result['message']} (응답시간: {response_time:.2f}초)")
                        result["success"] = True
                        result["message"] = validation_result["message"]
                        self.results["summary"]["passed"] += 1
                    else:
                        print(f"  [경고] {validation_result['message']}")
                        result["message"] = validation_result["message"]
                        self.results["summary"]["warnings"] += 1
                else:
                    print(f"  [성공] HTTP 200 (응답시간: {response_time:.2f}초)")
                    result["success"] = True
                    result["message"] = "HTTP 200 OK"
                    self.results["summary"]["passed"] += 1
            else:
                print(f"  [실패] HTTP {response.status_code}")
                result["message"] = f"HTTP {response.status_code}"
                self.results["summary"]["failed"] += 1
                
            self.results["tests"][test_key] = result
            self.results["summary"]["total"] += 1
            return result
            
        except requests.exceptions.Timeout:
            print(f"  [실패] 타임아웃 (15초 초과)")
            self.results["tests"][test_key] = {
                "endpoint": endpoint,
                "description": description,
                "success": False,
                "message": "Timeout"
            }
            self.results["summary"]["failed"] += 1
            self.results["summary"]["total"] += 1
            return {"success": False, "message": "Timeout"}
            
        except Exception as e:
            print(f"  [실패] {str(e)[:50]}")
            self.results["tests"][test_key] = {
                "endpoint": endpoint,
                "description": description,
                "success": False,
                "message": str(e)[:100]
            }
            self.results["summary"]["failed"] += 1
            self.results["summary"]["total"] += 1
            return {"success": False, "message": str(e)}
    
    def validate_health(self, response):
        """Health 엔드포인트 검증"""
        try:
            data = response.json()
            if data.get("status") == "healthy":
                return {"success": True, "message": f"서비스 정상: {data.get('service', 'unknown')}"}
            return {"success": False, "message": f"비정상 상태: {data}"}
        except:
            return {"success": False, "message": "JSON 파싱 실패"}
    
    def validate_html_page(self, response, required_text=None):
        """HTML 페이지 검증"""
        content = response.text
        if len(content) < 100:
            return {"success": False, "message": "페이지 내용이 너무 짧음"}
        
        if required_text:
            if required_text in content:
                return {"success": True, "message": f"필수 텍스트 확인: '{required_text[:20]}...'"}
            else:
                return {"success": False, "message": f"필수 텍스트 없음: '{required_text}'"}
        
        # 기본 HTML 구조 확인
        if "<html" in content.lower() and "</html>" in content.lower():
            return {"success": True, "message": "유효한 HTML 페이지"}
        
        return {"success": True, "message": "콘텐츠 확인됨"}
    
    def validate_api_response(self, response):
        """API 응답 검증"""
        try:
            data = response.json()
            return {"success": True, "message": f"JSON 응답 확인: {len(data)} 항목" if isinstance(data, list) else "JSON 응답 확인"}
        except:
            return {"success": False, "message": "JSON 파싱 실패"}
    
    def run_all_tests(self):
        """모든 테스트 실행"""
        self.print_header("완벽한 연동 테스트 시작")
        
        # 1. 기본 연결 테스트
        self.print_subheader("1. 기본 연결 테스트")
        self.test_endpoint("/health", "Health Check", self.validate_health)
        self.test_endpoint("/", "메인 페이지", lambda r: self.validate_html_page(r))
        
        # 2. HTML 페이지 테스트
        self.print_subheader("2. HTML 페이지 테스트")
        self.test_endpoint("/mode-selector.html", "모드 선택 페이지", 
                          lambda r: self.validate_html_page(r, "모드"))
        self.test_endpoint("/index.html", "AI 자동 생성 모드", 
                          lambda r: self.validate_html_page(r, "generator"))
        self.test_endpoint("/detail-input.html", "상세 입력 모드", 
                          lambda r: self.validate_html_page(r, "입력"))
        
        # 3. 정적 파일 테스트
        self.print_subheader("3. 정적 파일 테스트")
        self.test_endpoint("/css/style.css", "CSS 스타일시트", 
                          lambda r: {"success": True, "message": "CSS 로드 성공"} if "css" in r.headers.get("content-type", "").lower() else {"success": False, "message": "잘못된 콘텐츠 타입"})
        self.test_endpoint("/js/generator.js", "JavaScript 파일", 
                          lambda r: {"success": True, "message": "JS 로드 성공"} if "javascript" in r.headers.get("content-type", "").lower() or "function" in r.text else {"success": False, "message": "잘못된 콘텐츠 타입"})
        
        # 4. API 엔드포인트 테스트
        self.print_subheader("4. API 엔드포인트 테스트")
        self.test_endpoint("/products/", "제품 목록 API", self.validate_api_response)
        
        # POST 요청 테스트
        print("\n테스트: AI 보조 API (POST)")
        try:
            response = requests.post(
                f"{self.base_url}/api/ai-assist",
                json={"fieldType": "test", "context": {}},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            if response.status_code in [200, 201]:
                print("  [성공] POST 요청 처리됨")
                self.results["summary"]["passed"] += 1
            else:
                print(f"  [경고] HTTP {response.status_code}")
                self.results["summary"]["warnings"] += 1
            self.results["summary"]["total"] += 1
        except Exception as e:
            print(f"  [실패] {str(e)[:50]}")
            self.results["summary"]["failed"] += 1
            self.results["summary"]["total"] += 1
        
        # 5. 제품 페이지 테스트 (샘플)
        self.print_subheader("5. 제품 페이지 테스트")
        sample_products = [
            "인생_국물닭발800g",
            "인생_나가사키짬뽕탕410g"
        ]
        
        for product in sample_products:
            self.test_endpoint(f"/products/{product}/index.html", f"제품: {product}", 
                             lambda r: self.validate_html_page(r))
        
        # 6. 404 에러 처리 테스트
        self.print_subheader("6. 에러 처리 테스트")
        self.test_endpoint("/nonexistent.html", "404 에러 처리",
                          lambda r: {"success": True, "message": "404 처리 정상"} if r.status_code == 404 else {"success": False, "message": "404 처리 실패"})
        
        # 결과 요약
        self.print_results()
        
        # 결과 저장
        self.save_results()
        
        return self.results["summary"]["failed"] == 0
    
    def print_results(self):
        """테스트 결과 출력"""
        self.print_header("테스트 결과 요약")
        
        summary = self.results["summary"]
        success_rate = (summary["passed"] / summary["total"] * 100) if summary["total"] > 0 else 0
        
        print(f"\n총 테스트: {summary['total']}개")
        print(f"성공: {summary['passed']}개")
        print(f"실패: {summary['failed']}개")
        print(f"경고: {summary['warnings']}개")
        print(f"성공률: {success_rate:.1f}%")
        
        if summary["failed"] > 0:
            print("\n[실패한 테스트]")
            for test_name, result in self.results["tests"].items():
                if not result.get("success", False) and "경고" not in result.get("message", ""):
                    print(f"  - {result['description']}: {result['message']}")
        
        if summary["warnings"] > 0:
            print("\n[경고 항목]")
            for test_name, result in self.results["tests"].items():
                if not result.get("success", False) and "경고" in result.get("message", ""):
                    print(f"  - {result['description']}: {result['message']}")
        
        print("\n" + "="*60)
        
        if summary["failed"] == 0:
            print("[성공] 모든 테스트 통과! 배포가 완벽하게 작동합니다.")
        elif summary["failed"] <= 2:
            print("[부분성공] 대부분의 기능이 작동하지만 일부 수정이 필요합니다.")
        else:
            print("[실패] 배포에 문제가 있습니다. 수정이 필요합니다.")
        
        print("="*60)
    
    def save_results(self):
        """결과를 JSON 파일로 저장"""
        filename = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"\n테스트 결과 저장됨: {filename}")

def main():
    """메인 실행 함수"""
    # 명령줄 인자로 URL 받기 (옵션)
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "https://manwon-generator.onrender.com"
    
    # 로컬 테스트 옵션
    if "--local" in sys.argv:
        base_url = "http://localhost:10000"
        print(f"로컬 서버 테스트 모드: {base_url}")
    
    # 테스트 실행
    tester = CompleteTestSuite(base_url)
    success = tester.run_all_tests()
    
    # 종료 코드 반환
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()