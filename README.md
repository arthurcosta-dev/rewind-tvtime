# 📺 Rewind

Um guia pessoal para organizar as séries que você assiste — porque depois do fim do TV Time, ninguém mais lembra em que episódio parou.

**🔗 Projeto publicado:** [cole aqui o link da Vercel]

---

## Índice

- [Autor](#autor)
- [Problema](#problema)
- [Solução](#solução)
- [Identidade visual](#identidade-visual)
- [Tecnologias](#tecnologias)
- [API usada](#api-usada)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Uso de IA](#uso-de-ia)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Deploy](#deploy)

## Autor

- Arthur Carvalho Gomes da Costa

## Problema

Depois do encerramento do TV Time (julho de 2026), quem assiste séries perdeu uma forma simples de organizar o que já viu, o que está vendo e o que ainda quer assistir, além de acompanhar o progresso episódio a episódio e visualizar hábitos de consumo.

## Solução

O Rewind permite buscar séries, organizá-las por status (quero assistir / assistindo / assistido), marcar o progresso episódio por episódio dentro de cada temporada, dar uma nota pessoal e visualizar estatísticas de consumo — tudo salvo localmente no navegador, sem necessidade de login.

## Identidade visual

Em vez do dashboard escuro estilo streaming (padrão mais comum nesse tipo de app), o Rewind usa o conceito **"Guia de Programação"**: uma estética inspirada em guias impressos de TV e capas de fita VHS, com paleta de cores chapadas (mostarda, verde-petróleo, tijolo), tipografia condensada e etiquetas de canto cortado no lugar de cards arredondados. Justificativa completa em [`docs/references/references.md`](./docs/references/references.md).

## Tecnologias

- React (componentização e props)
- React Router (rotas aninhadas com layout compartilhado via `<Outlet />` e rota dinâmica `/serie/:id`)
- `useState` e `useEffect`
- `fetch` nativo com `async`/`await`
- react-icons

## API usada

[The Movie Database (TMDB)](https://developer.themoviedb.org/docs/getting-started) — endpoints `/search/tv`, `/tv/{id}` e `/tv/{id}/season/{numero}`.

## Funcionalidades

| Código | Funcionalidade |
|---|---|
| F01 | Buscar séries pelo nome |
| F02 | Adicionar série e definir status (quero assistir / assistindo / assistido) |
| F03 | Progresso por episódio, organizado por temporada |
| F04 | Página "Minhas Séries" com filtro por status |
| F05 | Estatísticas visuais: números e gráfico de gêneros mais assistidos |
| F06 | Nota pessoal (1 a 5) por série |
| F07 | Persistência local dos dados (localStorage) |

Objetivo, público, user stories, critérios de aceitação e regras do produto detalhados em [`docs/requirements.md`](./docs/requirements.md). Páginas, rotas, componentes, props, estados e efeitos em [`docs/architecture.md`](./docs/architecture.md).

## Estrutura do projeto

```text
rewind/
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   └── references/
│       ├── references.md
│       └── imagens/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── tmdb.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
└── README.md
```

## Uso de IA

O desenvolvimento seguiu a metodologia de Spec Driven Development, com apoio de IA nas etapas de especificação (`docs/requirements.md`, `docs/architecture.md`), decisões de design (`docs/references/references.md`) e geração inicial do código. As decisões técnicas, estéticas e de negócio — escopo do MVP, modelo de dados, identidade visual "Guia de Programação", nome do produto e ajustes para usar apenas o conteúdo visto em aula — foram feitas por mim.

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo de variáveis de ambiente e coloque sua chave da TMDB:
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` e cole sua chave em `VITE_TMDB_API_KEY` (gere uma gratuitamente em https://www.themoviedb.org/settings/api).
3. Rode o projeto em modo desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Deploy

Ao publicar na Vercel, cadastre a variável de ambiente `VITE_TMDB_API_KEY` nas configurações do projeto (Settings → Environment Variables) — o arquivo `.env` não é enviado ao repositório.
