import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDolarRate } from '../../services/dolarApi';
import { Trash2, DollarSign, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import './GastosPersonales.css';

function GastosPersonales() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('personal_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [esCompartido, setEsCompartido] = useState(false);
  const [enCuotas, setEnCuotas] = useState(false);
  const [totalCuotas, setTotalCuotas] = useState('');
  const [cuotaActual, setCuotaActual] = useState('');
  const [dolarRate, setDolarRate] = useState(null);

  useEffect(() => {
    const fetchDolarRate = async () => {
      const rate = await getDolarRate();
      setDolarRate(rate);
    };
    fetchDolarRate();
  }, []);

  useEffect(() => {
    localStorage.setItem('personal_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

      const sharedExpenseData = {
        ...newExpense,
        amount: parseFloat(amount)
      };

      localStorage.setItem('shared_expenses', JSON.stringify([...sharedExpenses, sharedExpenseData]));
      alert(`Gasto "${newExpense.description}" agregado a Gastos Compartidos.`);
    } else {
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    }

    setDescription('');
    setAmount('');
    setCurrency('ARS');
    setEsCompartido(false);
    setEnCuotas(false);
    setCuotaActual('');
    setTotalCuotas('');
  }, [description, amount, currency, enCuotas, cuotaActual, totalCuotas, esCompartido]);

  const handleClearExpenses = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los gastos?')) {
      setExpenses([]);
    }
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    if (window.confirm('¿Eliminar este gasto?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  }, [expenses]);

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
    <div className="gastos-container">
      <h1 className="page-title">Gastos Personales</h1>

      {/* KPI Section */}
      <div className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Gastos (ARS)</span>
            <span className="kpi-value">${(totals['ARS'] || 0).toFixed(2)}</span>
          </div>
        </div>
        {totals['USD'] > 0 && (
          <div className="kpi-card">
            <div className="kpi-icon">
              <DollarSign size={24} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Gastos (USD)</span>
              <span className="kpi-value">USD {(totals['USD'] || 0).toFixed(2)}</span>
            </div>
          </div>
        )}
        <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={handleClearExpenses}>
          <div className="kpi-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <Trash2 size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Acciones</span>
            <span className="kpi-value" style={{ fontSize: '1rem' }}>Limpiar Todo</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="expense-form-card">
        <h2 className="form-title">Añadir Nuevo Gasto</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '250px' }}>
              <label htmlFor="description_personal" className="form-label">Descripción</label>
              <input
                type="text"
                className="form-input"
                id="description_personal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Compra en el supermercado"
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label htmlFor="amount_personal" className="form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                id="amount_personal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
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
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <label className="form-check">
              <input
                type="checkbox"
                checked={esCompartido}
                onChange={(e) => setEsCompartido(e.target.checked)}
              />
              <span>Gasto Compartido</span>
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                checked={enCuotas}
                onChange={(e) => setEnCuotas(e.target.checked)}
              />
              <span>Pagar en cuotas</span>
            </label>
          </div>

          {enCuotas && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Cuota Actual</label>
                <input
                  type="number"
                  className="form-input"
                  value={cuotaActual}
                  onChange={(e) => setCuotaActual(e.target.value)}
                  placeholder="1"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Total de Cuotas</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalCuotas}
                  onChange={(e) => setTotalCuotas(e.target.value)}
                  placeholder="12"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-submit">Añadir Gasto</button>
        </form>
      </div>

      {/* Table Section */}
      <div className="expenses-table-container">
        {expenses.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-medium)' }}>
            No hay gastos registrados.
          </div>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th className="text-right">Monto</th>
                <th>Cuotas</th>
                <th>Fecha</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{expense.description}</div>
                    {expense.esCompartido && (
                      <span className="tipo-tag compartida" style={{ fontSize: '0.7rem', display: 'inline-block', marginTop: '0.25rem' }}>
                        Compartido
                      </span>
                    )}
                  </td>
                  <td className="text-right" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                    {expense.currency || 'ARS'} ${expense.amount.toFixed(2)}
                  </td>
                  <td>
                    {expense.enCuotas ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-medium)' }}>
                        <CreditCard size={14} />
                        {expense.cuotaActual}/{expense.totalCuotas}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ color: 'var(--color-text-medium)' }}>
                    {new Date(expense.id).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
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
