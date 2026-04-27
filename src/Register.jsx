import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!aceitouTermos) {
      alert("Você precisa aceitar os Termos de Uso e Política de Privacidade para criar a conta.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/register", {
        nome,
        email,
        senha,
      });

      const loginResponse = await axios.post("http://localhost:3000/login", {
        email,
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

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="terms">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
            />

            <label>
              Declaro que li e aceito os Termos de Uso e a Política de
              Privacidade.{" "}
              <span onClick={() => setMostrarTermos(true)}>
                Termos de Uso
              </span>
              .
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

      {mostrarTermos && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Termos de Uso - TrackRep</h2>

            <p>
              Ao utilizar o TrackRep, o usuário concorda em fornecer informações
              verdadeiras para criação da conta e registro dos treinos.
            </p>

            <p>
              Os dados informados serão utilizados apenas para funcionamento do
              sistema, incluindo autenticação, registro de treinos e
              acompanhamento da evolução de carga.
            </p>

            <p>
              As senhas são armazenadas de forma criptografada, e o acesso às
              funcionalidades protegidas é realizado por meio de autenticação.
            </p>

            <p>
              O usuário poderá solicitar a exclusão ou alteração de seus dados,
              conforme previsto na Lei Geral de Proteção de Dados (LGPD).
            </p>

            <button onClick={() => setMostrarTermos(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;