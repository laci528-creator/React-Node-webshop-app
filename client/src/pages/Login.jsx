import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  // Űrlap állapotok (state)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Hook az oldalak közötti átirányításhoz

  // Bejelentkezés elküldése a szervernek
  const handleSubmit = async (e) => {
    e.preventDefault(); // Megakadályozza az oldal alapértelmezett újratöltődését
    setError(null);

    try {
      // Meghívjuk a POST /api/v1/auth/login végpontot
      const response = await api.post('/auth/login', { email, password });

      // Ha a bejelentkezés sikeres, elmentjük a tokent a sessionStorage-ba
      sessionStorage.setItem('token', response.data.token);

      // 2. ÚJ: Elmentjük a felhasználó adatait is JSON stringként
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
 
      // Visszairányítjuk a felhasználót a főoldalra (termékkatalógus)
      navigate('/');
      
      // Opcionális: oldal frissítése vagy állapotkezelés, hogy a Navbar is érzékelje a belépést
      window.location.reload(); 
    } catch (err) {
      console.error('Anmeldefehler:', err);
      // Hibaüzenet megjelenítése németül a válasz alapján vagy általánosan
      setError(err.response?.data?.message || 'Ungültige E-Mail-Adresse oder Passwort!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Anmelden</h2>
      
      {/* Hibaüzenet kiírása, ha van */}
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fd8d8d22', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>E-Mail-Adresse:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Passwort:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Einloggen
        </button>
      </form>
    </div>
  );
}

export default Login;