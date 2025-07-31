// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from './pages/Home';
import Profile from './pages/Profile';
import AddProductPage from './pages/AddProduct';
import AuthForm from './components/AuthForm';
import UserStatus from './components/UserStatus';
import Gallery from './pages/Galeria'; // NUEVA IMPORTACIÓN

import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
            <nav style={{ marginBottom: '1rem' }}>
              <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
              <Link to="/galeria" style={{ marginRight: '1rem' }}>Galería</Link>
              <Link to="/add-product" style={{ marginRight: '1rem' }}>Vender</Link>
              <Link to="/profile">Perfil</Link>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/galeria" element={<Gallery />} /> {/* NUEVA RUTA */}
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
