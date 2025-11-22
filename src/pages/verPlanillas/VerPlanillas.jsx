import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VerPlanillas.css';

export default function VerPlanillas() {
  const [planillas, setPlanillas] = useState([]);

  useEffect(() => {
    const planillasGuardadas = JSON.parse(localStorage.getItem('planillas')) || [];
    setPlanillas(planillasGuardadas);
  }, []);

  const handleEliminarPlanilla = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la planilla "${nombre}"?`)) {
      const planillasActualizadas = planillas.filter((p) => p.id !== id);
      setPlanillas(planillasActualizadas);
      localStorage.setItem('planillas', JSON.stringify(planillasActualizadas));
    }
  };

  return (
    <div className="ver-planillas-container">
      <h1>Mis Planillas de Gastos</h1>
      {planillas.length === 0 ? (
        <div className="no-planillas">
          <p>Aún no has creado ninguna planilla.</p>
          <Link to="/crear-planilla" className="button-crear">¡Crea la primera!</Link>
        </div>
      ) : (
        <div className="lista-planillas">
          {planillas.map((planilla) => (
            <div key={planilla.id} className="planilla-card-container">
              <Link
                to={`/gastos/${planilla.id}`}
                className="planilla-card"
              >
                <h2>{planilla.nombre}</h2>
              </Link>
              <button
                onClick={() => handleEliminarPlanilla(planilla.id, planilla.nombre)}
                className="button-eliminar"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
