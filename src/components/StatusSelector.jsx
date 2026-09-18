const OPCOES = [
  { valor: "quero_assistir", rotulo: "Quero assistir" },
  { valor: "assistindo", rotulo: "Assistindo" },
  { valor: "assistido", rotulo: "Assistido" },
];

export default function StatusSelector({ statusAtual, aoMudar }) {
  return (
    <div className="seletor-status" role="group" aria-label="Status da série">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.valor}
          className={`${opcao.valor}${statusAtual === opcao.valor ? " selecionado" : ""}`}
          onClick={() => aoMudar(opcao.valor)}
          type="button"
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}

export function rotuloDoStatus(status) {
  const encontrada = OPCOES.find((opcao) => opcao.valor === status);
  return encontrada ? encontrada.rotulo : status;
}
