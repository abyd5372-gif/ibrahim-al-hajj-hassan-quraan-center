// Service Worker بسيط لتفعيل ميزة "تثبيت كتطبيق" (PWA)
const CACHE_NAME = "hifz-app-cache-v1";
const APP_SHELL = [
  "./",
  "./index-1.html"
];

// عند التثبيت: نخزن الصفحة الرئيسية في الكاش
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // في حال فشل تخزين أحد الملفات (اختلاف الاسم) نتجاهل الخطأ
      });
    })
  );
});

// عند التفعيل: حذف أي كاش قديم من نسخة سابقة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// عند الطلب: نحاول الشبكة أولاً، وإن فشلت نرجع للكاش
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
