// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from './pages/Home';
import Profile from './pages/Profile';
import AddProductPage from './pages/AddProductPage';
import AuthForm from './components/AuthForm';
import UserStatus from './components/UserStatus';

import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  // Estado para modo oscuro: true = oscuro, false = claro
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Escuchar cambios de auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Aplicar la clase dark al body y guardar en localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">ReRopa 👕</h1>
        <UserStatus />

        {/* Botón para cambiar tema */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ marginBottom: '1rem', padding: '0.4rem 1rem', cursor: 'pointer' }}
        >
          Cambiar a {darkMode ? 'modo claro' : 'modo oscuro'}
        </button>

        {!user ? (
          <AuthForm />
        ) : (
          <>
            {/* Navegación simple */}
            <nav style={{ marginBottom: '1rem' }}>
              <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
              <Link to="/add-product" style={{ marginRight: '1rem' }}>Agregar Producto</Link>
              <Link to="/profile">Perfil</Link>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add-product" element={<AddProductPage />} />
              {/* Ruta fallback, redirige a home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
