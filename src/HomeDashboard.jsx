import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiActivity,
  FiBarChart2,
  FiUser,
  FiShield,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiZap,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

function HomeDashboard() {
  const [treinos, setTreinos] = useState([]);
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const isAdmin = localStorage.getItem("is_admin") === "1";

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
    localStorage.clear();
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

  const totalSeries = treinos.reduce((total, treino) => {
    return total + (Number(treino.total_series) || 0);
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

  const ultimoTreino = [...treinos].sort(
    (a, b) => new Date(b.data_treino) - new Date(a.data_treino)
  )[0];

  const maiorVolume = treinos.reduce((maior, treino) => {
    return Number(treino.volume_total) > Number(maior?.volume_total || 0)
      ? treino
      : maior;
  }, null);

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
            <FiHome /> Início
          </a>

          <a
            className={location.pathname === "/treinos" ? "active" : ""}
            onClick={() => navigate("/treinos")}
          >
            <FiActivity /> Treinos
          </a>

          <a
            className={location.pathname === "/estatisticas" ? "active" : ""}
            onClick={() => navigate("/estatisticas")}
          >
            <FiBarChart2 /> Estatísticas
          </a>

          <a
            className={location.pathname === "/perfil" ? "active" : ""}
            onClick={() => navigate("/perfil")}
          >
            <FiUser /> Dados da conta
          </a>

          {isAdmin && (
            <a
              className={location.pathname === "/admin" ? "active" : ""}
              onClick={() => navigate("/admin")}
            >
              <FiShield /> Dashboard ADM
            </a>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>
              {saudacao}, {nomeUsuario} 💪
            </h1>
            <p>Seu resumo de evolução no TrackRep.</p>
          </div>

          <div className="header-actions">
            <button
              className="new-workout-button"
              onClick={() => navigate("/treinos")}
            >
              <FiPlus /> Novo treino
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
            <div className="home-stat-icon blue">
              <FiCalendar />
            </div>
            <p>Treinos esta semana</p>
            <h2>
              {treinosEstaSemana} <span>de 4</span>
            </h2>
          </div>

          <div className="stat-card">
            <div className="home-stat-icon green">
              <FiTrendingUp />
            </div>
            <p>Volume total</p>
            <h2>{volumeTotal.toLocaleString("pt-BR")} kg</h2>
          </div>

          <div className="stat-card">
            <div className="home-stat-icon purple">
              <FiActivity />
            </div>
            <p>Total de séries</p>
            <h2>{totalSeries}</h2>
          </div>

          <div className="stat-card">
            <div className="home-stat-icon orange">
              <FiZap />
            </div>
            <p>Sequência atual</p>
            <h2>{sequencia} dias</h2>
          </div>
        </section>

        <section className="next-workout">
          <div>
            <p>Próximo treino</p>
            <h2>Peito e Bíceps</h2>
            <span>8 exercícios • Estimado 1h10min</span>
          </div>

          <button onClick={() => navigate("/treinos")}>Iniciar treino ▶</button>
        </section>

        <section className="home-content-grid">
          <div className="chart-card">
            <h2>Progressão de carga</h2>

            {progressaoCarga.length === 0 ? (
              <p className="empty-text">Nenhum treino registrado ainda.</p>
            ) : (
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
            )}
          </div>

          <div className="chart-card quick-summary">
            <h2>Resumo rápido</h2>

            <div className="summary-item">
              <div className="home-stat-icon blue small">
                <FiCalendar />
              </div>

              <div>
                <p>Último treino</p>
                <strong>
                  {ultimoTreino
                    ? new Date(ultimoTreino.data_treino).toLocaleDateString("pt-BR")
                    : "Nenhum treino"}
                </strong>
                <span>
                  {ultimoTreino
                    ? `${ultimoTreino.total_series} séries`
                    : "Registre seu primeiro treino"}
                </span>
              </div>
            </div>

            <div className="summary-item">
              <div className="home-stat-icon green small">
                <FiTrendingUp />
              </div>

              <div>
                <p>Maior volume</p>
                <strong>
                  {maiorVolume
                    ? `${Number(maiorVolume.volume_total).toLocaleString("pt-BR")} kg`
                    : "0 kg"}
                </strong>
                <span>
                  {maiorVolume
                    ? new Date(maiorVolume.data_treino).toLocaleDateString("pt-BR")
                    : "Sem registros"}
                </span>
              </div>
            </div>

            <div className="summary-item">
              <div className="home-stat-icon purple small">
                <FiClock />
              </div>

              <div>
                <p>Tempo estimado</p>
                <strong>
                  {horas}h {minutos}m
                </strong>
                <span>Baseado nos treinos registrados</span>
              </div>
            </div>
          </div>
        </section>

        <section className="chart-card">
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
  if (treinos.length === 0) {
    return <p className="empty-text">Nenhum treino ainda.</p>;
  }

  return (
    <div className="home-training-table">
      <table>
        <thead>
          <tr>
            <th>Treino</th>
            <th>Data</th>
            <th>Volume total</th>
            <th>Séries</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {treinos.map((t) => (
            <tr key={t.id}>
              <td>
                <div className="training-name-cell">
                  <div className="training-icon">
                    <FiActivity />
                  </div>
                  <strong>Treino registrado</strong>
                </div>
              </td>

              <td>{new Date(t.data_treino).toLocaleDateString("pt-BR")}</td>

              <td className="highlight-volume">
                {Number(t.volume_total).toLocaleString("pt-BR")} kg
              </td>

              <td>{t.total_series}</td>

              <td>
                <button
                  type="button"
                  className="home-delete-button"
                  onClick={() => excluirTreino(t.id)}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeDashboard;