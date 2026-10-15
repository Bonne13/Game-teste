"""Build an offline, locally signed Android test APK (not a Play Store release)."""
from pathlib import Path
import hashlib, os, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / 'android'
CACHE = Path('/workspace/.cache/proxima-android')

def stage_assets():
    destination = PROJECT / 'app/src/main/assets/game'
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    for file in [ROOT / 'index.html', *ROOT.glob('*.js'), *ROOT.glob('*.css')]:
        shutil.copy2(file, destination / file.name)
    for directory in ['vendor', 'data']:
        shutil.copytree(ROOT / directory, destination / directory)
    return destination

def build():
    stage_assets()
    sdk = Path(os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT') or CACHE / 'sdk')
    if not (sdk / 'platforms/android-35/android.jar').exists():
        raise SystemExit('Instale Android SDK Platform 35 e Build Tools 35.0.0; defina ANDROID_HOME para a pasta do SDK.')
    local_cache = CACHE if CACHE.exists() else PROJECT / '.tool-cache'
    env = {**os.environ, 'ANDROID_HOME': str(sdk),
           'ANDROID_USER_HOME': str(local_cache / 'android-user'),
           'GRADLE_USER_HOME': os.environ.get('GRADLE_USER_HOME', str(local_cache / 'gradle-cache'))}
    jdk = CACHE / 'jdk-21.0.8+9'
    if jdk.exists() and not os.environ.get('JAVA_HOME'):
        env['JAVA_HOME'] = str(jdk)
        env['PATH'] = str(jdk / 'bin') + os.pathsep + env.get('PATH', '')
    Path(env['ANDROID_USER_HOME']).mkdir(parents=True, exist_ok=True)
    signing = PROJECT / '.signing/test.keystore'
    signing.parent.mkdir(exist_ok=True)
    if not signing.exists():
        # This is a local DEVELOPMENT key; never use it for Play Store publication.
        subprocess.run(['keytool', '-genkeypair', '-keystore', str(signing), '-storepass', 'android',
                        '-alias', 'androiddebugkey', '-keypass', 'android', '-keyalg', 'RSA',
                        '-keysize', '2048', '-validity', '10000', '-dname',
                        'CN=Proxima Estrela Teste,OU=Development,O=Proxima Estrela,C=BR'], check=True)
    preferred = CACHE / 'gradle-8.14.3/bin/gradle'
    gradle = os.environ.get('GRADLE_BINARY') or (str(preferred) if preferred.exists() else str(PROJECT / ('gradlew.bat' if os.name == 'nt' else 'gradlew')))
    command = [gradle, '--no-daemon', '--console', 'plain', '-Duser.home=' + env['ANDROID_USER_HOME'], 'assembleDebug', 'lintDebug']
    subprocess.run(command, cwd=PROJECT, env=env, check=True)
    output = ROOT / 'dist'
    output.mkdir(exist_ok=True)
    apk = output / 'ProximaEstrela-Android-teste.apk'
    shutil.copy2(PROJECT / 'app/build/outputs/apk/debug/app-debug.apk', apk)
    signer = sdk / 'build-tools/35.0.0' / ('apksigner.bat' if os.name == 'nt' else 'apksigner')
    subprocess.run([str(signer), 'verify', '--verbose', '--print-certs', str(apk)], check=True, env=env)
    checksum = hashlib.sha256(apk.read_bytes()).hexdigest()
    (output / (apk.name + '.sha256')).write_text(checksum + '  ' + apk.name + '\n')
    print(apk.name, apk.stat().st_size, 'bytes; SHA256', checksum)

if __name__ == '__main__':
    if '--assets-only' in sys.argv:
        print(stage_assets())
    else:
        build()
