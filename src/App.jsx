import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Treinos from "./Treinos";
import Terms from "./Terms";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/treinos" element={<Treinos />} />

      <Route path="/termos" element={<Terms />} />
    </Routes>
  );
}

export default App;