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

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Number(isAdmin) !== 1) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/termos" element={<Terms />} />

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
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;