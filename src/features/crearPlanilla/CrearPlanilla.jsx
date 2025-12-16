import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanillas } from '../../shared/context/PlanillasContext'; // Importar el hook del contexto
import { useToast } from '../../shared/context/ToastContext';
import useAuth from '../../shared/hooks/useAuth';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/forms/Input';
import Card from '../../shared/components/ui/Card';
import Typography from '../../shared/components/ui/Typography';


export default function CrearPlanilla() {
  const [nombrePlanilla, setNombrePlanilla] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addPlanilla } = usePlanillas();
  const { showToast } = useToast(); // Use the toast context

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombrePlanilla.trim()) {
      showToast('Por favor, dale un nombre a la planilla.', 'warning');
      return;
    }

    if (!currentUser) {
      showToast('Debes iniciar sesión para crear una planilla.', 'error');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPlanillaData = {
        nombre: nombrePlanilla,
        userId: currentUser.uid,
        createdAt: new Date(),
      };
      const docRef = await addPlanilla(newPlanillaData);
      showToast('¡Planilla creada con éxito!', 'success');
      navigate(`/gastos/${docRef.id}`);
    } catch (error) {
      console.error('Error al crear la planilla:', error);
      showToast('Hubo un error al crear la planilla. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ maxWidth: '500px', width: '100%' }}>
        <Typography variant="h2" className="text-center mb-4" style={{ color: 'var(--color-text-dark)' }}>
          Crear Nueva Planilla
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="nombre"
              label="Nombre de la Planilla"
              type="text"
              value={nombrePlanilla}
              onChange={(e) => setNombrePlanilla(e.target.value)}
              placeholder="Ej: Gastos de Enero"
              required
              style={{ padding: 'var(--spacing-md)' }}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear y Empezar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
