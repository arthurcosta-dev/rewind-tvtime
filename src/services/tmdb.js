const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

export function urlDoPoster(caminho) {
  return caminho ? `${IMAGE_BASE_URL}${caminho}` : null;
}

// F01 - Buscar séries pelo nome
export async function buscarSeries(termo) {
  const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
    termo
  )}`;
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Não foi possível buscar séries agora.");
  }
  const dados = await resposta.json();
  return dados.results || [];
}

// F02/F03 - Detalhes completos de uma série (gêneros, temporadas, total de episódios)
export async function buscarDetalhesSerie(id) {
  const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`;
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os detalhes da série.");
  }
  return resposta.json();
}

// F03 - Episódios de uma temporada específica
export async function buscarTemporada(id, numeroTemporada) {
  const url = `${BASE_URL}/tv/${id}/season/${numeroTemporada}?api_key=${API_KEY}&language=pt-BR`;
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os episódios dessa temporada.");
  }
  return resposta.json();
}
