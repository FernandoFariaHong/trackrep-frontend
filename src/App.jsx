import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Treinos from "./Treinos";
import Terms from "./Terms";
import Home from "./Home";
import HomeDashboard from "./HomeDashboard";
import Stats from "./Stats";
import Perfil from "./Perfil";
import AdminDashboard from "./AdminDashboard";

// Componente para proteger rotas
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomeDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/treinos"
        element={
          <PrivateRoute>
            <Treinos />
          </PrivateRoute>
        }
      />

      <Route
        path="/estatisticas"
        element={
          <PrivateRoute>
            <Stats />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route path="/termos" element={<Terms />} />
    </Routes>
  );
}

export default App;