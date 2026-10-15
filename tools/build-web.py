"""Export only public game assets for HTTPS hosting, including offline installation."""
from pathlib import Path
import hashlib, json, shutil
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist/web'

def build():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)
    for source in [ROOT / 'index.html', *ROOT.glob('*.js'), *ROOT.glob('*.css')]:
        shutil.copy2(source, OUTPUT / source.name)
    for directory in ['vendor', 'data']:
        shutil.copytree(ROOT / directory, OUTPUT / directory)
    for source in (ROOT / 'web').iterdir():
        if source.is_dir():
            shutil.copytree(source, OUTPUT / source.name)
        else:
            shutil.copy2(source, OUTPUT / source.name)
    page = (OUTPUT / 'index.html').read_text()
    page = page.replace('</head>', '<meta name="theme-color" content="#101a19">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n</head>')
    page = page.replace('</body>', '<p class="sub" id="webAvailability" role="status" style="text-align:center;padding:0 16px 18px">Controles v0.7.0 · Arraste no campo para mirar e definir a força. Sua carreira fica neste navegador.</p><script src="web-app.js"></script></body>')
    (OUTPUT / 'index.html').write_text(page)
    (OUTPUT / '.nojekyll').touch()
    files = sorted(p for p in OUTPUT.rglob('*') if p.is_file())
    digest = hashlib.sha256()
    for file in files:
        digest.update(file.relative_to(OUTPUT).as_posix().encode())
        digest.update(file.read_bytes())
    version = digest.hexdigest()[:16]
    urls = ['./'] + ['./' + p.relative_to(OUTPUT).as_posix() for p in files]
    worker = ''''use strict';
const CACHE='proxima-web-VERSION';
const FILES=URLS;
const BASE=new URL('./',self.location.href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(FILES);await self.skipWaiting();})));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith('proxima-web-')&&name!==CACHE)await caches.delete(name);
 await self.clients.claim();
 for(const client of await self.clients.matchAll({type:'window'})){
  const url=new URL(client.url);
  if(url.origin===BASE.origin&&url.pathname.startsWith(BASE.pathname)&&url.searchParams.get('atualizar')==='mira-pausada'){
   // Start navigation without awaiting it: its fetch can run after activation completes.
   url.searchParams.delete('atualizar');url.searchParams.set('versao','VERSION');client.navigate(url.href).catch(()=>{});
  }
 }
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  if(event.request.mode==='navigate')return await cache.match(new URL('index.html',BASE).href)||fetch(event.request);
  return fetch(event.request);
 })());
});
'''.replace('VERSION',version).replace('URLS',json.dumps(urls,ensure_ascii=True))
    (OUTPUT / 'service-worker.js').write_text(worker)
    print('Exportação web:',len(files),'arquivos; versão',version,';',sum(f.stat().st_size for f in OUTPUT.rglob('*') if f.is_file()),'bytes')
    return OUTPUT

if __name__ == '__main__':
    build()
