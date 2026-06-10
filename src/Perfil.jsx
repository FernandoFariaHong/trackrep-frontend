import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { mascararEmail } from "./utils/mascararDados";

function Perfil() {
  const navigate = useNavigate();
  const location = useLocation();

  const [perfil, setPerfil] = useState({
    altura: "",
    peso: "",
    peito: "",
    cintura: "",
    braco: "",
    coxa: "",
    panturrilha: "",
  });

  const [novoEmail, setNovoEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [calcPeso, setCalcPeso] = useState("");
  const [calcAltura, setCalcAltura] = useState("");
  const [calcCarga, setCalcCarga] = useState("");
  const [calcReps, setCalcReps] = useState("");
  const [calcSeries, setCalcSeries] = useState("");

  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const emailUsuario = localStorage.getItem("email") || "E-mail não informado";
  const isAdmin = localStorage.getItem("is_admin");

  const imc =
    calcPeso && calcAltura
      ? (Number(calcPeso) / (Number(calcAltura) * Number(calcAltura))).toFixed(2)
      : null;

  const classificacaoImc = imc
    ? Number(imc) < 18.5
      ? "Abaixo do peso"
      : Number(imc) < 25
      ? "Peso normal"
      : Number(imc) < 30
      ? "Sobrepeso"
      : "Obesidade"
    : null;

  const volumeTreino =
    calcCarga && calcReps && calcSeries
      ? Number(calcCarga) * Number(calcReps) * Number(calcSeries)
      : null;

  const cargaMaxima =
    calcCarga && calcReps
      ? (Number(calcCarga) * (1 + Number(calcReps) / 30)).toFixed(1)
      : null;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    buscarPerfil();
  }, []);

  const buscarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPerfil({
        altura: response.data.altura || "",
        peso: response.data.peso || "",
        peito: response.data.peito || "",
        cintura: response.data.cintura || "",
        braco: response.data.braco || "",
        coxa: response.data.coxa || "",
        panturrilha: response.data.panturrilha || "",
      });

      setCalcPeso(response.data.peso || "");
      setCalcAltura(response.data.altura || "");
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const atualizarCampoPerfil = (campo, valor) => {
    setPerfil((perfilAnterior) => ({
      ...perfilAnterior,
      [campo]: valor,
    }));

    if (campo === "peso") setCalcPeso(valor);
    if (campo === "altura") setCalcAltura(valor);
  };

  const atualizarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:3000/perfil", perfil, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Medidas atualizadas com sucesso!");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao atualizar perfil");
    }
  };

  const alterarEmail = async () => {
    if (!novoEmail || !confirmarEmail) {
      alert("Preencha os dois campos de e-mail.");
      return;
    }

    const emailFormatado = novoEmail.trim().toLowerCase();
    const confirmarEmailFormatado = confirmarEmail.trim().toLowerCase();

    if (emailFormatado !== confirmarEmailFormatado) {
      alert("Os e-mails não coincidem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/usuarios/alterar-email",
        { novoEmail: emailFormatado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("email", emailFormatado);

      alert("E-mail alterado com sucesso!");
      setNovoEmail("");
      setConfirmarEmail("");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao alterar e-mail");
    }
  };

  const alterarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      alert("Preencha os dois campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const senhaValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]).{8,}$/;

    if (!senhaValida.test(novaSenha)) {
      alert(
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/usuarios/alterar-senha",
        { novaSenha },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Senha alterada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao alterar senha");
    }
  };

  const excluirConta = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:3000/usuarios/minha-conta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.clear();
      alert("Conta excluída com sucesso!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao excluir conta");
    }
  };

  const sairDaConta = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-box">TR</div>
          <h2>
            Track<span className="logo-highlight">Rep</span>
          </h2>
        </div>

        <nav>
          <button
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            Início
          </button>

          <button
            className={location.pathname === "/treinos" ? "active" : ""}
            onClick={() => navigate("/treinos")}
          >
            Treinos
          </button>

          <button
            className={location.pathname === "/estatisticas" ? "active" : ""}
            onClick={() => navigate("/estatisticas")}
          >
            Estatísticas
          </button>

          <button
            className={location.pathname === "/perfil" ? "active" : ""}
            onClick={() => navigate("/perfil")}
          >
            Dados da conta
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Dados da conta</h1>
            <p>Gerencie suas informações pessoais, medidas e cálculos fitness.</p>
          </div>
        </header>

        <section className="chart-card profile-info-grid">
          <div>
            <h2>Informações do usuário</h2>

            <p>
              <strong>Nome:</strong> {nomeUsuario}
            </p>

            <p>
              <strong>E-mail:</strong> {mascararEmail(emailUsuario)}
            </p>

            <p>
              <strong>Senha:</strong> ********
            </p>
          </div>

          <div className="calculator-card-mini">
            <h2>Calculadora Fitness</h2>

            <p className="calc-description">
              Calcule seu IMC, volume de treino e carga máxima estimada.
            </p>

            <h3>IMC</h3>

            <div className="calc-grid">
              <input
                type="number"
                placeholder="Peso em kg"
                value={calcPeso}
                onChange={(e) => setCalcPeso(e.target.value)}
              />

              <input
                type="number"
                placeholder="Altura em metros. Ex: 1.75"
                value={calcAltura}
                onChange={(e) => setCalcAltura(e.target.value)}
              />
            </div>

            {imc && (
              <div className="calc-result">
                <strong>IMC:</strong> {imc} — {classificacaoImc}
              </div>
            )}

            <h3>Volume e 1RM</h3>

            <div className="calc-grid calc-grid-three">
              <input
                type="number"
                placeholder="Carga em kg"
                value={calcCarga}
                onChange={(e) => setCalcCarga(e.target.value)}
              />

              <input
                type="number"
                placeholder="Repetições"
                value={calcReps}
                onChange={(e) => setCalcReps(e.target.value)}
              />

              <input
                type="number"
                placeholder="Séries"
                value={calcSeries}
                onChange={(e) => setCalcSeries(e.target.value)}
              />
            </div>

            <div className="calc-results-row">
              {volumeTreino && (
                <div className="calc-result">
                  <strong>Volume:</strong>{" "}
                  {volumeTreino.toLocaleString("pt-BR")} kg
                </div>
              )}

              {cargaMaxima && (
                <div className="calc-result">
                  <strong>1RM estimado:</strong> {cargaMaxima} kg
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="chart-card">
          <h2>Alterar e-mail</h2>

          <input
            type="email"
            placeholder="Novo e-mail"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
          />

          <input
            type="email"
            placeholder="Confirmar novo e-mail"
            value={confirmarEmail}
            onChange={(e) => setConfirmarEmail(e.target.value)}
          />

          <button onClick={alterarEmail}>Alterar e-mail</button>
        </section>

        <section className="chart-card">
          <h2>Alterar senha</h2>

          <div className="password-field">
            <input
              type={mostrarNovaSenha ? "text" : "password"}
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
            >
              {mostrarNovaSenha ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="password-field">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            >
              {mostrarConfirmarSenha ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button onClick={alterarSenha}>Alterar senha</button>
        </section>

        <section className="chart-card">
          <h2>Medidas corporais</h2>

          <input
            type="number"
            placeholder="Altura em metros. Ex: 1.75"
            value={perfil.altura}
            onChange={(e) => atualizarCampoPerfil("altura", e.target.value)}
          />

          <input
            type="number"
            placeholder="Peso em kg"
            value={perfil.peso}
            onChange={(e) => atualizarCampoPerfil("peso", e.target.value)}
          />

          <input
            type="number"
            placeholder="Peito em cm"
            value={perfil.peito}
            onChange={(e) => atualizarCampoPerfil("peito", e.target.value)}
          />

          <input
            type="number"
            placeholder="Cintura em cm"
            value={perfil.cintura}
            onChange={(e) => atualizarCampoPerfil("cintura", e.target.value)}
          />

          <input
            type="number"
            placeholder="Braço em cm"
            value={perfil.braco}
            onChange={(e) => atualizarCampoPerfil("braco", e.target.value)}
          />

          <input
            type="number"
            placeholder="Coxa em cm"
            value={perfil.coxa}
            onChange={(e) => atualizarCampoPerfil("coxa", e.target.value)}
          />

          <input
            type="number"
            placeholder="Panturrilha em cm"
            value={perfil.panturrilha}
            onChange={(e) => atualizarCampoPerfil("panturrilha", e.target.value)}
          />

          <button onClick={atualizarPerfil}>Salvar medidas</button>
        </section>

        <section className="chart-card">
          <h2>Conta</h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={sairDaConta}>Sair da conta</button>

            {isAdmin !== "1" && (
              <button
                onClick={excluirConta}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Excluir conta
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;