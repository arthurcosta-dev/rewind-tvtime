const CORES = ["var(--mostarda)", "var(--verde)", "var(--tijolo)", "#7a6f4f", "#4a5b57"];

export default function GenreBarChart({ dadosPorGenero }) {
  if (dadosPorGenero.length === 0) {
    return null;
  }

  const maiorValor = Math.max(...dadosPorGenero.map((item) => item.quantidade));

  return (
    <div className="grafico-generos">
      {dadosPorGenero.map((item, indice) => (
        <div className="barra-genero-linha" key={item.genero}>
          <div className="barra-genero-nome">{item.genero}</div>
          <div className="barra-genero-trilho">
            <div
              className="barra-genero-preenchimento"
              style={{
                width: `${(item.quantidade / maiorValor) * 100}%`,
                backgroundColor: CORES[indice % CORES.length],
              }}
            />
          </div>
          <div className="barra-genero-valor">{item.quantidade}</div>
        </div>
      ))}
    </div>
  );
}
