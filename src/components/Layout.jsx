import { Outlet } from "react-router-dom";
import Header from "./Header";

// Layout compartilhado por todas as páginas: o cabeçalho fica fixo
// e o conteúdo de cada rota é renderizado no lugar do <Outlet />.
export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
