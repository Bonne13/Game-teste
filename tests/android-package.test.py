"""Verify that the installable Android APK contains the current offline game."""
from pathlib import Path
import sys, zipfile
root = Path(__file__).resolve().parents[1]
apk = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'dist/ProximaEstrela-Android-teste.apk'
with zipfile.ZipFile(apk) as archive:
    assert archive.testzip() is None, 'APK corrompido'
    names = archive.namelist()
    for required in ['AndroidManifest.xml', 'classes.dex', 'resources.arsc']:
        assert required in names, required
    files = [root / 'index.html', *root.glob('*.js'), *root.glob('*.css')]
    for folder in ['vendor', 'data']:
        files.extend(file for file in (root / folder).rglob('*') if file.is_file())
    for file in files:
        relative = file.relative_to(root).as_posix()
        assert archive.read('assets/game/' + relative) == file.read_bytes(), 'Asset ausente ou desatualizado: ' + relative
    assert not any(Path(name).suffix in {'.keystore', '.jks', '.p12', '.p8'} for name in names)
    assert not any(name.startswith('assets/game/.') or '/.git/' in name for name in names)
print('PASS: APK íntegro, recursos Android, jogo offline atual completo e nenhuma chave privada incluída.')
