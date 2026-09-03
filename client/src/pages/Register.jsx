import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    try {
      await api.post('/auth/register', { 
        full_name: trimmedFullName, 
        email: trimmedEmail, 
        password,
      });

      navigate('/login');
    } catch (err) {
      console.error('Registrierungsfehler:', err);
      setError(
        err.response?.data?.message || 
        'Registrierung fehlgeschlagen!'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Registrieren</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        
        <div>
          <label htmlFor="fullName" className="form-label">Name:</label>
          <input 
            id="fullName"
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            required
            autoComplete="name"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">E-Mail-Adresse:</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            autoComplete="email"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">Passwort:</label>
          <input
            id="password"
            type="password" 
            minLength={8}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            autoComplete="new-password"
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Konto wird erstellt...' : 'Konto erstellen'}
        </button>
      </form>
    </div>
  );
}

export default Register;