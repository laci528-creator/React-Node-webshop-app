import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const storedUser = sessionStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>{user ? user.full_name : 'Mein Profil'}</h1>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Abmelden
        </button>
      </div>

      <h2>Meine Bestellungen</h2>
      
      {loading ? (
        <p>Bestellungen werden geladen...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Du hast noch keine Bestellungen getätigt.</p>
      ) : (
<div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
  {orders.map((order) => (
    <div key={order.id} style={{ 
      padding: '20px', 
      border: '1px solid #dcdcdc', 
      borderRadius: '10px', 
      backgroundColor: '#ffffff', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)' 
    }}>
      
      {/* 1. FEJLÉC: Rendelés száma és dátuma */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #eee', 
        paddingBottom: '12px', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2c3e50' }}>
          Bestellung #{order.id}
        </h3>
        <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
          Datum: {new Date(order.created_at).toLocaleDateString('de-DE')}
        </span>
      </div>

      {/* 2. TÉTELEK LISTÁJA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {order.items.map((item) => (
          <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f8c8d' }}>
                {item.quantity}x €{Number(item.price).toFixed(2)}
              </p>
            </div>
            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
              €{(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* 3. LÁBLÉC: Státusz és Végösszeg */}
      <div style={{ 
        marginTop: '15px', 
        paddingTop: '15px', 
        borderTop: '1px dashed #eee', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
          Bestellstatus: <strong style={{ textTransform: 'capitalize', color: '#27ae60' }}>{order.status}</strong>
        </span>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: '#7f8c8d', marginRight: '10px' }}>Gesamtsumme:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
            €{Number(order.total_price).toFixed(2)}
          </span>
        </div>
      </div>

    </div>
  ))}
</div>
      )}
    </div>
  );
}

export default Profile;