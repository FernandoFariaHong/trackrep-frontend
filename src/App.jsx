import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Treinos from "./Treinos";
import Register from "./Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/treinos" element={<Treinos />} />
    </Routes>
  );
}

export default App;