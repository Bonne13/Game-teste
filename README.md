# Próxima Estrela

**[Baixar o jogo para Windows 10/11 de 64 bits](https://github.com/Bonne13/Game-teste/raw/refs/heads/main/downloads/ProximaEstrela-Windows-x64.zip)**

1. Baixe o ZIP e extraia os arquivos.
2. Abra `ProximaEstrela-Windows-x64.exe`.
3. O iniciador abre o jogo no navegador padrão. Mantenha sua janela aberta; pressione Enter nela para encerrar.

Não precisa instalar Python, Node.js ou Go para jogar. Os arquivos estão incorporados no executável e funcionam sem internet. Use um navegador com WebGL e aceleração gráfica. A carreira fica salva nesse navegador e computador, no endereço local fixo do iniciador. Uma partida em andamento não é retomada ao fechar. O executável foi compilado para Windows x64; a interface foi testada no Chromium e o servidor incorporado tem testes próprios. A execução nativa no Windows ainda precisa ser confirmada nesse sistema.

Protótipo independente de futebol e carreira para PC, inspirado na experiência de oportunidades e progressão de New Star Soccer e Football Legacy, com nome, interface e modelos próprios. Esta versão traz campos e jogadores em **3D real com Three.js/WebGL**, câmera atrás da bola, gol com rede, goleiro, iluminação e sombras. As animações são simples; não é uma partida completa de onze contra onze.

## Atualização visual e de jogabilidade — 0.3.0

![Campo 3D em fim de tarde, câmera próxima da bola](docs/campo-3d-v03.png)

- Gramado com textura procedural, faixas de corte, marcações, bandeirinhas, arquibancadas com cobertura, torcida e refletores.
- Câmeras perto da bola, aberta e lateral, com acompanhamento suave. Iluminação de dia, fim de tarde ou noite.
- Qualidade Leve, Equilibrada ou Alta. O modo leve reduz resolução e desliga sombras e torcida. Preferências ficam salvas; a trajetória de mira pode ser ocultada.
- Jogadores articulados, movimentos de corrida e chute, mergulho do goleiro e rede que reage ao gol.
- Finalizações Normal, Colocada, Potente e Cavadinha, com diferenças reais na velocidade, curva e arco. O seletor mostra a potência de referência de cada uma. A força do jogador continua limitando a potência máxima.
- Indicações de gol, defesa, trave, barreira e erro de contato. Um clique sem arrastar não dispara o chute. O resultado permanece brevemente em campo para mostrar o desfecho da bola.

As opções ficam em **Imagem e câmera**, abaixo do menu principal. Os gráficos e as animações continuam estilizados, com física simplificada para o protótipo.

## Controles em 3D

No menu **Treinos**, complete chute, visão, passe, velocidade, técnica e tiro livre. Cada sessão tem cinco tentativas. A média histórica dos seis fundamentos define automaticamente seu clube na liga de preferência, sem influência de dinheiro, reputação ou chuteiras.

Para chutar ou passar, clique na bola 3D ampliada abaixo do campo, segure o mouse, arraste para trás e solte. A direção do arrasto define a mira; sua distância define a potência, limitada pela força do jogador. Clicar mais embaixo da bola aumenta a altura. Clicar nas laterais produz curva. A linha no campo antecipa a trajetória enquanto você prepara o chute. Também é possível iniciar o gesto na bola do próprio campo.

| Treino | Como jogar |
| --- | --- |
| Chute | Acerte o alvo no gol e evite o goleiro usando o arrasto. |
| Passe | Antecipe o companheiro em movimento e evite interceptações. |
| Visão | Clique no jogador mais livre, ou use teclas/botões 1–4. |
| Velocidade | Alterne A/D ou os botões dos pés, com ritmo de 0,22–0,55 segundo. |
| Técnica | Clique no gramado para conduzir, ou use WASD/setas; atravesse os portões evitando cones. |
| Tiro livre | Use o ponto de contato na bola para contornar a barreira com curva e altura. |

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
```

Os testes opcionais `tests/browser.test.cjs` e `tests/match-browser.test.cjs` e `tests/visual-browser.test.cjs` usam Playwright, Chromium com WebGL e o servidor na porta 8000. Verificam gestos reais do mouse, interfaces de treino, recrutamento, elencos, partida, loja no intervalo, recuperação, salário e persistência após promoção.

Para compilar o iniciador com Go 1.27.2 e Python:

```sh
python tools/build-desktop.py
```

O script incorpora os arquivos públicos, testa o servidor e gera EXE/ZIP em `dist/`. `GO_BINARY` permite indicar o compilador. O workflow **Publicar jogo para Windows** também compila no GitHub Actions; tags `v*` publicam uma Release. O ZIP em `downloads/` permite baixar sem esperar a automação.

`football-presentation.js` contém estádio, qualidade gráfica, câmeras e animações; `football-3d.js` integra as cenas e os controles; `training-engine.js` e `match-engine.js`, as regras de jogadas; `career-economy.js`, economia; `league-world.js`, promoções; `season-awards.js`, estatísticas e prêmios. `club-database.js` é o snapshot offline, gerado por `tools/import-football-data.py`. Three.js está em `vendor/`, com sua licença MIT. Nomes factuais de clubes e jogadores são acompanhados de suas fontes; modelos, marcas comerciais da loja e apresentação foram criados para o protótipo.
