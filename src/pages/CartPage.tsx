// frontend/src/pages/CartPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { CartItem } from '@/context/cartContext';
import { useCart } from '@/context/cartContext';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  const handleUpdateQuantity = (item: CartItem, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      if (newQuantity > item.countInStock) {
        toast.error(`La quantité de "${item.name}" ne peut excéder le stock disponible (${item.countInStock}).`);
        updateCartQuantity(item._id, item.countInStock);
      } else {
        updateCartQuantity(item._id, newQuantity);
      }
    } else if (value === '') {
        updateCartQuantity(item._id, 1);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.info(`${name} a été retiré du panier.`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Votre panier a été vidé.");
  };

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-geist font-bold mb-6 text-center text-primary">Votre Panier</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle className="text-2xl mb-4">Votre panier est vide</CardTitle>
          <p className="mb-6 font-inter">Il est temps de découvrir nos magnifiques produits artisanaux !</p>
          <Link to="/products">
            <Button>Explorer les produits</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="flex items-center p-4">
                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h2 className="text-lg font-geist font-semibold">{item.name}</h2>
                  <p className="text-muted-foreground font-inter">{item.price.toFixed(2)} €</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    max={item.countInStock}
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item, e.target.value)}
                    className="w-20 text-center font-inter"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item._id, item.name)}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="w-full mt-4 font-inter"
            >
              Vider le panier
            </Button>
          </div>

          <Card className="lg:col-span-1 p-6 h-fit">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl">Résumé du Panier</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                <p className="font-inter">Nombre d'articles :</p>
                <p className="font-geist font-semibold">{getTotalItems()}</p>
              </div>
              <div className="flex justify-between items-center text-xl font-bold border-t pt-4 mt-4">
                <p className="font-inter">Total :</p>
                <p className="font-geist">{getTotalPrice().toFixed(2)} €</p>
              </div>
              <Link to="/shipping">
                <Button className="w-full mt-6 font-inter" disabled={cartItems.length === 0}>
                  Passer à la caisse
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;