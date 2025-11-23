import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanillas } from '../../shared/context/PlanillasContext'; // Importar el hook del contexto
import useAuth from '../../shared/hooks/useAuth';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/forms/Input';
import Card from '../../shared/components/ui/Card';
import Typography from '../../shared/components/ui/Typography';


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
      <Card style={{ maxWidth: '500px', width: '100%' }}>
        <Typography variant="h1" className="text-center mb-4">Crear Nueva Planilla</Typography>
        <form onSubmit={handleSubmit}>
          <Input
            id="nombre"
            label="Nombre de la Planilla"
            type="text"
            value={nombrePlanilla}
            onChange={(e) => setNombrePlanilla(e.target.value)}
            placeholder="Ej: Gastos de Enero"
            required
          />
          <Button type="submit" variant="primary" size="lg" className="w-100">
            Crear y Empezar a Añadir Gastos
          </Button>
        </form>
      </Card>
    </div>
  );
}
