# Architecture — Rewind

## 1. Visão Geral

A aplicação é uma SPA em React com React Router, dividida em 4 páginas principais, todas dentro de um layout compartilhado (`Layout.jsx`) que usa o padrão de **rota-pai com `<Outlet />`**: o cabeçalho fica fixo e o conteúdo de cada rota filha é renderizado no lugar do `<Outlet />`. O estado central — a lista de séries salvas pelo usuário ("Minhas Séries") — vive em `App.jsx` e é sincronizado com o `localStorage`. Esse estado e as funções que o alteram descem para as páginas por **props** (as rotas filhas continuam recebendo `element` com props explícitas, o `Outlet` só define onde essa página aparece dentro do layout). Cada página é responsável pelo próprio consumo de API (busca, detalhes, temporadas), mantendo `App.jsx` simples e focado em guardar/persistir os dados do usuário.

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── SeriesCard.jsx
│   ├── SeriesGrid.jsx
│   ├── StatusSelector.jsx
│   ├── RatingStars.jsx
│   ├── SeasonAccordion.jsx
│   ├── EpisodeItem.jsx
│   ├── StatCard.jsx
│   ├── GenreBarChart.jsx
│   ├── Loader.jsx
│   ├── EmptyState.jsx
│   └── ErrorState.jsx
├── pages/
│   ├── Home.jsx
│   ├── DetalheSerie.jsx
│   ├── MinhasSeries.jsx
│   └── Estatisticas.jsx
├── services/
│   └── tmdb.js
├── App.jsx
├── main.jsx
└── index.css
```

`services/tmdb.js` só isola as chamadas `fetch` em funções, pra não repetir código — nenhuma lib nova é usada. A persistência em `localStorage` (F07) não usa hook customizado: o `App.jsx` lê o valor salvo direto na inicialização do `useState` (passando uma função pra ele) e grava de novo com um `useEffect` simples sempre que `minhasSeries` muda.

## 3. Páginas e Rotas

Todas as rotas abaixo são filhas de uma rota-pai (`path="/"`) que renderiza `Layout.jsx`. O `Layout` mostra o `Header` fixo e usa `<Outlet />` no lugar onde a página da rota filha correspondente aparece.

| Página | Rota (dentro do Layout) | Objetivo |
|---|---|---|
| Home | `index` (`/`) | Buscar séries na TMDB e exibir resultados para adicionar à lista pessoal |
| Detalhe da Série | `serie/:id` | Ver temporadas/episódios da série, marcar progresso e dar nota |
| Minhas Séries | `minhas-series` | Listar séries salvas, com filtro por status |
| Estatísticas | `estatisticas` | Exibir números e gráfico de gêneros mais assistidos |

## 4. Componentes

| Componente | Responsabilidade | Props |
|---|---|---|
| Layout | Estrutura compartilhada de todas as páginas: `Header` fixo + `<Outlet />` para a página da rota atual | — |
| Header | Navegação entre páginas (usa React Router `NavLink`, que já destaca o item ativo) | — |
| SearchBar | Campo de busca controlado, dispara a busca | `valor`, `aoDigitar`, `aoBuscar` |
| SeriesGrid | Renderiza uma lista de `SeriesCard` | `series`, `idsJaSalvos`, `aoAdicionar` |
| SeriesCard | Exibe poster, nome, ano de uma série e permite adicioná-la; a navegação pro detalhe é feita com `Link`, não por prop | `serie`, `estaSalva`, `aoAdicionar` |
| StatusSelector | Botões para escolher status da série | `statusAtual`, `aoMudar` |
| RatingStars | Exibe/edita a nota de 1 a 5 | `nota`, `aoAvaliar` |
| SeasonAccordion | Lista as temporadas, expande a selecionada e mostra seus episódios | `temporadas`, `temporadaSelecionada`, `episodios`, `carregandoEpisodios`, `erroEpisodios`, `progresso`, `aoSelecionarTemporada`, `aoMarcarEpisodio` |
| EpisodeItem | Uma linha de episódio com checkbox | `episodio`, `numeroTemporada`, `assistido`, `aoMarcar` |
| StatCard | Card numérico simples (título + valor + ícone) | `titulo`, `valor`, `icone` |
| GenreBarChart | Barras (CSS) proporcionais aos gêneros mais assistidos | `dadosPorGenero` |
| Loader | Indicador de carregamento | `mensagem` |
| EmptyState | Mensagem para listas vazias | `mensagem`, `icone` |
| ErrorState | Mensagem de erro com opção de tentar novamente | `mensagem`, `aoTentarNovamente` |

## 5. Estado da Aplicação

| Estado | Onde será controlado? | Por quê? |
|---|---|---|
| `minhasSeries` (array) | `App.jsx` | É o dado central da aplicação; precisa ser lido/alterado por várias páginas (Detalhe, Minhas Séries, Estatísticas), então fica no componente mais alto e desce por props |
| `termoBusca`, `resultados` | `Home.jsx` | Só a Home usa o termo digitado e o resultado da busca na TMDB |
| `carregando`, `erro` (busca) | `Home.jsx` | Controla os estados de loading/erro específicos da busca |
| `detalhes`, `temporadaSelecionada`, `episodios` | `DetalheSerie.jsx` | Dados vindos da API específicos dessa página, dependentes do `:id` da rota e da temporada aberta |
| `carregando`, `erro` (detalhes da série) | `DetalheSerie.jsx` | Estados de loading/erro do fetch de `/tv/{id}` |
| `carregandoEpisodios`, `erroEpisodios` | `DetalheSerie.jsx` | Estados de loading/erro do fetch de `/tv/{id}/season/{numero}`, separados dos estados acima porque acontecem em momentos diferentes |
| `filtroStatus` | `MinhasSeries.jsx` | Controla apenas a exibição/filtro local dessa página, não precisa subir para `App.jsx` |

## 6. useEffect

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Persistir dados | Sempre que `minhasSeries` mudar | Escreve o array atualizado no `localStorage` |
| Buscar detalhes da série | Ao montar `DetalheSerie.jsx` ou quando o `:id` da rota mudar | `fetch` (com `async/await`) em `/tv/{id}` da TMDB para trazer nome, poster, gêneros e lista de temporadas |
| Buscar episódios da temporada | Quando `temporadaSelecionada` mudar | `fetch` (com `async/await`) em `/tv/{id}/season/{numero}` para trazer a lista de episódios daquela temporada |
| Buscar resultados (debounce) | Quando `termoBusca` mudar, em `Home.jsx` | Aguarda um pequeno intervalo (`setTimeout`/`clearTimeout` dentro do próprio `useEffect`) e então faz `fetch` (com `async/await`) em `/search/tv` para evitar uma requisição a cada tecla digitada |

> Observações:
> - A **leitura inicial** do `localStorage` (F07) não é um `useEffect` — é feita na própria inicialização do `useState` em `App.jsx`, passando uma função pra ele (`useState(() => {...})`). Essa função roda uma única vez, antes da primeira renderização, então não é um "efeito" no sentido do React — só o `useEffect` de gravação (linha acima) realmente sincroniza com algo externo a cada mudança.
> - Ao **adicionar** uma série pela primeira vez (a partir de um card de busca), também não usamos um `useEffect` — a função `adicionarSerie` (em `App.jsx`) é `async` e é chamada diretamente pelo clique do usuário, fazendo um `fetch` em `/tv/{id}` para trazer gêneros e número total de episódios antes de salvar no `minhasSeries`. É uma ação disparada pelo usuário, não um efeito de sincronização, por isso fica fora da tabela acima.

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| react-router-dom | Rotas (`/`, `/serie/:id`, `/minhas-series`, `/estatisticas`) e navegação | Biblioteca de rotas usada em aula |
| react-icons | Ícones (busca, status, estrelas, navegação) | Biblioteca de ícones definida pelo autor, evita criar SVGs de ícone na mão |
