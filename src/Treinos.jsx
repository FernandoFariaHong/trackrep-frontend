import { useEffect, useState } from "react";
import axios from "axios";

function Treinos() {
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:3000/treinos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setTreinos(response.data);
      } catch (error) {
        alert("Erro ao buscar treinos");
      }
    };

    fetchTreinos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Meus Treinos</h1>

      {treinos.map((t) => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          <strong>{t.exercicio}</strong><br />
          Carga: {t.carga}kg<br />
          Repetições: {t.repeticoes}<br />
          Séries: {t.series}<br />
        </div>
      ))}
    </div>
  );
}

export default Treinos;