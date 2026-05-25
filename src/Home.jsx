import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">

        <h1 className="home-title">
          <span className="track">Track</span>
          <span className="rep">Rep</span>
        </h1>

        <p className="home-subtitle">
          Acompanhe seus treinos, evolua seu desempenho
          <br />
          e alcance seus objetivos.
        </p>

        <div className="home-buttons">
          <button
            className="home-btn"
            onClick={() => navigate("/login")}
          >
            Fazer login
          </button>

          <button
  className="home-btn"
  onClick={() => navigate("/register")}
>
  Criar conta
</button>
        </div>

      </div>
    </div>
  );
}

export default Home;