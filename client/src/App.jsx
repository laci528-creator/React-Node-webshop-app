import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: Amikor a komponens betöltődik, azonnal lefut a fetchProducts függvény
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Meghívjuk a GET /api/v1/products végpontot a saját Axios példányunkkal
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
        setError('Termékek betöltése sikertelen.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2>Laden... (Betöltés...)</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Webshop Productlist</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Végigmegyünk a kapott termékeken és rendereljük őket */}
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Kategória:</strong> {product.category}</p>
            <p style={{ fontSize: '1.2rem', color: '#2ecc71', fontWeight: 'bold' }}>
              €{product.price}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;