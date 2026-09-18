import { FiAlertTriangle } from "react-icons/fi";

export default function ErrorState({ mensagem, aoTentarNovamente }) {
  return (
    <div className="estado erro">
      <FiAlertTriangle className="estado-icone" />
      <p>{mensagem}</p>
      {aoTentarNovamente && (
        <button className="botao-tentar-novamente" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
