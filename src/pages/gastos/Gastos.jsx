import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlanillas } from '../../context/PlanillasContext'; // Importar el hook del contexto
import './Gastos.css';

function Gastos() {
  const { planillaId } = useParams();
  const { planillas, loading: planillasLoading } = usePlanillas(); // Obtener planillas y loading del contexto
  const localStorageKey = `expenses_${planillaId}`;

  // Estado para almacenar la lista de gastos, inicializado desde localStorage
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem(localStorageKey);
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Estado para el formulario
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [esCompartido, setEsCompartido] = useState(false);
  const [enCuotas, setEnCuotas] = useState(false);
  const [totalCuotas, setTotalCuotas] = useState('');
  const [cuotaActual, setCuotaActual] = useState('');
  
  // Estado para manejar la edición
  const [editingId, setEditingId] = useState(null);

  // Efecto para guardar los gastos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(expenses));
  }, [expenses, localStorageKey]);

  // Buscar el nombre de la planilla actual
  const currentPlanilla = planillas.find(p => p.id === planillaId);
  const planillaName = currentPlanilla ? currentPlanilla.nombre : 'Cargando...';

  // Limpiar formulario y salir del modo edición
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setEsCompartido(false);
    setEnCuotas(false);
    setCuotaActual('');
    setTotalCuotas('');
    setEditingId(null);
  };

  // Manejador para enviar el formulario (añadir o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || (enCuotas && (!cuotaActual || !totalCuotas))) return;

    const expenseData = {
      description,
      amount: parseFloat(amount),
      esCompartido,
      enCuotas,
      cuotaActual: enCuotas ? parseInt(cuotaActual) : null,
      totalCuotas: enCuotas ? parseInt(totalCuotas) : null,
    };

    if (editingId) {
      // Actualizar gasto existente
      setExpenses(
        expenses.map(expense =>
          expense.id === editingId ? { ...expense, ...expenseData } : expense
        )
      );
    } else {
      // Añadir nuevo gasto
      setExpenses([...expenses, { ...expenseData, id: Date.now() }]);
    }

    resetForm();
  };

  // Cargar datos del gasto en el formulario para editar
  const handleEdit = (id) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (expenseToEdit) {
      setEditingId(expenseToEdit.id);
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount);
      setEsCompartido(expenseToEdit.esCompartido);
      setEnCuotas(expenseToEdit.enCuotas);
      setCuotaActual(expenseToEdit.cuotaActual || '');
      setTotalCuotas(expenseToEdit.totalCuotas || '');
    }
  };
  
  // Manejador para cancelar la edición
  const handleCancelEdit = () => {
    resetForm();
  };

  // Manejador para limpiar todos los gastos
  const handleClearExpenses = () => {
    setExpenses([]);
  };

  // Manejador para eliminar un gasto individual
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calcular el total
  const totalExpenses = expenses.reduce((total, expense) => total + (expense.esCompartido ? expense.amount / 2 : expense.amount), 0).toFixed(2);

  if (planillasLoading) {
    return <div className="container mt-5">Cargando planilla...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Planilla: {planillaName}</h1>

      {/* Resumen de Gastos */}
      <div className="card p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0">Total: <span className="text-primary">${totalExpenses}</span></h2>
          <button className="btn btn-danger" onClick={handleClearExpenses}>
            Limpiar Gastos
          </button>
        </div>
      </div>

      {/* Formulario para Añadir/Editar Gasto */}
      <div className="card p-4 mb-4">
        <h2 className="h5 mb-3">{editingId ? 'Editar Gasto' : 'Añadir Nuevo Gasto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end">
            {/* Descripción y Monto */}
            <div className="col-md-5">
              <label htmlFor="description_personal" className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control"
                id="description_personal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Compra en el supermercado"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="amount_personal" className="form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="amount_personal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 50.25"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="col-md-4 d-flex align-items-center">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="esCompartido"
                  checked={esCompartido}
                  onChange={(e) => setEsCompartido(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="esCompartido">
                  Gasto Compartido
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="enCuotas"
                  checked={enCuotas}
                  onChange={(e) => setEnCuotas(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="enCuotas">
                  Pagar en cuotas
                </label>
              </div>
            </div>
          </div>

          {/* Campos de Cuotas (condicional) */}
          {enCuotas && (
            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label htmlFor="cuotaActual" className="form-label">Cuota Actual</label>
                <input
                  type="number"
                  className="form-control"
                  id="cuotaActual"
                  value={cuotaActual}
                  onChange={(e) => setCuotaActual(e.target.value)}
                  placeholder="Ej: 1"
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="totalCuotas" className="form-label">Total de Cuotas</label>
                <input
                  type="number"
                  className="form-control"
                  id="totalCuotas"
                  value={totalCuotas}
                  onChange={(e) => setTotalCuotas(e.target.value)}
                  placeholder="Ej: 3"
                  required
                />
              </div>
            </div>
          )}

          <div className="row mt-3">
            <div className="col-12 d-flex">
              <button type="submit" className="btn btn-primary w-100">
                {editingId ? 'Actualizar' : 'Añadir'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary w-100 ms-2" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de Gastos */}
      <div>
        <h2 className="h5 mb-3">Historial de Gastos</h2>
        {expenses.length === 0 ? (
          <div className="alert alert-info">No hay gastos registrados.</div>
        ) : (
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Descripción</th>
                <th scope="col">Monto Total</th>
                <th scope="col">Monto Personal</th>
                <th scope="col">Cuotas</th>
                <th scope="col">Tipo</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>${(expense.esCompartido ? expense.amount / 2 : expense.amount).toFixed(2)}</td>
                  <td>{expense.enCuotas ? `${expense.cuotaActual} / ${expense.totalCuotas}` : '-'}</td>
                  <td>
                    <span className={`badge ${expense.esCompartido ? 'bg-info text-dark' : 'bg-light text-dark'}`}>
                      {expense.esCompartido ? 'Compartido' : 'Personal'}
                    </span>
                  </td>
                  <td>{new Date(expense.id).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(expense.id)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteExpense(expense.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-group-divider">
              <tr>
                <td className="fw-bold">Total</td>
                <td></td>
                <td className="fw-bold">${totalExpenses}</td>
                <td colSpan="4"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default Gastos;
