
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState("success");

const handleAddToCart = (product) => {
  const cartItem = cart.find((item) => item.id === product.id);

   if (cartItem && cartItem.quantity >= product.stock) {
    setMessage(
      `Die maximale verfügbare Menge von ${product.name} ist bereits im Warenkorb.`
    );
    setMessageType("error");
  } else {
      addToCart(product);
      setMessage(`${product.name} wurde zum Warenkorb hinzugefügt.`);
      setMessageType("success");
    }

  setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};
        const trimmedSearchQuery = searchQuery.trim();

        if (trimmedSearchQuery) params.search = trimmedSearchQuery;
        if (sortOrder) params.sort = sortOrder;

        const response = await api.get('/products', { params });
        setProducts(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Produkte:", error);
        setError("Die Produkte konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortOrder]);

  return (
    <div className="home-page">
      {message && (
        <div className={ messageType === "success"
          ? "cart-toast cart-toast-success"
          : "cart-toast cart-toast-error"
        }>
          {messageType === "success" ? "✓" : "✗"} {message}
        </div>
      )}
      <h1>Webshop Produktkatalog</h1>

      <div className="search-sort-container">
        <input 
          type="text"
          placeholder="Produkte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

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

      {loading ? (
        <p className="loading-message">Produkte werden geladen...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
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
                  type="button"
                  onClick={() => handleAddToCart(product)}
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