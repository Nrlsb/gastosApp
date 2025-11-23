import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDolarRate } from '../../services/dolarApi'; // Importar API del dólar

function GastosPersonales() {
  // Estado para almacenar la lista de gastos, inicializado desde localStorage
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('personal_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

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

  // Efecto para obtener la cotización del dólar al montar el componente
  useEffect(() => {
    const fetchDolarRate = async () => {
      const rate = await getDolarRate();
      setDolarRate(rate);
    };
    fetchDolarRate();
  }, []);

  // Efecto para guardar los gastos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('personal_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Manejador para enviar el formulario
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!description || !amount || (enCuotas && (!cuotaActual || !totalCuotas))) return;

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      currency,
      esCompartido,
      enCuotas,
      cuotaActual: enCuotas ? parseInt(cuotaActual) : null,
      totalCuotas: enCuotas ? parseInt(totalCuotas) : null,
    };

    if (esCompartido) {
      const savedSharedExpenses = localStorage.getItem('shared_expenses');
      const sharedExpenses = savedSharedExpenses ? JSON.parse(savedSharedExpenses) : [];
      
      // Para gastos compartidos, guardamos el monto original y la moneda
      const sharedExpenseData = {
        ...newExpense,
        amount: parseFloat(amount) // Guardar el monto completo para el compartido
      };

      localStorage.setItem('shared_expenses', JSON.stringify([...sharedExpenses, sharedExpenseData]));
      alert(`Gasto "${newExpense.description}" agregado a Gastos Compartidos.`);
    } else {
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    }

    // Limpiar formulario
    setDescription('');
    setAmount('');
    setCurrency('ARS');
    setEsCompartido(false);
    setEnCuotas(false);
    setCuotaActual('');
    setTotalCuotas('');
  }, [description, amount, currency, enCuotas, cuotaActual, totalCuotas, esCompartido]);

  // Manejador para limpiar todos los gastos
  const handleClearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  // Manejador para eliminar un gasto individual
  const handleDeleteExpense = useCallback((id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  }, [expenses]);

  // Calcular los totales por moneda
  const totals = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const expenseCurrency = expense.currency || 'ARS';
      if (!acc[expenseCurrency]) {
        acc[expenseCurrency] = 0;
      }
      acc[expenseCurrency] += expense.amount;
      return acc;
    }, {});
  }, [expenses]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gastos Personales</h1>

      {/* Resumen de Gastos */}
      <div className="card p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0">
            Total: {Object.keys(totals).length > 0 ? (
              Object.entries(totals).map(([currency, total]) => (
                <span key={currency} className="text-primary me-3">
                  {currency}: ${total.toFixed(2)}
                </span>
              ))
            ) : (
              <span className="text-primary">$0.00</span>
            )}
          </h2>
          <button className="btn btn-danger" onClick={handleClearExpenses}>
            Limpiar Gastos
          </button>
        </div>
      </div>

      {/* Formulario para Añadir Gasto */}
      <div className="card p-4 mb-4">
        <h2 className="h5 mb-3">Añadir Nuevo Gasto</h2>
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
              <label htmlFor="currency_personal" className="form-label">Moneda</label>
              <select 
                id="currency_personal" 
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
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-lg w-100">Añadir</button>
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
                <th scope="col">Monto</th>
                <th scope="col">Cuotas</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{expense.currency || 'ARS'} ${expense.amount.toFixed(2)}</td>
                  <td>{expense.enCuotas ? `${expense.cuotaActual} / ${expense.totalCuotas}` : '-'}</td>
                  <td>{new Date(expense.id).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteExpense(expense.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GastosPersonales;
