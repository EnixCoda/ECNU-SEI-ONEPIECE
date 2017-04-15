var version = '9ea1ae01a3ff998a3a3308f20fefa253' // @ version declaration

var extractVersion = function(key) {
  return key.substr(key.lastIndexOf('-v-') + '-v-'.length)
}

// we are using localStorage for the first 3 ones
var essentialAssets = [
  // '/assets/app.css',
  // '/assets/app.js',
  // '/assets/vendor.js',
  '/manifest.json',
  '/assets/MaterialIcons.woff',
]

// when fetching cachePaths, always return from cache
// but the cache would be updated everytime app is launched
var cachePaths = [
  '/',
  '/index',
]

var getCacheName = function(name) {
  return name + '-v-' + version
}

self.addEventListener('install', function(e) {
  console.log('[Service Worker] INSTALL')
  e.waitUntil(
    caches.open(getCacheName('onepiece'))
      .then(function(cache) {
        Promise.all([
          cache.addAll(cachePaths),
          cache.addAll(essentialAssets)
        ]).then(function() {
          self.skipWaiting()
        })
      })
  )
})

self.addEventListener('activate', function(e) {
  console.log('[Service Worker] ACTIVATE')
  caches.keys().then(function(cacheKeys) {
    return Promise.all(cacheKeys.map(function(key) {
      if (extractVersion(key) !== version) {
        console.log('[ServiceWorker] Removing old cache', key)
        return caches.delete(key)
      }
    }))
  })
})

self.addEventListener('fetch', function(e) {
  var path = e.request.url.replace(/https?:\/\/.*?\/(#\/)?/, '/')
  if (essentialAssets.indexOf(path) > -1) {
    console.log('caught fetching essential asset', e.request.url)
    e.respondWith(
      caches
        .match(e.request)
        .then(function(response) {
          return response
        })
    )
  } else if (cachePaths.indexOf(path) > -1) {
    console.log('caught fetching cachePaths', e.request.url)
    e.respondWith(
      caches
        .match(e.request)
        .then(function(response) {
          return response
        })
    )
  } else {
    console.log('caught fetching', e.request.url)
  }
})
