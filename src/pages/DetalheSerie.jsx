import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import StatusSelector from "../components/StatusSelector";
import RatingStars from "../components/RatingStars";
import SeasonAccordion from "../components/SeasonAccordion";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { buscarDetalhesSerie, buscarTemporada, urlDoPoster } from "../services/tmdb";

export default function DetalheSerie({
  minhasSeries,
  aoAdicionar,
  aoMudarStatus,
  aoAvaliar,
  aoMarcarEpisodio,
}) {
  const { id } = useParams();
  const idNumerico = Number(id);

  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [temporadaSelecionada, setTemporadaSelecionada] = useState(null);
  const [episodios, setEpisodios] = useState([]);
  const [carregandoEpisodios, setCarregandoEpisodios] = useState(false);
  const [erroEpisodios, setErroEpisodios] = useState(null);
  // Sobe 1 a cada "Tentar novamente" pra refazer a busca dos episódios da mesma temporada.
  const [tentativaEpisodios, setTentativaEpisodios] = useState(0);

  const serieSalva = minhasSeries.find((serie) => serie.id === idNumerico);

  // F03 - carrega os detalhes da série sempre que o :id da rota mudar
  useEffect(() => {
    async function carregarDetalhes() {
      setCarregando(true);
      setErro(null);
      setTemporadaSelecionada(null);

      try {
        const dados = await buscarDetalhesSerie(idNumerico);
        setDetalhes(dados);
      } catch (erroBusca) {
        setErro(erroBusca.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [idNumerico]);

  // F03 - carrega os episódios da temporada aberta
  useEffect(() => {
    if (temporadaSelecionada === null) {
      setEpisodios([]);
      return;
    }

    async function carregarEpisodios() {
      setCarregandoEpisodios(true);
      setErroEpisodios(null);

      try {
        const dados = await buscarTemporada(idNumerico, temporadaSelecionada);
        setEpisodios(dados.episodes || []);
      } catch (erroBusca) {
        setErroEpisodios(erroBusca.message);
      } finally {
        setCarregandoEpisodios(false);
      }
    }

    carregarEpisodios();
  }, [idNumerico, temporadaSelecionada, tentativaEpisodios]);

  if (carregando) return <Loader mensagem="Carregando página da série..." />;
  if (erro) return <ErrorState mensagem={erro} />;
  if (!detalhes) return null;

  const poster = urlDoPoster(detalhes.poster_path);
  const temporadasValidas = detalhes.seasons.filter((temporada) => temporada.season_number > 0);

  return (
    <div>
      <div className="detalhe-topo">
        {poster ? (
          <img className="detalhe-poster" src={poster} alt={`Pôster de ${detalhes.name}`} />
        ) : (
          <div className="poster-mini-vazio" style={{ width: "100%", height: "100%" }} />
        )}

        <div>
          <h1>{detalhes.name}</h1>
          <div className="detalhe-generos">
            {detalhes.genres.map((genero) => (
              <span className="tag-genero" key={genero.id}>
                {genero.name}
              </span>
            ))}
          </div>
          <p className="detalhe-sinopse">{detalhes.overview || "Sem sinopse disponível."}</p>

          <div className="detalhe-controles">
            {!serieSalva ? (
              <button className="botao-adicionar" onClick={() => aoAdicionar({ id: detalhes.id })}>
                <FiPlus /> Adicionar à minha lista
              </button>
            ) : (
              <>
                <div className="linha-controle">
                  <span className="linha-controle-rotulo">Status</span>
                  <StatusSelector
                    statusAtual={serieSalva.status}
                    aoMudar={(status) => aoMudarStatus(serieSalva.id, status)}
                  />
                </div>
                <div className="linha-controle">
                  <span className="linha-controle-rotulo">Sua nota</span>
                  <RatingStars
                    nota={serieSalva.rating}
                    aoAvaliar={(nota) => aoAvaliar(serieSalva.id, nota)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {serieSalva && (
        <>
          <h2>Temporadas</h2>
          {temporadasValidas.length === 0 ? (
            <EmptyState mensagem="Essa série ainda não tem temporadas cadastradas." />
          ) : (
            <SeasonAccordion
              temporadas={temporadasValidas}
              temporadaSelecionada={temporadaSelecionada}
              episodios={episodios}
              carregandoEpisodios={carregandoEpisodios}
              erroEpisodios={erroEpisodios}
              progresso={serieSalva.episodesWatched}
              aoSelecionarTemporada={setTemporadaSelecionada}
              aoTentarNovamente={() => setTentativaEpisodios((n) => n + 1)}
              aoMarcarEpisodio={(numeroTemporada, numeroEpisodio, assistido) =>
                aoMarcarEpisodio(serieSalva.id, numeroTemporada, numeroEpisodio, assistido)
              }
            />
          )}
        </>
      )}
    </div>
  );
}
