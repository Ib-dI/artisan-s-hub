// frontend/src/pages/MyOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


// Interface pour la structure des données d'une commande simplifiée pour la liste
interface OrderListItem {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderItems: Array<{ // Pour afficher quelques détails de produits si nécessaire
        name: string;
        imageUrl: string;
        qty: number;
    }>;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<OrderListItem[]>('/orders/myorders'); // Utilisez la nouvelle route backend
        setOrders(data);
      } catch (err) {
        console.error("Erreur lors du chargement de mes commandes:", err);
        if (err instanceof AxiosError && err.response) {
          setError(err.response.data?.message || "Échec du chargement de vos commandes.");
        } else {
          setError("Échec du chargement de vos commandes (erreur inconnue).");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Mes Commandes</h1>
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes Commandes</h1>

      {orders.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle className="text-2xl mb-4">Vous n'avez pas encore de commandes</CardTitle>
          <p className="mb-6">Commencez à explorer nos produits artisanaux uniques !</p>
          <Link to="/products">
            <Button>Découvrir les produits</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de la Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payée</TableHead>
                <TableHead>Livrée</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id.substring(order._id.length - 6)}</TableCell> {/* Affiche les 6 derniers caractères de l'ID */}
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.totalPrice.toFixed(2)}€</TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Oui ({order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'})
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Non</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Oui ({order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'})
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/${order._id}`}>Détails</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;