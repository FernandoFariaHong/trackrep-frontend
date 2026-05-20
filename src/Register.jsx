import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [aceitouTermos, setAceitouTermos] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const termosAceitos = localStorage.getItem("termosAceitos");

    if (termosAceitos === "true") {
      setAceitouTermos(true);
      localStorage.removeItem("termosAceitos");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailFormatado = email.trim().toLowerCase();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (!aceitouTermos) {
      alert(
        "Você precisa aceitar os Termos de Uso e Política de Privacidade para criar a conta."
      );
      return;
    }

    try {
      await axios.post("http://localhost:3000/register", {
        nome,
        email: emailFormatado,
        senha,
      });

      const loginResponse = await axios.post("http://localhost:3000/login", {
        email: emailFormatado,
        senha,
      });

      localStorage.setItem("token", loginResponse.data.token);

      alert("Conta criada com sucesso!");
      navigate("/treinos");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao criar conta");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Criar Conta - TrackRep</h1>

        <p>Crie sua conta para acompanhar seus treinos e sua evolução.</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="password-field">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-button"
              onClick={() =>
                setMostrarConfirmarSenha(!mostrarConfirmarSenha)
              }
            >
              {mostrarConfirmarSenha ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="terms">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
            />

            <label>
              Declaro que li e aceito os Termos de Uso e a Política de
              Privacidade.{" "}
              <span onClick={() => navigate("/termos")}>Termos de Uso</span>.
            </label>
          </div>

          <button type="submit">Criar conta</button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Já tenho conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;