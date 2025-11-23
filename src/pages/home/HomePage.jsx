import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import useAuth from '../../hooks/useAuth';
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
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="mb-3">Gestor de Gastos</h1>
        <p className="lead mb-4">Elige una opción para comenzar</p>
        <div className="d-grid gap-3 mb-4">
          <Link to="/crear-planilla" className="btn btn-primary btn-lg">
            Crear Nueva Planilla de Gastos
          </Link>
          <Link to="/ver-planillas" className="btn btn-secondary btn-lg">
            Ver Planillas de Gastos
          </Link>
        </div>
        {currentUser && (
          <button onClick={handleLogout} className="btn btn-danger mt-3">
            Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
