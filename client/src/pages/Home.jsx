
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // <--- ÚJ: Rendezési állapot
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Dinamikusan összerakjuk a query paramétereket
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (sortOrder) params.append('sort', sortOrder);

        const endpoint = `/products?${params.toString()}`;
        const response = await api.get(endpoint);
        setProducts(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProducts([]);
        } else {
          console.error('Fehler beim Laden der Produkte:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortOrder]); // <--- Figyeljük a sortOrder változását is!

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Webshop Produktkatalog</h1>

      {/* --- KERESŐ ÉS RENDEZŐ SÁV --- */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Keresőmező */}
        <input 
          type="text"
          placeholder="Produkte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            maxWidth: '500px',
            padding: '12px 15px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        />

        {/* --- ÚJ: RENDEZÉS LEGÖRDÜLŐ MENÜ --- */}
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: '12px 15px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <option value="">Neueste zuerst (Standard)</option>
          <option value="price_asc">Preis: Aufsteigend (Günstigste zuerst)</option>
          <option value="price_desc">Preis: Absteigend (Teuerste zuerst)</option>
        </select>
      </div>

      {/* --- TERMÉKEK LISTÁJA --- */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Produkte werden geladen...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic', marginTop: '40px' }}>
          Keine Produkte gefunden, die deinen Kriterien entsprechen.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ 
              border: '1px solid #dcdcdc', 
              borderRadius: '10px', 
              padding: '15px', 
              backgroundColor: '#ffffff', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              height: '100%' 
            }}>
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
                  to={`/product/${product.id}`} 
                  style={{ textAlign: 'center', backgroundColor: '#34495e', color: '#fff', padding: '10px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                  Details ansehen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}