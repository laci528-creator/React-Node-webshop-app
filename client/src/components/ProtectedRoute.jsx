import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {

  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;