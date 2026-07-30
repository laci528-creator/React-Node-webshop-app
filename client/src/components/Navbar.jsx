import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Token és felhasználó kiolvasása a localStorage-ból
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  // Átalakítjuk a tárolt JSON stringet JavaScript objektummá
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Kijelentkezés kezelése
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // A user adatokat is töröljük!
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#2c3e50',
      color: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Webshop</Link>
      </h2>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Produkte</Link>

        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500', position: 'relative' }}>
          🛒 Warenkorb {totalItems > 0 && (
            <span style={{ backgroundColor: '#e74c3c', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.8rem', marginLeft: '5px' }}>
              {totalItems}
            </span>
          )}
        </Link>

        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Üdvözlő szöveg a névvel */}
            <span style={{ fontSize: '0.95rem', color: '#ecf0f1' }}>
              Hallo, <strong>{user?.full_name || 'Benutzer'}</strong>!
            </span>

            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Abmelden
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Anmelden</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Registrieren</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;