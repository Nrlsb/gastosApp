import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useToast } from './shared/context/ToastContext';
import ErrorBoundary from './shared/components/ErrorBoundaries';

const HomePage = lazy(() => import('./features/home/HomePage'));
const CrearPlanilla = lazy(() => import('./features/crearPlanilla/CrearPlanilla'));
const VerPlanillas = lazy(() => import('./features/verPlanillas/VerPlanillas'));
const Gastos = lazy(() => import('./features/gastos/Gastos'));
const GastosCompartidos = lazy(() => import('./features/gastosCompartidos/GastosCompartidos'));
const GastosPersonales = lazy(() => import('./features/gastosPersonales/GastosPersonales'));
const LoginPage = lazy(() => import('./features/login/LoginPage'));
import LoadingSpinner from './shared/components/ui/LoadingSpinner';
import useAuth from './shared/hooks/useAuth';
import { PlanillasProvider } from './shared/context/PlanillasContext';

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
        <Suspense fallback={<LoadingSpinner />}>
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
          <Route
            path="/gastos-compartidos"
            element={
              <ProtectedRoute>
                <GastosCompartidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gastos-personales"
            element={
              <ProtectedRoute>
                <GastosPersonales />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Suspense>
      </PlanillasProvider>
    </ErrorBoundary>
  );
}

export default App;