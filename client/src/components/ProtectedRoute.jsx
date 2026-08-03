import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
  // Ellenőrizzük, hogy van-e token a sessionStorage-ban
  const token = sessionStorage.getItem('token');

const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  //const adminOnly = false;

  // Ha nincs token, átirányítjuk a bejelentkezésre,
  // a "replace" pedig gondoskodik róla, hogy a böngésző "Vissza" gombjával ne lehessen visszajönni a védett oldalra.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Ha van token, megjelenítjük a kért komponenst (children)
  return children;
}

export default ProtectedRoute;