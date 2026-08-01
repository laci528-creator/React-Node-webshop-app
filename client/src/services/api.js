import axios from 'axios';

// Létrehozunk egy Axios példányt az alapértelmezett beállításokkal
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // A backendünk címe
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Minden kérés előtt lefut. 
// Ha van elmentett tokenünk a sessionStorage-ban, automatikusan hozzácsatolja a fejléchez.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;