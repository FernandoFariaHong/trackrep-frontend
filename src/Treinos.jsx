import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [paginaAtiva, setPaginaAtiva] = useState("inicio");
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  const [buscaExercicio, setBuscaExercicio] = useState("");
  const [exerciciosApi, setExerciciosApi] = useState([]);
  const [carregandoApi, setCarregandoApi] = useState(false);

  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);

  const emailUsuario = localStorage.getItem("email") || "E-mail não encontrado";
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";

  const horaAtual = new Date().getHours();

  const saudacao =
    horaAtual >= 5 && horaAtual < 12
      ? "Bom dia"
      : horaAtual >= 12 && horaAtual < 18
      ? "Boa tarde"
      : "Boa noite";

  const [dadosConta, setDadosConta] = useState(() => {
    const dadosSalvos = localStorage.getItem("dadosConta");

    return dadosSalvos
      ? JSON.parse(dadosSalvos)
      : {
          medida: "",
          altura: "",
          peso: "",
        };
  });

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
      setPaginaAtiva("treinos");

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

  const buscarExerciciosApi = async () => {
    if (!buscaExercicio.trim()) {
      alert("Digite o nome de um exercício");
      return;
    }

    try {
  setCarregandoApi(true);
  setExerciciosApi([]);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3000/api/exercicios?busca=${encodeURIComponent(buscaExercicio)}&t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Resposta da API:", response.data);
      setExerciciosApi(response.data.resultados || []);
    } catch (error) {
      alert("Erro ao consultar API externa");
    } finally {
      setCarregandoApi(false);
    }
  };

  const salvarDadosConta = (event) => {
    event.preventDefault();
    localStorage.setItem("dadosConta", JSON.stringify(dadosConta));
    alert("Dados salvos com sucesso!");
  };

  const sairDaConta = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
    navigate("/");
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

      localStorage.removeItem("token");
      localStorage.removeItem("nome");
      localStorage.removeItem("email");
      localStorage.removeItem("dadosConta");

      alert("Conta excluída com sucesso.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao excluir conta");
    }
  };

  const hoje = new Date();

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const treinosEstaSemana = treinos.filter((treino) => {
    if (!treino.data_treino) return false;

    const dataTreino = new Date(treino.data_treino);
    return dataTreino >= inicioSemana && dataTreino <= hoje;
  }).length;

  const volumeTotal = treinos.reduce((total, treino) => {
    const carga = Number(treino.carga) || 0;
    const repeticoes = Number(treino.repeticoes) || 0;
    const series = Number(treino.series) || 0;

    return total + carga * repeticoes * series;
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

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  const progressaoCarga = meses.map((mes, index) => {
    const cargaMes = treinos
      .filter((treino) => {
        if (!treino.data_treino) return false;

        const dataTreino = new Date(treino.data_treino);
        return dataTreino.getMonth() === index;
      })
      .reduce((total, treino) => {
        const carga = Number(treino.carga) || 0;
        const repeticoes = Number(treino.repeticoes) || 0;
        const series = Number(treino.series) || 0;

        return total + carga * repeticoes * series;
      }, 0);

    return {
      mes,
      carga: cargaMes,
    };
  });

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
              onClick={() => setPaginaAtiva("novoTreino")}
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
                      setPaginaAtiva("estatisticas");
                      setMenuUsuarioAberto(false);
                    }}
                  >
                    Estatísticas
                  </button>

                  <button
                    onClick={() => {
                      setPaginaAtiva("perfil");
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

        {paginaAtiva === "inicio" && (
          <>
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
                  const y = 220 - (item.carga / maiorCarga) * 180;

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
              <ListaTreinos
                treinos={treinos}
                excluirTreino={excluirTreino}
              />
            </section>
          </>
        )}

        {paginaAtiva === "treinos" && (
          <section>
            <h2>Todos os treinos</h2>
            <ListaTreinos
              treinos={treinos}
              excluirTreino={excluirTreino}
            />
          </section>
        )}

        {paginaAtiva === "estatisticas" && (
          <>
            <section className="chart-card">
              <h2>Estatísticas</h2>
              <p>Total de treinos: {treinos.length}</p>
              <p>Treinos esta semana: {treinosEstaSemana}</p>
              <p>Volume total: {volumeTotal.toLocaleString("pt-BR")} kg</p>
              <p>
                Tempo estimado: {horas}h {minutos}m
              </p>
            </section>

            <section className="chart-card external-api-card">
              <h2>Pesquisar exercícios</h2>
              <p>
                Integração com API externa para buscar informações sobre
                exercícios.
              </p>

              <div className="api-search-box">
                <input
                  type="text"
                  placeholder="Ex: squat, bench, curl"
                  value={buscaExercicio}
                  onChange={(e) => setBuscaExercicio(e.target.value)}
                />

                <button type="button" onClick={buscarExerciciosApi}>
  {carregandoApi ? "Buscando..." : "Buscar"}
</button>
              </div>

              <div className="api-results">
                {exerciciosApi.length === 0 ? (
                  <p>Nenhum exercício buscado ainda.</p>
                ) : (
                  exerciciosApi.map((exercicio) => (
                    <div className="api-result-card" key={exercicio.id}>
                      <h3>{exercicio.nome}</h3>

                      <p>
                        <strong>Categoria:</strong> {exercicio.categoria}
                      </p>

                      <p>
                        <strong>Músculos:</strong> {exercicio.musculos}
                      </p>

                      <button
  type="button"
  onClick={() => setExercicioSelecionado(exercicio)}
>
  Ver detalhes
</button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {paginaAtiva === "perfil" && (
          <section className="chart-card account-card">
            <h2>Dados da conta</h2>

            <div className="account-email-box">
              <span>E-mail cadastrado</span>
              <strong>{emailUsuario}</strong>
            </div>

            <form className="account-form" onSubmit={salvarDadosConta}>
              <label>
                Medida
                <input
                  type="text"
                  placeholder="Ex: 38 cm de braço"
                  value={dadosConta.medida}
                  onChange={(e) =>
                    setDadosConta({ ...dadosConta, medida: e.target.value })
                  }
                />
              </label>

              <label>
                Altura
                <input
                  type="text"
                  placeholder="Ex: 1,78 m"
                  value={dadosConta.altura}
                  onChange={(e) =>
                    setDadosConta({ ...dadosConta, altura: e.target.value })
                  }
                />
              </label>

              <label>
                Peso
                <input
                  type="text"
                  placeholder="Ex: 82 kg"
                  value={dadosConta.peso}
                  onChange={(e) =>
                    setDadosConta({ ...dadosConta, peso: e.target.value })
                  }
                />
              </label>

              <button type="submit">Salvar dados</button>
            </form>

            <div className="delete-account-area">
              <h3>Excluir conta</h3>

              <p>
                Ao excluir sua conta, seu cadastro será removido permanentemente
                do sistema. Essa ação não poderá ser desfeita.
              </p>

              <button className="delete-account-button" onClick={excluirConta}>
                Excluir minha conta
              </button>
            </div>
          </section>
        )}

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

              {exercicioSelecionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{exercicioSelecionado.nome}</h2>

            {exercicioSelecionado.imagem ? (
              <img
                src={exercicioSelecionado.imagem}
                alt={exercicioSelecionado.nome}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  marginBottom: "15px",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              />
            ) : (
              <p>Imagem não disponível.</p>
            )}

            <p>
              <strong>Categoria:</strong>{" "}
              {exercicioSelecionado.categoria}
            </p>

            <p>
              <strong>Músculos:</strong>{" "}
              {exercicioSelecionado.musculos}
            </p>

            <p>{exercicioSelecionado.descricao}</p>

            <button
              onClick={() => setExercicioSelecionado(null)}
            >
              Fechar
            </button>
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