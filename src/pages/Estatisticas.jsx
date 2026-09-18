import { FiFilm, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";
import StatCard from "../components/StatCard";
import GenreBarChart from "../components/GenreBarChart";
import EmptyState from "../components/EmptyState";

const DURACAO_MEDIA_EPISODIO_MIN = 45;

function calcularEstatisticas(minhasSeries) {
  const totalSeries = minhasSeries.length;
  const totalAssistidas = minhasSeries.filter((serie) => serie.status === "assistido").length;

  let totalEpisodiosAssistidos = 0;
  const somaNotas = { soma: 0, quantidade: 0 };
  const contagemPorGenero = {};

  minhasSeries.forEach((serie) => {
    const assistidosDaSerie = Object.values(serie.episodesWatched).filter(Boolean).length;
    totalEpisodiosAssistidos += assistidosDaSerie;

    if (serie.rating) {
      somaNotas.soma += serie.rating;
      somaNotas.quantidade += 1;
    }

    if (assistidosDaSerie > 0) {
      serie.genres.forEach((genero) => {
        contagemPorGenero[genero] = (contagemPorGenero[genero] || 0) + assistidosDaSerie;
      });
    }
  });

  const horasEstimadas = Math.round((totalEpisodiosAssistidos * DURACAO_MEDIA_EPISODIO_MIN) / 6) / 10;
  const notaMedia = somaNotas.quantidade > 0 ? (somaNotas.soma / somaNotas.quantidade).toFixed(1) : "—";

  const generosOrdenados = Object.entries(contagemPorGenero)
    .map(([genero, quantidade]) => ({ genero, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 6);

  return {
    totalSeries,
    totalAssistidas,
    totalEpisodiosAssistidos,
    horasEstimadas,
    notaMedia,
    generosOrdenados,
  };
}

export default function Estatisticas({ minhasSeries }) {
  const {
    totalSeries,
    totalAssistidas,
    totalEpisodiosAssistidos,
    horasEstimadas,
    notaMedia,
    generosOrdenados,
  } = calcularEstatisticas(minhasSeries);

  if (totalSeries === 0) {
    return (
      <div>
        <h1>Estatísticas</h1>
        <EmptyState mensagem="Adicione e acompanhe séries pra ver suas estatísticas aqui." />
      </div>
    );
  }

  return (
    <div>
      <h1>Estatísticas</h1>

      <div className="grade-canhotos">
        <StatCard titulo="séries na lista" valor={totalSeries} icone={<FiFilm />} />
        <StatCard titulo="séries assistidas" valor={totalAssistidas} icone={<FiCheckCircle />} />
        <StatCard
          titulo="episódios assistidos"
          valor={totalEpisodiosAssistidos}
          icone={<FiClock />}
        />
        <StatCard titulo="horas estimadas" valor={horasEstimadas} icone={<FiClock />} />
        <StatCard titulo="nota média dada" valor={notaMedia} icone={<FiStar />} />
      </div>

      <h2>Gêneros mais assistidos</h2>
      {generosOrdenados.length === 0 ? (
        <EmptyState mensagem="Marque episódios como assistidos pra ver seus gêneros favoritos." />
      ) : (
        <GenreBarChart dadosPorGenero={generosOrdenados} />
      )}
    </div>
  );
}
