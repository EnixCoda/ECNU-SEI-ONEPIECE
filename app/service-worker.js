const version = '6f94a41eab01fd1088be00a58cbe5849' // @ version declaration

// we are using localStorage for the first 3 ones
const essentialAssetKeys = [
  // '/assets/app.css',
  // '/assets/app.js',
  // '/assets/vendor.js',
  '/manifest.json',
  '/assets/MaterialIcons.woff',
]

// when fetching cachePaths, always return from cache
// but the cache would be updated everytime app is launched
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
  const path = e.request.url.replace(/https?:\/\/.*?\/(#\/)?/, '/')
  if (essentialAssetKeys.includes(path)) {
    console.log('caught fetching essential asset', e.request.url)
    e.respondWith(
      caches
        .match(e.request)
        .then((response) => {
          return response
        })
    )
  } else if (cachePaths.includes(path)) {
    console.log('caught fetching cachePaths', e.request.url)
    e.respondWith(
      caches
        .match(e.request)
        .then((response) => {
          return response
        })
    )
  } else {
    console.log('caught fetching', e.request.url)
  }
})
