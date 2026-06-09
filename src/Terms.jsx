import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  const aceitarTermos = () => {
    localStorage.setItem("termosAceitos", "true");
    navigate("/register");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          color: "#111827",
          lineHeight: "1.8",
        }}
      >
        <h1>Termos de Uso e Política de Privacidade</h1>

        <p>
          <strong>Última atualização:</strong> Junho de 2026
        </p>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao criar uma conta ou utilizar o TrackRep, o usuário declara ter
          lido, compreendido e aceitado integralmente os presentes Termos de
          Uso e Política de Privacidade.
        </p>

        <h2>2. Sobre o TrackRep</h2>
        <p>
          O TrackRep é uma plataforma digital destinada ao registro,
          gerenciamento e acompanhamento de treinos de musculação,
          permitindo ao usuário armazenar informações relacionadas às suas
          atividades físicas, evolução de desempenho e estatísticas de
          treinamento.
        </p>

        <h2>3. Cadastro e Responsabilidade do Usuário</h2>
        <p>
          O usuário deverá fornecer informações verdadeiras, completas e
          atualizadas para utilização da plataforma.
        </p>

        <h2>4. Dados Coletados</h2>
        <ul>
          <li>Nome do usuário;</li>
          <li>Endereço de e-mail;</li>
          <li>Senha criptografada;</li>
          <li>Dados corporais informados pelo usuário;</li>
          <li>Informações relacionadas aos treinos cadastrados;</li>
          <li>Estatísticas de utilização da plataforma.</li>
        </ul>

        <h2>5. Proteção de Dados e Segurança</h2>
        <p>
          As senhas são protegidas por criptografia e não são armazenadas em
          formato legível.
        </p>

        <h2>6. Uso das Informações</h2>
        <ul>
          <li>Autenticação do usuário;</li>
          <li>Funcionamento da plataforma;</li>
          <li>Geração de estatísticas;</li>
          <li>Melhoria da experiência do usuário;</li>
          <li>Cumprimento de obrigações legais.</li>
        </ul>

        <h2>7. Exclusão de Conta</h2>
        <p>
          O usuário poderá excluir sua conta a qualquer momento através das
          funcionalidades disponibilizadas na plataforma.
        </p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>
          O TrackRep é fornecido "como está", sem garantia de disponibilidade
          contínua ou ausência de falhas.
        </p>

        <h2>9. Propriedade Intelectual</h2>
        <p>
          Todos os elementos do sistema, incluindo código-fonte, identidade
          visual, textos e demais componentes, são protegidos pelas
          legislações aplicáveis.
        </p>

        <h2>10. Legislação Aplicável</h2>
        <p>
          Este documento é regido pela legislação brasileira, incluindo a
          Lei Geral de Proteção de Dados (LGPD) e o Marco Civil da Internet.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "12px",
          }}
        >
          <button onClick={aceitarTermos}>
            Li e concordo
          </button>

          <button
            className="secondary-button"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Terms;