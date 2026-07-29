import { createContext, useState, useContext } from 'react';

// Létrehozzuk a Contextet
const CartContext = createContext();

// Létrehozzuk a Provider komponenst, ami körbeöleli az alkalmazást
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Termék hozzáadása a kosárhoz
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Megnézzük, hogy a termék benne van-e már a kosárban
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Ha igen, növeljük a darabszámot (quantity)
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Ha még nincs benne, hozzáadjuk 1-es darabszámmal
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Termék törlése a kosárból
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Teljes kosár ürítése
  const clearCart = () => setCart([]);

  // Összes darabszám kiszámítása a Navbarhoz
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Végösszeg kiszámítása
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// Egyedi hook a kényelmes használatért
export const useCart = () => useContext(CartContext);