const version = '2b059e7f58e6778ec6d385a28d16c966' // @ version declaration

// we are using localStorage for the first 3 ones
const essentialAssetKeys = [
  // '/assets/app.css',
  // '/assets/app.js',
  // '/assets/vendor.js',
  '/manifest.json',
  '/assets/MaterialIcons.woff',
]

// when fetching cachePaths, always return from cache
// but the cache would be updated every time app is launched
const cachePaths = [
  '/',
  // '/index',
]

const getCacheName = (name) => {
  return name + '-v-' + version
}

const extractVersion = (key) => {
  return key.split('-v-').pop()
}

self.addEventListener('install', (e) => {
  console.log('[Service Worker] INSTALL')
  e.waitUntil(
    caches.open(getCacheName('onepiece'))
      .then((cache) => {
        Promise.all([
          cache.addAll(cachePaths),
          cache.addAll(essentialAssetKeys)
        ]).then(() => {
          self.skipWaiting()
        })
      })
  )
})

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] ACTIVATE')
  caches.keys().then((cacheKeys) => {
    return Promise.all(cacheKeys.map((key) => {
      if (extractVersion(key) !== version) {
        console.log('[ServiceWorker] Removing old cache', key)
        return caches.delete(key)
      }
    }))
  })
})

self.addEventListener('fetch', (e) => {
  const r = /(https?:\/\/[^/]+)(\/(.*))?/
  const [host, path] = e.request.url.match(r) || []
  if (host === self.origin) {
    if (essentialAssetKeys.includes(path)) {
      console.log('caught fetching essential asset', e.request.url)
      e.respondWith(
        caches
          .match(e.request)
      )
    } else if (cachePaths.includes(path)) {
      console.log('caught fetching cachePaths', e.request.url)
      e.respondWith(
        caches
          .match(e.request)
      )
    } else {
      console.log('caught fetching', e.request.url)
    }
  }
})
