import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [paginaAtiva, setPaginaAtiva] = useState("inicio");
  const [mostrarLogout, setMostrarLogout] = useState(false);

  const navigate = useNavigate();

  const [novoTreino, setNovoTreino] = useState({
    exercicio: "",
    carga: "",
    repeticoes: "",
    series: "",
  });

  useEffect(() => {
    buscarTreinos();
  }, []);

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

      await axios.post("http://localhost:3000/treinos", novoTreino, {
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
      setPaginaAtiva("treinos");

      alert("Treino cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar treino");
    }
  };

  const sairDaConta = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const progressaoCarga = [
    { mes: "Jan", carga: 4200 },
    { mes: "Fev", carga: 5100 },
    { mes: "Mar", carga: 6200 },
    { mes: "Abr", carga: 7450 },
    { mes: "Mai", carga: 8600 },
    { mes: "Jun", carga: 9800 },
  ];

  const pontosGrafico = progressaoCarga
    .map((item, index) => {
      const x = 40 + index * 90;
      const y = 220 - (item.carga / 10000) * 180;
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
            className={paginaAtiva === "inicio" ? "active" : ""}
            onClick={() => setPaginaAtiva("inicio")}
          >
            Início
          </a>

          <a
            className={paginaAtiva === "treinos" ? "active" : ""}
            onClick={() => setPaginaAtiva("treinos")}
          >
            Treinos
          </a>

          <a
            className={paginaAtiva === "estatisticas" ? "active" : ""}
            onClick={() => setPaginaAtiva("estatisticas")}
          >
            Estatísticas
          </a>

          <a
            className={paginaAtiva === "perfil" ? "active" : ""}
            onClick={() => setPaginaAtiva("perfil")}
          >
            Perfil
          </a>
        </nav>

        {/* BOTÃO SAIR */}
        <button
          className="logout-button"
          onClick={() => setMostrarLogout(true)}
        >
          Sair
        </button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Boa noite, Fernando 💪</h1>
            <p>Foco no progresso. Cada treino conta.</p>
          </div>

          <button
            className="new-workout-button"
            onClick={() => setPaginaAtiva("novoTreino")}
          >
            Novo treino +
          </button>
        </header>

        {/* INÍCIO */}
        {paginaAtiva === "inicio" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <p>Treinos esta semana</p>
                <h2>
                  3 <span>de 4</span>
                </h2>
              </div>

              <div className="stat-card">
                <p>Tempo total</p>
                <h2>4h 35m</h2>
              </div>

              <div className="stat-card">
                <p>Volume total</p>
                <h2>9.800 kg</h2>
              </div>

              <div className="stat-card">
                <p>Sequência</p>
                <h2>6 dias</h2>
              </div>
            </section>

            <section className="next-workout">
              <div>
                <p>Próximo treino</p>
                <h2>Peito e Bíceps</h2>
                <span>8 exercícios • ~1h 10m</span>
              </div>

              <button onClick={() => setPaginaAtiva("treinos")}>
                Iniciar treino ▶
              </button>
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
                  const y = 220 - (item.carga / 10000) * 180;

                  return (
                    <g key={item.mes}>
                      <circle cx={x} cy={y} r="6" fill="#3b82f6" />
                      <text x={x} y="245" textAnchor="middle">
                        {item.mes}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </section>

            <section>
              <h2>Treinos recentes</h2>
              <ListaTreinos treinos={treinos} />
            </section>
          </>
        )}

        {/* TREINOS */}
        {paginaAtiva === "treinos" && (
          <section>
            <h2>Todos os treinos</h2>
            <ListaTreinos treinos={treinos} />
          </section>
        )}

        {/* NOVO TREINO */}
        {paginaAtiva === "novoTreino" && (
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
      </main>

      {/* MODAL SAIR */}
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

/* LISTA */
function ListaTreinos({ treinos }) {
  return (
    <div className="recent-list">
      {treinos.length === 0 ? (
        <p>Nenhum treino ainda.</p>
      ) : (
        treinos.map((t) => (
          <div className="recent-card" key={t.id}>
            <strong>{t.exercicio}</strong>
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