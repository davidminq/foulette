const CACHE_NAME = 'foodie-roulette-v1';
const URLS_TO_CACHE = [
  '/',                  // 루트 페이지
  '/index.html',
  '/manifest.json',
  '/app.icon/app_icon1.png',
  '/app.icon/app_icon2.png',
  '/opengraph/opengraph_img.png',
  // CSS, JS, 폰트, 라이브러리 등 필요한 파일들
  '/styles.css',
  '/bundle.js'
];

// 설치 단계: 지정한 리소스를 캐시에 담고, 즉시 활성화 대기열 건너뛰기
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 활성화 단계: 이전 버전 캐시 정리하고, 클라이언트 제어 바로 가져오기
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 네트워크 요청 가로채기: 캐시 우선, 아니면 네트워크로
self.addEventListener('fetch', event => {
  // API 요청 등 특별 처리하고 싶으면 여기서 분기
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => {
        // 오프라인일 때 보여줄 폴백 페이지나 이미지가 있다면 반환
        // return caches.match('/offline.html');
      })
  );
});