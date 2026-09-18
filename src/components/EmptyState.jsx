import { FiFilm } from "react-icons/fi";

export default function EmptyState({ mensagem, icone }) {
  return (
    <div className="estado">
      <span className="estado-icone">{icone || <FiFilm />}</span>
      <p>{mensagem}</p>
    </div>
  );
}
