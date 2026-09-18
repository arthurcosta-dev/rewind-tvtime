# Requirements — Rewind

## 1. Visão do Produto

### Nome
Rewind

### Problema
Com o encerramento do TV Time em julho de 2026, quem assiste séries perdeu uma forma simples de organizar o que já viu, o que está vendo e o que ainda quer assistir — além de acompanhar o próprio progresso episódio a episódio e visualizar hábitos de consumo (quantas séries, quantos episódios, quais gêneros preferidos).

### Público
Pessoas que assistem séries com frequência e querem manter um controle pessoal do progresso (por temporada/episódio), sem depender de anotações soltas ou da própria memória, e que gostam de visualizar estatísticas do próprio consumo.

### Proposta de solução
Uma plataforma web responsiva onde o usuário busca séries (via API da TMDB), organiza cada uma em um status (quero assistir / assistindo / assistido), marca o progresso por episódio dentro de cada temporada, atribui uma nota pessoal opcional e visualiza estatísticas do que já assistiu — tudo salvo localmente no navegador (localStorage), sem necessidade de login ou backend próprio.

## 2. Objetivo do MVP

Ao final do projeto, o usuário deve conseguir:
- Buscar uma série pelo nome e ver resultados vindos da API da TMDB;
- Adicionar essa série à sua lista pessoal com um status;
- Abrir a página da série, ver suas temporadas/episódios e marcar quais já assistiu;
- Atribuir uma nota de 1 a 5 à série (opcional);
- Ver a lista de "Minhas Séries" filtrada por status;
- Ver uma página de estatísticas com números (total de séries, episódios assistidos, horas estimadas) e um gráfico simples (barras em CSS) dos gêneros mais assistidos;
- Fechar o navegador e, ao voltar, encontrar tudo salvo como estava (localStorage).

## 3. User Stories

- **US01** (F01): Como usuário do Rewind, quero buscar uma série pelo nome, para encontrar rapidamente o que eu quero organizar ou acompanhar.
- **US02** (F02): Como usuário, quero adicionar uma série à minha lista e definir seu status (quero assistir / assistindo / assistido), para organizar o que já vi e o que ainda vou ver.
- **US03** (F03): Como usuário, quero marcar quais episódios de cada temporada eu já assisti, para não perder o fio de onde parei.
- **US04** (F04): Como usuário, quero ver todas as minhas séries organizadas por status, para ter uma visão geral rápida da minha lista.
- **US05** (F05): Como usuário, quero ver estatísticas do que já assisti, para entender melhor meus hábitos de consumo.
- **US06** (F06): Como usuário, quero dar uma nota pessoal de 1 a 5 pra série, para lembrar o que achei dela depois.
- **US07** (F07): Como usuário, quero que meus dados continuem salvos mesmo se eu fechar o navegador, para não precisar reorganizar tudo de novo.

## 4. Funcionalidades

### F01 — Buscar séries

**Descrição:** Campo de busca na Home que consulta o endpoint `/search/tv` da TMDB e exibe os resultados em cards (poster, nome, ano de lançamento).

**Critérios de aceitação:**
- [ ] O usuário digita um termo e, ao buscar, os resultados aparecem em cards
- [ ] Cada card mostra poster, nome e ano
- [ ] Buscas sem resultado exibem uma mensagem de "nenhuma série encontrada"
- [ ] Falha na API exibe uma mensagem de erro amigável

**Estados:**
- [x] Inicial (campo vazio, nenhum resultado)
- [x] Carregando (spinner/skeleton enquanto busca)
- [x] Sucesso (grid de resultados)
- [x] Vazio (busca sem resultados)
- [x] Erro (falha na requisição)

### F02 — Adicionar série e definir status

**Descrição:** A partir de um card de busca ou da página de detalhes, o usuário adiciona a série à lista pessoal e escolhe um status: "quero assistir", "assistindo" ou "assistido". O status pode ser alterado depois a qualquer momento.

**Critérios de aceitação:**
- [ ] É possível adicionar uma série ainda não salva
- [ ] É possível trocar o status de uma série já salva
- [ ] O status muda automaticamente para "assistido" quando todos os episódios forem marcados (ver F03)

**Estados:**
- [x] Inicial (série não adicionada)
- [x] Sucesso (série adicionada/atualizada)
- [ ] Carregando (não se aplica — operação local)
- [ ] Vazio (não se aplica)
- [x] Erro (falha ao salvar no localStorage)

### F03 — Progresso por episódio

**Descrição:** Na página de detalhes da série (`/serie/:id`), o usuário vê as temporadas (consumindo `/tv/{id}` e `/tv/{id}/season/{numero}` da TMDB) em formato de acordeão e marca, episódio por episódio, o que já assistiu.

**Critérios de aceitação:**
- [ ] As temporadas da série são listadas corretamente
- [ ] Ao abrir uma temporada, os episódios aparecem com checkbox
- [ ] Marcar/desmarcar um episódio atualiza o progresso salvo
- [ ] Quando 100% dos episódios estão marcados, o status da série vira "assistido" automaticamente

