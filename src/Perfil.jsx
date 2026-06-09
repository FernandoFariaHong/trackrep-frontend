import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const emailUsuario = localStorage.getItem("email") || "E-mail não informado";

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
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const atualizarCampoPerfil = (campo, valor) => {
    setPerfil((perfilAnterior) => ({
      ...perfilAnterior,
      [campo]: valor,
    }));
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

  const alterarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      alert("Preencha os dois campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem.");
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
            <p>Gerencie suas informações pessoais e medidas corporais.</p>
          </div>
        </header>

        <section className="chart-card">
          <h2>Informações do usuário</h2>

          <p>
            <strong>Nome:</strong> {nomeUsuario}
          </p>

          <p>
            <strong>E-mail:</strong> {emailUsuario}
          </p>

          <p>
            <strong>Senha:</strong> ********
          </p>
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
              onClick={() =>
                setMostrarConfirmarSenha(!mostrarConfirmarSenha)
              }
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
            onChange={(e) =>
              atualizarCampoPerfil("panturrilha", e.target.value)
            }
          />

          <button onClick={atualizarPerfil}>Salvar medidas</button>
        </section>

        <section className="chart-card">
          <h2>Conta</h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={sairDaConta}>Sair da conta</button>

            <button
              onClick={excluirConta}
              style={{
                background: "#dc2626",
                color: "#fff",
              }}
            >
              Excluir conta
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;