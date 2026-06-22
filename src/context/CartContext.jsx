import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : { storeId: null, storeName: null, items: [] };
    } catch {
      return { storeId: null, storeName: null, items: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, storeId, storeName) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        storeId,
        storeName,
        items: [...prev.items, { ...product, quantity: 1 }],
      };
    });
  };

  const replaceCart = (product, storeId, storeName) => {
    setCart({ storeId, storeName, items: [{ ...product, quantity: 1 }] });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.id !== productId);
      return items.length === 0
        ? { storeId: null, storeName: null, items: [] }
        : { ...prev, items };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === productId ? { ...i, quantity } : i
      ),
    }));
  };

  const clearCart = () => setCart({ storeId: null, storeName: null, items: [] });

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, replaceCart, removeFromCart, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