**Estados:**
- [x] Inicial (nenhum episódio marcado)
- [x] Carregando (buscando temporadas/episódios na API)
- [x] Sucesso (dados carregados e progresso exibido)
- [x] Vazio (série sem temporadas cadastradas na API)
- [x] Erro (falha ao buscar dados da API)

### F04 — Minhas Séries

**Descrição:** Página que lista todas as séries salvas pelo usuário, com filtro por status (todas / quero assistir / assistindo / assistido).

**Critérios de aceitação:**
- [ ] Lista todas as séries salvas no localStorage
- [ ] Filtro por status funciona corretamente
- [ ] Cada item mostra poster, nome, status, progresso (ex: "12/20 episódios") e nota (se houver)
- [ ] Lista vazia exibe mensagem incentivando a busca de séries

**Estados:**
- [x] Inicial (nenhuma série ainda salva)
- [ ] Carregando (não se aplica — leitura local é imediata)
- [x] Sucesso (lista exibida)
- [x] Vazio (nenhuma série no filtro selecionado)
- [ ] Erro (não se aplica)

### F05 — Estatísticas visuais

**Descrição:** Página com cards numéricos (total de séries por status, total de episódios assistidos, horas estimadas assistidas, nota média dada) e um gráfico de barras simples (feito em CSS puro, sem lib) mostrando os gêneros mais assistidos, calculados a partir dos gêneros das séries salvas.

**Critérios de aceitação:**
- [ ] Cards numéricos batem com os dados salvos
- [ ] Horas estimadas = episódios assistidos × duração média do episódio
- [ ] Gráfico de gêneros reflete corretamente a proporção de cada gênero
- [ ] Página informa quando não há dados suficientes para gerar estatísticas

**Estados:**
- [x] Inicial (nenhum dado ainda)
- [ ] Carregando (não se aplica — cálculo local é imediato)
- [x] Sucesso (estatísticas exibidas)
- [x] Vazio (usuário ainda não assistiu nada)
- [ ] Erro (não se aplica)

### F06 — Nota pessoal por série

**Descrição:** Campo opcional de 1 a 5 (estrelas ou números) na página de detalhes, para o usuário avaliar séries que já assistiu ou está assistindo.

**Critérios de aceitação:**
- [ ] É possível dar, alterar ou remover a nota a qualquer momento
- [ ] A nota aparece na lista "Minhas Séries"
- [ ] A nota média entra no cálculo da página de Estatísticas

**Estados:**
- [x] Inicial (sem nota)
- [x] Sucesso (nota salva)
- [ ] Carregando (não se aplica)
- [ ] Vazio (não se aplica)
- [ ] Erro (não se aplica)

### F07 — Persistência local

**Descrição:** Todos os dados de "Minhas Séries" (status, progresso por episódio, notas) são salvos no `localStorage` do navegador, permitindo que os dados persistam entre sessões sem necessidade de login ou backend.

**Critérios de aceitação:**
- [ ] Dados continuam disponíveis após recarregar a página
- [ ] Dados continuam disponíveis após fechar e reabrir o navegador
- [ ] Nenhum dado é perdido ao navegar entre páginas da aplicação

**Estados:**
- [x] Inicial (localStorage vazio na primeira visita)
- [x] Sucesso (leitura/escrita funcionando)
- [ ] Carregando (não se aplica)
- [ ] Vazio (primeira visita, sem dados)
- [x] Erro (localStorage indisponível/corrompido — aplicação segue funcionando com lista vazia)

## 5. Regras do Produto

- Cada série na lista pessoal tem exatamente um status: "quero assistir", "assistindo" ou "assistido" — nunca mais de um ao mesmo tempo.
- O status muda automaticamente para "assistido" quando 100% dos episódios da série estão marcados como assistidos.
- Uma série não pode ser adicionada duas vezes à lista pessoal (o botão "Adicionar" fica desabilitado se ela já foi salva).
- A nota pessoal é opcional, vai de 1 a 5, e pode ser alterada ou removida a qualquer momento — não é obrigatória pra usar o app.
- O MVP cobre apenas séries de TV; filmes estão fora do escopo (ver seção 6).
- Não existe login ou conta de usuário: todos os dados pertencem ao navegador de quem está usando (localStorage), sem sincronização entre dispositivos ou navegadores.
- As estatísticas de gêneros mais assistidos só consideram séries com pelo menos um episódio marcado como assistido.
- Horas estimadas assistidas = número de episódios assistidos × 45 minutos (duração média de episódio usada como referência).

## 6. Fora do Escopo

- Filmes (o MVP cobre apenas séries)
- Login/autenticação e contas de usuário
- Comunidade, comentários, curtidas ou seguir outros usuários
- Recomendações personalizadas baseadas em algoritmo
- Backend próprio (toda persistência é local, via localStorage)
- Sincronização entre dispositivos
- Onde assistir / links para streamings
- Notificações de novos episódios
