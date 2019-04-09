self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(`STATIC_V1.0`)
  .then((cache) => {
    return cache.addAll([
      `/`,
      `/index.html`
    ]);
  });
  evt.waitUntil(openCache);
});

self.addEventListener(`activate`, () => {
  window.console.log(`sw activated`);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(caches.match(evt.request)
  .then((response) => response ? response : fetch(evt.request))
  .catch((err) => window.console.error({err}))
  );
});
