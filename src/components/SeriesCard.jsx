import { Link } from "react-router-dom";
import { FiPlus, FiCheck } from "react-icons/fi";
import { urlDoPoster } from "../services/tmdb";

export default function SeriesCard({ serie, estaSalva, aoAdicionar }) {
  const ano = serie.first_air_date ? serie.first_air_date.slice(0, 4) : "—";
  const poster = urlDoPoster(serie.poster_path);

  return (
    <div className="cartao-serie">
      <Link to={`/serie/${serie.id}`}>
        {poster ? (
          <img className="cartao-serie-poster" src={poster} alt={`Pôster de ${serie.name}`} />
        ) : (
          <div className="cartao-serie-poster poster-mini-vazio" style={{ height: "auto", aspectRatio: "2 / 3" }} />
        )}
      </Link>
      <div className="cartao-serie-corpo">
        <Link to={`/serie/${serie.id}`}>
          <div className="cartao-serie-titulo">{serie.name}</div>
        </Link>
        <div className="cartao-serie-ano">{ano}</div>
        <button
          className="botao-adicionar"
          disabled={estaSalva}
          onClick={() => aoAdicionar(serie)}
        >
          {estaSalva ? (
            <>
              <FiCheck /> Na sua lista
            </>
          ) : (
            <>
              <FiPlus /> Adicionar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
