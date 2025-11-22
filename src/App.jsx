import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import CrearPlanilla from './pages/crearPlanilla/CrearPlanilla';
import VerPlanillas from './pages/verPlanillas/VerPlanillas';
import Gastos from './pages/gastos/Gastos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/crear-planilla" element={<CrearPlanilla />} />
      <Route path="/ver-planillas" element={<VerPlanillas />} />
      <Route path="/gastos/:planillaId" element={<Gastos />} />
    </Routes>
  );
}

export default App;