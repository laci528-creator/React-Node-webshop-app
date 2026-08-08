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
    <div className="login-container">
      <h2>Anmelden</h2>
      
      {/* Hibaüzenet kiírása, ha van */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label className="form-label">E-Mail-Adresse:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Passwort:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
        >
          Einloggen
        </button>
      </form>
    </div>
  );
}

export default Login;