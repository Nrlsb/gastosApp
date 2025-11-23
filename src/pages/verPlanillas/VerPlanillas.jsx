import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';
import './VerPlanillas.css';

export default function VerPlanillas() {
  const [planillas, setPlanillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPlanillas([]);
      setLoading(false);
      return;
    }
    console.log("User UID:", user.uid);

    const q = query(
      collection(db, 'planillas'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const planillasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlanillas(planillasData);
      setLoading(false);
    }, (error) => {
      console.error('Error al obtener planillas:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEliminarPlanilla = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la planilla "${nombre}"?`)) {
      try {
        await deleteDoc(doc(db, 'planillas', id));
        alert('Planilla eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar la planilla:', error);
        alert('Hubo un error al eliminar la planilla. Por favor, inténtalo de nuevo.');
      }
    }
  };

  if (loading) {
    return <div className="ver-planillas-container">Cargando planillas...</div>;
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
