// frontend/src/pages/OrderPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Interfaces pour la structure des données de la commande
interface ProductInOrder {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface ArtisanInOrder {
  _id: string;
  username: string;
  companyName?: string;
}

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string; // URL de l'image
  price: number;
  product: ProductInOrder; // Le produit réel associé à l'article de commande
  artisan: ArtisanInOrder; // L'artisan du produit
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

interface UserInOrder {
    _id: string;
    username: string;
    email: string;
}

interface Order {
  _id: string;
  user: UserInOrder;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult; // Optionnel, seulement si payé
  taxPrice: number;
  shippingPrice: number;
  itemsPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string; // Date de paiement, optionnel
  isDelivered: boolean;
  deliveredAt?: string; // Date de livraison, optionnel
  createdAt: string;
}

const OrderPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>(); // Récupère l'ID de la commande de l'URL
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("ID de commande manquant dans l'URL.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null); // Réinitialise l'erreur
        const { data } = await api.get<Order>(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la commande:", err);
        if (err instanceof AxiosError && err.response) {
          setError(err.response.data?.message || "Échec du chargement de la commande.");
        } else {
          setError("Échec du chargement de la commande (erreur inconnue).");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
        <Skeleton className="h-64 w-full lg:col-span-1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Erreur de chargement</h1>
        <p className="text-destructive text-lg">{error}</p>
        <Button asChild className="mt-6">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Commande introuvable</h1>
        <p className="text-muted-foreground text-lg">La commande que vous recherchez n'existe pas ou vous n'avez pas les permissions pour la voir.</p>
        <Button asChild className="mt-6">
          <Link to="/profile">Mes Commandes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne des détails de la commande */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Commande {order._id}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Adresse de Livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nom d'utilisateur:</strong> {order.user.username}</p>
            <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
            <Separator className="my-2" />
            <p><strong>Adresse:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <div className="mt-4">
                {order.isDelivered ? (
                    <p className="text-sm font-semibold text-green-600 bg-green-50 p-2 rounded-md inline-block">
                        Livrée le {new Date(order.deliveredAt!).toLocaleDateString()}
                    </p>
                ) : (
                    <p className="text-sm font-semibold text-orange-600 bg-orange-50 p-2 rounded-md inline-block">
                        Non Livrée
                    </p>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Méthode:</strong> {order.paymentMethod}</p>
            <div className="mt-4">
                {order.isPaid ? (
                    <p className="text-sm font-semibold text-green-600 bg-green-50 p-2 rounded-md inline-block">
                        Payée le {new Date(order.paidAt!).toLocaleDateString()}
                        {order.paymentResult && (
                            <span className="ml-2">({order.paymentResult.id})</span>
                        )}
                    </p>
                ) : (
                    <p className="text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-md inline-block">
                        Non Payée
                    </p>
                )}
            </div>
            {!order.isPaid && (
                <Button className="mt-4" disabled>
                    Payer la commande (intégration à venir)
                </Button>
                // Ici, vous intégrerez un composant PayPal/Stripe
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Articles Commandés</CardTitle>
          </CardHeader>
          <CardContent>
            {order.orderItems.length === 0 ? (
              <p>Aucun article dans cette commande.</p>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div className="flex items-center">
                      <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                      <div>
                        <Link to={`/products/${item.product._id}`} className="font-semibold hover:underline">
                            {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">Par : {item.artisan?.companyName || item.artisan?.username || 'Inconnu'}</p>
                      </div>
                    </div>
                    <p>{item.qty} x {item.price.toFixed(2)}€ = {(item.qty * item.price).toFixed(2)}€</p>
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
              <span>{order.itemsPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison:</span>
              <span>{order.shippingPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span>{order.taxPrice.toFixed(2)}€</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{order.totalPrice.toFixed(2)}€</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;