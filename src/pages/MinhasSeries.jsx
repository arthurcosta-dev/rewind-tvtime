import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiFilm } from "react-icons/fi";
import EmptyState from "../components/EmptyState";
import { urlDoPoster } from "../services/tmdb";
import { rotuloDoStatus } from "../components/StatusSelector";

const FILTROS = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "quero_assistir", rotulo: "Quero assistir" },
  { valor: "assistindo", rotulo: "Assistindo" },
  { valor: "assistido", rotulo: "Assistido" },
];

export default function MinhasSeries({ minhasSeries }) {
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const seriesFiltradas =
    filtroStatus === "todos"
      ? minhasSeries
      : minhasSeries.filter((serie) => serie.status === filtroStatus);

  return (
    <div>
      <h1>Minhas Séries</h1>

      <div className="filtros">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.valor}
            className={`filtro-botao${filtroStatus === filtro.valor ? " ativo" : ""}`}
            onClick={() => setFiltroStatus(filtro.valor)}
          >
            {filtro.rotulo}
          </button>
        ))}
      </div>

      {minhasSeries.length === 0 && (
        <EmptyState
          mensagem="Você ainda não adicionou nenhuma série. Vá em Buscar pra começar."
          icone={<FiFilm />}
        />
      )}

      {minhasSeries.length > 0 && seriesFiltradas.length === 0 && (
        <EmptyState mensagem="Nenhuma série com esse status." icone={<FiFilm />} />
      )}

      {seriesFiltradas.map((serie) => {
        const poster = urlDoPoster(serie.poster_path);
        const assistidos = Object.values(serie.episodesWatched).filter(Boolean).length;

        return (
          <Link className="linha-guia" to={`/serie/${serie.id}`} key={serie.id}>
            {poster ? (
              <img className="poster-mini" src={poster} alt={`Pôster de ${serie.name}`} />
            ) : (
              <div className="poster-mini-vazio">?</div>
            )}
            <div className="linha-guia-info">
              <div className="linha-guia-titulo">{serie.name}</div>
              <div className="linha-guia-meta">
                {assistidos}/{serie.totalEpisodes || "?"} episódios
                {serie.rating ? ` · ${serie.rating} ` : ""}
                {serie.rating ? <FaStar style={{ verticalAlign: "-2px" }} /> : ""}
              </div>
            </div>
            <div className="linha-guia-acao">
              <span className={`etiqueta ${serie.status}`}>{rotuloDoStatus(serie.status)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
