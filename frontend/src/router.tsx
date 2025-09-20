import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroEvaluadores from "./pages/RegistroEvaluador";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistroEvaluadores />} />
      </Routes>
    </BrowserRouter>
  );
}
