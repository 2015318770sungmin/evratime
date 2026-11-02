// 선택 파일: index.html과 같은 폴더에 올리면 오프라인에서도 열립니다.
const CACHE = 'evt-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (!res.ok) return caches.match(e.request, { ignoreSearch: true }).then(r => r || res); // 서버 오류(404 등)면 저장본 사용
        const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
