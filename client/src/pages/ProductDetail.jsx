import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams(); // Kiolvassuk az ID-t az URL-ből (pl. /product/3 -> id: 3)
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Termék adatainak lekérése
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
      
      {/* Vissza gomb */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#ecf0f1', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
      >
        &larr; Zurück
      </button>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Bal oldal: Kép helye */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#f9f9f9', minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <span style={{ color: '#aaa' }}>[Bild Platzhalter]</span>
        </div>
        
        {/* Jobb oldal: Termék adatok */}
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
          
          <button style={{ padding: '15px 30px', backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;