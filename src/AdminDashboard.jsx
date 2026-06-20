import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FiHome,
    FiUsers,
    FiActivity,
    FiCalendar,
    FiTrash2,
    FiSlash,
    FiSearch,
    FiArrowLeft,
} from "react-icons/fi";
import { mascararEmail } from "./utils/mascararDados";

function AdminDashboard() {
    const navigate = useNavigate();

    // Filtros do dashboard
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [buscaUsuario, setBuscaUsuario] = useState("");

    // Dados exibidos no painel administrativo
    // OBS: volumeTotal foi removido por solicitação da banca
    const [dados, setDados] = useState({
        totalUsuarios: 0,
        totalTreinos: 0,
        treinosHoje: 0,
        usuarios: [],
        treinos: [],
    });

    // Verifica autenticação e permissão de administrador
    useEffect(() => {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("is_admin");

        if (!token) {
            navigate("/login");
            return;
        }

        if (isAdmin !== "1") {
            alert("Acesso negado. Apenas administradores podem acessar.");
            navigate("/home");
            return;
        }

        carregarDashboard();
    }, []);

    // Busca os dados do dashboard administrativo
    async function carregarDashboard() {
        try {
            const token = localStorage.getItem("token");

            let url = "http://localhost:3000/admin/dashboard";

            if (dataInicio && dataFim) {
                url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDados(response.data);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.erro || "Erro ao carregar dashboard.");
        }
    }

    // Limpa o filtro de datas
    function limparFiltro() {
        setDataInicio("");
        setDataFim("");
        setTimeout(() => carregarDashboard(), 0);
    }

    // Exclui usuário comum
    async function excluirUsuario(id, nome) {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o usuário "${nome}"? Essa ação apagará todos os dados vinculados.`
        );

        if (!confirmar) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:3000/admin/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Usuário excluído com sucesso!");
            carregarDashboard();
        } catch (error) {
            alert(error.response?.data?.erro || "Erro ao excluir usuário.");
        }
    }

    // Filtro de pesquisa dos usuários
    const usuariosFiltrados = dados.usuarios.filter((usuario) => {
        const termo = buscaUsuario.toLowerCase();

        return (
            usuario.nome?.toLowerCase().includes(termo) ||
            usuario.email?.toLowerCase().includes(termo)
        );
    });

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-box">TR</div>
                    <h2>
                        Track<span>Rep</span>
                    </h2>
                </div>

                <nav className="admin-menu">
                    <button className="active">
                        <FiHome /> Dashboard
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("admin-usuarios")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <FiUsers /> Usuários
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("admin-treinos")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <FiActivity /> Treinos
                    </button>

                    <button onClick={() => navigate("/home")}>
                        <FiArrowLeft /> Voltar ao sistema
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>Dashboard Administrativo</h1>
                        <p>Visão geral do sistema e atividades recentes.</p>
                    </div>

                    <div className="admin-filter">
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />

                        <span>—</span>

                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />

                        <button onClick={carregarDashboard}>Filtrar</button>

                        <button onClick={limparFiltro} className="clear-filter">
                            Limpar
                        </button>
                    </div>
                </header>

                <section className="admin-stats">
                    <div className="admin-stat-card blue">
                        <div className="stat-icon">
                            <FiUsers />
                        </div>

                        <div>
                            <h2>{dados.totalUsuarios}</h2>
                            <p>Total de Usuários</p>
                            <span>Usuários cadastrados</span>
                        </div>
                    </div>

                    <div className="admin-stat-card purple">
                        <div className="stat-icon">
                            <FiActivity />
                        </div>

                        <div>
                            <h2>{dados.totalTreinos}</h2>
                            <p>Total de Treinos</p>
                            <span>Treinos finalizados</span>
                        </div>
                    </div>

                    <div className="admin-stat-card green">
                        <div className="stat-icon">
                            <FiCalendar />
                        </div>

                        <div>
                            <h2>{dados.treinosHoje}</h2>
                            <p>Treinos Hoje</p>
                            <span>Finalizados hoje</span>
                        </div>
                    </div>
                </section>

                <div className="admin-search">
                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Pesquisar usuário por nome ou e-mail..."
                        value={buscaUsuario}
                        onChange={(e) => setBuscaUsuario(e.target.value)}
                    />
                </div>
                <section className="admin-card" id="admin-usuarios">
                    <h2>
                        <FiUsers /> Usuários Cadastrados
                    </h2>

                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Tipo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">
                                                    {usuario.nome?.substring(0, 2).toUpperCase()}
                                                </div>

                                                {usuario.nome}
                                            </div>
                                        </td>

                                        <td>{mascararEmail(usuario.email)}</td>

                                        <td>
                                            {Number(usuario.is_admin) === 1 ? (
                                                <span className="badge admin">👑 Administrador</span>
                                            ) : (
                                                <span className="badge user">👤 Usuário</span>
                                            )}
                                        </td>

                                        <td>
                                            {Number(usuario.is_admin) === 1 ? (
                                                <button
                                                    className="blocked-button"
                                                    title="Admin protegido"
                                                >
                                                    <FiSlash />
                                                </button>
                                            ) : (
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        excluirUsuario(usuario.id, usuario.nome)
                                                    }
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-card" id="admin-treinos">
                    <h2>
                        <FiActivity /> Últimos Treinos
                    </h2>

                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Data</th>
                                    <th>Séries</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dados.treinos.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">Nenhum treino encontrado no período.</td>
                                    </tr>
                                ) : (
                                    dados.treinos.map((treino) => (
                                        <tr key={treino.id}>
                                            <td>{treino.nome}</td>

                                            <td>
                                                {new Date(treino.data_treino).toLocaleDateString(
                                                    "pt-BR"
                                                )}
                                            </td>

                                            <td>{treino.total_series} séries</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;