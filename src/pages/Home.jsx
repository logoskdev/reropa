import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        navigate('/');
      }
    });
    return unsub;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Bienvenido, {user?.email}</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Home;
