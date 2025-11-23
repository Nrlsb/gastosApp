import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoadingContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');

  const showLoading = useCallback((text = 'Cargando...') => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Cargando...');
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && (
        <div className="loading-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}>
          <LoadingSpinner text={loadingText} />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
