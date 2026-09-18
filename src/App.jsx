import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DetalheSerie from "./pages/DetalheSerie";
import MinhasSeries from "./pages/MinhasSeries";
import Estatisticas from "./pages/Estatisticas";
import NaoEncontrada from "./pages/NaoEncontrada";
import { buscarDetalhesSerie } from "./services/tmdb";

const CHAVE_LOCALSTORAGE = "rewind:minhasSeries";

export default function App() {
  // F07 - lê o que já estava salvo no localStorage assim que o app carrega.
  // A função passada pro useState só roda uma vez, na primeira renderização.
  const [minhasSeries, setMinhasSeries] = useState(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE_LOCALSTORAGE);
      return salvo ? JSON.parse(salvo) : [];
    } catch (erro) {
      console.error("Não foi possível ler o localStorage:", erro);
      return [];
    }
  });

  // Mensagem de erro global (falha ao salvar no localStorage ou ao adicionar uma série).
  // É exibida no topo do conteúdo pelo Layout.
  const [mensagemErro, setMensagemErro] = useState(null);

  // F07 - toda vez que minhasSeries mudar, salva de novo no localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(minhasSeries));
    } catch (erro) {
      console.error("Não foi possível salvar no localStorage:", erro);
      setMensagemErro("Não foi possível salvar suas séries neste navegador.");
    }
  }, [minhasSeries]);

  // F02 - adiciona uma série nova buscando os detalhes completos (gêneros, total de episódios)
  async function adicionarSerie(serieBasica) {
    const jaExiste = minhasSeries.some((serie) => serie.id === serieBasica.id);
    if (jaExiste) return;

    setMensagemErro(null);

    try {
      const detalhes = await buscarDetalhesSerie(serieBasica.id);

      const novaSerie = {
        id: detalhes.id,
        name: detalhes.name,
        poster_path: detalhes.poster_path,
        genres: detalhes.genres.map((genero) => genero.name),
        status: "quero_assistir",
        totalEpisodes: detalhes.number_of_episodes || 0,
        episodesWatched: {},
        rating: null,
        addedAt: Date.now(),
      };

      // Confere de novo aqui dentro: dois cliques rápidos podem passar pela checagem
      // de cima ao mesmo tempo, e assim a série nunca é salva duas vezes.
      setMinhasSeries((atual) =>
        atual.some((serie) => serie.id === novaSerie.id) ? atual : [...atual, novaSerie]
      );
    } catch (erro) {
      console.error("Não foi possível adicionar a série:", erro);
      setMensagemErro("Não foi possível adicionar a série agora. Tente novamente.");
    }
  }

  // F02 - troca o status manualmente
  function atualizarStatus(id, novoStatus) {
    setMinhasSeries((atual) =>
      atual.map((serie) => (serie.id === id ? { ...serie, status: novoStatus } : serie))
    );
  }

  // F06 - salva/edita a nota pessoal
  function atualizarNota(id, novaNota) {
    setMinhasSeries((atual) =>
      atual.map((serie) => (serie.id === id ? { ...serie, rating: novaNota } : serie))
    );
  }

  // F03 - marca/desmarca um episódio e recalcula o status automaticamente:
  // - todos os episódios marcados -> "assistido"
  // - primeiro episódio marcado em "quero assistir" -> "assistindo"
  // - episódio desmarcado em uma série "assistido" -> volta para "assistindo"
  function marcarEpisodio(id, numeroTemporada, numeroEpisodio, assistido) {
    setMinhasSeries((atual) =>
      atual.map((serie) => {
        if (serie.id !== id) return serie;

        const chave = `S${numeroTemporada}E${numeroEpisodio}`;
        const episodesWatched = { ...serie.episodesWatched };

        if (assistido) {
          episodesWatched[chave] = true;
        } else {
          delete episodesWatched[chave];
        }

        const totalAssistidos = Object.values(episodesWatched).filter(Boolean).length;
        const completou = serie.totalEpisodes > 0 && totalAssistidos >= serie.totalEpisodes;

        let novoStatus = serie.status;
        if (completou) {
          novoStatus = "assistido";
        } else if (serie.status === "quero_assistir" && assistido) {
          novoStatus = "assistindo";
        } else if (serie.status === "assistido" && !assistido) {
          novoStatus = "assistindo";
        }

        return {
          ...serie,
          episodesWatched,
          status: novoStatus,
        };
      })
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout mensagemErro={mensagemErro} />}>
        <Route index element={<Home minhasSeries={minhasSeries} aoAdicionar={adicionarSerie} />} />
        <Route
          path="serie/:id"
          element={
            <DetalheSerie
              minhasSeries={minhasSeries}
              aoAdicionar={adicionarSerie}
              aoMudarStatus={atualizarStatus}
              aoAvaliar={atualizarNota}
              aoMarcarEpisodio={marcarEpisodio}
            />
          }
        />
        <Route path="minhas-series" element={<MinhasSeries minhasSeries={minhasSeries} />} />
        <Route path="estatisticas" element={<Estatisticas minhasSeries={minhasSeries} />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
