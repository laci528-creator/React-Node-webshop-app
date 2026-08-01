import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Ellenőrizzük, hogy van-e token a sessionStorage-ban
  const token = sessionStorage.getItem('token');

  // Ha nincs token, átirányítjuk a bejelentkezésre,
  // a "replace" pedig gondoskodik róla, hogy a böngésző "Vissza" gombjával ne lehessen visszajönni a védett oldalra.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ha van token, megjelenítjük a kért komponenst (children)
  return children;
}

export default ProtectedRoute;