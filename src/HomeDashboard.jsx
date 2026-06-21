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
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este treino?"
    );

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
    sessionStorage.clear();
    navigate("/login");
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

  const totalSeries = treinos.reduce((total, treino) => {
    return total + (Number(treino.total_series) || 0);
  }, 0);

  const segundosTotais = treinos.reduce((total, treino) => {
  return total + (Number(treino.duracao_segundos) || 0);
}, 0);

const horas = Math.floor(segundosTotais / 3600);
const minutos = Math.floor((segundosTotais % 3600) / 60);
const segundos = segundosTotais % 60;

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

  const ultimoTreino = [...treinos].sort(
    (a, b) => new Date(b.data_treino) - new Date(a.data_treino)
  )[0];

  const ultimosTreinos = [...treinos]
    .sort((a, b) => new Date(a.data_treino) - new Date(b.data_treino))
    .slice(-7);
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
              onClick={() =>
                navigate("/treinos", { state: { abrirModalExercicio: true } })
              }
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
            <h2>{treinosEstaSemana}</h2>
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

          <div className="stat-card">
            <div className="home-stat-icon blue">
              <FiClock />
            </div>
            <p>Tempo Total</p>
            <h2>
              <h2>
  {horas}h {minutos}m {segundos}s
</h2>
            </h2>
          </div>
        </section>

        <section className="next-workout">
          <div>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              <FiActivity size={24} />
              Continue sua evolução
            </p>

            <h2>Treinos registrados: {treinos.length}</h2>

            <span>
              Último treino:{" "}
              {ultimoTreino
                ? new Date(ultimoTreino.data_treino).toLocaleDateString("pt-BR")
                : "Nenhum treino ainda"}
            </span>
          </div>

          <button
            onClick={() =>
              navigate("/treinos", { state: { abrirModalExercicio: true } })
            }
          >
            Iniciar treino ▶
          </button>
        </section>
        <section className="home-content-grid">
          <div className="chart-card">
            <h2>Treinos recentes</h2>

            {ultimosTreinos.length === 0 ? (
              <p className="empty-text">
                Nenhum treino registrado ainda.
              </p>
            ) : (
              <div className="home-training-table">
                <table>
                  <thead>
                    <tr>
                      <th>Treino</th>
                      <th>Data</th>
                      <th>Séries</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ultimosTreinos.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="training-name-cell">
                            <div className="training-icon">
                              <FiActivity />
                            </div>
                            <strong>Treino registrado</strong>
                          </div>
                        </td>

                        <td>
                          {new Date(t.data_treino).toLocaleDateString(
                            "pt-BR"
                          )}
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
                    ? new Date(
                      ultimoTreino.data_treino
                    ).toLocaleDateString("pt-BR")
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
              <div className="home-stat-icon purple small">
                <FiClock />
              </div>

              <div>
                <p>Tempo Total</p>

                <strong>
                  <strong>
  {horas}h {minutos}m {segundos}s
</strong>
                </strong>

                <span>Baseado nos treinos registrados</span>
              </div>
            </div>

            <div className="summary-item">
              <div className="home-stat-icon orange small">
                <FiZap />
              </div>

              <div>
                <p>Sequência atual</p>

                <strong>{sequencia} dias</strong>

                <span>Continue treinando</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {mostrarLogout && (
        <div className="modal-overlay">
          <div className="modal-content logout-modal">
            <h2>Sair da conta?</h2>

            <p>Tem certeza que deseja sair?</p>

            <div className="logout-actions">
              <button onClick={sairDaConta}>
                Sim, sair
              </button>

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

export default HomeDashboard;