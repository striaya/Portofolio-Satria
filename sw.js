// Service worker: bikin website bisa dibuka saat sinyal jelek atau offline.
// Strategi:
//  - File website sendiri: ambil dari jaringan dulu (selalu versi terbaru). Kalau jaringan lambat
//    (lebih dari NET_TIMEOUT) atau mati, pakai versi simpanan.
//  - Library dari CDN (Three.js, Font Awesome, Google Fonts): simpan dan pakai dari simpanan.
//  - Lagu (mp3 dll.), GitHub API, dan form: tidak disimpan, langsung ke jaringan.
const VERSION = 'v1'; // naikkan (v2, v3, ...) kalau mau memaksa semua pengunjung memuat ulang simpanannya
const CACHE = 'ksatriyau-' + VERSION;
const CDN_CACHE = 'ksatriyau-cdn-' + VERSION;
const NET_TIMEOUT = 4000; // ms

const CDN_HOSTS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

// file yang disimpan saat pertama kali dibuka. Kalau ada yang tidak ada di folder-mu, dilewati saja.
const PRECACHE = [
  './',
  'index.html',
  'style.css',
  'manifest.json',
  'songs.js',
  'main.js',
  'visualizer.js',
  'ticker.js',
  'highscore.js',
  'github-stats.js',
  'chatbot.js',
  'hero3d.js',
  'tilt.js',
  'pwa.js',
  'icon.png',
  'icon-192.png',
  'icon-512.png',
  'Me.jpeg',
  'ducati.png',
  'parkir.png',
  'backendabsensi.PNG',
  'figma.png',
  'nasipecel.png',
];

const CDN_PRECACHE = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    (async function () {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(function (u) {
          return cache.add(new Request(u, { cache: 'reload' })).catch(function () {});
        })
      );

      const cdn = await caches.open(CDN_CACHE);
      await Promise.all(
        CDN_PRECACHE.map(async function (u) {
          try {
            const res = await fetch(new Request(u, { mode: 'no-cors' }));
            await cdn.put(u, res);
          } catch (e) {}
        })
      );

      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      const keep = [CACHE, CDN_CACHE];
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(function (n) {
            return n.indexOf('ksatriyau-') === 0 && keep.indexOf(n) === -1;
          })
          .map(function (n) {
            return caches.delete(n);
          })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return; // permintaan potongan audio/video: biarkan ke jaringan

  const url = new URL(req.url);
  if (/\.(mp3|ogg|wav|m4a)$/i.test(url.pathname)) return; // lagu tidak disimpan (ukurannya besar)

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event));
    return;
  }

  if (CDN_HOSTS.indexOf(url.hostname) > -1) {
    event.respondWith(cacheFirst(req));
    return;
  }
  // selain itu (GitHub API, formspree, dll.) langsung ke jaringan
});

async function networkFirst(event) {
  const req = event.request;
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req, { ignoreSearch: true });

  const net = fetch(req).then(function (res) {
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  });
  net.catch(function () {});
  event.waitUntil(net.catch(function () {})); // biarkan pembaruan simpanan selesai di latar belakang

  if (!cached) {
    try {
      return await net;
    } catch (e) {
      if (req.mode === 'navigate') {
        const page = (await cache.match('index.html')) || (await cache.match('./'));
        if (page) return page;
      }
      return new Response('Sedang offline.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  // ada simpanan: tunggu jaringan sebentar saja, kalau lambat pakai simpanan
  try {
    return await Promise.race([
      net,
      new Promise(function (_, reject) {
        setTimeout(reject, NET_TIMEOUT);
      }),
    ]);
  } catch (e) {
    return cached;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CDN_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}