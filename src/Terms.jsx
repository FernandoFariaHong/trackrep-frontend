import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  const aceitarTermos = () => {
    localStorage.setItem("termosAceitos", "true");

    const aceitarTermos = () => {
  localStorage.setItem("termosAceitos", "true");
  navigate("/register");
};

    navigate("/register");
  };

  return (
    <div className="container">
      <div className="card terms-page">
        <h1>Termos de Uso e Política de Privacidade</h1>

        <p>
          Ao utilizar o TrackRep, o usuário concorda em fornecer
          informações verdadeiras para criação da conta e utilização
          da plataforma.
        </p>

        <p>
          Os dados cadastrados são utilizados exclusivamente para
          autenticação, registro de treinos, estatísticas e melhoria
          da experiência do usuário.
        </p>

        <p>
          As senhas são armazenadas de forma criptografada,
          garantindo maior segurança e proteção das informações.
        </p>

        <p>
          O usuário poderá solicitar alteração ou exclusão dos seus
          dados conforme previsto pela Lei Geral de Proteção de Dados
          (LGPD).
        </p>

        <p>
          O TrackRep não compartilha informações pessoais com terceiros
          sem autorização do usuário.
        </p>

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
  );
}

export default Terms;