import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  // Űrlap állapotok (state)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Regisztráció elküldése a szervernek
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Meghívjuk a POST /api/v1/auth/register végpontot
      await api.post('/auth/register', { full_name: fullName, email, password });

      // Sikeres regisztráció után átirányítjuk a felhasználót a bejelentkezés oldalra
      navigate('/login');
    } catch (err) {
      console.error('Registrierungsfehler:', err);
      // Hibaüzenet megjelenítése
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen!');
    }
  };

  return (
    <div className="login-container">
      <h2>Registrieren</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        
        <div>
          <label className="form-label">Benutzername:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required
            className="form-input"
          />
        </div>

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
          Konto erstellen
        </button>
      </form>
    </div>
  );
}

export default Register;