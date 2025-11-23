import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';
import './CrearPlanilla.css';

export default function CrearPlanilla() {
  const [nombrePlanilla, setNombrePlanilla] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Obtener el usuario autenticado

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombrePlanilla) {
      alert('Por favor, dale un nombre a la planilla.');
      return;
    }

    if (!currentUser) {
      alert('Debes iniciar sesión para crear una planilla.');
      navigate('/login'); // Redirigir al login si no hay usuario
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'planillas'), {
        nombre: nombrePlanilla,
        userId: currentUser.uid, // Asociar la planilla con el ID del usuario
        createdAt: new Date(),
      });
      navigate(`/gastos/${docRef.id}`);
    } catch (error) {
      console.error('Error al crear la planilla:', error);
      alert('Hubo un error al crear la planilla. Por favor, inténtalo de nuevo.');
    }
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
