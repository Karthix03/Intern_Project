import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variants: Record<string, string>) => void;
  removeFromCart: (productId: string, variants: Record<string, string>) => void;
  updateQuantity: (productId: string, variants: Record<string, string>, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('aether_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('aether_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, variants: Record<string, string>) => {
    setCart((prevCart) => {
      // Find item with same ID AND same selected variants
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const currentQty = newCart[existingItemIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        newCart[existingItemIndex].quantity = newQty;
        return newCart;
      } else {
        return [...prevCart, { product, quantity, selectedVariants: variants }];
      }
    });
  };

  const removeFromCart = (productId: string, variants: Record<string, string>) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === productId && JSON.stringify(item.selectedVariants) === JSON.stringify(variants))
      )
    );
  };

  const updateQuantity = (productId: string, variants: Record<string, string>, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variants);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === 'GOLDEN' || uppercaseCode === 'AETHER10') {
      setPromoCode(uppercaseCode);
      setDiscountPercent(10); // 10% discount
      return true;
    }
    return false;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        promoCode,
        applyPromoCode,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
