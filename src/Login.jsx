import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        senha,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/treinos");
    } catch (error) {
      alert("Erro no login");
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

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

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