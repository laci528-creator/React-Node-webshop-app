import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';



function Profile() {
  const storedUser = sessionStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get("/orders/my-orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Bestellungen:", error);
        setError("Die Bestellungen konnten nicht geladen werden.");
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
  <div className="profile">

    <div className="profile-header">
      <h1>{user ? user.full_name : 'Mein Profil'}</h1>
      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Abmelden
      </button>
    </div>

    <h2>Meine Bestellungen</h2>

    {loading ? (
        <p>Bestellungen werden geladen...</p>
      ) : error ? (
        <p className="profile-error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">
          Du hast noch keine Bestellungen getätigt.
        </p>
    ) : (
      orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3 className="order-title">
              Bestellung #{order.id}
            </h3>

            <span className="order-date">
              Datum:{' '}
              {new Date(order.created_at).toLocaleDateString('de-DE')}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="order-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />

                <div className="order-item-info">
                  <p className="order-item-name">
                    {item.name}
                  </p>

                  <p className="order-item-details">
                    {item.quantity}x €
                    {Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="order-item-total">
                  €
                  {(item.quantity * Number(item.price)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">

            <span className="order-status">
              Bestellstatus:{' '}
              <strong>{order.status}</strong>
            </span>

            <div className="order-total">
              <span className="order-total-label">
                Gesamtsumme:
              </span>

              <span className="order-total-price">
                €{Number(order.total_price).toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      ))
    )}

  </div>
);
}

export default Profile;