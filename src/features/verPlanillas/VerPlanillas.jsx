import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlanillas } from '../../shared/context/PlanillasContext';
import { Trash2, Copy, FileText } from 'lucide-react';
import './VerPlanillas.css';

export default function VerPlanillas() {
  const { planillas, loading, deletePlanilla, clonePlanilla, error } = usePlanillas();
  const navigate = useNavigate();

  const handleEliminarPlanilla = async (e, id, nombre) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que quieres eliminar la planilla "${nombre}"?`)) {
      try {
        await deletePlanilla(id);
        alert('Planilla eliminada con éxito.');
      } catch (err) {
        console.error('Error al eliminar la planilla:', err);
        alert('Hubo un error al eliminar la planilla. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleClonarPlanilla = async (e, id, nombre) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    const nuevoNombre = window.prompt(`Ingresa el nuevo nombre para la planilla clonada:`, `${nombre} - Copia`);
    if (nuevoNombre) {
      try {
        await clonePlanilla(id, nuevoNombre);
        alert(`Planilla "${nombre}" clonada con éxito como "${nuevoNombre}".`);
      } catch (err) {
        console.error('Error al clonar la planilla:', err);
        alert('Hubo un error al clonar la planilla. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleCardClick = (id) => {
    navigate(`/gastos/${id}`);
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
            <div
              key={planilla.id}
              className="planilla-card"
              onClick={() => handleCardClick(planilla.id)}
              role="button"
              tabIndex={0}
            >
              <div className="card-content">
                <div className="icon-wrapper">
                  <FileText size={32} className="text-primary" />
                </div>
                <h2>{planilla.nombre}</h2>
                <span className={`tipo-tag ${planilla.tipo || 'personal'}`}>
                  {planilla.tipo || 'Personal'}
                </span>
              </div>

              <div className="card-actions">
                <button
                  onClick={(e) => handleClonarPlanilla(e, planilla.id, planilla.nombre)}
                  className="action-btn btn-clone"
                  title="Clonar planilla"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={(e) => handleEliminarPlanilla(e, planilla.id, planilla.nombre)}
                  className="action-btn btn-delete"
                  title="Eliminar planilla"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
