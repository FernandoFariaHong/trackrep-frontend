import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { mascararEmail } from "./utils/mascararDados";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Perfil() {
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // ESTADOS DO PERFIL, META CORPORAL E HISTÓRICO
  // ======================================================

  const [perfil, setPerfil] = useState({
    altura: "",
    peso: "",
    peito: "",
    cintura: "",
    braco: "",
    coxa: "",
    panturrilha: "",
    objetivo_corporal: "manter_peso",
    peso_meta: "",
    data_meta: "",
  });

  const [historicoCorporal, setHistoricoCorporal] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  // Filtros por período
  const [dataInicioFiltro, setDataInicioFiltro] = useState("");
  const [dataFimFiltro, setDataFimFiltro] = useState("");

  // Paginação do histórico
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // Estados de alteração de e-mail
  const [novoEmail, setNovoEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");

  // Estados de alteração de senha
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Calculadora fitness
  const [calcPeso, setCalcPeso] = useState("");
  const [calcAltura, setCalcAltura] = useState("");
  const [calcCarga, setCalcCarga] = useState("");
  const [calcReps, setCalcReps] = useState("");

  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const emailUsuario = localStorage.getItem("email") || "E-mail não informado";
  const isAdmin = localStorage.getItem("is_admin");

  // ======================================================
  // CÁLCULOS DA CALCULADORA FITNESS
  // ======================================================

  const imc =
    calcPeso && calcAltura
      ? (Number(calcPeso) / (Number(calcAltura) * Number(calcAltura))).toFixed(2)
      : null;

  const classificacaoImc = imc
    ? Number(imc) < 18.5
      ? "Abaixo do peso"
      : Number(imc) < 25
        ? "Peso normal"
        : Number(imc) < 30
          ? "Sobrepeso"
          : "Obesidade"
    : null;

  const cargaMaxima =
    calcCarga && calcReps
      ? (Number(calcCarga) * (1 + Number(calcReps) / 30)).toFixed(1)
      : null;

  // ======================================================
  // BUSCAS INICIAIS
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    buscarPerfil();
    buscarHistoricoCorporal();
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
        objetivo_corporal: response.data.objetivo_corporal || "manter_peso",
        peso_meta: response.data.peso_meta || "",
        data_meta: response.data.data_meta
          ? String(response.data.data_meta).substring(0, 10)
          : "",
      });

      setCalcPeso(response.data.peso || "");
      setCalcAltura(response.data.altura || "");
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const buscarHistoricoCorporal = async () => {
    try {
      setCarregandoHistorico(true);

      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/perfil/historico", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistoricoCorporal(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico corporal:", error);
      setHistoricoCorporal([]);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  // ======================================================
  // ATUALIZAÇÃO DO PERFIL
  // ======================================================

  const atualizarCampoPerfil = (campo, valor) => {
    setPerfil((perfilAnterior) => ({
      ...perfilAnterior,
      [campo]: valor,
    }));

    if (campo === "peso") setCalcPeso(valor);
    if (campo === "altura") setCalcAltura(valor);
  };

  const atualizarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:3000/perfil", perfil, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Perfil, meta corporal e histórico atualizados com sucesso!");

      buscarPerfil();
      buscarHistoricoCorporal();
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao atualizar perfil");
    }
  };

  // ======================================================
  // ALTERAÇÃO DE E-MAIL, SENHA E CONTA
  // ======================================================

  const alterarEmail = async () => {
    if (!novoEmail || !confirmarEmail) {
      alert("Preencha os dois campos de e-mail.");
      return;
    }

    const emailFormatado = novoEmail.trim().toLowerCase();
    const confirmarEmailFormatado = confirmarEmail.trim().toLowerCase();

    if (emailFormatado !== confirmarEmailFormatado) {
      alert("Os e-mails não coincidem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/usuarios/alterar-email",
        { novoEmail: emailFormatado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("email", emailFormatado);

      alert("E-mail alterado com sucesso!");
      setNovoEmail("");
      setConfirmarEmail("");
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao alterar e-mail");
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

    const senhaValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]).{8,}$/;

    if (!senhaValida.test(novaSenha)) {
      alert(
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
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
    sessionStorage.clear();
    navigate("/login");
  };

  // ======================================================
  // FUNÇÕES AUXILIARES DO HISTÓRICO E EVOLUÇÃO
  // ======================================================

  const calcularIMCRegistro = (peso, altura) => {
    if (!peso || !altura) return "-";

    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    if (!pesoNumero || !alturaNumero) return "-";

    return (pesoNumero / (alturaNumero * alturaNumero)).toFixed(2);
  };

  const formatarData = (registro) => {
    const data =
      registro.data_registro ||
      registro.criado_em ||
      registro.data ||
      registro.created_at;

    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarObjetivo = (objetivo) => {
    const objetivos = {
      ganhar_massa: "Ganhar massa",
      perder_peso: "Perder peso",
      manter_peso: "Manter peso",
    };

    return objetivos[objetivo] || "Manter peso";
  };

  const formatarValorComSinal = (valor, sufixo = "") => {
    if (valor === null || valor === undefined) return "-";

    const numero = Number(valor);
    const sinal = numero > 0 ? "+" : "";

    return `${sinal}${valor}${sufixo}`;
  };

  // ======================================================
  // FILTRO POR DATA DO HISTÓRICO CORPORAL
  // ======================================================

  const historicoOrdenado = [...historicoCorporal].sort((a, b) => {
    const dataA = new Date(
      a.data_registro || a.criado_em || a.data || a.created_at || 0
    );

    const dataB = new Date(
      b.data_registro || b.criado_em || b.data || b.created_at || 0
    );

    return dataA - dataB;
  });

  const historicoFiltrado = historicoOrdenado.filter((registro) => {
    const dataRegistro = new Date(
      registro.data_registro ||
      registro.criado_em ||
      registro.data ||
      registro.created_at
    );

    if (dataInicioFiltro) {
      const inicio = new Date(`${dataInicioFiltro}T00:00:00`);

      if (dataRegistro < inicio) {
        return false;
      }
    }

    if (dataFimFiltro) {
      const fim = new Date(`${dataFimFiltro}T23:59:59`);

      if (dataRegistro > fim) {
        return false;
      }
    }

    return true;
  });

  const limparFiltroHistorico = () => {
    setDataInicioFiltro("");
    setDataFimFiltro("");
    setPaginaAtual(1);
  };

  // Sempre que o filtro mudar, volta para a primeira página
  const aplicarFiltroHistorico = () => {
    setPaginaAtual(1);
  };

  // ======================================================
  // PAGINAÇÃO DO HISTÓRICO CORPORAL
  // ======================================================

  const totalPaginas = Math.ceil(historicoFiltrado.length / itensPorPagina) || 1;

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;

  const historicoPaginado = historicoFiltrado.slice(indiceInicial, indiceFinal);

  const irPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const irProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  // ======================================================
  // CÁLCULO DA EVOLUÇÃO CORPORAL
  // Usa o primeiro e o último registro do período filtrado
  // ======================================================

  const primeiroRegistro = historicoFiltrado[0];
  const ultimoRegistro = historicoFiltrado[historicoFiltrado.length - 1];

  const pesoInicial = primeiroRegistro?.peso ? Number(primeiroRegistro.peso) : null;
  const pesoAtual = ultimoRegistro?.peso ? Number(ultimoRegistro.peso) : null;

  const imcInicial =
    primeiroRegistro?.peso && primeiroRegistro?.altura
      ? Number(calcularIMCRegistro(primeiroRegistro.peso, primeiroRegistro.altura))
      : null;

  const imcAtual =
    ultimoRegistro?.peso && ultimoRegistro?.altura
      ? Number(calcularIMCRegistro(ultimoRegistro.peso, ultimoRegistro.altura))
      : null;

  const evolucaoPeso =
    pesoInicial !== null && pesoAtual !== null
      ? (pesoAtual - pesoInicial).toFixed(2)
      : null;

  const evolucaoIMC =
    imcInicial !== null && imcAtual !== null
      ? (imcAtual - imcInicial).toFixed(2)
      : null;

  // =====================================================
  // DADOS DO GRÁFICO DE EVOLUÇÃO
  // =====================================================

  const dadosGraficoEvolucao = Object.values(
    historicoFiltrado.reduce((acumulador, registro) => {
      const dataFormatada = formatarData(registro);

      acumulador[dataFormatada] = {
        data: dataFormatada,
        peso: registro.peso ? Number(registro.peso) : null,
      };

      return acumulador;
    }, {})
  );

  // ======================================================
  // ANÁLISE DA META CORPORAL
  // Transforma os dados em informação útil para o atleta
  // ======================================================

  const pesoMeta = perfil.peso_meta ? Number(perfil.peso_meta) : null;
  const objetivoCorporal = perfil.objetivo_corporal || "manter_peso";

  let progressoMeta = null;
  let statusMeta = "Cadastre uma meta corporal para acompanhar sua evolução.";
  let diferencaParaMeta = null;

  if (pesoInicial !== null && pesoAtual !== null && pesoMeta !== null) {
    diferencaParaMeta = (pesoMeta - pesoAtual).toFixed(2);

    if (objetivoCorporal === "ganhar_massa") {
      const totalObjetivo = pesoMeta - pesoInicial;
      const progressoAtual = pesoAtual - pesoInicial;

      progressoMeta =
        totalObjetivo > 0
          ? Math.min(100, Math.max(0, (progressoAtual / totalObjetivo) * 100))
          : 0;

      statusMeta =
        pesoAtual >= pesoMeta
          ? "Meta atingida: o peso atual alcançou ou superou o peso definido."
          : `Faltam ${(pesoMeta - pesoAtual).toFixed(
            2
          )} kg para atingir a meta de ganho de massa.`;
    }

    if (objetivoCorporal === "perder_peso") {
      const totalObjetivo = pesoInicial - pesoMeta;
      const progressoAtual = pesoInicial - pesoAtual;

      progressoMeta =
        totalObjetivo > 0
          ? Math.min(100, Math.max(0, (progressoAtual / totalObjetivo) * 100))
          : 0;

      statusMeta =
        pesoAtual <= pesoMeta
          ? "Meta atingida: o peso atual está igual ou abaixo do peso definido."
          : `Faltam ${(pesoAtual - pesoMeta).toFixed(
            2
          )} kg para atingir a meta de perda de peso.`;
    }

    if (objetivoCorporal === "manter_peso") {
      const variacao = Math.abs(pesoAtual - pesoInicial);

      progressoMeta = variacao <= 1 ? 100 : Math.max(0, 100 - variacao * 10);

      statusMeta =
        variacao <= 1
          ? "Peso mantido dentro de uma variação saudável de até 1 kg."
          : `Houve variação de ${variacao.toFixed(
            2
          )} kg em relação ao peso inicial.`;
    }
  }
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
            <p>
              Gerencie suas informações pessoais, metas corporais, medidas e
              evolução física.
            </p>
          </div>
        </header>

        <section className="chart-card profile-info-grid">
          <div>
            <h2>Informações do usuário</h2>

            <p>
              <strong>Nome:</strong> {nomeUsuario}
            </p>

            <p>
              <strong>E-mail:</strong> {mascararEmail(emailUsuario)}
            </p>

            <p>
              <strong>Senha:</strong> ********
            </p>
          </div>

          <div className="calculator-card-mini">
            <h2>Calculadora Fitness</h2>

            <p className="calc-description">
              Calcule seu IMC e sua carga máxima estimada.
            </p>

            <h3>IMC</h3>

            <div className="calc-grid">
              <div>
                <label className="form-label">Peso para cálculo (kg)</label>
                <input
                  type="number"
                  placeholder="Ex: 70"
                  value={calcPeso}
                  onChange={(e) => setCalcPeso(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Altura para cálculo (m)</label>
                <input
                  type="number"
                  placeholder="Ex: 1.75"
                  value={calcAltura}
                  onChange={(e) => setCalcAltura(e.target.value)}
                />
              </div>
            </div>

            {imc && (
              <div className="calc-result">
                <strong>IMC:</strong> {imc} — {classificacaoImc}
              </div>
            )}

            <h3>1RM estimado</h3>

            <div className="calc-grid">
              <div>
                <label className="form-label">Carga utilizada (kg)</label>
                <input
                  type="number"
                  placeholder="Ex: 40"
                  value={calcCarga}
                  onChange={(e) => setCalcCarga(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Repetições realizadas</label>
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={calcReps}
                  onChange={(e) => setCalcReps(e.target.value)}
                />
              </div>
            </div>

            {cargaMaxima && (
              <div className="calc-result">
                <strong>1RM estimado:</strong> {cargaMaxima} kg
              </div>
            )}
          </div>
        </section>

        <section className="chart-card">
          <h2>Alterar e-mail</h2>

          <label className="form-label">Novo e-mail</label>
          <input
            type="email"
            placeholder="Digite o novo e-mail"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
          />

          <label className="form-label">Confirmar novo e-mail</label>
          <input
            type="email"
            placeholder="Confirme o novo e-mail"
            value={confirmarEmail}
            onChange={(e) => setConfirmarEmail(e.target.value)}
          />

          <button onClick={alterarEmail}>Alterar e-mail</button>
        </section>

        <section className="chart-card">
          <h2>Alterar senha</h2>

          <label className="form-label">Nova senha</label>
          <div className="password-field">
            <input
              type={mostrarNovaSenha ? "text" : "password"}
              placeholder="Digite a nova senha"
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

          <label className="form-label">Confirmar nova senha</label>
          <div className="password-field">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            >
              {mostrarConfirmarSenha ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button onClick={alterarSenha}>Alterar senha</button>
        </section>

        <section className="chart-card">
          <h2>Meta corporal</h2>

          <p>
            Defina um objetivo para que o sistema acompanhe se sua evolução está
            de acordo com a meta definida.
          </p>

          <label className="form-label">Objetivo corporal</label>
          <select
            value={perfil.objetivo_corporal}
            onChange={(e) =>
              atualizarCampoPerfil("objetivo_corporal", e.target.value)
            }
          >
            <option value="ganhar_massa">Ganhar massa</option>
            <option value="perder_peso">Perder peso</option>
            <option value="manter_peso">Manter peso</option>
          </select>

          <label className="form-label">Peso meta (kg)</label>
          <input
            type="number"
            placeholder="Ex: 75"
            value={perfil.peso_meta}
            onChange={(e) => atualizarCampoPerfil("peso_meta", e.target.value)}
          />

          <label className="form-label">Data limite da meta</label>
          <input
            type="date"
            value={perfil.data_meta}
            onChange={(e) => atualizarCampoPerfil("data_meta", e.target.value)}
          />

          <button
            className="save-button"
            onClick={atualizarPerfil}
          >
            Salvar meta corporal
          </button>
        </section>

        <section className="chart-card">
          <h2>Medidas corporais</h2>

          <label className="form-label">Altura (m)</label>
          <input
            type="number"
            placeholder="Ex: 1.75"
            value={perfil.altura}
            onChange={(e) => atualizarCampoPerfil("altura", e.target.value)}
          />

          <label className="form-label">Peso atual (kg)</label>
          <input
            type="number"
            placeholder="Ex: 70"
            value={perfil.peso}
            onChange={(e) => atualizarCampoPerfil("peso", e.target.value)}
          />

          <label className="form-label">Peito (cm)</label>
          <input
            type="number"
            placeholder="Ex: 95"
            value={perfil.peito}
            onChange={(e) => atualizarCampoPerfil("peito", e.target.value)}
          />

          <label className="form-label">Cintura (cm)</label>
          <input
            type="number"
            placeholder="Ex: 80"
            value={perfil.cintura}
            onChange={(e) => atualizarCampoPerfil("cintura", e.target.value)}
          />

          <label className="form-label">Braço (cm)</label>
          <input
            type="number"
            placeholder="Ex: 35"
            value={perfil.braco}
            onChange={(e) => atualizarCampoPerfil("braco", e.target.value)}
          />

          <label className="form-label">Coxa (cm)</label>
          <input
            type="number"
            placeholder="Ex: 55"
            value={perfil.coxa}
            onChange={(e) => atualizarCampoPerfil("coxa", e.target.value)}
          />

          <label className="form-label">Panturrilha (cm)</label>
          <input
            type="number"
            placeholder="Ex: 38"
            value={perfil.panturrilha}
            onChange={(e) =>
              atualizarCampoPerfil("panturrilha", e.target.value)
            }
          />

          <button onClick={atualizarPerfil}>Salvar perfil e meta</button>
        </section>

        <section className="chart-card">
          <h2>Análise da evolução corporal</h2>

          <p>
            Esta análise compara os registros do histórico corporal com a meta
            definida pelo atleta.
          </p>

          <div className="profile-info-grid">
            <div className="calc-result">
              <strong>Objetivo:</strong>{" "}
              {formatarObjetivo(perfil.objetivo_corporal)}
            </div>

            <div className="calc-result">
              <strong>Peso meta:</strong>{" "}
              {pesoMeta !== null ? `${pesoMeta.toFixed(2)} kg` : "-"}
            </div>

            <div className="calc-result">
              <strong>Data da meta:</strong>{" "}
              {perfil.data_meta
                ? new Date(`${perfil.data_meta}T00:00:00`).toLocaleDateString(
                  "pt-BR"
                )
                : "-"}
            </div>

            <div className="calc-result">
              <strong>Peso inicial:</strong>{" "}
              {pesoInicial !== null ? `${pesoInicial.toFixed(2)} kg` : "-"}
            </div>

            <div className="calc-result">
              <strong>Peso atual:</strong>{" "}
              {pesoAtual !== null ? `${pesoAtual.toFixed(2)} kg` : "-"}
            </div>

            <div className="calc-result">
              <strong>Evolução de peso:</strong>{" "}
              {formatarValorComSinal(evolucaoPeso, " kg")}
            </div>

            <div className="calc-result">
              <strong>IMC inicial:</strong>{" "}
              {imcInicial !== null ? imcInicial.toFixed(2) : "-"}
            </div>

            <div className="calc-result">
              <strong>IMC atual:</strong>{" "}
              {imcAtual !== null ? imcAtual.toFixed(2) : "-"}
            </div>

            <div className="calc-result">
              <strong>Evolução de IMC:</strong>{" "}
              {formatarValorComSinal(evolucaoIMC)}
            </div>

            <div className="calc-result">
              <strong>Progresso da meta:</strong>{" "}
              {progressoMeta !== null ? `${progressoMeta.toFixed(0)}%` : "-"}
            </div>
          </div>

          <div className="calc-result" style={{ marginTop: "16px" }}>
            <strong>Status:</strong> {statusMeta}
          </div>
        </section>

        <section className="chart-card">
          <h2>Gráfico de evolução corporal</h2>

          <p>
            <p>
              Visualize a evolução do peso corporal com base nos registros
              salvos pelo atleta.
            </p>
          </p>

          {dadosGraficoEvolucao.length === 0 ? (
            <p>Nenhum dado disponível para gerar o gráfico.</p>
          ) : (
            <div
              style={{
                width: "100%",
                height: "350px",
                marginTop: "20px",
              }}
            >
              <ResponsiveContainer>
                <LineChart data={dadosGraficoEvolucao}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                  <XAxis dataKey="data" stroke="#cbd5e1" />

                  <YAxis stroke="#cbd5e1" />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="peso"
                    name="Peso corporal (kg)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="chart-card">
          <h2>Histórico de medidas corporais</h2>

          <p>
            Use o filtro por período para analisar a evolução em um intervalo
            específico.
          </p>

          <div className="calc-grid">
            <div>
              <label className="form-label">Data inicial</label>
              <input
                type="date"
                value={dataInicioFiltro}
                onChange={(e) => setDataInicioFiltro(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Data final</label>
              <input
                type="date"
                value={dataFimFiltro}
                onChange={(e) => setDataFimFiltro(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={aplicarFiltroHistorico}>Filtrar histórico</button>
            <button className="secondary-button" onClick={limparFiltroHistorico}>
              Limpar filtro
            </button>
          </div>

          {carregandoHistorico ? (
            <p>Carregando histórico corporal...</p>
          ) : historicoFiltrado.length === 0 ? (
            <p>
              Nenhum histórico corporal encontrado para o período selecionado.
            </p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Peso</th>
                      <th>Altura</th>
                      <th>IMC</th>
                      <th>Peito</th>
                      <th>Cintura</th>
                      <th>Braço</th>
                      <th>Coxa</th>
                      <th>Panturrilha</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historicoPaginado.map((registro, index) => (
                      <tr key={registro.id || index}>
                        <td>{formatarData(registro)}</td>
                        <td>{registro.peso ? `${registro.peso} kg` : "-"}</td>
                        <td>{registro.altura ? `${registro.altura} m` : "-"}</td>
                        <td>
                          {calcularIMCRegistro(registro.peso, registro.altura)}
                        </td>
                        <td>{registro.peito ? `${registro.peito} cm` : "-"}</td>
                        <td>
                          {registro.cintura ? `${registro.cintura} cm` : "-"}
                        </td>
                        <td>{registro.braco ? `${registro.braco} cm` : "-"}</td>
                        <td>{registro.coxa ? `${registro.coxa} cm` : "-"}</td>
                        <td>
                          {registro.panturrilha
                            ? `${registro.panturrilha} cm`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={irPaginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  Anterior
                </button>

                <span>
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <button
                  onClick={irProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </section>

        <section className="chart-card">
          <h2>Conta</h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={sairDaConta}>Sair da conta</button>

            {isAdmin !== "1" && (
              <button
                onClick={excluirConta}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Excluir conta
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;