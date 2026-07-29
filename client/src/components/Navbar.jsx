import { Link } from 'react-router-dom';

function Navbar() {
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
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Produkte</Link>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Anmelden</Link>
        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Registrieren</Link>
      </div>
    </nav>
  );
}

export default Navbar;