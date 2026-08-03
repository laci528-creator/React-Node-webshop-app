/*import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Rendelés feldolgozása
  const handleCheckout = async () => {
    const token = sessionStorage.getItem('token');

    // Ha nincs bejelentkezve, átirányítjuk a Login oldalra
    if (!token) {
      alert('Bitte melden Sie sich an, um die Bestellung abzuschließen.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post('/orders', { cart, totalPrice });
      
      // Kosár kiürítése
      clearCart();
      setMessage(`Vielen Dank für Ihre Bestellung! Bestellnummer: #${response.data.orderId}`);
    } catch (err) {
      console.error('Checkout Fehler:', err);
      alert(err.response?.data?.message || 'Fehler beim Ausführen der Bestellung.');
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#e8f8f5', borderRadius: '8px', border: '1px solid #2ecc71' }}>
        <h2 style={{ color: '#27ae60' }}>{message}</h2>
        <p style={{ margin: '20px 0' }}>Ihre Bestellung wurde erfolgreich in der Datenbank gespeichert.</p>
        <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#2980b9', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Weiter einkaufen
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Dein Warenkorb ist leer</h2>
        <p style={{ color: '#7f8c8d', margin: '20px 0' }}>Du hast noch keine Produkte in deinem Warenkorb hinzugefügt.</p>
        <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#2980b9', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Zu den Produkten
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dein Warenkorb</h1>
      
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {cart.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Einzelpreis: €{item.price} | Anzahl: <strong>{item.quantity}</strong></p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
                €{(item.price * item.quantity).toFixed(2)}
              </span>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Entfernen
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd' }}>
        <button 
          onClick={clearCart}
          style={{ backgroundColor: '#95a5a6', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Warenkorb leeren
        </button>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Gesamtsumme: €{totalPrice.toFixed(2)}</h2>
          <button 
            onClick={handleCheckout}
            disabled={loading}
            style={{ backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Wird verarbeitet...' : 'Zur Kasse'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

*/

import React, { useState } from 'react';
import api from '../services/api'; 
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {

  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setOrderMessage(null);
    setOrderError(null);

    try {
      const formattedItems = cart.map(item => ({
        productId: item.id, 
        quantity: item.quantity
      }));

      const response = await api.post('/orders', {
        cartItems: formattedItems
      });

      // Sikeres rendelés üzenete (németül)
      setOrderMessage(`Bestellung erfolgreich abgeschlossen! Gesamtsumme: ${response.data.totalPrice} € (Bestellnummer: ${response.data.orderId})`);
      
      clearCart();

      setTimeout(() => {
        navigate('/'); // Itt megadhatsz bármilyen útvonalat, pl. '/profile' vagy '/success'
      }, 4000);

    } catch (err) {
      // Hibaüzenetek (németül)
      console.error('Fehler bei der Bestellung:', err);
      setOrderError(err.response?.data?.message || 'Ein Fehler ist bei der Verarbeitung der Bestellung aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        
        {/* PROFI SIKERÜZENET - Csak akkor jelenik meg, ha frissen vásárolt */}
        {orderMessage && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', padding: '20px', borderRadius: '8px', marginBottom: '30px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '10px' }}>✅</span>
            <strong>{orderMessage}</strong>
            <div style={{ marginTop: '15px', color: '#28a745', fontSize: '0.9rem' }}>
              Du wirst in Kürze zur Startseite weitergeleitet...
            </div>
          </div>
        )}

        <h2>Dein Warenkorb ist leer</h2>
        <p style={{ color: '#7f8c8d', margin: '20px 0' }}>Du hast noch keine Produkte in deinem Warenkorb hinzugefügt.</p>
        
        {/* Ha épp átirányításra vár (van orderMessage), akkor felesleges a gombot mutatni */}
        {!orderMessage && (
          <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#2980b9', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            Zu den Produkten
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="cart-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dein Warenkorb</h1>
      
      {/* PROFI HIBAÜZENET - A cím alatt jelenik meg, hogy azonnal észrevegye */}
      {orderError && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', padding: '15px', borderRadius: '5px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>❌</span>
          <strong>{orderError}</strong>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {cart.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Einzelpreis: €{item.price} | Anzahl: <strong>{item.quantity}</strong></p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
                €{(item.price * item.quantity).toFixed(2)}
              </span>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Entfernen
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd' }}>
        <button 
          onClick={clearCart}
          style={{ backgroundColor: '#95a5a6', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Warenkorb leeren
        </button>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Gesamtsumme: €{totalPrice.toFixed(2)}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
              Weiter einkaufen
            </Link>
            <button 
              onClick={handleCheckout} 
              disabled={isSubmitting || cart.length === 0}
              style={{
                background: isSubmitting ? '#ccc' : '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? 'Wird bearbeitet...' : 'Jetzt kaufen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}