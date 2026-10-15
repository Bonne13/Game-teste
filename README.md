# Próxima Estrela

## Jogar pelo navegador do celular

Versão web preparada para Safari/iPhone e Chrome/Android, com controles por toque e suporte offline após o primeiro carregamento. Não precisa de APK nem de conta Apple Developer.

**Endereço previsto após a publicação:** https://bonne13.github.io/Game-teste/

A publicação usa GitHub Pages. A ativação e a disponibilidade pública ainda precisam ser confirmadas na sua conta; veja [como ativar e jogar](docs/NAVEGADOR.md).

## Testar no Android, sem pagar

**[Baixar APK de teste para Android](https://github.com/Bonne13/Game-teste/blob/main/downloads/ProximaEstrela-Android-teste.apk)** — abra o link no celular, toque em **Download raw**, abra o arquivo e autorize a instalação pelo navegador se o Android solicitar. Não precisa de conta Google Play.

Inclui jogo offline e controles por toque. Android 8.0 ou posterior, com WebView atualizado e WebGL. Veja [como instalar, controles e compilação](docs/ANDROID.md). O APK ainda precisa ser testado num aparelho físico; os controles foram exercitados em Chromium com toque.

## Jogar no Windows

**[Baixar o jogo para Windows 10/11 de 64 bits](https://github.com/Bonne13/Game-teste/raw/refs/heads/main/downloads/ProximaEstrela-Windows-x64.zip)**

1. Baixe o ZIP e extraia os arquivos.
2. Abra `ProximaEstrela-Windows-x64.exe`.
3. O iniciador abre o jogo no navegador padrão. Mantenha sua janela aberta; pressione Enter nela para encerrar.

Não precisa instalar Python, Node.js ou Go para jogar. Os arquivos estão incorporados no executável e funcionam sem internet. Use um navegador com WebGL e aceleração gráfica. A carreira fica salva nesse navegador e computador, no endereço local fixo do iniciador. Uma partida em andamento não é retomada ao fechar. O executável foi compilado para Windows x64; a interface foi testada no Chromium e o servidor incorporado tem testes próprios. A execução nativa no Windows ainda precisa ser confirmada nesse sistema.

Protótipo independente de futebol e carreira para PC, inspirado na experiência de oportunidades e progressão de New Star Soccer e Football Legacy, com nome, interface e modelos próprios. Esta versão traz campos e jogadores em **3D real com Three.js/WebGL**, câmera atrás da bola, gol com rede, goleiro, iluminação e sombras. As animações são simples; não é uma partida completa de onze contra onze.

## Atualização de campo e controles — 0.4.2

![Novo campo 3D com câmera baixa e áreas em proporções naturais](docs/campo-3d-v04.png)

- Campo completo de 105 × 68 metros na cena, áreas e marcações em escala, dois gols e arquibancadas com assentos e espectadores modelados.
- Câmera mais baixa e perspectiva mais natural, acompanhando o lance e ficando estável enquanto você carrega o chute. Jogadores com mangas, gola e proporções refinadas.
- **Arrastar para trás é exclusivo dos treinos.** Nas partidas, escolha a mira e solte; a jogada pausa e abre a bola ampliada. Somente um novo toque na bola, segurando e soltando, executa o chute. A carga depende do tempo e da força do jogador, sem depender da distância de arrasto.
- A bola ampliada aparece depois de confirmar a mira e permite escolher contato, altura e curva. Segure nela para carregar a força e solte para chutar; use Voltar e ajustar a mira para cancelar. O botão **Preparar chute** confirma a mira atual sem disparar a jogada.
- Três câmeras, luz de dia/fim de tarde/noite, qualidade Leve/Equilibrada/Alta, quatro estilos de finalização e animações de jogadores, goleiro e rede.

As opções ficam em **Imagem e câmera**, abaixo do menu principal. Os gráficos continuam estilizados e a física é simplificada para este protótipo.

## Controles em 3D

No menu **Treinos**, complete chute, visão, passe, velocidade, técnica e tiro livre. Cada sessão tem cinco tentativas. A média histórica dos seis fundamentos define automaticamente seu clube na liga de preferência, sem influência de dinheiro, reputação ou chuteiras.

**Nos treinos de chute, passe e tiro livre:** primeiro toque no campo para definir a mira e solte. O treino pausa e abre a bola 3D. Em um novo toque, escolha o ponto da bola, segure, arraste para trás e solte para executar. A distância do arrasto define a potência, limitada pela força do jogador. Embaixo aumenta a altura; nas laterais produz curva. Use Voltar para corrigir a mira sem gastar a tentativa.

| Treino | Como jogar |
| --- | --- |
| Chute | Acerte o alvo no gol e evite o goleiro usando o arrasto. |
| Passe | Antecipe o companheiro em movimento e evite interceptações. |
| Visão | Clique no jogador mais livre, ou use teclas/botões 1–4. |
| Velocidade | Alterne A/D ou os botões dos pés, com ritmo de 0,22–0,55 segundo. |
| Técnica | Clique no gramado para conduzir, ou use WASD/setas; atravesse os portões evitando cones. |
| Tiro livre | Use o ponto de contato na bola para contornar a barreira com curva e altura. |

**Nas partidas:** escolha o destino no campo e solte. A jogada pausa e abre uma janela com a bola 3D. Escolha o ponto de contato, segure a bola para carregar e solte para executar. Soltar a mira nunca chuta. Para passes e escanteios, mire no gramado; para chutes, mire no gol. A força depende do tempo segurando e do atributo do jogador. A bola ampliada permite escolher o efeito sem arrastar. Há uma opção para voltar e ajustar a mira.

Em **Jogar**, as chances alternam chute, passe, pênalti, falta, escanteio, cabeceio, voleio e bicicleta. O seletor de jogada permite experimentar as situações. Cabeceio, voleio e bicicleta exigem soltar o mouse na faixa verde do indicador de contato. Passe e escanteio recebidos continuam na mesma chance; a assistência e o gol pertencem aos jogadores envolvidos. Para comandar um companheiro, escolha sua camisa, ative **Movimentar companheiro** e clique no destino no gramado. Desative para voltar a chutar.

## Partidas, intervalo e stamina

Cada tempo tem 45 minutos simulados, mais 1–4 minutos de acréscimos no primeiro e 2–6 no segundo. O relógio avança entre oportunidades e pausa durante uma jogada. A quantidade de chances é sorteada conforme a força efetiva e a intensidade.

| Intensidade | Chances com força 80 | Custo total de stamina |
| --- | --- | --- |
| Leve | 4–6 | 10 |
| Moderada | 5–7 | 20 |
| Alta | 6–8 | 35 |

O cansaço reduz a velocidade. No intervalo obrigatório, você pode abrir a loja completa, comprar e consumir um energético ou refeição, e só então entrar no segundo tempo. Energético custa R$ 60 e recupera até 40 stamina; refeição custa R$ 35 e recupera até 25. Descanso gratuito recupera 30, com bônus da casa e das mobílias. Recuperação limitada a 100; itens não são consumidos com energia cheia. Durante uma jogada não é possível comprar ou recuperar energia.

## Carreira e loja

O menu separa Jogar, Treinos, Carreira, Loja e Ligas e prêmios. As cores acompanham a liga e o clube do jogador. A loja tem Recuperação, Casas, Veículos, Mobílias, Itens pessoais e Chuteiras. Casas oferecem espaços para mobílias; patrimônio influencia o prestígio comercial. Uma chuteira equipada melhora atributos nas partidas, mantendo os treinos e o recrutamento sem bônus de equipamento.

O salário é bruto e **semanal**, pago a cada sete dias do calendário. Rodadas avançam 7, 7, 3 e 4 dias em sequência; partidas próximas não duplicam salários. Valores acumulam proporcionalmente e são quitados ao vencer o contrato. Negociações de aumento e renovação podem ser aceitas ou recusadas, com prazos entre tentativas. Contrato vencido exige renovação ou nova avaliação antes de jogar.

Há três agentes e oito empresas de patrocínio fictícias. Agentes cobram contratação e comissão sobre salários e patrocínios, e melhoram as chances de negociação e renovação. É possível ter até dois patrocinadores simultâneos. O extrato separa salário, patrocínios, bônus e comissões. Negociações de carreira ficam disponíveis entre partidas.

## Ligas, elencos e temporadas

São **12 divisões e 238 clubes**, com nomes reais: primeiras e segundas divisões da Inglaterra, Espanha, Itália, Alemanha, França e Brasil. Referência solicitada: **Europa 2026/27 e Brasil 2026**. O menu permite consultar clubes, nomes, posições, overalls e origem de cada cadastro; essa consulta não escolhe seu clube de carreira.

A base contém **7.170 cadastros de jogadores**, com pelo menos onze nomes por clube. **Os elencos não estão todos confirmados para 2026:** 2.565 cadastros vêm de uma fonte histórica de 2025 e têm o vínculo marcado como pendente; parte da composição das segundas divisões europeias também é auxiliar e ainda precisa de confirmação. Alguns ratings são estimativas. Não há atualização ao vivo. Veja [fontes e limitações](data/SOURCES.md) e [cobertura por clube](data/coverage.json).

O campeonato usa ida e volta, classificação e resultados simulados. Há acesso e rebaixamento entre as duas divisões de cada país; Brasil tem quatro vagas diretas. Na Europa há acessos diretos e playoffs automáticos simplificados em jogo único. Não há terceira divisão. As mudanças preservam clube, atributos, patrimônio e histórico do jogador ao iniciar a temporada seguinte.

Ao fim da temporada, estatísticas simuladas determinam sete prêmios: **Bola de Ouro, Troféu Yashin/Melhor goleiro, Melhor atacante, Melhor defensor, Melhor meio-campo, Chuteira de Ouro e Melhor assistente**. O jogador da carreira concorre e recebe bônus quando vence. Esses vencedores representam a simulação da carreira, não os prêmios reais do mundo atual.

## Executar o código e verificar

Para testar o código em um navegador:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000`. Para testar as regras, com Node.js:

```sh
node tests/economy.test.cjs
node tests/leagues.test.cjs
node tests/training.test.cjs
node tests/match.test.cjs
node tests/match-rules.test.cjs
node tests/recovery.test.cjs
node tests/timeline.test.cjs
node tests/world.test.cjs
node tests/drag.test.cjs
node tests/match-input.test.cjs
```

Os testes opcionais `tests/browser.test.cjs` e `tests/match-browser.test.cjs` e `tests/visual-browser.test.cjs` usam Playwright, Chromium com WebGL e o servidor na porta 8000. Verificam gestos reais do mouse, interfaces de treino, recrutamento, elencos, partida, loja no intervalo, recuperação, salário e persistência após promoção.

Para compilar o iniciador com Go 1.27.2 e Python:

```sh
python tools/build-desktop.py
```

O script incorpora os arquivos públicos, testa o servidor e gera EXE/ZIP em `dist/`. `GO_BINARY` permite indicar o compilador. O workflow **Publicar jogo para Windows** também compila no GitHub Actions; tags `v*` publicam uma Release. O ZIP em `downloads/` permite baixar sem esperar a automação.

`match-input.js` separa a carga por tempo das partidas do arrasto dos treinos; `football-presentation.js` contém estádio, qualidade gráfica, câmeras e animações; `football-3d.js` integra as cenas e os controles; `training-engine.js` e `match-engine.js`, as regras de jogadas; `career-economy.js`, economia; `league-world.js`, promoções; `season-awards.js`, estatísticas e prêmios. `club-database.js` é o snapshot offline, gerado por `tools/import-football-data.py`. Three.js está em `vendor/`, com sua licença MIT. Nomes factuais de clubes e jogadores são acompanhados de suas fontes; modelos, marcas comerciais da loja e apresentação foram criados para o protótipo.

Atualização do navegador v0.4.3: se uma aba manteve controles antigos, depois da publicação abra `https://bonne13.github.io/Game-teste/?atualizar=mira-pausada`. O worker atualizado recarrega somente a aba que pediu recuperação e preserva o armazenamento da carreira. As demais abas não são recarregadas automaticamente.

Correção web v0.4.4: mira com retículo visível desde o toque no campo e bola ampliada 3D renderizada pelo mesmo contexto WebGL do campo. Evita criar dois contextos gráficos extras no celular. O teste móvel verifica pixels claros/escuros da bola, pausa e novo gesto antes de finalizar.

Treinos v0.4.5: o retículo e uma mira inicial aparecem ao começar cada tentativa. O botão Preparar chute · abrir bola abre a preparação mesmo sem tocar no campo; o toque no campo continua disponível. A preparação usa leitura direta dos pixels 3D para evitar depender da cópia entre superfícies gráficas do navegador. A versão fica no topo da tela.

## Menu inicial e carreiras — v0.5.0

Ao abrir o jogo, escolha Carreiras, Conquistas ou Opções. Há seis slots locais. Um save anterior é migrado integralmente para o primeiro slot; selecionar um slot vazio abre identidade (nome, nacionalidade e uma das 12 ligas), depois posição (ATA, PE, PD ou MEI). A posição MEI é considerada meio-campo no elenco e nas premiações. O clube continua definido pelos seis fundamentos, após os treinos.

As 220 opções unem os 193 membros e dois observadores da ONU às 211 associações da FIFA, incluindo seleções de territórios e as quatro seleções britânicas. Fontes e critérios em `data/SOURCES.md`. Conquistas são calculadas a partir das carreiras salvas.

Opções permite controlar o volume geral e silenciar os sons de menu e chute. O áudio sintetizado inicia após interação e não precisa de downloads. Configurações de áudio são compartilhadas; progresso de cada carreira é isolado. O botão Menu inicial retorna após concluir a partida ou interromper o treino. Saves ficam neste navegador/aparelho; não há sincronização com servidor. O cenário 3D só é inicializado ao entrar em uma carreira.

Validação adicional: `node tests/career-saves.test.cjs` e `GAME_URL=http://127.0.0.1:8011/ node tests/menu-browser.test.cjs`. Os testes de jogabilidade existentes usam `tests/game-page.cjs` para entrar diretamente em uma carreira; o teste de menu percorre a criação e troca de saves sem esse atalho.

## Visibilidade da bola durante o chute — v0.5.1

Nos treinos, o atacante fica ao lado da bola para não encobrir sua saída. A reprodução do lance avança a 45% da velocidade original, mantém um tamanho mínimo legível da bola na câmera e mostra um rastro curto em 3D. Ao soltar o chute, o campo volta ao centro da tela. A simulação, a força, a curva e o cálculo da nota continuam usando o mesmo tempo lógico.

`GAME_URL=http://127.0.0.1:8011/ node tests/training-flight-browser.test.cjs` acompanha vários quadros depois de um chute por toque: verifica deslocamento até o gol, ausência de oclusão pelo próprio atacante, tamanho em pixels, duração, rastro e enquadramento do campo.

## Controle de efeito e destino final — v0.5.2

No treino, toque na bola para selecionar o efeito. Depois segure e arraste para baixo: somente essa distância define a potência, limitada pela força do jogador. Segurar parado, arrastar para cima ou só para o lado não chuta. O ponto escolhido permanece travado durante o arrasto; outro toque sem arrastar troca o efeito. A mira no campo permanece fixa enquanto se define a força. A seleção usa interseção analítica com a esfera e tolerância nas bordas do controle. O medidor e o ponto de contato atualizam imediatamente.

A câmera acompanha o lance e aproxima o destino. A bola fica acima do gramado inclusive nos chutes fracos. Gol termina dentro da rede; defesa para antes da linha; barreira e interceptação param a trajetória no contato. Um marcador Bola aqui e uma legenda de resultado permanecem visíveis até a próxima tentativa.

Verificação: `node tests/training-controls-browser.test.cjs` exercita toque, gesto e destino; `node tests/training-destinations-browser.test.cjs` cobre gol, defesa, barreira, chute curto, direita, esquerda e acima do travessão. Use `GAME_URL` para apontar ao servidor local.

## Gols, comemorações e treino de visão — v0.6.0

Nas partidas, gols acionam uma sequência com rede, placar, nome do autor e seis comemorações 3D alternadas: aviãozinho, deslize de joelhos, soco no ar, salto com giro, coração para a torcida e abraço da equipe. O relógio e o gasto de stamina ficam pausados; Continuar encerra a sequência. Preferência por movimento reduzido é respeitada.

O treino de visão tem cinco cenários com quatro recebedores, defensores, goleiro e linha do penúltimo adversário. Na v0.6.1, use o arrasto livre no campo, conforme os controles abaixo.

A posição de impedimento é registrada no instante do passe. O recebedor precisa estar no campo adversário e à frente tanto da bola quanto do penúltimo adversário; alinhamento é legal e o goleiro conta como adversário. Nos passes simulados, a infração de recepção é aplicada quando o jogador recebe a bola; interceptações não geram impedimento de quem não participou. A regra também se aplica aos passes nas partidas. Recepção direta de escanteio é isenta.

Testes adicionais: `node tests/vision-offside.test.cjs`, `node tests/vision-browser.test.cjs`, `node tests/celebrations-browser.test.cjs` (os testes de navegador aceitam `GAME_URL`).

## Mira livre no treino de visão — v0.6.1

Segure em qualquer ponto do campo e arraste no sentido contrário ao passe. A direção e o comprimento do arrasto definem a mira e a potência, limitadas pela força do jogador. A trajetória e o medidor são atualizados enquanto segura; solte para passar. Não há seleção automática de companheiro, botões numerados ou janela de chute nesse treino. É possível passar para espaços vazios e errar; recepção, interceptação e impedimento dependem do destino real da bola. O tempo fica pausado durante a preparação.

Validação por toque: `GAME_URL=http://127.0.0.1:8011/ node tests/vision-browser.test.cjs`.

## Arrasto livre em todas as finalizações — v0.7.0

Chutes, passes, visão e faltas no treino, além de chute, passe, pênalti, falta, escanteio, cabeceio, voleio e bicicleta na partida usam o arrasto no próprio campo. Segure em qualquer ponto e puxe no sentido contrário à jogada; distância define potência, ângulo define direção. A linha pontilhada acompanha os ajustes antes de soltar. Não há alvo fixo no gol nem seleção automática de recebedor. Gols no treino livre recebem nota pela finalização, sem exigir um ponto oculto.

O botão **Efeito da bola · opcional** mostra a bola 3D abaixo do campo para escolher altura/curva, sem disparar. A execução continua sendo pelo arrasto no campo. Cabeceio, voleio e bicicleta mantêm a janela de tempo de contato; as outras jogadas pausam durante o arrasto.

Verificação atual dos controles: `node tests/match-input.test.cjs`, `node tests/free-drag-browser.test.cjs` e `node tests/vision-browser.test.cjs` (navegador aceita `GAME_URL`). Os testes antigos da janela obrigatória de preparação descrevem o controle anterior.
