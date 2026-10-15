from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
site=root/'dist/web'
page=(site/'index.html').read_text()
for reference in re.findall(r'(?:src|href)="([^"#]+)"',page):
    if not reference.startswith(('http:','https:','data:')):
        assert (site/reference).is_file(), 'Arquivo ausente: '+reference
manifest=json.loads((site/'manifest.webmanifest').read_text())
assert manifest['start_url']=='./' and manifest['scope']=='./'
for icon in manifest['icons']:assert (site/icon['src']).is_file()
worker=(site/'service-worker.js').read_text()
urls=json.loads(re.search(r'const FILES=(\[.*?\]);',worker).group(1))
for url in urls:
    assert url=='./' or (site/url.removeprefix('./')).is_file(),url
assert "new URL('./',self.location.href)" in worker
assert 'skipWaiting' in worker
assert "url.searchParams.get('atualizar')==='mira-pausada'" in worker,'Só recarrega a aba que pediu atualização explícita.'
for file in site.rglob('*'):
    assert file.suffix not in {'.apk','.exe','.zip','.keystore','.jks','.p8','.p12'},file
assert not (site/'.git').exists()
for file in [*root.glob('*.js'),*root.glob('*.css')]:assert (site/file.name).read_bytes()==file.read_bytes()
print('PASS: exportação web completa, caminhos relativos, manifest, cache offline e exclusão de executáveis/chaves.')
