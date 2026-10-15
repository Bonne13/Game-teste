# Teste no Android

**[Baixar Próxima Estrela para Android](https://github.com/Bonne13/Game-teste/blob/main/downloads/ProximaEstrela-Android-teste.apk)**

1. No Android, abra o link e toque em **Download raw** para baixar o APK.
2. Abra o arquivo baixado. Se solicitado, autorize esse navegador ou gerenciador de arquivos a instalar o aplicativo.
3. Instale e abra **Próxima Estrela · Teste**.

Não é necessário pagar, ter conta Google Play ou publicar na loja para este teste por APK. O aplicativo inclui o jogo, funciona sem internet e não pede acesso a arquivos, localização, câmera ou microfone. O APK é universal, para Android 8.0 ou posterior, com Android System WebView atualizado e suporte gráfico WebGL. Os gráficos dependem do aparelho; em **Imagem e câmera**, escolha **Leve** se necessário.

Nos treinos de chute, passe e falta, toque na bola, segure e arraste para trás. Nas partidas, toque no destino no campo e solte para confirmar a mira. A jogada pausa e abre a bola ampliada. Só então toque no ponto da bola, segure para carregar e solte para chutar. O botão Voltar e ajustar a mira cancela a preparação sem consumir a chance. Visão, corrida e técnica oferecem botões na tela. Há um painel compacto de stamina, overall e dinheiro, com opção de nome e descanso. A tela pode ser usada deitada ou em pé.

A carreira fica nos dados locais do aplicativo. Desinstalar ou limpar seus dados apaga esse progresso. Uma partida em andamento não é retomada ao fechar o aplicativo. O progresso do APK é separado do navegador e da versão Windows.

## Compilar outra versão

Requisitos: **JDK completo 21** (com `javac`), Android SDK Platform 35, Build Tools 35.0.0 e Python 3. Defina `ANDROID_HOME` para a pasta do SDK. O wrapper inclui a versão fixa do Gradle, com verificação SHA256 da distribuição.

```sh
sdkmanager 'platforms;android-35' 'build-tools;35.0.0'
python3 tools/build-android.py
```

O script incorpora apenas os arquivos públicos do jogo, gera uma chave local de desenvolvimento se necessário, executa `assembleDebug` e `lintDebug`, verifica a assinatura e escreve APK e checksum em `dist/`. Não é um pacote de produção para a Play Store. O código Android fica em `android/`; é uma Activity com WebView acelerada e origem local HTTPS do `WebViewAssetLoader`, sem servidor e sem permissão de internet.

Guarde a chave ignorada `android/.signing/test.keystore` para assinar atualizações compatíveis do mesmo teste; não a publique. Ela usa as credenciais convencionais de desenvolvimento e não deve ser usada para produção. O workflow **Compilar APK de teste Android** gera um artefato sem exigir segredos; cada runner tem uma chave própria, portanto seus APKs não substituem automaticamente um APK assinado em outro ambiente.

Validações automatizadas: regras do jogo, análise Android Lint, compilação e assinatura do APK, conteúdo dos assets e teste de toque em Chromium com viewport de celular. Esses testes não substituem a verificação do APK num aparelho Android físico.

## iPhone / TestFlight

A versão Android não é instalável no iPhone. O TestFlight continua pendente: exige assinatura ativa do Apple Developer Program, projeto iOS, compilação/assinatura pela Apple e processamento no App Store Connect. Nenhuma versão foi enviada ao TestFlight e nenhum IPA foi gerado nesta atualização.
