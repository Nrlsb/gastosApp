import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Plus, List } from 'lucide-react';
import { auth } from '../../services/firebase';
import useAuth from '../../shared/hooks/useAuth';
import './HomePage.css';


function HomePage() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card-container">
        <h1 className="home-title">Gestor de Gastos</h1>
        <p className="home-subtitle">Elige una opción para comenzar</p>

        <div className="d-grid gap-3 mb-4">
          <Link to="/crear-planilla" className="btn-primary-custom">
            <Plus size={20} />
            Crear Nueva Planilla
          </Link>

          <Link to="/ver-planillas" className="btn-secondary-custom">
            <List size={20} />
            Ver Mis Gastos
          </Link>
        </div>

        {currentUser && (
          <button onClick={handleLogout} className="btn-logout-custom">
            ¿Ya terminaste? Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
