const CACHE_NAME = 'luminari-web-shell-v1';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icons.svg'];
const STATIC_ASSET_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.ico',
  '.js',
  '.png',
  '.svg',
  '.webmanifest',
  '.webp',
  '.woff',
  '.woff2',
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (shouldBypassRequest(event.request)) {
    return;
  }

  event.respondWith(fetchStaticAsset(event.request));
});

async function fetchStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.mode === 'navigate') {
      const cachedShell = await cache.match('/');
      if (cachedShell) {
        return cachedShell;
      }
    }

    throw error;
  }
}

function shouldBypassRequest(request) {
  if (request.method !== 'GET') {
    return true;
  }

  if ((request.headers.get('upgrade') || '').toLowerCase() === 'websocket') {
    return true;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return true;
  }

  if (isApiRoute(url.pathname) || isWebSocketRoute(url.pathname)) {
    return true;
  }

  return !isStaticShellPath(url.pathname);
}

function isCacheableResponse(response) {
  return response.ok && response.type === 'basic';
}

function isApiRoute(pathname) {
  return pathname === '/api' || pathname.startsWith('/api/');
}

function isWebSocketRoute(pathname) {
  return pathname === '/ws' || pathname.startsWith('/ws/');
}

function isStaticShellPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return true;
  }

  if (pathname.startsWith('/assets/')) {
    return Boolean(getStaticExtension(pathname));
  }

  return STATIC_ASSET_EXTENSIONS.has(getStaticExtension(pathname));
}

function getStaticExtension(pathname) {
  const extensionStart = pathname.lastIndexOf('.');
  return extensionStart >= 0 ? pathname.slice(extensionStart).toLowerCase() : '';
}
