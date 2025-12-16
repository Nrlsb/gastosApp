import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePlanillas } from '../../shared/context/PlanillasContext'; // Importar el hook del contexto
import { getDolarRate } from '../../services/dolarApi'; // Importar API del dólar

function Gastos() {
  const { planillaId } = useParams();
  // Usar el contexto para la gestión de gastos
  const {
    planillas,
    expenses,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    loading: planillasLoading
  } = usePlanillas();

  // Estado para el formulario
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ARS'); // Estado para la moneda
  const [esCompartido, setEsCompartido] = useState(false);
  const [enCuotas, setEnCuotas] = useState(false);
  const [totalCuotas, setTotalCuotas] = useState('');
  const [cuotaActual, setCuotaActual] = useState('');

  // Estado para la cotización del dólar
  const [dolarRate, setDolarRate] = useState(null);

  // Estado para manejar la edición
  const [editingId, setEditingId] = useState(null);

  // Efecto para obtener la cotización del dólar
  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const rate = await getDolarRate();
        setDolarRate(rate);
      } catch (error) {
        console.error("Error fetching dolar rate:", error);
      }
    };
    fetchDolar();
  }, []);

  // Efecto para obtener los gastos
  useEffect(() => {
    if (planillaId) {
      getExpenses(planillaId);
    }
  }, [planillaId, getExpenses]);

  // Buscar el nombre de la planilla actual
  const currentPlanilla = useMemo(() => {
    return planillas.find(p => p.id === planillaId);
  }, [planillas, planillaId]);
  const planillaName = useMemo(() => {
    return currentPlanilla ? currentPlanilla.nombre : 'Cargando...';
  }, [currentPlanilla]);

  // Limpiar formulario y salir del modo edición
  const resetForm = useCallback(() => {
    setDescription('');
    setAmount('');
    setCurrency('ARS');
    setEsCompartido(false);
    setEnCuotas(false);
    setCuotaActual('');
    setTotalCuotas('');
    setEditingId(null);
  }, []);

  // Manejador para enviar el formulario (añadir o actualizar)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!description || !amount || (enCuotas && (!cuotaActual || !totalCuotas))) return;

    const expenseData = {
      description,
      amount: parseFloat(amount),
      currency,
      esCompartido,
      enCuotas,
      cuotaActual: enCuotas ? parseInt(cuotaActual) : null,
      totalCuotas: enCuotas ? parseInt(totalCuotas) : null,
      createdAt: new Date(), // Añadir fecha de creación para ordenar
    };

    try {
      if (editingId) {
        // Actualizar gasto existente
        await updateExpense(planillaId, editingId, expenseData);
      } else {
        // Añadir nuevo gasto
        await addExpense(planillaId, expenseData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  }, [description, amount, currency, esCompartido, enCuotas, cuotaActual, totalCuotas, editingId, planillaId, addExpense, updateExpense, resetForm]);

  // Cargar datos del gasto en el formulario para editar
  const handleEdit = useCallback((id) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (expenseToEdit) {
      setEditingId(expenseToEdit.id);
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount);
      setCurrency(expenseToEdit.currency || 'ARS');
      setEsCompartido(expenseToEdit.esCompartido);
      setEnCuotas(expenseToEdit.enCuotas);
      setCuotaActual(expenseToEdit.cuotaActual || '');
      setTotalCuotas(expenseToEdit.totalCuotas || '');
    }
  }, [expenses]);

  // Manejador para cancelar la edición
  const handleCancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Manejador para eliminar un gasto individual
  const handleDeleteExpense = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await deleteExpense(planillaId, id);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  }, [planillaId, deleteExpense]);

  // Calcular el total de gastos personales en ARS
  const totalPersonalARS = useMemo(() => {
    if (!dolarRate) return 0;
    return expenses.reduce((acc, expense) => {
      const amountInARS = expense.currency === 'USD' ? expense.amount * dolarRate : expense.amount;
      const personalAmount = expense.esCompartido ? amountInARS / 2 : amountInARS;
      return acc + personalAmount;
    }, 0);
  }, [expenses, dolarRate]);

  if (planillasLoading) {
    return <div className="container mt-5">Cargando datos...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Planilla: {planillaName}</h1>

      {/* Resumen de Gastos */}
      <div className="card p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0">
            Gasto Personal Total: <span className="text-primary">ARS ${totalPersonalARS.toFixed(2)}</span>
            {!dolarRate && <small className="text-muted ms-2">(Cotización USD cargando...)</small>}
          </h2>
        </div>
      </div>

      {/* Formulario para Añadir/Editar Gasto */}
      <div className="card p-4 mb-4">
        <h2 className="h5 mb-3">{editingId ? 'Editar Gasto' : 'Añadir Nuevo Gasto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end">
            {/* Descripción, Monto y Moneda */}
            <div className="col-md-4">
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
            <div className="col-md-2">
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
              {currency === 'USD' && amount > 0 && dolarRate && (
                <small className="form-text text-muted">
                  ~ ARS ${(amount * dolarRate).toFixed(2)}
                </small>
              )}
            </div>
            <div className="col-md-2">
              <label htmlFor="currency" className="form-label">Moneda</label>
              <select
                id="currency"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
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
                <th scope="col">Monto Total (ARS)</th>
                <th scope="col">Monto Personal (ARS)</th>
                <th scope="col">Monto en Dólares</th>
                <th scope="col">Cuotas</th>
                <th scope="col">Tipo</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => {
                const montoTotalArs = expense.currency === 'USD' && dolarRate ? expense.amount * dolarRate : expense.amount;
                const montoPersonalArs = expense.esCompartido ? montoTotalArs / 2 : montoTotalArs;
                const montoDolares = expense.currency === 'ARS' && dolarRate ? expense.amount / dolarRate : (expense.currency === 'USD' ? expense.amount : 0);

                return (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>
                      {expense.currency === 'USD' && !dolarRate ? (
                        <span className="text-muted">Cargando...</span>
                      ) : (
                        `ARS $${montoTotalArs.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {expense.currency === 'USD' && !dolarRate ? (
                        <span className="text-muted">Cargando...</span>
                      ) : (
                        `ARS $${montoPersonalArs.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {!dolarRate && expense.currency === 'ARS' ? (
                        <span className="text-muted">Cargando...</span>
                      ) : (
                        `USD $${montoDolares.toFixed(2)}`
                      )}
                    </td>
                    <td>{expense.enCuotas ? `${expense.cuotaActual} / ${expense.totalCuotas}` : '-'}</td>
                    <td>
                      <span className={`badge ${expense.esCompartido ? 'bg-info text-dark' : 'bg-light text-dark'}`}>
                        {expense.esCompartido ? 'Compartido' : 'Personal'}
                      </span>
                    </td>
                    <td>{expense.createdAt ? new Date(expense.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(expense.id)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteExpense(expense.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="table-group-divider">
              <tr>
                <td className="fw-bold">Total Personal</td>
                <td></td>
                <td className="fw-bold">ARS ${totalPersonalARS.toFixed(2)}</td>
                <td colSpan="5"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default Gastos;
