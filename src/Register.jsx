import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [nome, setNome] = useState(sessionStorage.getItem("cadastro_nome") || "");
  const [email, setEmail] = useState(sessionStorage.getItem("cadastro_email") || "");
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

  const calcularForcaSenha = (senhaDigitada) => {
    let pontos = 0;

    if (senhaDigitada.length >= 8) pontos++;
    if (/[A-Z]/.test(senhaDigitada)) pontos++;
    if (/[a-z]/.test(senhaDigitada)) pontos++;
    if (/[0-9]/.test(senhaDigitada)) pontos++;
    if (/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaDigitada)) pontos++;

    if (pontos <= 2) {
      return {
        nivel: "Fraca",
        cor: "#ef4444",
        largura: "33%",
      };
    }

    if (pontos <= 4) {
      return {
        nivel: "Média",
        cor: "#facc15",
        largura: "66%",
      };
    }

    return {
      nivel: "Forte",
      cor: "#22c55e",
      largura: "100%",
    };
  };

  const forcaSenha = calcularForcaSenha(senha);

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailFormatado = email.trim().toLowerCase();

    const senhaValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]).{8,}$/;

    if (!senhaValida.test(senha)) {
      alert(
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

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
      localStorage.setItem("email", loginResponse.data.usuario.email);
      localStorage.setItem("nome", loginResponse.data.usuario.nome);

      sessionStorage.removeItem("cadastro_nome");
      sessionStorage.removeItem("cadastro_email");

      alert("Conta criada com sucesso!");
      navigate("/home");
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
            onChange={(e) => {
              setNome(e.target.value);
              sessionStorage.setItem("cadastro_nome", e.target.value);
            }}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              sessionStorage.setItem("cadastro_email", e.target.value);
            }}
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

          {senha && (
            <>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#1e293b",
                  borderRadius: "20px",
                  marginTop: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: forcaSenha.largura,
                    height: "100%",
                    background: forcaSenha.cor,
                    transition: "0.3s",
                  }}
                />
              </div>

              <p
                style={{
                  marginTop: "5px",
                  fontSize: "13px",
                  color: forcaSenha.cor,
                  fontWeight: "600",
                }}
              >
                Senha {forcaSenha.nivel}
              </p>
            </>
          )}

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
              <span
                onClick={() => {
                  sessionStorage.setItem("cadastro_nome", nome);
                  sessionStorage.setItem("cadastro_email", email);
                  navigate("/termos");
                }}
              >
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
    </div>
  );
}

export default Register;