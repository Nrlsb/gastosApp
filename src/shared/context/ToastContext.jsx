import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [show, setShow] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    // Clear any existing timeout to prevent multiple toasts from interfering
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setToast({ message, type });
    setShow(true);

    const id = setTimeout(() => {
      setShow(false);
      setToast({ message: '', type: 'info' }); // Clear message after hiding
    }, duration);
    setTimeoutId(id);
  }, [timeoutId]);

  const hideToast = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShow(false);
    setToast({ message: '', type: 'info' });
  }, [timeoutId]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </ToastContext.Provider>
  );
};
