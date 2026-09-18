import { Link } from "react-router-dom";
import { FiFilm } from "react-icons/fi";
import EmptyState from "../components/EmptyState";

// Rota "*": aparece quando o endereço digitado não existe no app.
export default function NaoEncontrada() {
  return (
    <div>
      <h1>Página não encontrada</h1>
      <EmptyState mensagem="Esse endereço não existe no Rewind." icone={<FiFilm />} />
      <p>
        <Link to="/">Voltar para a busca</Link>
      </p>
    </div>
  );
}
