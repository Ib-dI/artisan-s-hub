// frontend/src/pages/PaymentPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/cartContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Valeur par défaut

  useEffect(() => {
    // Redirige si le panier est vide ou pas d'adresse de livraison
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!shippingAddress || cartItems.length === 0) {
      toast.error("Problème de commande", {
        description: "Veuillez remplir votre adresse de livraison et avoir des articles dans votre panier."
      });
      navigate('/shipping');
    }
  }, [navigate, cartItems]);


  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    // Sauvegarder la méthode de paiement dans localStorage
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));

    // Rediriger vers la page de révision de la commande (PlaceOrderPage)
    toast.success("Méthode de paiement sélectionné !")
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-64px)] font-inter">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-geist text-primary">Méthode de Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
            <RadioGroup
              defaultValue="PayPal"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PayPal" id="paypal" />
                <Label htmlFor="paypal" className="font-inter">PayPal ou Carte de Crédit</Label>
              </div>
              {/* Vous pouvez ajouter d'autres options ici plus tard */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Stripe" id="stripe" />
                <Label htmlFor="stripe" className="font-inter">Stripe</Label>
              </div>
            </RadioGroup>
            <Button type="submit" className="w-full font-inter">
              Continuer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;