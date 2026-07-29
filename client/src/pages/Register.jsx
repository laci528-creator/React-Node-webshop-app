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
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Registrieren</h2>
      
      {/* Hibaüzenet kiírása */}
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fd8d8d22', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Benutzername:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

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
          Konto erstellen
        </button>
      </form>
    </div>
  );
}

export default Register;