import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Token és felhasználó kiolvasása a sessionStorage-ból
  const token = sessionStorage.getItem('token');
  const storedUser = sessionStorage.getItem('user');
  
  // Átalakítjuk a tárolt JSON stringet JavaScript objektummá
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Kijelentkezés kezelése
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user'); // A user adatokat is töröljük!
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 style={{ margin: 0 }}>
        <Link to="/" className="webshop-link ">Webshop</Link>
      </h2>

      <div className="nav-links">
        <Link to="/" className="nav-link-a">Produkte</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link-a">Admin Seite</Link>
        )}

        <Link to="/cart" className="nav-link-a" style={{ position: 'relative' }}>
          🛒 Warenkorb {totalItems > 0 && (
            <span className="cart-item-count">
              {totalItems}
            </span>
          )}
        </Link>

        {token && (
          <Link to="/profile" className="nav-link-a">
            Mein Profil
          </Link>
        )}

        {token ? (
          <div className="user-info">
            <span className="user-name">
              Hallo, <strong>{user?.full_name || 'Benutzer'}</strong>!
            </span>

            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link-a">Anmelden</Link>
            <Link to="/register" className="nav-link-a">Registrieren</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;