import { Outlet } from "react-router-dom";
import Header from "./Header";
import ErrorState from "./ErrorState";

// Layout compartilhado por todas as páginas: o cabeçalho fica fixo
// e o conteúdo de cada rota é renderizado no lugar do <Outlet />.
// Se o App tiver uma mensagem de erro global, ela aparece acima do conteúdo.
export default function Layout({ mensagemErro }) {
  return (
    <>
      <Header />
      <main className="container">
        {mensagemErro && <ErrorState mensagem={mensagemErro} />}
        <Outlet />
      </main>
    </>
  );
}
