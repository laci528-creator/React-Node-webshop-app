import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Amint betölt az oldal, lekérjük a rendeléseket
  useEffect(() => {
    const fetchMyOrders = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Kijelentkezés és visszairányítás a főoldalra
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Fejléc és Kijelentkezés */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Mein Profil</h1>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Abmelden
        </button>
      </div>

      {/* Rendelések listája */}
      <h2>Meine Bestellungen</h2>
      
      {loading ? (
        <p>Bestellungen werden geladen...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Du hast noch keine Bestellungen getätigt.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
              
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Bestellung #{order.id}</h3>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  Datum: {new Date(order.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60', margin: '0 0 5px 0' }}>
                  €{Number(order.total_price).toFixed(2)}
                </p>
                <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#d4efdf', color: '#27ae60', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {order.status}
                </span>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;