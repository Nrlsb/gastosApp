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
    <div className="login-page">
      <h2>Iniciar Sesión</h2>
      <div className="auth-forms">
        <div className="login-form">
          <button onClick={handleGoogleSignIn} className="google-signin-button">
            Iniciar Sesión con Google
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
