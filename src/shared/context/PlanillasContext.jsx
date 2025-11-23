import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

const PlanillasContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePlanillas = () => {
  return useContext(PlanillasContext);
};

export const PlanillasProvider = ({ children }) => {
  const [planillas, setPlanillas] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const planillasCollectionRef = useMemo(() => collection(db, 'planillas'), []);

  // Fetch planillas from Firestore
  const fetchPlanillas = useCallback(async () => {
    if (!currentUser) {
      setPlanillas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(planillasCollectionRef, where("userId", "==", currentUser.uid));
      const data = await getDocs(q);
      setPlanillas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      setError(err);
      console.error("Error fetching planillas:", err);
    } finally {
      setLoading(false);
    }
  }, [planillasCollectionRef, currentUser]);

  useEffect(() => {
    fetchPlanillas();
  }, [fetchPlanillas]);

  // CRUD operations for Planillas
  const addPlanilla = useCallback(async (newPlanilla) => {
    try {
      const docRef = await addDoc(planillasCollectionRef, newPlanilla);
      await fetchPlanillas(); // Re-fetch
      return docRef;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [planillasCollectionRef, fetchPlanillas]);

  const updatePlanilla = useCallback(async (id, updatedPlanilla) => {
    try {
      const planillaDoc = doc(db, 'planillas', id);
      await updateDoc(planillaDoc, updatedPlanilla);
      await fetchPlanillas(); // Re-fetch
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [fetchPlanillas]);

  const deletePlanilla = useCallback(async (id) => {
    try {
      const planillaDoc = doc(db, 'planillas', id);
      await deleteDoc(planillaDoc);
      await fetchPlanillas(); // Re-fetch
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [fetchPlanillas]);

  // CRUD operations for Expenses
  const getExpenses = useCallback(async (planillaId) => {
    if (!planillaId) return;
    try {
      const expensesCollectionRef = collection(db, 'planillas', planillaId, 'expenses');
      const data = await getDocs(expensesCollectionRef);
      setExpenses(data.docs.map((d) => ({ ...d.data(), id: d.id })));
    } catch (err) {
      setError(err);
    }
  }, []);

  const addExpense = useCallback(async (planillaId, newExpense) => {
    if (!planillaId) throw new Error("Planilla ID is required to add an expense.");
    try {
      const expensesCollectionRef = collection(db, 'planillas', planillaId, 'expenses');
      const docRef = await addDoc(expensesCollectionRef, newExpense);
      await getExpenses(planillaId); // Re-fetch expenses for the current planilla
      return docRef;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [getExpenses]);

  const updateExpense = useCallback(async (planillaId, expenseId, updatedExpense) => {
    if (!planillaId || !expenseId) throw new Error("Planilla ID and Expense ID are required.");
    try {
      const expenseDoc = doc(db, 'planillas', planillaId, 'expenses', expenseId);
      await updateDoc(expenseDoc, updatedExpense);
      await getExpenses(planillaId);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [getExpenses]);

  const deleteExpense = useCallback(async (planillaId, expenseId) => {
    if (!planillaId || !expenseId) throw new Error("Planilla ID and Expense ID are required.");
    try {
      const expenseDoc = doc(db, 'planillas', planillaId, 'expenses', expenseId);
      await deleteDoc(expenseDoc);
      await getExpenses(planillaId);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [getExpenses]);


  const value = useMemo(() => ({
    planillas,
    expenses,
    loading,
    error,
    addPlanilla,
    updatePlanilla,
    deletePlanilla,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }), [planillas, expenses, loading, error, addPlanilla, updatePlanilla, deletePlanilla, getExpenses, addExpense, updateExpense, deleteExpense]);

  return (
    <PlanillasContext.Provider value={value}>
      {children}
    </PlanillasContext.Provider>
  );
};
