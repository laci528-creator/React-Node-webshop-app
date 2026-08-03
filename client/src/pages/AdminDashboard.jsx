import React, { useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Mezők változásának kezelése
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Űrlap beküldése
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Elküldjük a backendnek (a price-ot számmá, a stock-ot egész számmá alakítjuk)
      const response = await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });

      setMessage(response.data.message || 'Produkt erfolgreich erstellt!');
      
      // Sikeres mentés után ürítjük az űrlapot
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: ''
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Fehler beim Speichern des Produkts.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2>Admin Dashboard – Neues Produkt</h2>

      {message && <div style={{ color: 'green', marginBottom: '15px', padding: '10px', background: '#e6f4ea', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', background: '#fce8e6', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Produktname:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Beschreibung:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Preis (€):</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Kategorie:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Lagerbestand (Stock):</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Bild URL:</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: '#007bff',
            color: '#white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Produkt hochladen
        </button>
      </form>
    </div>
  );
}