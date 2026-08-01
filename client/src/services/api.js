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

api.interceptors.response.use(
  (response) => {
    // Ha minden rendben, csak simán továbbengedjük az adatokat
    return response;
  },
  (error) => {
    // Ha a szerver 401-es vagy 403-as hibát dob (Lejárt / Érvénytelen token)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
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