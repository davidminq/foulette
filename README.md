Foodie Roulette (Foulette)

소개

“Foodie Roulette”는 점심 메뉴 선택의 어려움을 해결해주는 웹 기반 룰렛 애플리케이션입니다. 사용자가 원하는 음식 메뉴를 추가하고, 룰렛을 돌려 무작위로 메뉴를 선택할 수 있습니다.

- **간편한 메뉴 추가**: 입력 창에 음식 이름을 입력하고 Enter 또는 추가 버튼 클릭  
- **랜덤 룰렛 회전**: GSAP 애니메이션으로 부드럽고 화려한 룰렛 효과  
- **반투명 무지개 색 파이 조각**: 각 조각이 반투명으로 겹치며 시각적 재미 제공  
- **PWA 지원**: 오프라인 캐시, 홈 화면 추가, 앱처럼 사용 가능  
- **서비스 워커**: SW.js 기반 캐싱으로 빠른 로딩  
- **Open Graph**: 공유 시 풍부한 미리보기 제공  
⸻

데모

라이브 페이지: https://davidminq.github.io/foodie/

⸻

설치 & 실행


	1.	레포지토리 클론

git clone https://github.com/davidminq/foodie.git
cd foodie


	2.	로컬 서버 실행

# Python SimpleHTTPServer 예시
python3 -m http.server 8000


	3.	브라우저에서 http://localhost:8000/index.html 열기

⸻

## 📁 주요 파일 구조

foodie/
├─ index.html              # 메인 HTML 파일
├─ manifest.json           # PWA 웹 앱 매니페스트
├─ sw.js                   # 서비스 워커 스크립트
├─ app.icon/               # 앱 아이콘 폴더
│  ├─ app_icon1.png        # 192×192 마스커블 아이콘
│  └─ app_icon2.png        # 512×512 마스커블 아이콘
├─ opengraph/              # OG 이미지 폴더
│  └─ opengraph_img.png
└─ README.md               # 프로젝트 설명 (이 파일)

---

## 🛠️ 사용 기술

- **HTML5 & CSS3**  
- **JavaScript ES6**  
- **GSAP 애니메이션**  
- **Canvas Confetti**  
- **PWA**: Web App Manifest, Service Worker  

---

## ✨ 기능 설명

1. `drawWheel()`: Canvas API로 파이 조각 및 텍스트 렌더링  
2. **Spin**: GSAP으로 회전 애니메이션, 종속적 증가(+=) 방식으로 반복 동작 보장  
3. **Confetti**: 선택 시 다중 폭죽 연출  
4. **메뉴 관리**: LocalStorage에 메뉴 배열과 버전 정보 저장, 동적 추가 및 클릭 제거  
5. **Reset**: 메뉴와 버전을 초기화  
6. **Responsiveness**: 모바일 대응 뷰포트 및 CSS 미디어 쿼리  

---

## 📲 PWA 활용 가이드

1. 브라우저에서 **“홈 화면에 추가”**  
2. 오프라인 상태에서도 실행 가능  
3. 최신 SW 캐시 사용:  - 캐시 버전 변경 시 `sw.js`의 `CACHE_NAME` 업데이트 필요

⸻

컨트리뷰션

Pull Request 및 Issue는 언제나 환영입니다. 포크 → 브랜치 생성 → PR 템플릿 작성 후 제출해주세요.

⸻

License

MIT © 2025 David Minkyu
