import { NavLink } from "react-router-dom";
import { FiSearch, FiList, FiBarChart2 } from "react-icons/fi";

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <div className="marca">
          REWIND
          <span className="marca-tag">guia de séries</span>
        </div>
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item${isActive ? " ativo" : ""}`}
          >
            <FiSearch /> Buscar
          </NavLink>
          <NavLink
            to="/minhas-series"
            className={({ isActive }) => `nav-item${isActive ? " ativo" : ""}`}
          >
            <FiList /> Minhas Séries
          </NavLink>
          <NavLink
            to="/estatisticas"
            className={({ isActive }) => `nav-item${isActive ? " ativo" : ""}`}
          >
            <FiBarChart2 /> Estatísticas
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
