import { useState, useEffect } from "react";
import { FiFilm } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import SeriesGrid from "../components/SeriesGrid";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { buscarSeries } from "../services/tmdb";

export default function Home({ minhasSeries, aoAdicionar }) {
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  // Sobe 1 a cada "Tentar novamente" pra refazer a busca com o mesmo termo.
  const [tentativa, setTentativa] = useState(0);

  // F01 - busca com um pequeno atraso (debounce) pra não disparar uma requisição a cada tecla
  useEffect(() => {
    if (termoBusca.trim() === "") {
      setResultados([]);
      setErro(null);
      return;
    }

    setCarregando(true);
    setErro(null);

    const temporizador = setTimeout(async () => {
      try {
        const dados = await buscarSeries(termoBusca);
        setResultados(dados);
      } catch (erroBusca) {
        setErro(erroBusca.message);
      } finally {
        setCarregando(false);
      }
    }, 500);

    return () => clearTimeout(temporizador);
  }, [termoBusca, tentativa]);

  const idsJaSalvos = minhasSeries.map((serie) => serie.id);

  return (
    <div>
      <h1>O que você vai assistir hoje?</h1>
      <SearchBar valor={termoBusca} aoDigitar={setTermoBusca} />

      {carregando && <Loader mensagem="Sintonizando resultados..." />}

      {!carregando && erro && (
        <ErrorState mensagem={erro} aoTentarNovamente={() => setTentativa((n) => n + 1)} />
      )}

      {!carregando && !erro && termoBusca.trim() !== "" && resultados.length === 0 && (
        <EmptyState mensagem="Nenhuma série encontrada com esse nome." icone={<FiFilm />} />
      )}

      {!carregando && !erro && resultados.length > 0 && (
        <SeriesGrid series={resultados} idsJaSalvos={idsJaSalvos} aoAdicionar={aoAdicionar} />
      )}

      {termoBusca.trim() === "" && (
        <EmptyState
          mensagem="Busque uma série pelo nome pra começar a organizar o que assistir."
          icone={<FiFilm />}
        />
      )}
    </div>
  );
}
