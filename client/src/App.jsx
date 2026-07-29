import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

// Ideiglenes Regisztráció komponens (ezt is áttehetjük majd külön fájlba)
const Register = () => <div style={{ padding: '20px' }}><h2>Registrierung Seite</h2></div>;

function App() {
  return (
    <div>
      {/* Navigációs sáv minden oldalon fent van */}
      <Navbar />

      {/* Útvonalak kezelése */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;