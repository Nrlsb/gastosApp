import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanillas } from '../../context/PlanillasContext'; // Importar el hook del contexto
import useAuth from '../../hooks/useAuth';


export default function CrearPlanilla() {
  const [nombrePlanilla, setNombrePlanilla] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addPlanilla } = usePlanillas(); // Obtener addPlanilla del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombrePlanilla) {
      alert('Por favor, dale un nombre a la planilla.');
      return;
    }

    if (!currentUser) {
      alert('Debes iniciar sesión para crear una planilla.');
      navigate('/login');
      return;
    }

    try {
      // Usar la función addPlanilla del contexto
      const newPlanillaData = {
        nombre: nombrePlanilla,
        userId: currentUser.uid,
        createdAt: new Date(),
      };
      const docRef = await addPlanilla(newPlanillaData); // addPlanilla ahora devuelve el docRef o el id
      navigate(`/gastos/${docRef.id}`);
    } catch (error) {
      console.error('Error al crear la planilla:', error);
      alert('Hubo un error al crear la planilla. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="text-center mb-4">Crear Nueva Planilla</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de la Planilla</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombrePlanilla}
              onChange={(e) => setNombrePlanilla(e.target.value)}
              placeholder="Ej: Gastos de Enero"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100">
            Crear y Empezar a Añadir Gastos
          </button>
        </form>
      </div>
    </div>
  );
}
