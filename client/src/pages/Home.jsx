import { useState, useEffect } from 'react';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Termékek lekérése a backendről
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
      <h1>Webshop Produktkatalog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Kategorie:</strong> {product.category}</p>
            <p style={{ fontSize: '1.2rem', color: '#2ecc71', fontWeight: 'bold' }}>
              €{product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;