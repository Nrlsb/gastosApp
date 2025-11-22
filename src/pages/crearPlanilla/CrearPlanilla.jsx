import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearPlanilla.css';

export default function CrearPlanilla() {
  const [nombrePlanilla, setNombrePlanilla] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombrePlanilla) {
      alert('Por favor, dale un nombre a la planilla.');
      return;
    }
    
    // Guardar la nueva planilla en localStorage
    const planillasGuardadas = JSON.parse(localStorage.getItem('planillas')) || [];
    const nuevaPlanilla = {
      id: Date.now(),
      nombre: nombrePlanilla,
    };
    planillasGuardadas.push(nuevaPlanilla);
    localStorage.setItem('planillas', JSON.stringify(planillasGuardadas));

    // Redirigir a la página de gastos con el ID de la nueva planilla
    navigate(`/gastos/${nuevaPlanilla.id}`);
  };

  return (
    <div className="crear-planilla-container">
      <form onSubmit={handleSubmit} className="crear-planilla-form">
        <h1>Crear Nueva Planilla</h1>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Planilla</label>
          <input
            type="text"
            id="nombre"
            value={nombrePlanilla}
            onChange={(e) => setNombrePlanilla(e.target.value)}
            placeholder="Ej: Gastos de Enero"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Crear y Empezar a Añadir Gastos
        </button>
      </form>
    </div>
  );
}
