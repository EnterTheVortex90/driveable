const CACHE='driveable-v69';
const ASSETS=['./','./index.html','./driveable.css','./enhancements.css','./hazard-guide.css','./mock-options.css','./mock-engine.css','./mock-controls-override.css','./official-layout.css','./mock-responsive.css','./test-controls-fix.css','./test-active-nav.css','./theme-polish.css','./ux-fixes.css','./settings.css','./palette.css','./learning-tools.css','./questionbank.js','./original-question-expansion.js','./legacy-hazard-stubs.js','./driveable.js','./dashboard-library.js','./sign-catalogue-data.js','./sign-reference-viewer.js','./sign-catalogue.json','./how-it-works-detail.js','./practice-session.js','./practice-quit-fix.js','./enhancements.js','./answer-randomizer.js','./mock-engine.js','./page-persistence.js','./settings.js','./learning-tools.js','./accessibility-tools.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url),shell=url.origin===self.location.origin&&(/\.(?:html|js|css|json)$/.test(url.pathname)||event.request.mode==='navigate');
  if(shell){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)));return}
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response})));
});
