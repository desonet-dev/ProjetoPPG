import { useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ irParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manter, setManter] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setAviso("");
    setCarregando(true);
    try {
      await setPersistence(auth, manter ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, senha);
    } catch {
      setErro("Email ou senha incorretos.");
      setCarregando(false);
    }
  }

  async function esqueciSenha() {
    setErro("");
    setAviso("");
    if (!email) return setErro("Digite seu email acima para receber o link.");
    try {
      await sendPasswordResetEmail(auth, email);
      setAviso("Enviamos um link para redefinir sua senha.");
    } catch {
      setErro("Não foi possível enviar o link. Confira o email.");
    }
  }

  return (
    <main className="tela">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12V9a5 5 0 0 1 10 0v3" strokeLinecap="round" />
        <rect x="5" y="12" width="18" height="12" rx="3" />
        <circle cx="14" cy="18" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <h1>Acessar conta</h1>
      <p className="sub">Insira seus dados para entrar na sua conta de instituição.</p>

      <form onSubmit={entrar}>
        <input type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" aria-label="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <div className="extras">
          <button type="button" className="link" onClick={esqueciSenha}>Esqueceu sua senha?</button>
          <label>
            <input type="checkbox" checked={manter} onChange={(e) => setManter(e.target.checked)} />
            Mantenha-me conectado
          </label>
        </div>

        {erro && <p className="erro" role="alert">{erro}</p>}
        {aviso && <p className="aviso">{aviso}</p>}

        <button className="botao" disabled={carregando}>Continuar</button>
        <button type="button" className="link centro" onClick={irParaCadastro}>Não possui conta?</button>
      </form>
    </main>
  );
}
