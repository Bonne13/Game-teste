"""Empacota somente arquivos públicos do jogo em um iniciador Windows x64."""
from pathlib import Path
import os,shutil,subprocess,zipfile,hashlib,tempfile
root=Path(__file__).resolve().parents[1]
assets=root/'desktop/assets'
assets.mkdir(parents=True,exist_ok=True)
for file in assets.iterdir():
 if file.is_file():file.unlink()
for file in [root/'index.html',*root.glob('*.js'),*root.glob('*.css'),*root.glob('*.json')]:
 if file.name not in ['package.json','package-lock.json']:shutil.copy2(file,assets/file.name)
for directory in ['data','vendor']:
 if (root/directory).is_dir():shutil.copytree(root/directory,assets/directory,dirs_exist_ok=True)
go=os.environ.get('GO_BINARY') or shutil.which('go')
if Path('/tmp/star-go-sdk/go/bin/go').exists() and not os.environ.get('GO_BINARY'):go='/tmp/star-go-sdk/go/bin/go'
if not go:raise SystemExit('Instale Go 1.27.2 ou defina GO_BINARY.')
env={**os.environ,'GOTOOLCHAIN':'local','GOCACHE':str(Path(tempfile.gettempdir())/'proxima-go-cache')}
subprocess.run([go,'test','./...'],cwd=root/'desktop',env=env,check=True)
output=root/'dist';output.mkdir(exist_ok=True)
exe=output/'ProximaEstrela-Windows-x64.exe'
subprocess.run([go,'build','-trimpath','-ldflags=-s -w','-o',str(exe),'.'],cwd=root/'desktop',env={**env,'GOOS':'windows','GOARCH':'amd64','CGO_ENABLED':'0'},check=True)
readme='''PROXIMA ESTRELA - WINDOWS 10/11 DE 64 BITS

1. Extraia todos os arquivos do ZIP.
2. De dois cliques em ProximaEstrela-Windows-x64.exe.
3. No Windows com Microsoft Edge, o jogo abre em janela de aplicativo.
   Sem Edge, o iniciador usa seu navegador padrao.
4. Mantenha a janela do iniciador aberta enquanto joga.
5. Para encerrar, volte ao iniciador e pressione Enter.

Nao requer Python, Node.js, instalacao ou conexao com a internet.
Os arquivos do jogo estao incluidos no proprio executavel.
O progresso fica salvo neste navegador e computador. Nao use navegacao anonima
se quiser preservar a carreira. Uma partida em andamento nao e retomada ao fechar.

Versao de teste independente, sem afiliacao com clubes, ligas ou editoras.
'''
(output/'COMO-JOGAR.txt').write_text(readme,encoding='utf-8')
archive=output/'ProximaEstrela-Windows-x64.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 z.write(exe,exe.name);z.write(output/'COMO-JOGAR.txt','COMO-JOGAR.txt')
for file in [exe,archive]:print(file.name,file.stat().st_size,'bytes','SHA256',hashlib.sha256(file.read_bytes()).hexdigest())
