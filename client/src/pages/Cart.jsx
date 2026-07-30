import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();

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

      {/* Összesítő sáv */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd' }}>
        <div>
          <button 
            onClick={clearCart}
            style={{ backgroundColor: '#95a5a6', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Warenkorb leeren
          </button>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Gesamtsumme: €{totalPrice.toFixed(2)}</h2>
          <button 
            style={{ backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => alert('A pénztár funkció hamarosan érkezik!')}
          >
            Zur Kasse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;