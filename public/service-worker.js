const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';

// const CACHE_NAME = 'BudgetTracker-v1';
const CACHE_NAME = APP_PREFIX + VERSION;

const DATA_CACHE = 'data-v1';
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/idb.js",
  "/js/index.js",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png"
];

// self referes to service worker object
// this instantiates run before the window object has been created
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// self.addEventListener('fetch', function (e) {
//   console.log('fetch request : ' + e.request.url)
//   e.respondWith(
//     caches.match(e.request).then(function (request) {
//       if (request) { // if cache is available, respond with cache
//         console.log('responding with cache : ' + e.request.url)
//         return request
//       } else {       // if there are no cache, try fetching request
//         console.log('file is not cached, fetching : ' + e.request.url)
//         return fetch(e.request)
//       }

//       // You can omit if/else for console.log & put one line below like this too.
//       // return request || fetch(e.request)
//     })
//   )
// });

self.addEventListener('fetch', function (e) {
  if (e.request.url.includes('/api')) {
    e.respondWith(
      caches.open(DATA_CACHE)
        .then(cache => {
          return fetch(e.request).then(response => {
            if (response.status === 200) {
              cache.put(e.request.url, response.clone())
            }
            return response
          })
          .catch(error => {
            return cache.match(e.request)
          })
        })
        
    )
  return 
  }
  e.respondWith(fetch(e.request).catch(() => {
    return caches.match(e.request).then((response) => {
      if(response) {
        return response;
      } else {
        return caches.match('/')
      }
    })
  }))

})


// self.addEventListener('activate', function(e) {
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       let cacheKeeplist = keyList.filter(function(key) {
//         return key.indexOf(APP_PREFIX);
//       });
//       cacheKeeplist.push(CACHE_NAME);

//       return Promise.all(
//         keyList.map(function(key, i) {
//           if (cacheKeeplist.indexOf(key) === -1) {
//             console.log('deleting cache : ' + keyList[i]);
//             return caches.delete(keyList[i]);
//           }
//         })
//       );
//     })
//   );
// });