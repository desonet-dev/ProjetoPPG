import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Home({ usuario }) {
  const primeiroNome = usuario.nome?.split(" ")[0];

  return (
    <>
      <header className="topo">
        <strong>PPG</strong>
        <button className="sair" onClick={() => signOut(auth)}>Sair</button>
      </header>
      <main className="home">
        <h1>Olá{primeiroNome ? `, ${primeiroNome}` : ""}!</h1>
        <p>Você está conectado como {usuario.email}.</p>
      </main>
    </>
  );
}
