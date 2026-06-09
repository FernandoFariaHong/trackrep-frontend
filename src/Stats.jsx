import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Stats() {
  const [treinos, setTreinos] = useState([]);
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

  const [buscaExercicio, setBuscaExercicio] = useState("");
  const [exerciciosApi, setExerciciosApi] = useState([]);
  const [carregandoApi, setCarregandoApi] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);

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

      const response = await axios.get(
        "http://localhost:3000/treinos/sessoes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTreinos(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar treinos");
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
        `http://localhost:3000/api/exercicios?busca=${encodeURIComponent(
          buscaExercicio
        )}&t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExerciciosApi(response.data.resultados || []);
    } catch (error) {
      alert("Erro ao consultar API externa");
    } finally {
      setCarregandoApi(false);
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

  const treinosEstaSemana = treinos.filter((treino) => {
    if (!treino.data_treino) return false;

    const dataTreino = new Date(treino.data_treino);
    return dataTreino >= inicioSemana && dataTreino <= hoje;
  }).length;

  const volumeTotal = treinos.reduce((total, treino) => {
    return total + Number(treino.volume_total || 0);
  }, 0);

  const totalSeries = treinos.reduce((total, treino) => {
    return total + Number(treino.total_series || 0);
  }, 0);

  const minutosTotais = totalSeries * 2;
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

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
            <p>Acompanhe sua evolução e consulte exercícios.</p>
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
    navigate("/home");
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

        <section className="chart-card">
          <h2>Estatísticas</h2>

          <p>Total de treinos: {treinos.length}</p>

          <p>Treinos esta semana: {treinosEstaSemana}</p>

          <p>Total de séries: {totalSeries}</p>

          <p>Volume total: {volumeTotal.toLocaleString("pt-BR")} kg</p>

          <p>
            Tempo estimado: {horas}h {minutos}m
          </p>
        </section>

        <section className="chart-card external-api-card">
          <h2>Pesquisar exercícios</h2>

          <p>
            Integração com API externa para buscar informações sobre exercícios.
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
              <strong>Categoria:</strong> {exercicioSelecionado.categoria}
            </p>

            <p>
              <strong>Músculos:</strong> {exercicioSelecionado.musculos}
            </p>

            <p>{exercicioSelecionado.descricao}</p>

            <button onClick={() => setExercicioSelecionado(null)}>
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

export default Stats;