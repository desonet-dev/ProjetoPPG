import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";

export default function App() {
  const [usuario, setUsuario] = useState(undefined); // undefined = ainda verificando
  const [tela, setTela] = useState("login");

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) =>
        setUsuario(u ? { nome: u.displayName, email: u.email } : null)
      ),
    []
  );

  if (usuario === undefined) return null;
  if (usuario) return <Home usuario={usuario} />;
  if (tela === "cadastro")
    return (
      <Cadastro
        irParaLogin={() => setTela("login")}
        aoCriar={(nome) => setUsuario((u) => u && { ...u, nome })}
      />
    );
  return <Login irParaCadastro={() => setTela("cadastro")} />;
}
