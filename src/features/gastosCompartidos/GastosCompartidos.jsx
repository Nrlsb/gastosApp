import React, { useState, useEffect, useMemo, useCallback } from 'react';

function GastosCompartidos() {
  // Estado para almacenar la lista de gastos, inicializado desde localStorage
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('shared_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Efecto para guardar los gastos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('shared_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Efecto para escuchar cambios en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shared_expenses') {
        setExpenses(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


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
      const expenseCurrency = expense.currency || 'ARS'; // Default a ARS para gastos viejos
      if (!acc[expenseCurrency]) {
        acc[expenseCurrency] = 0;
      }
      // Los gastos compartidos se guardan con el monto total
      acc[expenseCurrency] += expense.amount;
      return acc;
    }, {});
  }, [expenses]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gastos Compartidos</h1>

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

      {/* Tabla de Gastos */}
      <div>
        <h2 className="h5 mb-3">Historial de Gastos</h2>
        {expenses.length === 0 ? (
          <div className="alert alert-info">No hay gastos compartidos registrados.</div>
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

export default GastosCompartidos;
