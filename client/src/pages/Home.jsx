
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';

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
    <div className="home-page">
      <h1>Webshop Produktkatalog</h1>

      {/* --- KERESŐ ÉS RENDEZŐ SÁV --- */}
      <div className="search-sort-container">
        <input 
          type="text"
          placeholder="Produkte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* --- ÚJ: RENDEZÉS LEGÖRDÜLŐ MENÜ --- */}
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
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
        <p className="no-products-message">
          Keine Produkte gefunden, die deinen Kriterien entsprechen.
        </p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-element">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="product-image"
                />
                
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description}
                </p>
                
                <p className="product-category">
                  <strong>Kategorie:</strong> {product.category}
                </p>
                <p className="product-stock">
                  <strong>Verfügbar:</strong> {product.stock} Stück
                </p>
                
                <p className="product-price">
                  €{Number(product.price).toFixed(2)}
                </p>
              </div>

              <div className="product-actions-buttons">                                                                                                                                                                                                                                              
               {product.stock > 0 ? (
                <button 
                  onClick={() => addToCart(product)}
                  className="primary-button"
                >
                  In den Warenkorb
                </button>
               ) : (
                <button 
                  disabled
                  className="unavailable-button"
                >
                  Ausverkauft
                </button>
              )}
                
                <Link 
                  to={`/product/${product.id}`} 
                  className="secondary-button"
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