const CACHE = 'pagemood-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Lato:wght@300;400&family=Cinzel:wght@400;600&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache-first for same-origin, network-first for external
  if(e.request.url.startsWith(self.location.origin)){
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res=>{ const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); return res; }).catch(()=>caches.match('./index.html'))));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
