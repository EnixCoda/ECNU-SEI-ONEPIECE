// we are using localStorage for the first 3 ones
const essentialAssetKeys = [
  // '/assets/app.css',
  // '/assets/app.js',
  // '/assets/vendor.js',
  // '/manifest.json',
  '/assets/MaterialIcons.woff',
]

// when fetching cachePaths, always return from cache
// but the cache would be updated every time app launches
const cachePaths = []

// const getCacheName = name => name + '-v-' + version
const extractVersion = key => key.split('-v-').pop()

self.addEventListener('install', e => {
  console.log('[Service Worker] INSTALL')
  e.waitUntil(
    caches.open('onepiece').then(cache => {
      Promise.all([cache.addAll(cachePaths), cache.addAll(essentialAssetKeys)]).then(() => {
        self.skipWaiting()
      })
    })
  )
})

self.addEventListener('activate', e => {
  console.log('[Service Worker] ACTIVATE')
  // caches.keys().then(cacheKeys => {
  //   return Promise.all(
  //     cacheKeys.map(key => {
  //       if (extractVersion(key) !== version) {
  //         console.log('[ServiceWorker] Removing old cache', key)
  //         return caches.delete(key)
  //       }
  //     })
  //   )
  // })
})

self.addEventListener('fetch', e => {
  const r = /(https?:\/\/[^/]+)(\/(.*))?/
  const req = e.request
  const [host, path] = req.url.match(r) || []
  if (host === self.origin) {
    if (essentialAssetKeys.includes(path)) {
      console.log('caught fetching essential asset', req.url)
      e.respondWith(caches.match(req))
    } else if (cachePaths.includes(path)) {
      console.log('caught fetching cachePaths', req.url)
      e.respondWith(caches.match(req))
    } else {
      console.log('caught fetching', req.url)
    }
  }
})
