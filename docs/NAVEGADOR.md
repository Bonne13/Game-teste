# Jogar no navegador do celular

A versão web usa os mesmos controles por toque do APK e não exige instalar executáveis ou ter conta de desenvolvedor Apple/Google.

**Endereço previsto após publicar o GitHub Pages:** https://bonne13.github.io/Game-teste/

Abra no Safari do iPhone ou no Chrome do Android. No treino de chute, passe e falta, toque na bola e arraste para trás. Na partida, toque no campo para confirmar a mira e solte. Com a jogada pausada, aparece a bola ampliada; toque nela, segure para carregar e solte para chutar. O nome e a carreira ficam nesse navegador; não são sincronizados com o APK ou com o PC.

Após o primeiro carregamento completo, os arquivos ficam disponíveis offline quando o navegador permite service workers. No iPhone, é possível usar **Compartilhar → Adicionar à Tela de Início**. No Android, use **Adicionar à tela inicial/Instalar app**, quando oferecido pelo navegador. Limpar os dados desse site remove a carreira e o cache. Uma partida em andamento não é retomada ao recarregar.

## Ativação inicial do GitHub Pages

A automação está em `.github/workflows/web-pages.yml`, com o nome **Publicar jogo no navegador**. Ela exporta apenas arquivos públicos, testa o pacote e publica o conteúdo de `dist/web`. APKs, EXEs, pastas de desenvolvimento e chaves de assinatura não fazem parte do site.

1. Abra [Settings → Pages](https://github.com/Bonne13/Game-teste/settings/pages) na sua conta.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Em [Actions → Publicar jogo no navegador](https://github.com/Bonne13/Game-teste/actions/workflows/web-pages.yml), execute **Run workflow** na branch `main` se não houver uma execução em andamento; se uma execução anterior falhou antes da ativação, use **Re-run all jobs**.
4. Aguarde a etapa **Publicar** concluir. O GitHub mostra o endereço efetivamente publicado nessa execução e na página de configurações.

O endereço acima é o esperado para este repositório, não uma confirmação de site ativo. Este ambiente recebeu bloqueio de acesso à API de configuração do GitHub e ao domínio `github.io`; por isso a ativação e a disponibilidade pública precisam ser confirmadas na sua conta. O repositório não foi tornado público nem teve sua visibilidade alterada.

## Compilar e verificar localmente

```sh
python3 tools/build-web.py
python3 tests/web-package.test.py
python3 -m http.server 8004 --bind 127.0.0.1 --directory dist
```

O teste opcional `node tests/web-browser.test.cjs` usa Playwright/Chromium e esse servidor. Ele verifica o site em subpasta, controles reais de toque, cache, recarga offline e treino 3D offline. O teste foi executado em Chromium; não é um teste físico de Safari/iPhone.

O cache recebe uma versão derivada do conteúdo exportado. Uma atualização espera as abas antigas fecharem antes de assumir, evitando trocar arquivos no meio de uma partida. A carreira permanece no mesmo armazenamento local do endereço publicado.
