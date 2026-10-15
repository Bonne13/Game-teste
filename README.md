# Próxima Estrela

## Baixar e jogar no Windows

**[Baixar o jogo para Windows 10/11 de 64 bits](https://github.com/Bonne13/Game-teste/raw/refs/heads/main/downloads/ProximaEstrela-Windows-x64.zip)**

1. Baixe e extraia o ZIP.
2. Dê dois cliques em `ProximaEstrela-Windows-x64.exe`.
3. O jogo abre no navegador padrão. Mantenha a janela do iniciador aberta; pressione Enter nela para encerrar.

Não precisa instalar Python, Node.js nem Go para jogar. O executável incorpora os arquivos do jogo e utiliza um servidor apenas no próprio computador. Progresso salvo no navegador. O executável Windows foi compilado neste ambiente Linux; o jogo foi exercitado no Chromium e o servidor incorporado tem testes próprios. A abertura nativa no Windows ainda depende do teste do usuário.

**Estado da versão de teste:** treino, carreira, partidas, intervalo, stamina, loja por categorias, patrimônio, chuteiras, agentes, patrocínios e salário semanal estão implementados. A expansão de ligas, atualização de elencos 2026/27 e 2026 e premiações está em andamento e não integra a versão 0.1.0.


Protótipo de futebol e carreira para computador, inspirado no gênero de New Star Soccer, com nome e apresentação próprios. Feito com HTML, CSS e JavaScript, sem dependências de instalação.

## Jogar

Na pasta do projeto, execute:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Abra `http://localhost:8000` no navegador do seu computador. Também é possível abrir `index.html` diretamente; a persistência de arquivos locais depende do navegador.

- Complete os seis treinos no centro de avaliação: chute, visão, passe, velocidade, técnica e tiro livre.
- Selecione uma liga e clique em **Receber clube pelos treinos**. Não existe escolha manual do clube.
- Clique em **Jogar partida**. O total de chances é sorteado conforme sua força geral e a intensidade escolhida.
- Mire no campo com mouse ou setas. Segure espaço ou o botão de carregar e solte para executar a jogada. O medidor mostra a força.
- Para movimentar alguém, selecione a camisa e ative **Movimentar companheiro**. Clique no destino ou ajuste-o com as setas. Desative esse modo para voltar a mirar.
- Mire entre as traves, longe do goleiro.
- Repita os treinos para construir seu histórico e descanse para recuperar energia. A média de chute também define a precisão nas partidas.
- Nome, atributos e resultados são salvos no armazenamento local do navegador.

O protótipo inclui saldo, reputação e pontos acumulados. Inclui cinco ligas europeias: Premier League e La Liga e Serie A (20 clubes cada), Bundesliga e Ligue 1 (18 clubes cada). Escolha a liga de preferência; o recrutamento define automaticamente o clube. O calendário tem ida e volta, com classificação por pontos, saldo de gols, gols marcados e ordem alfabética como desempate simplificado. Os outros jogos são simulados a cada rodada. Ao terminar, o botão de jogar inicia uma nova temporada. Receber um novo clube reinicia a tabela e preserva os totais, atributos e histórico de treinos da carreira.

A base de clubes corresponde à temporada 2025/26, sem atualização ao vivo. Calendários e resultados são fictícios; não reproduzem os calendários oficiais. Ainda não inclui transferências, rebaixamento, partidas completas, áudio ou instalador de desktop. A interface utiliza fontes do sistema e funciona sem internet.

## Verificação

```sh
node --check game.js
node tests/leagues.test.cjs
node tests/training.test.cjs
node tests/match.test.cjs
node tests/match-rules.test.cjs
node tests/recovery.test.cjs
node tests/timeline.test.cjs
```

## Avaliação e recrutamento

Cada treino tem cinco tentativas, com confirmação entre elas e salvamento ao concluir a sessão. Interromper registra nota zero. Não há custo nem limite de sessões. Os controles aparecem no campo ao iniciar:

| Fundamento | Mecânica | Controles |
| --- | --- | --- |
| Chute | Mira, força e defesa do goleiro | Mouse/setas para mirar; segure e solte espaço ou Carregar. Força ideal: 75%. |
| Passe | Antecipação de companheiro em movimento e interceptação dos defensores | Mira e força; ideal 55%. Espere uma linha livre. |
| Visão | Leitura da marcação para encontrar o jogador com mais espaço | Teclas 1–4 ou botões numerados. Acerto rápido rende mais pontos. |
| Velocidade | Corrida de 16 passos com alternância e ritmo | A/D ou botões dos pés; intervalo ideal de 0,22–0,55 segundo. |
| Técnica | Condução da bola por cinco portões em ordem, evitando cones | WASD/setas ou botões de direção; colisões descontam pontos. |
| Tiro livre | Trajetória com curva para contornar uma barreira | Mira, controle de curva e força; ideal 75%. |

Chute, passe, visão e tiro livre têm limite de 12 segundos por tentativa; corrida, 8 segundos; drible, 18 segundos. Corrida e drible incompletos podem receber pontuação parcial. Não há notas sorteadas: as ações e o tempo determinam o desempenho.

A nota de cada fundamento é a média de todas as sessões registradas. A avaliação geral é a média dos seis fundamentos, com pesos iguais. É necessário concluir os seis antes de receber um clube. Dinheiro, reputação, gols e sorte não participam dessa seleção.

Patamares próprios do protótipo: abaixo de 50, clubes de desenvolvimento; de 50 até menos de 80, intermediários; de 80 a 100, elite. Dentro do patamar, a nota define um clube de forma determinística. Os patamares não são rankings oficiais. Uma nova contratação é solicitada pelo botão; não há transferência automática no meio da partida. Salvamentos anteriores preservam os resultados antigos, mas exigem completar a avaliação antes de voltar a jogar.

## Sistema de jogadas na partida

As chances alternam entre oito situações; o seletor **Jogada** permite experimentar qualquer uma durante uma chance ainda não executada. É um modo de oportunidades de ataque, com dois tempos de 45 minutos simulados e acréscimos, além de defensores simplificados; não há arbitragem completa nem 11 contra 11. Pênaltis, faltas e escanteios são situações oferecidas pelo protótipo, sem um sistema de infrações que as origine.

- **Posicionamento:** mande as camisas 7, 10 e 11 correrem para um destino. Os jogadores se deslocam gradualmente; o histórico de velocidade influencia a corrida. Pontos azuis e linhas mostram seus destinos. O comando respeita os limites do campo.
- **Chute:** mira e força ideal de 75%, com bloqueio dos defensores e defesa do goleiro.
- **Passe:** força ideal de 55%; precisa chegar perto de um companheiro e evitar interceptações. O histórico de passe influencia a tolerância de recepção. Depois de recebido, a jogada continua com uma finalização.
- **Pênalti:** cobrança da marca, sem defensores na trajetória. Força ideal de 75%; o goleiro pode defender.
- **Falta:** use o controle de curva para passar ao redor da barreira. Força ideal de 75%.
- **Escanteio:** posicione um companheiro na área e cruze até ele, com força ideal de 65%. Jogadores marcados podem perder a disputa. Escolha **Após o escanteio** antes de cruzar para definir a finalização seguinte.
- **Cabeceio, voleio e bicicleta:** mire no gol e solte com força ideal de 60% quando o marcador estiver na faixa verde. Cada modalidade tem uma janela de contato diferente. O histórico de técnica aumenta um pouco a tolerância. A bola recebida e sua trajetória são representadas no campo; as animações são esquemáticas.

Passe e cruzamento recebidos não consomem outra chance. Gol, defesa, interceptação ou finalização perdida encerram a chance atual e entram no fluxo normal de placar e campeonato. Uma ação em andamento não pode ser trocada.

### Organização do código

- `training-engine.js`: movimento, trajetórias, colisões e notas dos seis fundamentos.
- `training.js`: interface dos treinos, controles, histórico e recrutamento.
- `match-engine.js`: estado de uma jogada, ordens de deslocamento, recepção, finalizações e transições entre ações.
- `game.js`: controles e desenho da partida, integração com carreira e resultados.
- `leagues.js`: clubes, calendário e classificação.

Os testes de regras usam apenas Node.js. Os testes opcionais `tests/browser.test.cjs` e `tests/match-browser.test.cjs` usam Playwright e Chromium, além do servidor na porta 8000. O primeiro percorre as seis sessões completas; o segundo exercita controles de partida e escanteio em sequência. Esses utilitários precisam estar instalados no ambiente para rodar os testes de navegador.

## Chances, intensidade e stamina

A força geral é a média dos seis fundamentos, obtida do histórico dos treinos. A cada 25 pontos de força, a faixa de chances sobe uma posição. O total é sorteado uma única vez antes de cada partida entre três inteiros consecutivos, com a mesma probabilidade. Pode se repetir entre partidas. A intensidade fica travada até o fim.

| Intensidade | Chances com força 80 | Custo total de stamina |
| --- | --- | --- |
| Leve | 4–6 | 10 |
| Moderada | 5–7 | 20 |
| Alta | 6–8 | 35 |

A interface mostra a faixa correspondente à força real do jogador antes de jogar. É necessário ter stamina suficiente para o custo total da intensidade. A stamina vai de 0 a 100, é consumida gradualmente pelo relógio da partida e reduz a velocidade de movimentação quando baixa. O custo total é exato, independentemente da quantidade de chances e dos acréscimos. O histórico de treino e a força geral não são alterados pelo cansaço.

### Loja e recuperação

| Recuperação | Preço | Efeito |
| --- | --- | --- |
| Descanso | Grátis | Até +30 stamina |
| Energético Energia+ | R$ 60 | Até +40 stamina |
| Refeição equilibrada | R$ 35 | Até +25 stamina |

Comprar coloca o produto no inventário; não o consome automaticamente. A recuperação respeita o limite de 100. Com stamina cheia, o item é preservado. Saldo e inventário são salvos no navegador, inclusive em salvamentos antigos, que começam sem itens.

Compras e descanso ficam disponíveis entre partidas e treinos. Os itens podem ser consumidos entre partidas **e no intervalo**; não durante uma jogada ou treino. No intervalo, há um botão específico para o energético, sem precisar procurar a loja.

## Relógio e intervalo

Cada tempo tem 45 minutos simulados. O primeiro recebe de 1 a 4 minutos de acréscimos; o segundo, de 2 a 6. O relógio usa as indicações 45+N e 90+N e avança a 12 minutos simulados por segundo entre as oportunidades. Ele pausa enquanto você controla uma jogada, para permitir posicionamento, mira e preparação.

As chances sorteadas são distribuídas pelos dois tempos. Mesmo sem chances restantes em um tempo, o relógio segue até os acréscimos terminarem. No intervalo, o jogo pausa obrigatoriamente: você pode consumir o energético do inventário, ver a stamina recuperada e clicar em **Entrar para o segundo tempo**. A partida não retoma sozinha.

O placar entra no campeonato, o pagamento é liberado e o resultado é salvo somente ao encerrar o segundo tempo com seus acréscimos. O progresso de carreira, compras e consumo são persistidos; uma partida em andamento não é retomada ao recarregar a página.

## Economia e patrimônio

A loja tem as categorias Recuperação, Casas, Veículos, Mobílias, Itens pessoais e Chuteiras. Cada bem só pode ser comprado uma vez; consumíveis continuam usando estoque. Uma casa ativa oferece espaços para instalar mobílias e melhora o descanso. O patrimônio pode aumentar o prestígio comercial. Uma única chuteira pode ficar equipada: seus bônus, limitados a 100, afetam a força e habilidades nas partidas. As notas de treino e o recrutamento permanecem sem bônus de equipamento.

O escritório da carreira permite contratar um dos três agentes fictícios e negociar com oito patrocinadores fictícios. Agentes cobram taxa de contratação e comissão futura sobre salários e patrocínios. Você pode manter dois patrocínios simultâneos. Cada empresa tem exigências, chance de aceitar ou recusar, valor por participação e prazo. Recusas e períodos de espera ficam salvos.

O salário é bruto e **semanal**, com vencimento a cada sete dias do calendário. Rodadas avançam 7, 7, 3 e 4 dias em sequência; duas partidas próximas não duplicam um salário semanal. Valores acumulam proporcionalmente por dia; renegociar não muda dias já acumulados. O fim do contrato quita o proporcional restante. O extrato separa salário efetivamente vencido, patrocínios, bônus e comissão. O salário não depende de vencer ou marcar gols. São regras simplificadas do jogo, sem simulação de impostos.

Você pode pedir aumento, com chance de recusa e espera de três jogos antes de outra proposta. A renovação abre nas últimas cinco partidas do contrato, com uma tentativa por jogo. Agente e desempenho influenciam a chance. Contrato vencido impede novas partidas pelo clube até renovar ou passar pela avaliação de um novo contrato.

No intervalo, **Abrir loja no intervalo** mostra a mesma loja em uma janela, com todas as categorias e o mesmo saldo. O relógio permanece pausado. Feche a loja para voltar ao intervalo e decidir quando iniciar o segundo tempo. Negociações de carreira continuam restritas aos momentos entre partidas.

## Compilar uma nova versão Windows

Com Go 1.27.2 e Python instalados:

```sh
python tools/build-desktop.py
```

O script testa o servidor incorporado, compila um PE Windows x64 e gera o ZIP em `dist/`. O workflow `Publicar jogo para Windows` também pode ser executado no GitHub Actions. Tags `v*` geram uma Release. Há um ZIP de teste em `downloads/` para não depender de esperar a automação.
