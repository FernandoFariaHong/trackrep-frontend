import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const nomeUsuario = localStorage.getItem("nome") || "Usuário";

  const horaAtual = new Date().getHours();

  const saudacao =
    horaAtual >= 5 && horaAtual < 12
      ? "Bom dia"
      : horaAtual >= 12 && horaAtual < 18
      ? "Boa tarde"
      : "Boa noite";

  const [novoTreino, setNovoTreino] = useState({
    exercicio: "",
    carga: "",
    repeticoes: "",
    series: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    buscarTreinos();
  }, [navigate]);

  const buscarTreinos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/treinos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTreinos(response.data);
    } catch (error) {
      alert("Erro ao buscar treinos");
    }
  };

  const cadastrarTreino = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const treinoComData = {
        ...novoTreino,
        data: new Date().toISOString().split("T")[0],
      };

      await axios.post("http://localhost:3000/treinos", treinoComData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNovoTreino({
        exercicio: "",
        carga: "",
        repeticoes: "",
        series: "",
      });

      await buscarTreinos();
      setMostrarFormulario(false);

      alert("Treino cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar treino");
    }
  };

  const excluirTreino = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este treino?"
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/treinos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTreinos(treinos.filter((treino) => treino.id !== id));

      alert("Treino excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir treino");
    }
  };

  const sairDaConta = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
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
          <a
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            Início
          </a>

          <a
            className={location.pathname === "/treinos" ? "active" : ""}
            onClick={() => navigate("/treinos")}
          >
            Treinos
          </a>

          <a
            className={location.pathname === "/estatisticas" ? "active" : ""}
            onClick={() => navigate("/estatisticas")}
          >
            Estatísticas
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>
              {saudacao}, {nomeUsuario} 💪
            </h1>
            <p>Gerencie seus treinos cadastrados.</p>
          </div>

          <div className="header-actions">
            <button
              className="new-workout-button"
              onClick={() => setMostrarFormulario(true)}
            >
              Novo treino +
            </button>

            <div className="user-menu">
              <button
                className="user-menu-button"
                onClick={() => setMenuUsuarioAberto(!menuUsuarioAberto)}
              >
                {nomeUsuario.charAt(0).toUpperCase()}
              </button>

              {menuUsuarioAberto && (
                <div className="user-dropdown">
                  <button
                    onClick={() => {
                      navigate("/estatisticas");
                      setMenuUsuarioAberto(false);
                    }}
                  >
                    Estatísticas
                  </button>

                  <button
                    onClick={() => {
                      alert("A tela de dados da conta será separada depois.");
                      setMenuUsuarioAberto(false);
                    }}
                  >
                    Dados da conta
                  </button>

                  <button
                    className="dropdown-logout"
                    onClick={() => {
                      setMostrarLogout(true);
                      setMenuUsuarioAberto(false);
                    }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {mostrarFormulario && (
          <section className="chart-card">
            <h2>Novo treino</h2>

            <form onSubmit={cadastrarTreino}>
              <input
                type="text"
                placeholder="Exercício"
                value={novoTreino.exercicio}
                onChange={(e) =>
                  setNovoTreino({ ...novoTreino, exercicio: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Carga"
                value={novoTreino.carga}
                onChange={(e) =>
                  setNovoTreino({ ...novoTreino, carga: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Repetições"
                value={novoTreino.repeticoes}
                onChange={(e) =>
                  setNovoTreino({
                    ...novoTreino,
                    repeticoes: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Séries"
                value={novoTreino.series}
                onChange={(e) =>
                  setNovoTreino({ ...novoTreino, series: e.target.value })
                }
              />

              <button type="submit">Salvar treino</button>
            </form>
          </section>
        )}

        <section>
          <h2>Todos os treinos</h2>

          <ListaTreinos treinos={treinos} excluirTreino={excluirTreino} />
        </section>
      </main>

      {mostrarLogout && (
        <div className="modal-overlay">
          <div className="modal-content logout-modal">
            <h2>Sair da conta?</h2>
            <p>Tem certeza que deseja sair?</p>

            <div className="logout-actions">
              <button onClick={sairDaConta}>Sim, sair</button>

              <button
                className="secondary-button"
                onClick={() => setMostrarLogout(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListaTreinos({ treinos, excluirTreino }) {
  return (
    <div className="recent-list">
      {treinos.length === 0 ? (
        <p>Nenhum treino ainda.</p>
      ) : (
        treinos.map((t) => (
          <div className="recent-card" key={t.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <strong>{t.exercicio}</strong>

              <button
                type="button"
                onClick={() => excluirTreino(t.id)}
                style={{
                  width: "auto",
                  background: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </div>

            <span>
              {t.series} séries • {t.repeticoes} reps
            </span>

            <span>{t.carga} kg</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Treinos;