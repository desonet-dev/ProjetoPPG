import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const SUBTITULOS = [
  "Insira seus dados para criar sua conta institucional.",
  "Insira seu Email para a criação da conta PPG",
  "Insira sua senha para a criação da conta PPG",
];

export default function Cadastro({ irParaLogin, aoCriar }) {
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState({
    nome: "", sobrenome: "", email: "", confirmarEmail: "", senha: "", confirmarSenha: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const campo = (nome, placeholder, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      value={dados[nome]}
      onChange={(e) => setDados({ ...dados, [nome]: e.target.value })}
    />
  );

  function validar() {
    if (etapa === 0 && (!dados.nome.trim() || !dados.sobrenome.trim()))
      return "Preencha nome e sobrenome.";
    if (etapa === 1) {
      if (!dados.email.includes("@")) return "Digite um email válido.";
      if (dados.email !== dados.confirmarEmail) return "Os emails não são iguais.";
    }
    if (etapa === 2) {
      if (dados.senha.length < 6) return "Use pelo menos 6 caracteres na senha.";
      if (dados.senha !== dados.confirmarSenha) return "As senhas não são iguais.";
    }
    return "";
  }

  async function continuar(e) {
    e.preventDefault();
    const problema = validar();
    setErro(problema);
    if (problema) return;
    if (etapa < 2) return setEtapa(etapa + 1);

    setCarregando(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
      const nomeCompleto = `${dados.nome.trim()} ${dados.sobrenome.trim()}`;
      await updateProfile(user, { displayName: nomeCompleto });
      aoCriar(nomeCompleto);
    } catch (err) {
      setErro(
        err.code === "auth/email-already-in-use"
          ? "Este email já tem uma conta."
          : "Não foi possível criar a conta. Tente novamente."
      );
      setCarregando(false);
    }
  }

  return (
    <main className="tela">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12V9a5 5 0 0 1 10 0v3" strokeLinecap="round" />
        <rect x="5" y="12" width="18" height="12" rx="3" />
        <circle cx="14" cy="18" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <h1>Cadastrar conta</h1>
      <p className="sub">{SUBTITULOS[etapa]}</p>

      <form onSubmit={continuar}>
        {etapa === 0 && <>{campo("nome", "Nome")}{campo("sobrenome", "Sobrenome")}</>}
        {etapa === 1 && <>{campo("email", "Email", "email")}{campo("confirmarEmail", "Confirmar Email", "email")}</>}
        {etapa === 2 && <>{campo("senha", "Senha", "password")}{campo("confirmarSenha", "Confirmar Senha", "password")}</>}

        <button type="button" className="link" onClick={irParaLogin}>Já possui conta?</button>

        {erro && <p className="erro" role="alert">{erro}</p>}

        <button className="botao" disabled={carregando}>Continuar</button>
        <p className="termos">
          Ao continuar, você concorda com os <a href="#termos">Termos de Uso</a> e{" "}
          <a href="#privacidade">Política de Privacidade</a> do aplicativo.
        </p>
      </form>
    </main>
  );
}
