import { FiSearch } from "react-icons/fi";

export default function SearchBar({ valor, aoDigitar, aoBuscar }) {
  function lidarComEnvio(evento) {
    evento.preventDefault();
    aoBuscar(valor);
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
