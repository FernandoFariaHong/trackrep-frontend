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
      iniciarTreino();
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

  const iniciarTreino = () => {
    setTreinoEmAndamento(true);
    setCronometroAtivo(false);
    setTempoTreino(0);
    setExerciciosTreino([]);
    setDataTreino(new Date().toISOString().split("T")[0]);
    setMostrarModalExercicio(true);
  };

  const alternarCronometro = () => {
    if (exerciciosTreino.length === 0) {
      alert("Adicione pelo menos um exercício antes de iniciar o tempo.");
      return;
    }

    setCronometroAtivo(!cronometroAtivo);
  };

  const cancelarTreino = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja descartar este treino? Nenhum dado será salvo."
    );

    if (!confirmar) return;

    setExerciciosTreino([]);
    setTreinoEmAndamento(false);
    setCronometroAtivo(false);
    setTempoTreino(0);
    setDataTreino(new Date().toISOString().split("T")[0]);
  };

  const sairDaConta = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
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
    if (!nomeExercicio.trim()) {
      alert("Informe o nome do exercício.");
      return;
    }

    if (!treinoEmAndamento) {
      alert("Inicie um treino antes de adicionar exercícios.");
      return;
    }

    setExerciciosTreino([
      ...exerciciosTreino,
      {
        nome: nomeExercicio.trim(),
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

  const validarTreinoAntesDeFinalizar = () => {
    if (exerciciosTreino.length === 0) {
      alert("Adicione pelo menos um exercício antes de finalizar o treino.");
      return false;
    }

    for (const exercicio of exerciciosTreino) {
      if (!exercicio.series || exercicio.series.length === 0) {
        alert(`Adicione pelo menos uma série para ${exercicio.nome}.`);
        return false;
      }

      for (const serie of exercicio.series) {
        if (!serie.carga || Number(serie.carga) <= 0) {
          alert(`Informe a carga em todas as séries de ${exercicio.nome}.`);
          return false;
        }

        if (!serie.reps || Number(serie.reps) <= 0) {
          alert(`Informe as repetições em todas as séries de ${exercicio.nome}.`);
          return false;
        }
      }
    }

    return true;
  };

  const finalizarTreino = async () => {
    if (!validarTreinoAntesDeFinalizar()) return;

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

      alert("Treino finalizado com sucesso!");

      setExerciciosTreino([]);
      setTreinoEmAndamento(false);
      setCronometroAtivo(false);
      setTempoTreino(0);
      setDataTreino(new Date().toISOString().split("T")[0]);

      await buscarTreinos();
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao finalizar treino");
    }
  };

  const totalSeries = exerciciosTreino.reduce(
    (total, exercicio) => total + exercicio.series.length,
    0
  );
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
            <p>
              Inicie um treino, registre exercícios e finalize apenas quando
              todas as séries estiverem preenchidas.
            </p>
          </div>

          <div className="header-actions">
            {!treinoEmAndamento ? (
              <button className="new-workout-button" onClick={iniciarTreino}>
                Novo treino
              </button>
            ) : (
              <button
                className="new-workout-button"
                onClick={() => setMostrarModalExercicio(true)}
              >
                + Adicionar exercício
              </button>
            )}

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
            <h2>Treino em andamento</h2>

            <div className="training-stats">
              <div className="training-stat">
                <p>Duração</p>
                <h3>{formatarTempo(tempoTreino)}</h3>
              </div>

              <div className="training-stat">
                <p>Séries registradas</p>
                <h3>{totalSeries}</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={alternarCronometro}
              style={{
                background: cronometroAtivo ? "#f59e0b" : "#16a34a",
                color: "#fff",
                marginTop: "15px"
              }}
            >
              {cronometroAtivo ? "⏸ Pausar tempo" : "▶ Iniciar tempo"}
            </button>

            {exerciciosTreino.length === 0 ? (
              <p className="empty-text">
                Nenhum exercício adicionado ainda. Clique em “Adicionar
                exercício” para começar o treino.
              </p>
            ) : (
              exerciciosTreino.map((exercicio, exercicioIndex) => (
                <div key={exercicioIndex} className="exercise-card">
                  <h3>{exercicio.nome}</h3>

                  <table className="exercise-table">
                    <thead>
                      <tr>
                        <th>Série</th>
                        <th>Carga (kg)</th>
                        <th>Repetições</th>
                        <th>Ação</th>
                      </tr>
                    </thead>

                    <tbody>
                      {exercicio.series.map((serie, serieIndex) => (
                        <tr key={serieIndex}>
                          <td>{serieIndex + 1}</td>

                          <td>
                            <input
                              id={`carga-${exercicioIndex}-${serieIndex}`}
                              type="number"
                              min="1"
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
                              placeholder="Ex: 40"
                              aria-label={`Carga da série ${serieIndex + 1} do exercício ${exercicio.nome}`}
                              required
                            />
                          </td>

                          <td>
                            <input
                              id={`reps-${exercicioIndex}-${serieIndex}`}
                              type="number"
                              min="1"
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
                              placeholder="Ex: 10"
                              aria-label={`Repetições da série ${serieIndex + 1} do exercício ${exercicio.nome}`}
                              required
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
                    + Adicionar série
                  </button>

                  <button
                    type="button"
                    className="delete-exercise-button"
                    onClick={() => excluirExercicio(exercicioIndex)}
                  >
                    Excluir exercício
                  </button>
                </div>
              ))
            )}

            <button
              className="new-workout-button"
              onClick={() => setMostrarModalExercicio(true)}
              style={{ marginTop: "20px" }}
            >
              + Adicionar exercício
            </button>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={finalizarTreino}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                }}
              >
                Finalizar treino
              </button>

              <button
                type="button"
                onClick={cancelarTreino}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Descartar treino
              </button>
            </div>
          </section>
        ) : (
          <section className="chart-card">
            <h2>Todos os treinos finalizados</h2>

            <p>
              Os treinos só aparecem aqui depois que forem finalizados pelo
              usuário.
            </p>

            <ListaTreinos treinos={treinos} excluirTreino={excluirTreino} />
          </section>
        )}
      </main>

      {mostrarModalExercicio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar exercício</h2>

            <label className="form-label" htmlFor="nomeExercicio">
              Nome do exercício
            </label>
            <input
              id="nomeExercicio"
              type="text"
              placeholder="Ex: Supino reto"
              value={nomeExercicio}
              onChange={(e) => setNomeExercicio(e.target.value)}
            />

            <label className="form-label" htmlFor="dataTreino">
              Data do treino
            </label>
            <input
              id="dataTreino"
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
              <button onClick={adicionarExercicio}>Adicionar exercício</button>

              <button
                className="secondary-button"
                onClick={() => {
                  setNomeExercicio("");
                  setMostrarModalExercicio(false);
                }}
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
    <div className="saved-workouts-list">
      {treinos.length === 0 ? (
        <p>Nenhum treino finalizado ainda.</p>
      ) : (
        treinos.map((t) => (
          <div className="saved-workout-card" key={t.id}>
            <div className="saved-workout-top">
              <div>
                <h3>Treino #{t.id}</h3>
                <p>{new Date(t.data_treino).toLocaleDateString("pt-BR")}</p>
              </div>

              <button
                type="button"
                className="saved-workout-delete"
                onClick={() => excluirTreino(t.id)}
              >
                Excluir
              </button>
            </div>

            <div className="saved-workout-badges">
              <span>{t.exercicios?.length || 0} exercício(s)</span>
            </div>

            <div className="saved-workout-exercises">
              {t.exercicios?.map((exercicio, index) => (
                <div className="saved-exercise-block" key={index}>

                  <div className="saved-exercise-header">
                    <strong> {exercicio.nome}</strong>
                  </div>

                  <div className="saved-series-table">
                    {exercicio.series?.map((serie) => (
                      <div className="saved-series-row" key={serie.numero}>
                        <div className="saved-serie-badge">
                          Série {serie.numero}
                        </div>

                        <div className="saved-serie-carga">
                          {Number(serie.carga).toFixed(2)} kg
                        </div>

                        <div className="saved-serie-x">
                          ×
                        </div>

                        <div className="saved-serie-reps">
                          {serie.repeticoes} reps
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Treinos;