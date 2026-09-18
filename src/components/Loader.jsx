import { FiClock } from "react-icons/fi";

export default function Loader({ mensagem = "Carregando..." }) {
  return (
    <div className="estado">
      <FiClock className="estado-icone" />
      <p>{mensagem}</p>
    </div>
  );
}
