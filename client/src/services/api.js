import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    // Ha minden rendben, csak simán továbbengedjük az adatokat
    return response;
  },
  (error) => {
    // Ha a szerver 401-es hibát dob (Lejárt / Érvénytelen token)
    if (error.response && (error.response.status === 401)) {
      
      // Töröljük a lejárt tokent a memóriából
      sessionStorage.removeItem('token');
      
      // Ha a felhasználói adatokat is elmentetted, azt is töröljük
      sessionStorage.removeItem('user'); 

      // Kidobjuk a felhasználót a bejelentkezési oldalra (ez frissíti a Navbart is)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;  