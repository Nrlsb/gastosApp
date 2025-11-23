import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const PlanillasContext = createContext();

export const usePlanillas = () => {
  return useContext(PlanillasContext);
};

export const PlanillasProvider = ({ children }) => {
  const [planillas, setPlanillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const planillasCollectionRef = collection(db, 'planillas');

  // Fetch planillas from Firestore
  useEffect(() => {
    const getPlanillas = async () => {
      try {
        const data = await getDocs(planillasCollectionRef);
        setPlanillas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getPlanillas();
  }, []);

  // CRUD operations
  const addPlanilla = async (newPlanilla) => {
    try {
      const docRef = await addDoc(planillasCollectionRef, newPlanilla);
      // Re-fetch or update state locally
      const data = await getDocs(planillasCollectionRef);
      setPlanillas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      return docRef; // Devolver el docRef
    } catch (err) {
      setError(err);
      throw err; // Re-lanzar el error para que el componente que llama pueda manejarlo
    }
  };

  const updatePlanilla = async (id, updatedPlanilla) => {
    try {
      const planillaDoc = doc(db, 'planillas', id);
      await updateDoc(planillaDoc, updatedPlanilla);
      // Re-fetch or update state locally
      const data = await getDocs(planillasCollectionRef);
      setPlanillas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      setError(err);
    }
  };

  const deletePlanilla = async (id) => {
    try {
      const planillaDoc = doc(db, 'planillas', id);
      await deleteDoc(planillaDoc);
      // Re-fetch or update state locally
      const data = await getDocs(planillasCollectionRef);
      setPlanillas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      setError(err);
    }
  };

  const value = {
    planillas,
    loading,
    error,
    addPlanilla,
    updatePlanilla,
    deletePlanilla,
  };

  return (
    <PlanillasContext.Provider value={value}>
      {children}
    </PlanillasContext.Provider>
  );
};
