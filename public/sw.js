self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(`STATIC_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/bundle.js`,
        `/img/*.*`,
        `/css/*.*`
      ]);
});
evt.waitUntil(openCache);
});

self.addEventListener(`activate`, () => {
  console.log(`sw activated`);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => response ? response : fetch(evt.request))
      .catch((err) => console.error({err}))
  );
});
