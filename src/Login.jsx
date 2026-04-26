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
        senha
      });

      localStorage.setItem("token", response.data.token);

      alert("Login realizado com sucesso");

      navigate("/treinos");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro no login");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login - TrackRep</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <br /><br />

        <button type="submit">Entrar</button>

        <br /><br />

        <button type="button" onClick={() => navigate("/register")}>
          Criar conta
        </button>
      </form>
    </div>
  );
}

export default Login;