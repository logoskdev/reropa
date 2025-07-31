import React, { useState } from 'react';
import { auth } from '../firebase/config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Intentando login o registro con email:", email);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registro exitoso");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login exitoso");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error en autenticación:", err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Intentando login con Google");
      await signInWithPopup(auth, provider);
      console.log("Login con Google exitoso");
    } catch (err) {
      setError(err.message);
      console.error("Error login Google:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>
      <form onSubmit={handleEmailAuth} style={styles.form}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          {isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>

      <p>O usar:</p>
      <button onClick={handleGoogleLogin} style={styles.googleBtn}>
        Iniciar con Google
      </button>

      <p style={{ marginTop: '10px' }}>
        {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
        <button onClick={() => setIsRegister(!isRegister)} style={styles.toggleBtn}>
          {isRegister ? 'Iniciar sesión' : 'Registrate'}
        </button>
      </p>

      {error && <p style={styles.error}>⚠️ {error}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '10px',
    fontSize: '1rem'
  },
  button: {
    padding: '10px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none'
  },
  googleBtn: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#DB4437',
    color: '#fff',
    border: 'none'
  },
  toggleBtn: {
    background: 'none',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  error: {
    color: 'red',
    marginTop: '1rem'
  }
};

export default AuthForm;
