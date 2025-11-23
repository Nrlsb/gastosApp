import { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    showLoading('Iniciando sesión...');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Sesión iniciada correctamente', 'success');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      showToast(`Error al iniciar sesión: ${error.message}`, 'danger');
      throw error; // Re-throw to allow component to handle if needed
    } finally {
      hideLoading();
    }
  }, [showLoading, showToast]);

  const authValue = useMemo(() => ({ currentUser, loading, login }), [currentUser, loading, login]);

  return authValue;
};

export default useAuth;
