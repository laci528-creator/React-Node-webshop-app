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
    <div className="product-upload-container">
      <h2>Admin Dashboard - Neues Produkt</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="product-upload-form">
        <div>
          <label className="form-label">Produktname:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Beschreibung:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <div style={{ flex: 1 }}>
            <label className="form-label">Preis (€):</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label">Kategorie:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ flex: 1 }}>
            <label className="form-label">Lagerbestand (Stock):</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div style={{ flex: 2 }}>
            <label className="form-label">Bild URL:</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          className="upload-button" 
        >
          Produkt hochladen
        </button>
      </form>
    </div>
  );
}