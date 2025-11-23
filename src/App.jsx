import { Routes, Route, Navigate } from 'react-router-dom';
import { useToast } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundaries';

import HomePage from './pages/home/HomePage';
import CrearPlanilla from './pages/crearPlanilla/CrearPlanilla';
import VerPlanillas from './pages/verPlanillas/VerPlanillas';
import Gastos from './pages/gastos/Gastos';
import LoginPage from './pages/login/LoginPage';
import useAuth from './hooks/useAuth';
import { PlanillasProvider } from './context/PlanillasContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { showToast } = useToast();

  return (
    <ErrorBoundary showToast={showToast}>
      <PlanillasProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-planilla"
            element={
              <ProtectedRoute>
                <CrearPlanilla />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ver-planillas"
            element={
              <ProtectedRoute>
                <VerPlanillas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gastos/:planillaId"
            element={
              <ProtectedRoute>
                <Gastos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PlanillasProvider>
    </ErrorBoundary>
  );
}

export default App;