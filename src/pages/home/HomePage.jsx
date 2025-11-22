import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
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
    </div>
  );
}

export default HomePage;
