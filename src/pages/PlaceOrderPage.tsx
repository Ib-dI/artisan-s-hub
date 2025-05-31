// frontend/src/pages/PlaceOrderPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const PlaceOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calcul des prix
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Ex: livraison gratuite au-dessus de 100€
  const taxPrice = 0.15 * itemsPrice; // Ex: 15% de taxes
  const totalPrice = itemsPrice + shippingPrice + taxPrice;


  useEffect(() => {
    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');

    if (!storedShippingAddress || !storedPaymentMethod || cartItems.length === 0) {
        toast.error("Information manquante", {
            description: "Veuillez vérifier votre panier, adresse de livraison et méthode de paiement."
        });
        navigate('/cart');
        return;
    }

    setShippingAddress(JSON.parse(storedShippingAddress));
    setPaymentMethod(JSON.parse(storedPaymentMethod));

    if (!user) {
        toast.error("Non connecté", {
            description: "Veuillez vous connecter pour passer commande."
        });
        navigate('/login?redirect=/placeorder');
    }
  }, [cartItems, navigate, user]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/orders', {
        orderItems: cartItems.map(item => ({
            product: item._id, // Envoyez l'ID du produit
            name: item.name,
            image: item.imageUrl,
            price: item.price,
            qty: item.quantity,
            // L'artisan sera peuplé côté backend via le modèle Product
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      });

      setLoading(false);
      clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      toast.success("Commande passée !", {
        description: `Votre commande #${data._id} a été créée avec succès.`
      });
      navigate(`/order/${data._id}`);
    } catch (error: unknown) {
      setLoading(false);
      console.error('Erreur lors du passage de la commande:', error);
      toast.error("Erreur de commande", {
        description: error instanceof AxiosError 
          ? error.response?.data?.message 
          : "Échec de la commande. Veuillez réessayer."
      });
    }
  };

  if (!shippingAddress || !paymentMethod || cartItems.length === 0 || !user) {
    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-64px)]">
            <Card className="max-w-md w-full text-center p-8">
                <CardTitle className="text-xl">Chargement des informations de commande...</CardTitle>
                <CardDescription className="mt-2">Redirection si des informations sont manquantes.</CardDescription>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Toaster />
      {/* Colonne des détails de la commande */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Adresse de Livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Adresse:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Méthode de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Méthode:</strong> {paymentMethod}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Articles Commandés</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p>Votre panier est vide.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div className="flex items-center">
                      <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                      <p>{item.name}</p>
                    </div>
                    <p>{item.quantity} x {item.price.toFixed(2)}€ = {(item.quantity * item.price).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Colonne du résumé de la commande */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Résumé de la Commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Articles:</span>
              <span>{itemsPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison:</span>
              <span>{shippingPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span>{taxPrice.toFixed(2)}€</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </div>
          </div>
          <Button
            className="w-full mt-6"
            onClick={placeOrderHandler}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Traitement...' : 'Commander'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceOrderPage;