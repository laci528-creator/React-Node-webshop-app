
import { useState } from 'react';
import api from '../services/api'; 
import { useCart } from '../context/useCart';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {

  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, totalItems, totalPrice, increaseQuantity, decreaseQuantity } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const token = sessionStorage.getItem("token");

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!token) {
      navigate("/login");
      return;
    }

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

      setOrderMessage(`Bestellung erfolgreich abgeschlossen! Gesamtsumme: ${response.data.totalPrice} € (Bestellnummer: ${response.data.orderId})`);
      
      clearCart();

      setTimeout(() => {
        navigate('/'); 
      }, 4000);

    } catch (err) {
      
      console.error('Fehler bei der Bestellung:', err);
      setOrderError(err.response?.data?.message || 'Ein Fehler ist bei der Verarbeitung der Bestellung aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

if (cart.length === 0) {
  return (
    <div className="order-message">
      {orderMessage ? (
        <div className="order-success-message">
          <span className="order-message-icon">✅</span>
          <strong>{orderMessage}</strong>

          <div className="order-message-content">
            Du wirst in Kürze zur Startseite weitergeleitet...
          </div>
        </div>
      ) : (
        <>
          <h2>Dein Warenkorb ist leer</h2>

          <p className="empty-cart-message">
            Du hast noch keine Produkte in deinem Warenkorb hinzugefügt.
          </p>

          <Link to="/" className="primary-button">
            Zu den Produkten
          </Link>
        </>
      )}
    </div>
  );
}

  return (
    <div className="cart-container">
      <h1>Dein Warenkorb</h1>
      
      {orderError && (
        <div className="cart-error-message">
          <span>❌</span>
          <strong>{orderError}</strong>
        </div>
      )}

<div className="cart-items-container">
  {cart.map((item) => (
    <div key={item.id} className="cart-item">
      <div>
        <h3 className="cart-product-name" >{item.name}</h3>
        <p className="product-price-cart">Einzelpreis: €{item.price}</p>
        
        <div className="quantity-controls">
          <button 
            onClick={() => decreaseQuantity(item.id)}
            className="quantity-button"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          
          <span className="quantity-value">
            {item.quantity}
          </span>

          <button 
            onClick={() => increaseQuantity(item.id)}
            className="quantity-button"
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="cart-item-right">
        <span className="product-total-price">
          €{(item.price * item.quantity).toFixed(2)}
        </span>
        
        <button 
          onClick={() => removeFromCart(item.id)}
          className="secondary-button"
        >
          Entfernen
        </button>
      </div>

    </div>
  ))}
</div>
      <div className="cart-summary">
        <div className="cart-summary-content">
          <h2 className="cart-summary-title">Bestellübersicht</h2>
          <p className="cart-summary-text">Gesamtanzahl der Produkte: {totalItems}</p>
        
        <h2 className="item-total-price" >Gesamtsumme: €{totalPrice.toFixed(2)}</h2>
         {token ? (
            <button 
              onClick={handleCheckout} 
              disabled={isSubmitting || cart.length === 0}
              className="order-button"
            >
              {isSubmitting ? 'Wird bearbeitet...' : 'Jetzt kaufen'}
            </button>
            ) : (
              <Link
                to="/login"
                className="order-button"
              >
                Einloggen und bestellen
              </Link>
            )}
            </div>
          <div className="cart-actions">
            <button 
              onClick={clearCart}
              className="secondary-button clear-cart-button"
            >
              Warenkorb leeren
            </button>
          
            <Link to="/" className="secondary-button">
              Weiter einkaufen
            </Link>

          </div>
        
      </div>
    </div>
  );
}

