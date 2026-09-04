import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const token = sessionStorage.getItem('token');
  const storedUser = sessionStorage.getItem('user');
  
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
      <Link to="/" className="webshop-brand">
        <img
          src="/favicon_webshop.png"
          alt=""
          className="nav-logo"
        />
        <span>Webshop</span>
      </Link>

      <div className="nav-links">
       <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link-a${isActive ? " active" : ""}`
          }
        >
          Produkte
        </NavLink>

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Admin Seite
          </NavLink>
        )}

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `nav-link-a cart-link${isActive ? " active" : ""}`
          }
        >
          🛒 Warenkorb
          {totalItems > 0 && (
            <span className="cart-item-count">
              {totalItems}
            </span>
          )}
        </NavLink>

        {token && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Mein Profil
          </NavLink>
        )}

        {token ? (
          <div className="user-info">
            <span className="user-name">
              Hallo, <strong>{user?.full_name || 'Benutzer'}</strong>!
            </span>

            <button
              type="button"
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
      </div>
    </nav>
  );
}

export default Navbar;