import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  const [treinoEmAndamento, setTreinoEmAndamento] = useState(false);
  const [mostrarModalExercicio, setMostrarModalExercicio] = useState(false);
  const [exerciciosTreino, setExerciciosTreino] = useState([]);
  const [nomeExercicio, setNomeExercicio] = useState("");
  const [dataTreino, setDataTreino] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tempoTreino, setTempoTreino] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

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

  useEffect(() => {
    if (location.state?.abrirModalExercicio) {
      setMostrarModalExercicio(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    let intervalo;

    if (cronometroAtivo) {
      intervalo = setInterval(() => {
        setTempoTreino((tempoAnterior) => tempoAnterior + 1);
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [cronometroAtivo]);

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
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
    navigate("/");
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    }

    if (minutos > 0) {
      return `${minutos}m ${segs}s`;
    }

    return `${segs}s`;
  };

  const adicionarExercicio = () => {
    if (!nomeExercicio.trim()) return;

    if (!treinoEmAndamento) {
      setTempoTreino(0);
      setCronometroAtivo(true);
    }

    setTreinoEmAndamento(true);

    setExerciciosTreino([
      ...exerciciosTreino,
      {
        nome: nomeExercicio,
        series: [{ carga: "", reps: "" }],
      },
    ]);

    setNomeExercicio("");
    setMostrarModalExercicio(false);
  };

  const adicionarSerie = (exercicioIndex) => {
    const novosExercicios = [...exerciciosTreino];

    novosExercicios[exercicioIndex].series.push({
      carga: "",
      reps: "",
    });

    setExerciciosTreino(novosExercicios);
  };

  const atualizarSerie = (exercicioIndex, serieIndex, campo, valor) => {
    const novosExercicios = [...exerciciosTreino];

    novosExercicios[exercicioIndex].series[serieIndex][campo] = valor;

    setExerciciosTreino(novosExercicios);
  };

  const excluirExercicio = (exercicioIndex) => {
    const novosExercicios = exerciciosTreino.filter(
      (_, index) => index !== exercicioIndex
    );

    setExerciciosTreino(novosExercicios);
  };

  const excluirSerie = (exercicioIndex, serieIndex) => {
    const novosExercicios = [...exerciciosTreino];

    novosExercicios[exercicioIndex].series = novosExercicios[
      exercicioIndex
    ].series.filter((_, index) => index !== serieIndex);

    setExerciciosTreino(novosExercicios);
  };

  const salvarTreino = async () => {
    if (exerciciosTreino.length === 0) {
      alert("Adicione pelo menos um exercício antes de salvar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/treinos/sessao",
        {
          exercicios: exerciciosTreino,
          data: dataTreino,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Treino salvo com sucesso!");

      setExerciciosTreino([]);
      setTreinoEmAndamento(false);
      setCronometroAtivo(false);
      setTempoTreino(0);
      setDataTreino(new Date().toISOString().split("T")[0]);

      await buscarTreinos();
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao salvar treino");
    }
  };

  const totalSeries = exerciciosTreino.reduce(
    (total, exercicio) => total + exercicio.series.length,
    0
  );

  const volumeTotal = exerciciosTreino.reduce((total, exercicio) => {
    const volumeExercicio = exercicio.series.reduce((subtotal, serie) => {
      const carga = Number(serie.carga) || 0;
      const reps = Number(serie.reps) || 0;

      return subtotal + carga * reps;
    }, 0);

    return total + volumeExercicio;
  }, 0);

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
              onClick={() => setMostrarModalExercicio(true)}
            >
              + Adicionar Exercício
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

        {treinoEmAndamento ? (
          <section className="chart-card training-card">
            <h2>Treinamento</h2>

            <div className="training-stats">
              <div className="training-stat">
                <p>Duração</p>
                <h3>{formatarTempo(tempoTreino)}</h3>
              </div>

              <div className="training-stat">
                <p>Volume</p>
                <h3>{volumeTotal} kg</h3>
              </div>

              <div className="training-stat">
                <p>Séries</p>
                <h3>{totalSeries}</h3>
              </div>
            </div>

            {exerciciosTreino.map((exercicio, exercicioIndex) => (
              <div key={exercicioIndex} className="exercise-card">
                <h3>{exercicio.nome}</h3>

                <table className="exercise-table">
                  <thead>
                    <tr>
                      <th>SÉRIE</th>
                      <th>KG</th>
                      <th>REPS</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {exercicio.series.map((serie, serieIndex) => (
                      <tr key={serieIndex}>
                        <td>{serieIndex + 1}</td>

                        <td>
                          <input
                            type="number"
                            value={serie.carga}
                            onChange={(e) =>
                              atualizarSerie(
                                exercicioIndex,
                                serieIndex,
                                "carga",
                                e.target.value
                              )
                            }
                            className="series-input"
                            placeholder="0"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={serie.reps}
                            onChange={(e) =>
                              atualizarSerie(
                                exercicioIndex,
                                serieIndex,
                                "reps",
                                e.target.value
                              )
                            }
                            className="series-input"
                            placeholder="0"
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-serie-button"
                            onClick={() =>
                              excluirSerie(exercicioIndex, serieIndex)
                            }
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="button"
                  className="add-series-button"
                  onClick={() => adicionarSerie(exercicioIndex)}
                >
                  + Adicionar Série
                </button>

                <button
                  type="button"
                  className="delete-exercise-button"
                  onClick={() => excluirExercicio(exercicioIndex)}
                >
                  Excluir Exercício
                </button>
              </div>
            ))}

            <button
              className="new-workout-button"
              onClick={() => setMostrarModalExercicio(true)}
              style={{ marginTop: "20px" }}
            >
              + Adicionar Exercício
            </button>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={salvarTreino}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                }}
              >
                Salvar Treino
              </button>

              <button
                type="button"
                onClick={() => {
                  setExerciciosTreino([]);
                  setTreinoEmAndamento(false);
                  setCronometroAtivo(false);
                  setTempoTreino(0);
                  setDataTreino(new Date().toISOString().split("T")[0]);
                }}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Descartar Treino
              </button>
            </div>
          </section>
        ) : (
          <section>
            <h2>Todos os treinos</h2>

            <ListaTreinos treinos={treinos} excluirTreino={excluirTreino} />
          </section>
        )}
      </main>

      {mostrarModalExercicio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Exercício</h2>

            <input
              type="text"
              placeholder="Nome do exercício"
              value={nomeExercicio}
              onChange={(e) => setNomeExercicio(e.target.value)}
            />

            <input
  type="date"
  value={dataTreino}
  max={new Date().toISOString().split("T")[0]}
  onChange={(e) => setDataTreino(e.target.value)}
  onClick={(e) => e.target.showPicker && e.target.showPicker()}
/>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button onClick={adicionarExercicio}>Adicionar</button>

              <button
                className="secondary-button"
                onClick={() => setMostrarModalExercicio(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <strong>Treino #{t.id}</strong>

                <span>
                  {t.total_series} séries •{" "}
                  {Number(t.volume_total).toLocaleString("pt-BR")} kg
                </span>

                <span>
                  {new Date(t.data_treino).toLocaleDateString("pt-BR")}
                </span>

                <div style={{ marginTop: "12px" }}>
                  {t.exercicios?.map((exercicio, index) => (
                    <p key={index} style={{ margin: "6px 0" }}>
                      {exercicio.total_series} sets {exercicio.nome}
                    </p>
                  ))}
                </div>
              </div>

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
          </div>
        ))
      )}
    </div>
  );
}

export default Treinos;