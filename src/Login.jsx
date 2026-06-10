import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailFormatado = email.trim().toLowerCase();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: emailFormatado,
        senha,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.usuario.email);
      localStorage.setItem("nome", response.data.usuario.nome);
      localStorage.setItem("is_admin", response.data.usuario.is_admin);

      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro no login");
    }
  };
  

  return (
    <div className="container">
      <div className="card">
        <h1>Login - TrackRep</h1>

        <p>Entre na sua conta para acompanhar seus treinos.</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Entrar</button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;