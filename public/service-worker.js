let sessionTokenPromises = {};

self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
    var regexp = /https:\/\/((cdn)|(embed))\.api\.video\/[^\/]+\/([A-Za-z0-9]+)[\?\/](token[=\/]([a-z0-9-]+))?.*/;
    let result = event.request.url.match(regexp);

    if (!result || !result[6]) {
        return;
    }

    const token = result[6];

    if (!sessionTokenPromises[token]) {
        sessionTokenPromises[token] = new Promise(function (resolve, reject) {
            event.respondWith(fetch(event.request.url)
                .then(function (res) {
                    resolve(res.headers.get("x-token-session"));
                    return res;
                }));
        });
        return;
    }

    event.respondWith(sessionTokenPromises[token]
        .then(function (sessionToken) {
            return fetch(event.request.url, {
                headers: {
                    ...event.request.headers,
                    "x-token-session": sessionToken,
                }
            });
        }));
});
