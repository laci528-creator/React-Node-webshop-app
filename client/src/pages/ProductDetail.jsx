import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <h2 style={{ padding: '20px' }}>Laden...</h2>;
  if (error) return <h2 style={{ padding: '20px', color: 'red' }}>{error}</h2>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
      >
      Zurück zum Produktliste
      </button>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
<div style={{ flex: '1 1 300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', maxHeight: '400px' }}>
  <img 
    src={product.image_url || 'https://via.placeholder.com/400x300?text=Kein+Bild'} 
    alt={product.name} 
    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
  />
</div>
        
        <div style={{ flex: '2 1 300px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>{product.name}</h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem', marginBottom: '20px' }}>
            Kategorie: <strong>{product.category}</strong>
          </p>
          
          <p style={{ fontSize: '2rem', color: '#2ecc71', fontWeight: 'bold', margin: '0 0 20px 0' }}>
            €{product.price}
          </p>
          
          <p style={{ lineHeight: '1.6', marginBottom: '30px' }}>
            {product.description}
          </p>

          <p>
            <strong>Verfügbar:</strong> {product.stock} Stück
          </p>
          
          <button 
            onClick={() => addToCart(product)}
            style={{ padding: '15px 30px', backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;