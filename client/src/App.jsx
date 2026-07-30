import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

const Profile = () => (
  <div style={{ padding: '20px' }}>
    <h2>Mein Profil </h2>
    <p>Seite nur für angemeldet Persone!</p>
  </div>
);

function App() {
  return (
    <CartProvider>
    <div>
      {/* Navigációs sáv minden oldalon fent van */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
    </CartProvider>
  );
}

export default App;