import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/useCart';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddToCart = (product) => {
  addToCart(product);

  setMessage(`${product.name} wurde zum Warenkorb hinzugefügt.`);

  setTimeout(() => {
    setMessage('');
  }, 2000);
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden des Produkts:', err);
        setError('Produkt nicht gefunden oder Serverfehler.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="loading-text">Laden...</h2>;
  if (error) return <h2 className="error-text">{error}</h2>;
  if (!product) return null;

  return (
    <div className="product-detail-container">
      {message && (
  <div className="cart-toast">
    ✓ {message}
  </div>
)}
      <button 
        onClick={() => navigate(-1)} 
        className="btn-back"
      >
      Zurück zum Produktliste
      </button>
      
      <div className="product-layout">
        <div className="product-image-container">
          <img 
            src={product.image_url || 'https://via.placeholder.com/400x300?text=Kein+Bild'} 
            alt={product.name} 
            className="product-image-detail"
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-detail-category">
            Kategorie: <strong>{product.category}</strong>
          </p>
          
          <p className="product-price-detail">
            €{product.price}
          </p>
          
          <p className="product-detail-description">
            {product.description}
          </p>

          <p>
            <strong>Verfügbar:</strong> {product.stock} Stück
          </p>
          
          {product.stock > 0 ? (
            <button 
              onClick={() => handleAddToCart(product)}
              className="btn-add-to-cart"
            >
              In den Warenkorb
            </button>) : (
            <button 
              disabled
              className="unavailable-button"
            >
              Ausverkauft
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;