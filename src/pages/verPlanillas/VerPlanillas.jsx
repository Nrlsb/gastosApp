import React from 'react';
import { Link } from 'react-router-dom';
import { usePlanillas } from '../../context/PlanillasContext'; // Importar el hook del contexto


export default function VerPlanillas() {
  const { planillas, loading, deletePlanilla, error } = usePlanillas(); // Usar el hook del contexto

  const handleEliminarPlanilla = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la planilla "${nombre}"?`)) {
      try {
        await deletePlanilla(id); // Usar la función deletePlanilla del contexto
        alert('Planilla eliminada con éxito.');
      } catch (err) {
        console.error('Error al eliminar la planilla:', err);
        alert('Hubo un error al eliminar la planilla. Por favor, inténtalo de nuevo.');
      }
    }
  };

  if (loading) {
    return <div className="ver-planillas-container">Cargando planillas...</div>;
  }

  if (error) {
    return <div className="ver-planillas-container">Error: {error.message}</div>;
  }

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
