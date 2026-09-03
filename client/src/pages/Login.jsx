import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // page refresh not allowed 
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    try {
      const response = await api.post('/auth/login', { email: trimmedEmail, password });

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
 
      navigate('/');
      window.location.reload(); 
    } catch (err) {
      console.error('Anmeldefehler:', err);
      setError(
        err.response?.data?.message || 
          'Ungültige E-Mail-Adresse oder Passwort!'
      );
    } finally {
    setIsSubmitting(false);
  }
  };

  return (
    <div className="login-container">
      <h2>Anmelden</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
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
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            autoComplete="current-password" 
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Anmelden...' : 'Einloggen'}
        </button>
      </form>
    </div>
  );
}

export default Login;