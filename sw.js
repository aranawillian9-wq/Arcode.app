const CACHE_NOME = 'estatisticas-v3.0';
const ARQUIVOS_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', evento => {
    evento.waitUntil(
        caches.open(CACHE_NOME).then(cache => {
            console.log("📦 Baixando nova versão...");
            return cache.addAll(ARQUIVOS_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', evento => {
    evento.waitUntil(
        caches.keys().then(chaves => {
            return Promise.all(
                chaves.filter(c => c !== CACHE_NOME).map(c => caches.delete(c))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', evento => {
    evento.respondWith(
        fetch(evento.request).then(r => {
            caches.open(CACHE_NOME).then(c => c.put(evento.request, r.clone()));
            return r;
        }).catch(() => caches.match(evento.request))
    );
});
