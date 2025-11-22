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
    <div className="home-container">
      <h1>Gestor de Gastos</h1>
      <p>Elige una opción para comenzar</p>
      <div className="button-container">
        <Link to="/crear-planilla" className="button">
          Crear Nueva Planilla de Gastos
        </Link>
        <Link to="/ver-planillas" className="button">
          Ver Planillas de Gastos
        </Link>
      </div>
      {currentUser && (
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      )}
    </div>
  );
}

export default HomePage;
