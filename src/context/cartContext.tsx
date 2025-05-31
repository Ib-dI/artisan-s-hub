// frontend/src/context/cartContext.tsx
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner'
// Interface pour un article du panier
interface CartItem {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number; // Quantité de cet article dans le panier
  countInStock: number; // Quantité totale disponible (à obtenir du produit original)
}

// Interface pour le contexte du panier
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Vous pouvez ajouter d'autres utilitaires comme getTotalPrice, getTotalItems, etc.
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Crée le contexte avec des valeurs par défaut nulles (sera rempli par le fournisseur)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Fournisseur du panier
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialise le panier depuis le localStorage ou un tableau vide
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage", error);
      return [];
    }
  });

  // Synchronise le localStorage chaque fois que cartItems change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((item) => item._id === itemToAdd._id);

      if (existItem) {
        // Si l'article existe déjà, met à jour sa quantité
        const newQuantity = existItem.quantity + itemToAdd.quantity;
        // Assurez-vous de ne pas dépasser la quantité en stock
        if (newQuantity > itemToAdd.countInStock) {
          toast.error(`Impossible d'ajouter plus de ${itemToAdd.countInStock} de cet article au panier.`);
          return prevItems; // Ne pas modifier si la quantité dépasse le stock
        }
        return prevItems.map((item) =>
          item._id === existItem._id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Si l'article n'existe pas, l'ajoute
        if (itemToAdd.quantity > itemToAdd.countInStock) {
            toast.error(`Impossible d'ajouter plus de ${itemToAdd.countInStock} de cet article au panier.`);
            return prevItems;
        }
        return [...prevItems, itemToAdd];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id === id) {
          const newQuantity = Math.max(1, quantity); // Ne pas descendre en dessous de 1
          if (newQuantity > item.countInStock) {
            toast.error(`Impossible de définir la quantité à plus de ${item.countInStock}.`);
            return { ...item, quantity: item.countInStock }; // Limite à la quantité en stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé au sein d\'un CartProvider');
  }
  return context;
};