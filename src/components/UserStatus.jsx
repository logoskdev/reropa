import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function UserStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Detectar cambios en la sesión
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) return <p>No estás logueado.</p>;

  return (
    <div>
      <p>Hola, {user.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
