import { FiSearch } from "react-icons/fi";

export default function SearchBar({ valor, aoDigitar }) {
  // A busca acontece sozinha enquanto o usuário digita (ver useEffect da Home).
  // Aqui o envio do formulário só evita que a página recarregue ao apertar Enter.
  function lidarComEnvio(evento) {
    evento.preventDefault();
  }

  return (
    <form className="form-busca" onSubmit={lidarComEnvio}>
      <input
        type="text"
        placeholder="Qual série você quer organizar hoje?"
        value={valor}
        onChange={(evento) => aoDigitar(evento.target.value)}
        aria-label="Buscar série"
      />
      <button type="submit">
        <FiSearch /> Buscar
      </button>
    </form>
  );
}
