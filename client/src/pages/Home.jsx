import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
        setError('Fehler beim Laden der Produkte.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2 style={{ padding: '20px' }}>Laden...</h2>;
  if (error) return <h2 style={{ padding: '20px', color: 'red' }}>{error}</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Webshop Produkt katalog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => (

          <div style={{ 
            border: '1px solid #dcdcdc', 
            borderRadius: '10px', 
            padding: '15px', 
            backgroundColor: '#ffffff', 
            display: 'flex',              
            flexDirection: 'column',      
            justifyContent: 'space-between',
            height: '100%'               
          }}>
            
            {/* 2. FELSŐ RÉSZ: Kép, cím, leírás, ár (Ez fog "növekedni") */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <img 
                src={product.image_url} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
              />
              
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{product.name}</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#7f8c8d', flex: 1 }}>
                {product.description}
              </p>
              
              <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem' }}>
                <strong>Kategorie:</strong> {product.category}
              </p>
              
              <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#27ae60' }}>
                €{Number(product.price).toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <button 
                onClick={() => addToCart(product)}
                style={{ backgroundColor: '#2980b9', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                In den Warenkorb
              </button>
              <Link 
                to={`/products/${product.id}`} 
                style={{ textAlign: 'center', backgroundColor: '#34495e', color: '#fff', padding: '10px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                Details ansehen
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;