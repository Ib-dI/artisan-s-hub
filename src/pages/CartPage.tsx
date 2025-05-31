// frontend/src/pages/CartPage.tsx
import React from 'react';
import { useCart } from '@/context/cartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Pour la quantité
import { Trash2 } from 'lucide-react'; // Pour l'icône de suppression (nécessite 'lucide-react')
import { Link } from 'react-router-dom';


const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Votre Panier</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle className="text-2xl mb-4">Votre panier est vide</CardTitle>
          <p className="mb-6">Il est temps de découvrir nos magnifiques produits artisanaux !</p>
          <Link to="/products">
            <Button>Explorer les produits</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne des articles du panier */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="flex items-center p-4">
                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-muted-foreground">{item.price.toFixed(2)} €</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    max={item.countInStock} // Limite supérieure basée sur le stock
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item._id, parseInt(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full mt-4"
            >
              Vider le panier
            </Button>
          </div>

          {/* Colonne du résumé du panier */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl">Résumé du Panier</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                <p>Nombre d'articles :</p>
                <p className="font-semibold">{getTotalItems()}</p>
              </div>
              <div className="flex justify-between items-center text-xl font-bold border-t pt-4 mt-4">
                <p>Total :</p>
                <p>{getTotalPrice().toFixed(2)} €</p>
              </div>
              <Button className="w-full mt-6">Passer à la caisse</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;