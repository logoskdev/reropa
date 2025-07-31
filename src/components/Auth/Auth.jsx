// src/components/Auth.jsx
import { useState, useEffect } from 'react';
import { signInWithEmail, signInWithGoogle, onAuthStateChanged } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        navigate('/home');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin}>Ingresar con Google</button>
    </div>
  );
};

export default Auth;
