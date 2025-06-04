// frontend/src/pages/ShippingPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext'; // Pour la récupération des items du panier
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Si vous utilisez shadcn toast

const ShippingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Initialisez l'état avec des valeurs par défaut si l'utilisateur est connecté (ou localStorage si vous le sauvegardez)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Panier vide", {
        description: "Ajoutez des articles à votre panier avant de commander."
      });
      navigate('/products')
      return;
    }

    if (!user) {
      toast.error("Non connecté", {
        description: "Veuillez vous connecter pour passer commande."
      });
      navigate('/login?redirect=/shipping');
      return;
    }

    // Sauvegarder les infos de livraison (simplement dans localStorage pour l'instant)
    const shippingInfo = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));

    toast.success("Adresse de livraison enregistrée !")

    // Rediriger vers la page de paiement
    navigate('/payment');
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-64px)] font-inter">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-geist text-primary">Adresse de Livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <Label htmlFor="address" className="font-inter">Adresse</Label>
              <Input
                id="address"
                type="text"
                placeholder="Entrez votre adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className='mt-3 font-inter'
              />
            </div>
            <div>
              <Label htmlFor="city" className="font-inter">Ville</Label>
              <Input
                id="city"
                type="text"
                placeholder="Entrez votre ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className='mt-3 font-inter'
              />
            </div>
            <div>
              <Label htmlFor="postalCode" className="font-inter">Code Postal</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="Entrez votre code postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className='mt-3 font-inter'
              />
            </div>
            <div>
              <Label htmlFor="country" className="font-inter">Pays</Label>
              <Input
                id="country"
                type="text"
                placeholder="Entrez votre pays"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className='my-3 font-inter'
              />
            </div>
            <Button type="submit" className="w-full font-inter">
              Continuer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingPage;