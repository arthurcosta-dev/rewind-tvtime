import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import EpisodeItem from "./EpisodeItem";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

function contarAssistidosDaTemporada(progresso, numeroTemporada) {
  const prefixo = `S${numeroTemporada}E`;
  return Object.keys(progresso).filter((chave) => chave.startsWith(prefixo) && progresso[chave])
    .length;
}

export default function SeasonAccordion({
  temporadas,
  temporadaSelecionada,
  episodios,
  carregandoEpisodios,
  erroEpisodios,
  progresso,
  aoSelecionarTemporada,
  aoTentarNovamente,
  aoMarcarEpisodio,
}) {
  return (
    <div>
      {temporadas.map((temporada) => {
        const aberta = temporadaSelecionada === temporada.season_number;
        const assistidos = contarAssistidosDaTemporada(progresso, temporada.season_number);

        return (
          <div className="temporada" key={temporada.season_number}>
            <button
              className="temporada-cabecalho"
              onClick={() => aoSelecionarTemporada(aberta ? null : temporada.season_number)}
            >
              <span>{temporada.name}</span>
              <span className="temporada-progresso">
                {assistidos}/{temporada.episode_count} episódios
                {aberta ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </button>

            {aberta && (
              <div className="lista-episodios">
                {carregandoEpisodios && <Loader mensagem="Carregando episódios..." />}
                {erroEpisodios && !carregandoEpisodios && (
                  <ErrorState
                    mensagem={erroEpisodios}
                    aoTentarNovamente={aoTentarNovamente}
                  />
                )}
                {temporada.episode_count === 0 && (
                  <EmptyState mensagem="Nenhum episódio cadastrado nesta temporada." />
                )}
                {!carregandoEpisodios &&
                  !erroEpisodios &&
                  episodios.map((episodio) => (
                    <EpisodeItem
                      key={episodio.id}
                      episodio={episodio}
                      numeroTemporada={temporada.season_number}
                      assistido={Boolean(
                        progresso[`S${temporada.season_number}E${episodio.episode_number}`]
                      )}
                      aoMarcar={(numeroEpisodio, assistido) =>
                        aoMarcarEpisodio(temporada.season_number, numeroEpisodio, assistido)
                      }
                    />
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
