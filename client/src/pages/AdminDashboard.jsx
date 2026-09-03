import { useState } from 'react';
import { Navigate } from "react-router-dom";
import api from '../services/api';

export default function AdminDashboard() {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // send the form data to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/products', {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock, 10)
      });

      setMessage(response.data.message || 'Produkt erfolgreich erstellt!');
      
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

      setError(
        err.response?.data?.message || 
        'Fehler beim Speichern des Produkts.'
      );
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div className="product-upload-container">
      <h2>Admin Dashboard - Neues Produkt</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="product-upload-form">
        <div>
          <label htmlFor="name" className="form-label">Produktname:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">Beschreibung:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            autoComplete="off"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <div className="form-column">
            <label htmlFor="price" className="form-label">Preis (€):</label>
            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              autoComplete="off"
              className="form-input"
            />
          </div>

          <div className="form-column">
            <label htmlFor="category" className="form-label">Kategorie:</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              autoComplete="off"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-column">
            <label htmlFor="stock" className="form-label">Lagerbestand (Stock):</label>
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              autoComplete="off"
              className="form-input"
            />
          </div>

          <div className="form-column-wide">
            <label htmlFor="image_url" className="form-label">Bild URL:</label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              autoComplete="off"
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Produkt hochladen'}
        </button>
      </form>
    </div>
  );
}