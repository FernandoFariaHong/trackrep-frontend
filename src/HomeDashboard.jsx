import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function HomeDashboard() {
  const [treinos, setTreinos] = useState([]);
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

      const response = await axios.get("http://localhost:3000/treinos/sessoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTreinos(response.data);
    } catch (error) {
      alert("Erro ao buscar treinos");
    }
  };

  const excluirTreino = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este treino?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/treinos/sessoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTreinos(treinos.filter((treino) => treino.id !== id));
      alert("Treino excluído com sucesso!");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao excluir treino");
    }
  };

  const sairDaConta = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
    navigate("/");
  };

  const hoje = new Date();

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const treinosEstaSemana = treinos.filter((treino) => {
    if (!treino.data_treino) return false;

    const dataTreino = new Date(treino.data_treino);
    return dataTreino >= inicioSemana && dataTreino <= hoje;
  }).length;

  const volumeTotal = treinos.reduce((total, treino) => {
    return total + (Number(treino.volume_total) || 0);
  }, 0);

  const minutosTotais = treinos.length * 45;
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  const datasTreino = [
    ...new Set(
      treinos
        .filter((treino) => treino.data_treino)
        .map((treino) => treino.data_treino.split("T")[0])
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let sequencia = 0;
  let dataAtual = new Date();

  for (let i = 0; i < datasTreino.length; i++) {
    const dataFormatada = dataAtual.toISOString().split("T")[0];

    if (datasTreino.includes(dataFormatada)) {
      sequencia++;
      dataAtual.setDate(dataAtual.getDate() - 1);
    } else {
      break;
    }
  }

  const ultimosTreinos = [...treinos]
    .sort((a, b) => new Date(a.data_treino) - new Date(b.data_treino))
    .slice(-7);

  const progressaoCarga = ultimosTreinos.map((treino) => ({
    label: new Date(treino.data_treino).toLocaleDateString("pt-BR"),
    carga: Number(treino.volume_total) || 0,
  }));

  const maiorCarga = Math.max(...progressaoCarga.map((item) => item.carga), 1);

  const pontosGrafico = progressaoCarga
    .map((item, index) => {
      const x = 40 + index * 90;
      const y = 220 - (item.carga / maiorCarga) * 180;
      return `${x},${y}`;
    })
    .join(" ");

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
            <p>Foco no progresso. Cada treino conta.</p>
          </div>

          <div className="header-actions">
            <button
              className="new-workout-button"
              onClick={() => navigate("/treinos")}
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
                      navigate("/perfil");
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

        <section className="stats-grid">
          <div className="stat-card">
            <p>Treinos esta semana</p>
            <h2>
              {treinosEstaSemana} <span>de 4</span>
            </h2>
          </div>

          <div className="stat-card">
            <p>Tempo total</p>
            <h2>
              {horas}h {minutos}m
            </h2>
          </div>

          <div className="stat-card">
            <p>Volume total</p>
            <h2>{volumeTotal.toLocaleString("pt-BR")} kg</h2>
          </div>

          <div className="stat-card">
            <p>Sequência</p>
            <h2>{sequencia} dias</h2>
          </div>
        </section>

        <section className="next-workout">
          <div>
            <p>Próximo treino</p>
            <h2>Peito e Bíceps</h2>
            <span>8 exercícios • ~1h 10m</span>
          </div>

          <button onClick={() => navigate("/treinos")}>Iniciar treino ▶</button>
        </section>

        <section className="chart-card">
          <h2>Progressão de carga</h2>

          <svg viewBox="0 0 540 260" className="progress-chart">
            <polyline
              points={pontosGrafico}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
            />

            {progressaoCarga.map((item, index) => {
              const x = 40 + index * 90;
              const y = 220 - (item.carga / maiorCarga) * 180;

              return (
                <g key={`${item.label}-${index}`}>
                  <circle cx={x} cy={y} r="6" fill="#3b82f6" />
                  <text
                    x={x}
                    y="245"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        <section>
          <h2>Treinos recentes</h2>
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
            <div style={{ position: "relative" }}>
              <h3 style={{ marginBottom: "12px" }}>
                Treino {new Date(t.data_treino).toLocaleDateString("pt-BR")}
              </h3>

              <p style={{ margin: "8px 0" }}>
                🏋️ {t.total_series} séries
              </p>

              <p style={{ margin: "8px 0" }}>
                📈 Volume:{" "}
                {Number(t.volume_total).toLocaleString("pt-BR")} kg
              </p>

              <div style={{ marginTop: "12px" }}>
                {t.exercicios?.map((exercicio, index) => (
                  <p key={index} style={{ margin: "6px 0" }}>
                    {exercicio.total_series} sets {exercicio.nome}
                  </p>
                ))}
              </div>

              <button
                type="button"
                onClick={() => excluirTreino(t.id)}
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
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
          </div>
        ))
      )}
    </div>
  );
}

export default HomeDashboard;