// เก็บหน้าแอปไว้ในเครื่อง เพื่อให้เปิดเร็วและเปิดจากหน้าจอโฮมได้ ข้อมูลบัญชียังโหลดจาก Supabase ทุกครั้ง
const CACHE = 'card-shop-v1';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // ลองโหลดของใหม่จากเน็ตก่อน (อัปเดตทันทีที่อัปโหลดไฟล์ใหม่) ถ้าไม่มีเน็ตค่อยใช้ของที่เก็บไว้
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
  );
});
