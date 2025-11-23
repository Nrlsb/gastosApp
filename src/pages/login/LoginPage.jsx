import React, { useState } from 'react';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      console.log('Usuario ha iniciado sesión con Google');
      navigate('/'); // Redirige a la página de inicio
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4">Iniciar Sesión</h2>
        <div className="d-grid gap-3">
          <button onClick={handleGoogleSignIn} className="btn btn-danger btn-lg">
            <i className="fab fa-google me-2"></i> Iniciar Sesión con Google
          </button>
        </div>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
